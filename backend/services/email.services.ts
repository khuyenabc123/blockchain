import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.ethereal.email",
  port: Number(process.env.EMAIL_PORT) || 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendIssuedCertificateEmail = async (
  studentEmail: string,
  studentName: string,
  pdfBuffer: Buffer,
  studentId: string,
) => {
  const mailOptions = {
    from: '"DTU Registry" <registry@dtu.edu>',
    to: studentEmail,
    subject: "🎓 Graduation Day! Your Secure NFT Certificate is Ready",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2 style="color: #2e7d32;">Congratulations, ${studentName}!</h2>
        <p>Your official academic degree certificate has been verified, uploaded to IPFS, and permanently minted on the blockchain network ledger.</p>
        <p>We have compiled a secure cryptographic PDF copy of your credential and attached it directly to this email message for your personal records.</p>
      </div>
    `,
    attachments: [
      {
        filename: `Degree_Certificate_${studentId}.pdf`,
        content: pdfBuffer,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

export const sendOnboardingEmail = async (
  studentEmail: string,
  studentName: string,
  studentId: string,
  tempPassword: string,
) => {
  const portalUrl = "http://localhost:5173/portal";

  try {
    await transporter.sendMail({
      from: '"DTU Registry" <registry@dtu.edu>',
      to: studentEmail,
      subject: "Action Required: Set up your Credentials Profile",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Welcome to Duy Tan University, ${studentName}!</h2>

          <p>Your university has pre-registered your account profile in our decentralized credentials network.</p>

          <p>To receive your secure, you are required to connect your personal wallet address to your profile.</p>

          <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <strong>Your Login Access Credentials:</strong><br/>
            • Student ID: ${studentId}<br/>
            • Temporary Password: ${tempPassword}<br/>
          </div>

          <a href="${portalUrl}">
            Access Student Portal
          </a>
        </div>
      `,
    });

    console.log(
      `Rest API email payload successfully routed to Mailtm account: ${studentEmail}`,
    );
  } catch (error: any) {
    console.log(
      "\n------------------------------------------------------------",
    );
    console.log("[MOCK EMAIL DISPATCH TO TERMINAL]");
    console.log(`To: ${studentName} (${studentEmail})`);
    console.log(`Subject: Link your Wallet for ID: ${studentId}`);
    console.log(`Student Portal Link: ${portalUrl}`);
    console.log(
      "------------------------------------------------------------\n",
    );
  }
};
