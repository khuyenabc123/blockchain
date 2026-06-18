import { Alert, Typography } from "antd";
import { WarningOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function GuideWarning() {
  return (
    <Alert
      title={
        <Text strong style={{ color: "#d46b08" }}>
          🚧 Core System Implementation Status Notice
        </Text>
      }
      description={
        <div style={{ fontSize: "14px", marginTop: "4px" }}>
          <p>
            Please note the structural boundaries for this active deployment
            iteration:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
            <li>
              <strong>In-Development / Pending:</strong> Standard authentication
              services (User Login flow, Change Password triggers, and explicit
              Admin Authorization tokens) are currently mocked and pending final
              security integration.
            </li>
            <li>
              <strong>🎯 Main Evaluation Purpose:</strong> The primary intent of
              this active sandbox environment is to test, demonstrate, and
              evaluate the{" "}
              <strong>NFT cryptographic certificate processing module</strong>,
              live blockchain ledger cross-checks, and AI analysis pipelines.
            </li>
          </ul>
        </div>
      }
      type="warning"
      showIcon
      icon={<WarningOutlined style={{ fontSize: "20px" }} />}
      style={{
        marginBottom: "35px",
        borderRadius: "12px",
        border: "1px solid #ffe58f",
        backgroundColor: "#fffbe6",
      }}
    />
  );
}
