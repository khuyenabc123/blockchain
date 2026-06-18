import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import certificateRoutes from "./routes/certificate.routes";
import studentRoutes from "./routes/student.routes";
import aiRoutes from "./routes/ai.routes";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/certificates", certificateRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/ai", aiRoutes);

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nft_academic_cert";
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("🍃 Successfully connected to Local MongoDB");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(
        `🚀 Backend server is running locally on http://localhost:${PORT}`,
      );
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
  });
