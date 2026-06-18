import React, { useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { Alert, Typography } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import AIAgent from "../components/verifier/AIAgent";
import VerifyResult from "../components/verifier/VerifyResult";

const { Dragger } = Upload;
const { Title, Text } = Typography;


export const VerifierSearch: React.FC = () => {
  const [certResult, setCertResult] = useState<any>(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const processFileAndVerify = (file: File) => {
    setStatusMsg(
      "🔬 Extracting file metadata structures and reading binary arrays...",
    );
    setCertResult(null);

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;

        const wa = CryptoJS.lib.WordArray.create(arrayBuffer as any);

        const calculatedHash = CryptoJS.SHA256(wa).toString();

        setStatusMsg(
          `🔎 Fingerprint Extracted: ${calculatedHash.substring(0, 16)}... Checking blockchain records...`,
        );

        const res = await axios.get(
          `/api/certificates/verify-by-hash/${calculatedHash}`,
        );

        if (res.data.success) {
          setCertResult(res.data);
          setStatusMsg(
            "✅ VERIFICATION SUCCESSFUL: Document matches blockchain ledger state perfectly!",
          );
        }
      } catch (err: any) {
        setCertResult(null);
        setStatusMsg(
          `❌ ${err.response?.data?.message || "❌ Verification Error: Failed to link asset with security indexes."}`,
        );
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const props: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".pdf",
    beforeUpload(file) {
      if (file.type !== "application/pdf") {
        setStatusMsg(
          "⚠️ File validation rejected: Please select an official .pdf file format.",
        );
        return Upload.LIST_IGNORE;
      }

      processFileAndVerify(file);
      return false;
    },
    onDrop(e) {
      const file = e.dataTransfer.files?.[0];

      if (file && file.type === "application/pdf") {
        processFileAndVerify(file);
      } else {
        setStatusMsg(
          "⚠️ File validation rejected: Please drop an official .pdf file format.",
        );
      }
    },
  };

  return (
    <div
      style={{
        maxWidth: "750px",
        margin: "40px auto",
        padding: "0 20px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "35px" }}>
        <Title level={2} style={{ margin: 0, color: "#111" }}>
          🌐 Public Web3 Credentials Registry
        </Title>

        <Text style={{ margin: "5px 0 0 0", color: "#666" }}>
          Drag and drop any institutional PDF certificate file to verify its
          cryptographic validity.
        </Text>
      </div>

      {contextHolder}

      {!certResult && (
        <Alert
          type="info"
          title="Please upload and verify a certificate first."
        />
      )}

      <Dragger {...props} data-testid="verifier-search-dragger">
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>

        <p className="ant-upload-text">Drag & Drop your PDF Certificate here</p>

        <p className="ant-upload-hint">
          or click manually to choose from your documents directory
        </p>
      </Dragger>

      {statusMsg && (
        <div
          data-testid="verification-status-message"
          style={{
            marginTop: "25px",
            padding: "15px",
            borderRadius: "6px",
            fontSize: "14px",
            lineHeight: "1.4",
            backgroundColor: statusMsg.startsWith("✅")
              ? "#e8f5e9"
              : statusMsg.startsWith("❌") || statusMsg.startsWith("🚨")
                ? "#ffebee"
                : "#f5f5f7",
            color: statusMsg.startsWith("✅")
              ? "#2e7d32"
              : statusMsg.startsWith("❌") || statusMsg.startsWith("🚨")
                ? "#c62828"
                : "#333",
            border: `1px solid ${statusMsg.startsWith("✅") ? "#c8e6c9" : statusMsg.startsWith("❌") || statusMsg.startsWith("🚨") ? "#ffcdd2" : "#e0e0e0"}`,
          }}
        >
          {statusMsg}
        </div>
      )}

      {certResult && <VerifyResult certResult={certResult} />}

      <Title
        level={4}
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Chat with our AI Agent for explain about the above result
      </Title>

      <AIAgent certificateData={certResult} />
    </div>
  );
};

export default VerifierSearch;
