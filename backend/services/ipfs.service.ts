import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

const PINATA_JWT = process.env.PINATA_JWT;

interface ICertificateMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export const uploadMetadataToIPFS = async (certData: any): Promise<string> => {
  if (!PINATA_JWT) {
    throw new Error("Missing PINATA_JWT in backend environment variables.");
  }

  const metadataPayload = {
    pinataContent: {
      name: `Academic Certificate - ${certData.studentName}`,
      description: `Official decentralized educational degree issued by ${certData.issuedBy}.`,
      pdfCID: certData.pdfCID,
      fileHash: certData.fileHash,
      attributes: [
        { trait_type: "Student ID", value: certData.studentId },
        { trait_type: "Degree", value: certData.degree },
        { trait_type: "Major", value: certData.major },
        { trait_type: "Graduation Date", value: certData.graduationDate },
      ],
    },
    pinataMetadata: {
      name: `${certData.studentId}_metadata.json`,
    },
  };

  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      metadataPayload,
      {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          "Content-Type": "application/json",
        },
      },
    );

    return res.data.IpfsHash;
  } catch (error: any) {
    console.error(
      "❌ Pinata Upload Error:",
      error.response?.data || error.message,
    );
    throw new Error("Failed to pin structural metadata to IPFS network.");
  }
};

export const uploadPDFToIPFS = async (
  pdfBuffer: Buffer,
  fileName: string,
): Promise<string> => {
  const formData = new FormData();

  formData.append("file", pdfBuffer, {
    filename: fileName,
    contentType: "application/pdf",
  });

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      maxBodyLength: Infinity,
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
        ...formData.getHeaders(),
      },
    },
  );

  return res.data.IpfsHash;
};
