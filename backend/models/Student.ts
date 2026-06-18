import { Schema, model, Document } from "mongoose";

export interface IStudent extends Document {
  studentId: string;

  studentName: string;

  dateOfBirth: Date;

  email: string;

  passwordHash: string;

  mustChangePassword: boolean;

  studentWallet?: string;

  isEligibleToGraduate: boolean;

  hasGraduated: boolean;
}

const StudentSchema = new Schema<IStudent>(
  {
    studentId: { type: String, required: true, unique: true },

    studentName: { type: String, required: true },

    dateOfBirth: { type: Date, required: true },

    email: { type: String, required: true, unique: true },

    passwordHash: { type: String, required: true, select: true },

    mustChangePassword: { type: Boolean, default: true },

    studentWallet: { type: String, unique: true, sparse: true },

    isEligibleToGraduate: { type: Boolean, default: false },

    hasGraduated: { type: Boolean, default: false },
  },

  { timestamps: true },
);

export const StudentModel = model<IStudent>("Student", StudentSchema);
