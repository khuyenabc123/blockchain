import { Request, Response } from "express";
import { askAI } from "../services/ai.service";
import Certificate from "../models/Certificate";

export class AIController {
  static async verifyCertificate(req: Request, res: Response) {
    try {
      const { question, certificateData } = req.body;

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const aiResponse = await askAI(question, certificateData);

      for await (const chunk of aiResponse) {
        const textToken = chunk.choices[0]?.delta?.content || "";
        if (textToken) {
          res.write(textToken);
        }
      }

      return res.end();
    } catch (error: any) {
      console.error("AI Controller Pipeline Failure:", error);

      if (res.headersSent) {
        res.write(`\n\n❌ Stream Interrupted: ${error.message}`);
        return res.end();
      }

      return res.status(500).json({
        success: false,
        message: `Internal AI processing fault: ${error.message}`,
      });
    }
  }
}
