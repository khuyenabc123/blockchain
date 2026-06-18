import { Document } from "mongoose";

export enum LifecycleStatus {
  PENDING = "PENDING",
  UPLOADED = "UPLOADED",
  MINTED = "MINTED",
  FAILED = "FAILED",
}

export enum CertificateStatus {
  ACTIVE = "ACTIVE",
  REVOKED = "REVOKED",
}

export interface ICertificate extends Document {
  tokenId?: number;

  studentWallet: string;
  studentId: string;
  studentName: string;

  degree: string;
  major: string;
  graduationDate?: Date;

  ipfsHash?: string;
  txHash?: string;

  lifecycleStatus: LifecycleStatus;
  status: CertificateStatus;

  issuedBy?: string;
  issuedAt: Date;

  revokedAt?: Date;
  revocationReason?: string;

  pdfCID: string;
  fileHash: string;
}
