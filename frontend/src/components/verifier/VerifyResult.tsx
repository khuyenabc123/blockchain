import { Col, Row, Typography } from "antd";

const { Title } = Typography;

const PINATA_URL = import.meta.env.PINATA_URL;

export interface VerifyResultProps {
  certResult: any;
}

export default function VerifyResult({ certResult }: VerifyResultProps) {
  return (
    <Row
      style={{
        marginTop: "30px",
      }}
      gutter={[24, 24]}
      data-testid="verification-result-display"
    >
      <Col xs={24} md={12} sm={24}>
        <div
          style={{
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #eaeaea",
            boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
            height: "100%",
          }}
        >
          <Title
            level={4}
            style={{
              margin: "0 0 15px 0",
              color: "#4f46e5",
              borderBottom: "2px solid #f0f2ff",
              paddingBottom: "5px",
            }}
          >
            ⛓️ Smart Contract State
          </Title>

          {certResult.blockchain ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "14px",
              }}
            >
              <div>
                <strong>Token ID Number:</strong> #
                {certResult.blockchain.tokenId}
              </div>

              <div>
                <strong>Graduate Student:</strong>{" "}
                {certResult.blockchain.studentName}
              </div>

              <div>
                <strong>Student ID Key:</strong>{" "}
                {certResult.blockchain.studentId}
              </div>

              <div>
                <strong>Degree Major:</strong> {certResult.blockchain.degree} -{" "}
                {certResult.blockchain.major}
              </div>

              <div>
                <strong>On-Chain Issue Block:</strong>{" "}
                {new Date(
                  Number(certResult.blockchain.issueDate) * 1000,
                ).toLocaleDateString()}
              </div>

              <div>
                <strong>IPFS Audit Gateway:</strong>
                <br />

                <a
                  href={`${PINATA_URL}/${certResult.blockchain.ipfsHash}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#0070f3",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    wordBreak: "break-all",
                  }}
                >
                  {certResult.blockchain.ipfsHash} 🌐
                </a>
              </div>
            </div>
          ) : (
            <div style={{ color: "#e65100", fontSize: "13px" }}>
              ⚠️ Alert: Record verified off-chain only. Block confirmation
              absent.
            </div>
          )}
        </div>
      </Col>

      <Col xs={24} md={12} sm={24}>
        <div
          style={{
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #eaeaea",
            boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
            height: "100%",
          }}
        >
          <Title
            level={4}
            style={{
              margin: "0 0 15px 0",
              color: "#2e7d32",
              borderBottom: "2px solid #e8f5e9",
              paddingBottom: "5px",
            }}
          >
            💾 Institutional Database Mirror
          </Title>

          {certResult.database ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "14px",
              }}
            >
              <div>
                <strong>DB ID Reference:</strong>{" "}
                <span style={{ fontFamily: "monospace", fontSize: "12px" }}>
                  {certResult.database._id}
                </span>
              </div>

              <div>
                <strong>Target Wallet Key:</strong>{" "}
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "11px",
                    wordBreak: "break-all",
                  }}
                >
                  {certResult.database.studentWallet || "N/A"}
                </span>
              </div>

              <div>
                <strong>Lifecycle Status Flag:</strong>{" "}
                <span style={{ color: "#2e7d32", fontWeight: "bold" }}>
                  {certResult.database.lifecycleStatus}
                </span>
              </div>

              <div>
                <strong>Issuing Entity:</strong> {certResult.database.issuedBy}
              </div>

              <div>
                <strong>Stored File Hash Checksum:</strong>{" "}
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "11px",
                    color: "#666",
                    wordBreak: "break-all",
                  }}
                >
                  {certResult.database.fileHash}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ color: "#c62828", fontSize: "13px" }}>
              ❌ Missing institutional database entry profile record tracking
              context.
            </div>
          )}
        </div>
      </Col>
    </Row>
  );
}
