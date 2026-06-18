import mongoose from "mongoose";
import {
  ICertificate,
  LifecycleStatus,
  CertificateStatus,
} from "../types/ICertificate";

const CertificateSchema = new mongoose.Schema<ICertificate>({
  tokenId: { type: Number, unique: true, sparse: true },
  
  studentWallet: { type: String, required: true },
  
  studentId: { type: String, required: true },
  
  studentName: { type: String, required: true },
  
  degree: { type: String, required: true },
  
  major: { type: String, required: true },
  
  graduationDate: { type: Date, required: true },
  
  ipfsHash: { type: String },
  
  txHash: { type: String },
  
  lifecycleStatus: {
    type: String,
    default: LifecycleStatus.PENDING,
  },
  
  status: {
    type: String,
    default: CertificateStatus.ACTIVE,
  },
  
  issuedBy: { type: String, required: true },
  
  issuedAt: { type: Date, default: Date.now },
  
  revokedAt: Date,
  
  revocationReason: String,

  pdfCID: { type: String, default: "" },
  
  fileHash: { type: String, default: "" }
});

const CertificateModel = mongoose.model<ICertificate>(
  "Certificate",
  CertificateSchema,
);
export default CertificateModel;
