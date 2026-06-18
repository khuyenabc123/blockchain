import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Input, Select, Spin, Typography } from "antd";

const { Title } = Typography;

export const MintCertificateForm: React.FC = () => {
  const [eligibleStudents, setEligibleStudents] = useState<any[]>([]);
  const [statusMsg, setStatusMsg] = useState("");
  const [createdCertId, setCreatedCertId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    axios
      .get("/api/students/eligible-graduates")
      .then((res) => setEligibleStudents(res.data.data))
      .catch((err) => console.error("Error fetching graduates list", err));
  }, []);

  const handleCreateDraftPipeline = async () => {
    setLoading(true);

    const formData = form.getFieldsValue();
    const { selectedStudentId, degree, major, graduationDate } = formData;

    if (!selectedStudentId) return alert("Please choose a target student.");

    try {
      setCreatedCertId(null);

      const res = await axios.post("/api/certificates/issue", {
        studentId: selectedStudentId,
        degree,
        major,
        graduationDate: new Date(graduationDate).toISOString(),
        issuedBy: "Duy Tan University Admin",
      });

      setCreatedCertId(res.data.certificateId);

      setStatusMsg(`Minted Token #${res.data.tokenId}`);
    } catch (err: any) {
      console.error("Full pipeline crash details:", err);

      let errorMessage =
        "Network connectivity issue or backend server is offline.";

      if (err.response && err.response.data) {
        errorMessage = err.response.data.message || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setStatusMsg(`❌ Process Failed: ${errorMessage}`);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        padding: "20px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Title level={4}>Secure Dynamic NFT Minting Desk</Title>

      {statusMsg && (
        <div
          style={{
            padding: "12px",
            background: "#f0f7ff",
            borderLeft: "4px solid #0070f3",
            marginBottom: "15px",
            fontSize: "14px",
          }}
        >
          {statusMsg}
          <Spin spinning={loading} />
        </div>
      )}

      <Form
        layout="vertical"
        form={form}
        style={{ maxWidth: 600 }}
        onFinish={handleCreateDraftPipeline}
      >
        <Form.Item
          name="selectedStudentId"
          label="Select Eligible Graduate"
          rules={[{ required: true, message: "Please select Student Id" }]}
        >
          <Select
            style={{ width: "100%" }}
            showSearch={{
              filterOption: (input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase()),
            }}
            placeholder="Select a person"
            options={eligibleStudents.map((s) => ({
              value: s.studentId,
              label: `${s.studentId} - ${s.studentName}`,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="degree"
          label="Degree Level"
          rules={[{ required: true, message: "Please select Degree Level" }]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="Select a person"
            options={[
              { value: "Bachelor", label: "Bachelor" },
              { value: "Master", label: "Master" },
              { value: "Doctorate", label: "Doctorate" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="major"
          label="Major Field of Study"
          rules={[
            { required: true, message: "Please select Major Field of Study" },
          ]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="Select a person"
            options={[
              { value: "Computer Science", label: "Computer Science" },
              { value: "Arts In English", label: "Arts In English" },
              {
                value: "Business Administration",
                label: "Business Administration",
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="graduationDate"
          label="Graduation Date"
          rules={[{ required: true, message: "Please input Graduation Date" }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={loading}>
            Process
          </Button>
        </Form.Item>
      </Form>

      {createdCertId && !loading && (
        <div
          style={{
            marginTop: "15px",
            borderTop: "1px solid #eee",
            paddingTop: "15px",
            textAlign: "center",
          }}
        >
          <a
            href={`http://localhost:5000/api/certificates/download/${createdCertId}`}
            download
            style={{
              display: "inline-block",
              padding: "10px 20px",
              background: "#4f46e5",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              fontSize: "14px",
              boxShadow: "0 2px 4px rgba(79, 70, 229, 0.3)",
            }}
          >
            Download & Export Digital PDF Diploma
          </a>
        </div>
      )}
    </div>
  );
};
