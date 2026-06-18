import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface CertificateData {
  tokenId: number;
  studentName: string;
  degree: string;
  major: string;
  walletAddress: string;
  ipfsHash: string;
  txHash: string;
  status: string;
}

export async function askAI(question: string, certificateData: any) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error(
      "❌ AI Error: GROQ_API_KEY is missing from your .env configuration.",
    );
  }

  try {
    const context = `
        Verified Certificate Information

        Student Name:
        ${certificateData.blockchain.studentName}

        Token ID:
        ${certificateData.blockchain.tokenId}

        Degree:
        ${certificateData.blockchain.degree}

        Major:
        ${certificateData.blockchain.major}

        Wallet:
        ${certificateData.database.studentWallet}

        IPFS Hash:
        ${certificateData.blockchain.ipfsHash}

        Status:
        ${certificateData.database.lifecycleStatus}
        `;

    const prompt = `You are an NFT Academic Certificate Verification Assistant.

                    Responsibilities:

                    1. Explain verification results.
                    2. Verify certificate authenticity.
                    3. Explain blockchain records.
                    4. Explain IPFS storage.
                    5. Explain NFT ownership.
                    6. Help users understand certificate status.

                    Rules:

                    - Never output raw JSON.
                    - Use professional formatting.
                    - If certificate is verified, clearly state VERIFIED.
                    - If information is missing, say so.
                    - Keep responses concise.`;

    return await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: `
            Question:
            ${question}

            Certificate Payload Context:
            ${context}
            `,
        },
      ],

      temperature: 0.1,
      stream: true,
    });
  } catch (error: any) {
    console.error("Groq Cloud Hub Connection Failure:", error);
    throw new Error(`Free Cloud AI Sync Broken: ${error.message}`);
  }
}
