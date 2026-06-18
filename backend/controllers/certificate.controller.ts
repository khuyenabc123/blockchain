import { Request, Response } from "express";
import CertificateModel from "../models/Certificate";
import { CertificateStatus, LifecycleStatus } from "../types/ICertificate";
import { certificateContract } from "../services/blockchain.service";
import axios from "axios";
import { StudentModel } from "../models/Student";
import { generateCertificatePDFBuffer } from "../services/pdf.service";
import { sendIssuedCertificateEmail } from "../services/email.services";
import crypto from "crypto";
import { ethers } from "ethers";
import AcademicCertificateArtifact from "../../blockchain/artifacts/contracts/AcademicCertificate.sol/AcademicCertificate.json";
import {
  uploadMetadataToIPFS,
  uploadPDFToIPFS,
} from "../services/ipfs.service";

export const revokeCertificate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const cert = await CertificateModel.findById(id);
    if (!cert) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    if (!cert.tokenId) {
      return res
        .status(400)
        .json({ message: "Cannot revoke an unminted certificate" });
    }

    const tx = await certificateContract.revokeCertificate(
      cert.tokenId,
      reason,
    );
    await tx.wait();

    cert.status = CertificateStatus.REVOKED;
    cert.revokedAt = new Date();
    cert.revocationReason = reason;
    await cert.save();

    return res.json({
      success: true,
      message: "Certificate successfully revoked on-chain and off-chain.",
      txHash: tx.hash,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Revocation process failed.",
      error: error.message,
    });
  }
};

export const getAllCertificates = async (_req: Request, res: Response) => {
  try {
    const certs = await CertificateModel.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: certs,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyCertificateByFileHash = async (
  req: Request,
  res: Response,
) => {
  try {
    const { hash } = req.params;

    console.log("Incoming Hash from Uploaded PDF:", hash);

    if (!hash) {
      return res.status(400).json({
        success: false,
        message: "File hash string parameter is required.",
      });
    }

    const provider = new ethers.JsonRpcProvider(
      process.env.RPC_URL || "http://127.0.0.1:8545",
    );

    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS!,
      AcademicCertificateArtifact.abi,
      provider,
    );

    let blockchainData = null;
    let hasMatchOnChain = false;

    try {
      const contractResult = await contract.getCertificateByHash(hash);

      blockchainData = {
        tokenId: contractResult.tokenId.toString(),
        studentId: contractResult.studentId,
        studentName: contractResult.studentName,
        degree: contractResult.degree,
        major: contractResult.major,
        ipfsHash: contractResult.ipfsHash,
        issueDate: contractResult.issueDate.toString(),
        isRevoked: contractResult.isRevoked,
        revokedAt: contractResult.revokedAt.toString(),
        revocationReason: contractResult.revocationReason,
      };
      hasMatchOnChain = true;
    } catch (contractErr) {
      console.log(
        `🔍 No on-chain records found matching hash parameter: ${hash}`,
      );
    }

    const dbRecord = await CertificateModel.findOne({ fileHash: hash });

    if (!hasMatchOnChain && !dbRecord) {
      return res.status(404).json({
        success: false,
        message:
          "INVALID DOCUMENT: This certificate's digital fingerprint does not match any official blockchain records or institutional archives. It may have been tampered with!",
      });
    }

    return res.json({
      success: true,
      message: "🔒 Document verified authentic.",
      blockchain: blockchainData,
      database: dbRecord,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal verification pipeline error.",
      error: error.message,
    });
  }
};

export const issueCertificate = async (req: Request, res: Response) => {
  try {
    const { studentId, degree, major, graduationDate, issuedBy } = req.body;

    const student = await StudentModel.findOne({ studentId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message:
          "Student profile does not exist. Please add the student first.",
      });
    }

    if (!student.isEligibleToGraduate) {
      return res.status(400).json({
        success: false,
        message: "This student has not been approved for graduation yet.",
      });
    }

    if (student.hasGraduated) {
      return res.status(400).json({
        success: false,
        message:
          "A certificate record has already been prepared/issued for this student ID.",
      });
    }

    if (!student.studentWallet) {
      return res.status(400).json({
        success: false,
        message:
          "This student has not linked their Web3 wallet address yet. The certificate cannot be generated.",
      });
    }

    const certificatePayload = {
      studentWallet: student.studentWallet,
      studentId: student.studentId,
      studentName: student.studentName,
      degree,
      major,
      graduationDate,
      issuedBy,
    };

    const pdfBuffer = await generateCertificatePDFBuffer(certificatePayload);

    const fileHash = crypto
      .createHash("sha256")
      .update(pdfBuffer)
      .digest("hex");

    const pdfCID = await uploadPDFToIPFS(
      pdfBuffer,
      `Certificate_${student.studentId}.pdf`,
    );

    const metadataPayload = {
      ...certificatePayload,
      pdfCID,
      fileHash,
    };

    const metadataCID = await uploadMetadataToIPFS(metadataPayload);

    console.log("Contract:", await certificateContract.getAddress());

    const contractAddress = await certificateContract.getAddress();

    const code =
      await certificateContract.runner?.provider?.getCode(contractAddress);

    if (!code || code === "0x") {
      throw new Error(`Contract not deployed at ${contractAddress}`);
    }

    const tx = await certificateContract.mintCertificate(
      student.studentWallet,
      student.studentId,
      student.studentName,
      degree,
      major,
      metadataCID,
      fileHash,
    );

    const receipt = await tx.wait();

    console.log("RECEIPT STATUS:", receipt.status);

    if (!receipt || receipt.status !== 1) {
      throw new Error("Blockchain transaction failed");
    }

    let mintedTokenId = 0;

    if (receipt && receipt.logs) {
      for (const log of receipt.logs) {
        try {
          const parsedLog = certificateContract.interface.parseLog(log);
          if (parsedLog && parsedLog.name === "CertificateMinted") {
            mintedTokenId = Number(parsedLog.args.tokenId);
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }

    console.log("TOKEN ID:", mintedTokenId);

    if (mintedTokenId <= 0) {
      throw new Error(
        "CertificateMinted event not found. MongoDB save aborted.",
      );
    }

    console.log("TX HASH:", tx.hash);

    const cert = await CertificateModel.create({
      studentWallet: student.studentWallet,
      studentId: student.studentId,
      studentName: student.studentName,

      degree,
      major,
      graduationDate,
      issuedBy,

      pdfCID,
      ipfsHash: metadataCID,
      fileHash,

      tokenId: mintedTokenId,
      txHash: tx.hash,

      lifecycleStatus: LifecycleStatus.MINTED,

      status: CertificateStatus.ACTIVE,
    });

    await cert.save();

    student.hasGraduated = true;
    await student.save();

    try {
      const studentProfile = await StudentModel.findOne({
        studentId: cert.studentId,
      });

      if (studentProfile && studentProfile.email) {
        console.log("Downloading official PDF from IPFS...");

        const response = await axios.get(
          `${process.env.PINATA_URL}/${cert.pdfCID}`,
          {
            responseType: "arraybuffer",
          },
        );

        const pdfBuffer = Buffer.from(response.data);

        await sendIssuedCertificateEmail(
          studentProfile.email,
          cert.studentName,
          pdfBuffer,
          cert.studentId,
        );
      }
    } catch (deliveryError) {
      console.error(
        "Blockchain token generation succeeded, but distribution script failed:",
        deliveryError,
      );
    }

    return res.json({
      success: true,
      certificateId: cert._id,
      tokenId: cert.tokenId,
      txHash: cert.txHash,
    });
  } catch (error: any) {
    console.error("Mint Error Details:", error);

    return res.status(500).json({
      success: false,
      message: "Blockchain Minting Failed. Status updated to FAILED.",
      error: error.message,
    });
  }
};
