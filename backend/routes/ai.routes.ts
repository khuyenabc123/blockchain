import { Router } from "express";
import { AIController } from "../controllers/ai.controller";

const router = Router();

router.post("/verify", AIController.verifyCertificate);

export default router;
