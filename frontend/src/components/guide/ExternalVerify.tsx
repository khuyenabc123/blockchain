import { Card, Space, Steps, Typography } from "antd";
import {
  FilePdfOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;

export default function ExternalVerify() {
  return (
    <Card
      title={
        <Space>
          <SearchOutlined style={{ color: "#52c41a" }} />
          <span>2. External Verifier & Recruiter Verification Guide</span>
        </Space>
      }
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
      }}
    >
      <Steps
        direction="vertical"
        current={-1}
        items={[
          {
            title: (
              <Text strong style={{ fontSize: "15px" }}>
                Acquire the Original Document File
              </Text>
            ),
            description: (
              <Paragraph type="secondary" style={{ marginTop: "4px" }}>
                The third-party verifier or corporate human resource recruiter
                obtains the official graduation PDF directly from the student
                candidate.
              </Paragraph>
            ),
            icon: <FilePdfOutlined style={{ color: "#ff4d4f" }} />,
          },
          {
            title: (
              <Text strong style={{ fontSize: "15px" }}>
                Perform the Cryptographic Check Drop
              </Text>
            ),
            description: (
              <Paragraph type="secondary" style={{ marginTop: "4px" }}>
                Upload that PDF into our{" "}
                <strong>Public Web3 Credentials Registry</strong> drag-and-drop
                zone. The portal calculates the binary hash value and maps it
                live against the ledger states to return matching credentials
                arrays.
              </Paragraph>
            ),
            icon: <SafetyCertificateOutlined style={{ color: "#52c41a" }} />,
          },
          {
            title: (
              <Text strong style={{ fontSize: "15px" }}>
                Leverage the AI Audit Copilot Assistant
              </Text>
            ),
            description: (
              <Paragraph type="secondary" style={{ marginTop: "4px" }}>
                Verifiers can instantly text-chat with our{" "}
                <strong>AI Agent</strong> right inside the card widget to easily
                interpret cryptographic variables, audit target block addresses,
                or generate pre-formatted summaries.
              </Paragraph>
            ),
            icon: <RobotOutlined style={{ color: "#13c2c2" }} />,
          },
        ]}
      />
    </Card>
  );
}
