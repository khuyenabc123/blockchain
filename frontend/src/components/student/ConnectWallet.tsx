import { Button, Form, Input, Space } from "antd";

export interface ConnectWalletProps {
  walletForm: ReturnType<typeof Form.useForm>[0];
  studentData: any;
  handleLinkWalletSubmit: () => void;
  connectMetaMask: () => void;
}

export default function ConnectWallet({
  walletForm,
  studentData,
  handleLinkWalletSubmit,
  connectMetaMask,
}: ConnectWalletProps) {
  return (
    <Form
      layout="vertical"
      form={walletForm}
      style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      onFinish={handleLinkWalletSubmit}
    >
      <Form.Item
        name="walletAddress"
        label="Your Linked Web3 Wallet Address"
        rules={[
          { required: true, message: "Please input your wallet address" },
        ]}
      >
        <Space.Compact style={{ width: "100%" }}>
          <Input
            placeholder="e.g., 0x..."
            disabled={!!studentData.studentWallet}
          />

          {!studentData.studentWallet && (
            <Button
              type="primary"
              onClick={connectMetaMask}
              style={{
                background: "#f57c00",
                borderColor: "#f57c00",
                fontWeight: "bold",
              }}
            >
              🦊 Connect
            </Button>
          )}
        </Space.Compact>
      </Form.Item>

      {!studentData.studentWallet ? (
        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
          >
            Lock Wallet & Confirm Data
          </Button>
        </Form.Item>
      ) : (
        <div
          style={{
            textAlign: "center",
            color: "#2e7d32",
            fontWeight: "bold",
            padding: "12px",
            background: "#e8f5e9",
            borderRadius: "4px",
          }}
        >
          🔒 This wallet is permanently registered to your identity.
        </div>
      )}
    </Form>
  );
}
