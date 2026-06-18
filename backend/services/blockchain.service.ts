import { ethers } from "ethers";
import dotenv from "dotenv";
import AcademicCertificateArtifact from "../../blockchain/artifacts/contracts/AcademicCertificate.sol/AcademicCertificate.json";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

export const certificateContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS!,
  AcademicCertificateArtifact.abi,
  wallet,
);
