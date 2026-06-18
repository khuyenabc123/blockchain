import { Typography, Divider, Collapse, Alert } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import GuideWarning from "../components/guide/Warning";
import GraduationLifecycle from "../components/guide/GraduationLifecycle";
import ExternalVerify from "../components/guide/ExternalVerify";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

export default function UserGuide() {
  return (
    <div style={{ margin: "40px auto", padding: "0 20px" }}>
      <GuideWarning />

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <Title level={2}>📖 Platform User Guide</Title>
        <Paragraph type="secondary" style={{ fontSize: "16px" }}>
          Comprehensive guide for Students, University Admins, and External
          Verifiers.
        </Paragraph>
      </div>

      <GraduationLifecycle />

      <ExternalVerify />

      <Divider style={{ margin: "40px 0" }} />

      <Title level={3} style={{ marginBottom: "20px" }}>
        <QuestionCircleOutlined
          style={{ marginRight: "8px", fontSize: "22px" }}
        />
        Frequently Asked Questions
      </Title>

      <Collapse
        accordion
        defaultActiveKey={["1"]}
        style={{ background: "#fff", borderRadius: "12px", overflow: "hidden" }}
      >
        <Panel
          header={
            <Text strong>
              Why can I access pages without a strict password change
              requirement?
            </Text>
          }
          key="1"
        >
          <p style={{ color: "#595959", lineHeight: "1.6" }}>
            As noted in our system status parameters, account configuration
            parameters and deep profile authorization tables are currently{" "}
            <strong>pending deployment</strong>. The user interface forms are
            bypassable intentionally during this staging checkpoint to let
            evaluators shift focus directly to the functional smart contract
            processing core.
          </p>
        </Panel>

        <Panel
          header={
            <Text strong>
              How does a verifier trust that the downloaded PDF file is real?
            </Text>
          }
          key="2"
        >
          <p style={{ color: "#595959", lineHeight: "1.6" }}>
            The PDF contains embedded file structural configurations. When
            dragged into the system's drop zone, its SHA-256 binary hash code is
            calculated locally in browser memory. If a bad actor alters even a
            single character of text on that PDF, the hash breaks completely and
            the blockchain ledger will reject it.
          </p>
        </Panel>

        <Panel
          header={
            <Text strong>
              How exactly can the AI Agent help an outside verifier or HR
              recruiter?
            </Text>
          }
          key="3"
        >
          <p style={{ color: "#595959", lineHeight: "1.6" }}>
            Instead of forcing recruiters to dissect raw block hashes or
            hexadecimal values manually, they can ask the AI simple, natural
            questions like:{" "}
            <em>"Can you break down this student's wallet keys?"</em>,{" "}
            <em>"When was this token minted?"</em>, or{" "}
            <em>
              "Confirm if this specific transaction state is verified active."
            </em>{" "}
            The AI evaluates the background JSON objects instantly and delivers
            plain-English answers.
          </p>
        </Panel>
      </Collapse>

      <Alert
        title="System Security Lifecycle Notice"
        description="Every step of this operational chain is completely locked. A student cannot log in without email registration confirmation, an admin cannot mint without verifying graduation requirements, and a certificate cannot pass validation if its file hash deviates from the contract block record."
        type="info"
        showIcon
        style={{ marginTop: "30px", borderRadius: "8px" }}
      />
    </div>
  );
}
