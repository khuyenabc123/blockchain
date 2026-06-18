import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Typography } from "antd";
import ConnectWallet from "../components/student/ConnectWallet";
import LoginForm from "../components/student/LoginForm";

const { Title, Text } = Typography;

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const StudentPortal: React.FC = () => {
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const [searchForm] = Form.useForm();
  const [walletForm] = Form.useForm();

  useEffect(() => {
    if (studentData?.studentWallet) {
      walletForm.setFieldsValue({ walletAddress: studentData.studentWallet });
    }
  }, [studentData, walletForm]);

  const handleStudentLogin = async () => {
    const formData = searchForm.getFieldsValue();
    const studentId = formData.studentId?.trim();
    const password = formData.password?.trim();

    if (!studentId || !password) return;

    try {
      setStatusMsg("⏳ Fetching university records...");

      const res = await axios.post("/api/students/login", {
        studentId,
        password,
      });

      if (res.data.success) {
        setStudentData(res.data.data);
        setIsLoggedIn(true);

        if (res.data.mustChangePassword) {
          setStatusMsg("⚠️ Please change your temporary password soon from the default.");
        } else {
          setStatusMsg("");
        }
      }
    } catch (err: any) {
      setStatusMsg(
        `❌ Login Failed: ${err.response?.data?.message || "Student profile not found."}`,
      );
    }
  };

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      alert(
        "🦊 MetaMask extension not detected! Please install MetaMask to link your wallet.",
      );
      return;
    }

    try {
      setStatusMsg("🦊 Connecting to MetaMask wallet...");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const capturedWallet = accounts[0].toLowerCase();

        walletForm.setFieldsValue({ walletAddress: capturedWallet });
        setStatusMsg("✅ Wallet address captured successfully from MetaMask.");
      }
    } catch (err: any) {
      setStatusMsg(`❌ Connection rejected: ${err.message}`);
    }
  };

  const handleLinkWalletSubmit = async () => {
    const formData = walletForm.getFieldsValue();
    const inputWalletAddress = formData.walletAddress?.trim();

    if (!inputWalletAddress) return;

    try {
      setStatusMsg(
        "📡 Synchronizing decentralized identity address with school database...",
      );
      const res = await axios.post("/api/students/student/link-wallet", {
        studentId: studentData.studentId,
        studentWallet: inputWalletAddress,
      });

      if (res.data.success) {
        setStatusMsg(
          "🎉 Success! Your Web3 Wallet is officially locked to your academic profile.",
        );
        setStudentData({ ...studentData, studentWallet: inputWalletAddress });
      }
    } catch (err: any) {
      setStatusMsg(
        `❌ Link Failed: ${err.response?.data?.message || err.message}`,
      );
    }
  };

  if (!isLoggedIn) {
    return (
      <LoginForm
        searchForm={searchForm}
        handleStudentLogin={handleStudentLogin}
        statusMsg={statusMsg}
      />
    );
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "5px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <Title level={4} style={{ marginTop: 0, color: "#111" }}>
        Welcome back, {studentData.studentName}!
      </Title>

      <Text style={{ color: "#555" }}>
        Verify your degree metadata profile details and attach your public
        Ethereum cryptographic credential target wallet key below.
      </Text>

      <div
        style={{
          background: "#f9f9f9",
          padding: "15px",
          borderRadius: "6px",
          marginBottom: "20px",
          fontSize: "15px",
          border: "1px solid #eaeaea",
        }}
      >
        <div>
          <strong>Student Reference ID:</strong> {studentData.studentId}
        </div>

        <div style={{ marginTop: "5px" }}>
          <strong>Legal Name String:</strong> {studentData.studentName}
        </div>

        <div style={{ marginTop: "5px" }}>
          <strong>On-Chain Issued Status:</strong>{" "}
          {studentData.hasGraduated
            ? "🎓 Certificate Minted"
            : "⏳ In Review Pipeline"}
        </div>
      </div>

      {statusMsg && (
        <div
          style={{
            padding: "12px",
            background: "#eef2ff",
            borderLeft: "4px solid #4f46e5",
            color: "#3730a3",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          {statusMsg}
        </div>
      )}

      <ConnectWallet
        walletForm={walletForm}
        studentData={studentData}
        handleLinkWalletSubmit={handleLinkWalletSubmit}
        connectMetaMask={connectMetaMask}
      />
    </div>
  );
};
