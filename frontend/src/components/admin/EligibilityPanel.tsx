import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Typography, type TableProps } from "antd";

const { Title } = Typography;

interface DataType {
  studentId: string;
  studentName: string;
  studentWallet: string;
  isEligibleToGraduate: boolean;
}

export const EligibilityPanel: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("/api/students/all-profiles");
      setStudents(res.data.data);
    } catch (err) {
      console.error("Error fetching student registry", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleApprove = async (studentId: string) => {
    try {
      const res = await axios.post("/api/students/admin/approve-eligibility", {
        studentId,
      });
      if (res.data.success) {
        alert("🎓 Student status successfully updated to ELIGIBLE.");
        fetchStudents();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Approval failed.");
    }
  };

  if (loading) return <div>Loading active student registry...</div>;

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Student ID",
      dataIndex: "studentId",
      key: "studentId",
    },
    {
      title: "Name",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Linked Wallet",
      dataIndex: "studentWallet",
      key: "studentWallet",
      render: (walletAddress: string) => (
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            color: walletAddress ? "#333" : "#999",
          }}
        >
          {walletAddress || "⚠️ Pending Wallet Link"}
        </span>
      ),
    },
    {
      title: "Graduation Eligibility Status",
      dataIndex: "isEligibleToGraduate",
      key: "isEligibleToGraduate",
      render: (isEligible: boolean, record: DataType) =>
        isEligible ? (
          <span style={{ color: "#2e7d32", fontWeight: "bold" }}>
            ✅ Approved Eligible
          </span>
        ) : (
          <Button
            disabled={!record.studentWallet}
            onClick={() => handleApprove(record.studentId)}
            type="primary"
            color={record.studentWallet ? "green" : "default"}
          >
            Approve Graduation
          </Button>
        ),
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Title level={4}>Graduation Verification & Review Desk</Title>

      <Table
        style={{ marginTop: "15px" }}
        dataSource={students}
        columns={columns}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};
