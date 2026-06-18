import { Router } from "express";
import {
  adminRegisterStudent,
  studentLinkWallet,
  adminApproveGraduation,
  getEligibleGraduates,
  getStudentProfile,
  getAllStudentProfiles,
  studentLogin,
  changePassword,
} from "../controllers/student.controller";

const router = Router();

router.post("/admin/register", adminRegisterStudent);

router.post("/student/link-wallet", studentLinkWallet);

router.post("/admin/approve-eligibility", adminApproveGraduation);

router.get("/eligible-graduates", getEligibleGraduates);

router.get("/profile/:studentId", getStudentProfile);

router.get("/all-profiles", getAllStudentProfiles);

router.post("/login", studentLogin);

router.post("/change-password", changePassword);

export default router;
