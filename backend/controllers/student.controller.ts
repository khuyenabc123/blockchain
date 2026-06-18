import { Request, Response } from "express";
import { StudentModel } from "../models/Student";
import { sendOnboardingEmail } from "../services/email.services";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const adminRegisterStudent = async (req: Request, res: Response) => {
  try {
    const { studentId, studentName, dateOfBirth, email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message:
          "Student email address is required for onboarding notifications.",
      });
    }

    const existingStudent = await StudentModel.findOne({ studentId });

    if (existingStudent) {
      return res
        .status(400)
        .json({ success: false, message: "Student ID already exists." });
    }

    const tempPassword = crypto.randomBytes(6).toString("base64url");
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const student = await StudentModel.create({
      studentId,
      studentName,
      dateOfBirth,
      email: email.toLowerCase(),
      passwordHash,
      mustChangePassword: true,
    });

    try {
      await sendOnboardingEmail(
        student.email,
        student.studentName,
        student.studentId,
        tempPassword,
      );

      console.log(
        `✉️ Onboarding verification dispatch mail successfully sent to: ${student.email}`,
      );
    } catch (mailError) {
      console.error(
        "⚠️ Database write succeeded, but mailing engine encountered an error:",
        mailError,
      );
    }

    return res.status(201).json({
      success: true,
      data: student,
      message: "Student registered and onboarding email dispatched.",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const studentLinkWallet = async (req: Request, res: Response) => {
  try {
    const { studentId, studentWallet } = req.body;

    if (!studentWallet) {
      return res
        .status(400)
        .json({ success: false, message: "Wallet address is required." });
    }

    const student = await StudentModel.findOne({ studentId });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student account not found." });
    }

    const normalizedWallet = studentWallet.toLowerCase();

    const walletClaimed = await StudentModel.findOne({
      studentWallet: normalizedWallet,
    });
    if (walletClaimed && walletClaimed.studentId !== studentId) {
      return res.status(400).json({
        success: false,
        message:
          "This wallet address is already claimed by another student account.",
      });
    }

    student.studentWallet = normalizedWallet;
    await student.save();

    return res.json({
      success: true,
      message: "Wallet linked successfully!",
      data: student,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const adminApproveGraduation = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;

    const student = await StudentModel.findOne({ studentId });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    }

    if (!student.studentWallet) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot approve graduation. Student has not linked a wallet yet.",
      });
    }

    student.isEligibleToGraduate = true;
    await student.save();

    return res.json({
      success: true,
      message: "Student approved for graduation status.",
      data: student,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEligibleGraduates = async (_req: Request, res: Response) => {
  try {
    const graduates = await StudentModel.find({
      isEligibleToGraduate: true,
      hasGraduated: false,
    });
    return res.json({ success: true, data: graduates });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentProfile = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const student = await StudentModel.findOne({ studentId });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found." });
    }
    return res.json({ success: true, data: student });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllStudentProfiles = async (_req: Request, res: Response) => {
  try {
    const students = await StudentModel.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: students,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student registry.",
      error: error.message,
    });
  }
};

export const studentLogin = async (req: Request, res: Response) => {
  try {
    const { studentId, password } = req.body;

    const student = await StudentModel.findOne({ studentId });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid Student ID or Password",
      });
    }

    const isMatch = await bcrypt.compare(password, student.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Student ID or Password",
      });
    }

    const studentData = student.toObject();

    return res.json({
      success: true,
      data: studentData,
      mustChangePassword: student.mustChangePassword,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { studentId, currentPassword, newPassword } = req.body;

    const student = await StudentModel.findOne({
      studentId,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const valid = await bcrypt.compare(currentPassword, student.passwordHash);

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Current password incorrect",
      });
    }

    student.passwordHash = await bcrypt.hash(newPassword, 10);

    student.mustChangePassword = false;

    await student.save();

    return res.json({
      success: true,
      message: "Password updated",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
