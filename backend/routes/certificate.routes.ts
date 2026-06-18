import { Router } from "express";
import {
  revokeCertificate,
  getAllCertificates,
  verifyCertificateByFileHash,
  issueCertificate,
} from "../controllers/certificate.controller";
import CertificateModel from "../models/Certificate";

const router = Router();

router.put("/revoke/:id", revokeCertificate);

router.get("/all", getAllCertificates);

router.get("/download/:id", async (req, res) => {
  const cert = await CertificateModel.findById(req.params.id);

  if (!cert) return res.status(404).send();

  const gatewayUrl = `${process.env.PINATA_URL}/${cert.pdfCID}`;

  return res.redirect(gatewayUrl);
});

router.get("/verify-by-hash/:hash", verifyCertificateByFileHash);

router.post("/issue", issueCertificate);

export default router;
