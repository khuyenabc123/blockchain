import PDFDocument from "pdfkit";
import QRCode from "qrcode";

export const generateCertificatePDFBuffer = (
  rawCertData: any,
): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    try {
      const certData = {
        studentName: String(rawCertData.studentName || ""),
        degree: String(rawCertData.degree || ""),
        major: String(rawCertData.major || ""),
        studentId: String(rawCertData.studentId || ""),
        graduationDate: rawCertData.graduationDate,
        issuedBy: String(rawCertData.issuedBy || "Duy Tan University Admin"),
      };

      const verificationUrl = `${process.env.FE_URL || "http://localhost:5173"}/certificate-search`;

      const qrDataUrl = await QRCode.toDataURL(verificationUrl);

      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 0,
      });

      const buffers: Buffer[] = [];

      doc.on("data", (chunk) => buffers.push(chunk));

      doc.on("end", () => {
        resolve(Buffer.concat(buffers));
      });

      doc.on("error", reject);

      doc
        .lineWidth(10)
        .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .stroke("#4f46e5");

      doc
        .lineWidth(2)
        .rect(28, 28, doc.page.width - 56, doc.page.height - 56)
        .stroke("#111111");

      doc.moveDown(4);

      doc
        .font("Helvetica-Bold")
        .fontSize(34)
        .fillColor("#111111")
        .text("DIPLOMA OF GRADUATION", {
          align: "center",
        });

      doc.moveDown(1);

      doc
        .font("Helvetica")
        .fontSize(16)
        .fillColor("#555555")
        .text("This institutional credential proudly certifies that", {
          align: "center",
        });

      doc.moveDown(1.5);

      doc
        .font("Helvetica-Bold")
        .fontSize(26)
        .fillColor("#4f46e5")
        .text(certData.studentName.toUpperCase(), {
          align: "center",
        });

      doc.moveDown(1);

      doc
        .font("Helvetica")
        .fontSize(15)
        .fillColor("#333333")
        .text(
          "has successfully fulfilled all academic requirements established by the university registry and is hereby awarded the degree of",
          {
            align: "center",
            width: doc.page.width - 160,
          },
        );

      doc.moveDown(1);

      doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .fillColor("#111111")
        .text(`${certData.degree} in ${certData.major}`, {
          align: "center",
        });

      doc.moveDown(2.5);

      const footerY = doc.y;

      doc.font("Helvetica").fontSize(11).fillColor("#555555");

      doc.text(`Student ID: ${certData.studentId}`, 60, footerY);

      const rawDate = certData.graduationDate;

      const formattedDate =
        rawDate instanceof Date
          ? rawDate.toISOString().split("T")[0]
          : String(rawDate).split("T")[0];

      doc.text(`Graduation Date: ${formattedDate}`, 60, footerY + 18);

      doc.text(
        `Issuing Authority: ${certData.issuedBy}`,
        doc.page.width - 400,
        footerY,
        {
          width: 340,
          align: "right",
        },
      );

      doc.text(
        "Verification: Blockchain & IPFS Secured",
        doc.page.width - 400,
        footerY + 18,
        {
          width: 340,
          align: "right",
        },
      );

      doc
        .fontSize(10)
        .text(`Verify Portal: ${verificationUrl}`, 60, footerY + 54);

      doc
        .fontSize(8)
        .text(
          "Scan the QR code to verify this certificate through the official blockchain verification portal.",
          60,
          footerY + 72,
          {
            width: 500,
          },
        );

      const qrImageBuffer = Buffer.from(
        qrDataUrl.replace(/^data:image\/png;base64,/, ""),
        "base64",
      );

      doc.image(qrImageBuffer, doc.page.width - 140, footerY + 35, {
        width: 80,
      });

      doc
        .fontSize(8)
        .text("Scan to Verify", doc.page.width - 145, footerY + 118, {
          width: 90,
          align: "center",
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
