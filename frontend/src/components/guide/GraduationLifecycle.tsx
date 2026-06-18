import { Card, Space, Timeline, Typography } from "antd";
import {
  MailOutlined,
  WalletOutlined,
  AuditOutlined,
  BlockOutlined,
  FilePdfOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;

export default function GraduationLifecycle() {
  return (
    <Card
      title={
        <Space>
          <UserOutlined style={{ color: "#1677ff" }} />
          <span>1. Student Account & Graduation Lifecycle Flow</span>
        </Space>
      }
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
        marginBottom: "30px",
      }}
    >
      <Timeline
        mode="alternate"
        items={[
          {
            label: <Text type="secondary">Step 1</Text>,
            children: (
              <div>
                <Text strong style={{ fontSize: "15px" }}>
                  <UsergroupAddOutlined /> Amin Create Student Account
                </Text>

                <Paragraph type="secondary" style={{ marginTop: "4px" }}>
                  Admin create the Student account and after created, an email
                  will send to Student email address with{" "}
                  <strong>Student ID</strong> and{" "}
                  <strong>Temporary Password</strong>
                </Paragraph>
              </div>
            ),
            color: "#1677ff",
          },
          {
            label: <Text type="secondary">Step 2</Text>,
            children: (
              <div>
                <Text strong style={{ fontSize: "15px" }}>
                  <MailOutlined /> Account Activation via Email
                </Text>
                <Text
                  type="warning"
                  style={{ fontSize: "12px", marginLeft: "10px" }}
                >
                  ⚠️ (Auth Flow Sandbox Mock)
                </Text>
                <Paragraph type="secondary" style={{ marginTop: "4px" }}>
                  Students must first open their institutional mailbox to
                  receive their account configuration setup link. Use these test
                  credentials to pass into the <strong>Student Portal</strong>{" "}
                  view layers.
                </Paragraph>
              </div>
            ),
            color: "#1677ff",
          },
          {
            label: <Text type="secondary">Step 3</Text>,
            children: (
              <div>
                <Text strong style={{ fontSize: "15px" }}>
                  <WalletOutlined /> Wallet Connection Binding
                </Text>
                <Paragraph type="secondary" style={{ marginTop: "4px" }}>
                  Once logged in, the student must connect their MetaMask wallet
                  and submit their public Ethereum wallet address. This binds
                  their cryptographic identity to their Student ID.
                </Paragraph>
              </div>
            ),
            color: "#1677ff",
          },
          {
            label: <Text type="secondary">Step 4</Text>,
            children: (
              <div>
                <Text strong style={{ fontSize: "15px" }}>
                  <AuditOutlined /> Admin Eligibility Evaluation
                </Text>
                <Paragraph type="secondary" style={{ marginTop: "4px" }}>
                  The University Admin reviews the profiles inside the backend
                  panel to confirm if the student has met all criteria required
                  to graduate. If conditions are met, the admin executes an{" "}
                  <strong>Approval</strong>.
                </Paragraph>
              </div>
            ),
            color: "#722ed1",
          },
          {
            label: <Text type="secondary">Step 5</Text>,
            children: (
              <div>
                <Text strong style={{ fontSize: "15px" }}>
                  <BlockOutlined /> Blockchain Minting Queue
                </Text>
                <Text
                  type="success"
                  style={{ fontSize: "12px", marginLeft: "10px" }}
                >
                  ✨ (Active Web3 Engine)
                </Text>
                <Paragraph type="secondary" style={{ marginTop: "4px" }}>
                  Approved records move straight into the{" "}
                  <strong>Mint Screen</strong> layout layer. The administrator
                  triggers a local node transaction to bind the credentials to a
                  unique Token ID, uploading structural metadata permanently to
                  the blockchain.
                </Paragraph>
              </div>
            ),
            color: "#52c41a",
          },
          {
            label: <Text type="secondary">Step 6</Text>,
            children: (
              <div>
                <Text strong style={{ fontSize: "15px" }}>
                  <FilePdfOutlined /> PDF Certificate Delivery
                </Text>
                <Paragraph type="secondary" style={{ marginTop: "4px" }}>
                  After successful minting, the student receives an automated
                  delivery email containing their secured academic diploma PDF
                  file ready for immediate download.
                </Paragraph>
              </div>
            ),
            color: "#ff4d4f",
          },
        ]}
      />
    </Card>
  );
}
