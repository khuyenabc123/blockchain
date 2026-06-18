import React, { useState } from "react";
import axios from "axios";
import { Button, Form, Input, Spin, Typography } from "antd";

const { Title } = Typography;

export const AddStudent: React.FC = () => {
  const [message, setMessage] = useState({ text: "", isError: false });
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    setLoading(true);

    const formData = form.getFieldsValue();

    try {
      const response = await axios.post(
        "/api/students/admin/register",
        formData,
      );

      if (response.data.success) {
        setMessage({
          text: `🎉 Student ${formData.studentName} registered successfully!`,
          isError: false,
        });

        form.resetFields();
      }
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.message || "Failed to register student.",
        isError: true,
      });
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        padding: "20px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Title level={4}>Register New Student Account</Title>

      {message.text && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "4px",
            backgroundColor: message.isError ? "#ffebee" : "#e8f5e9",
            color: message.isError ? "#c62828" : "#2e7d32",
          }}
        >
          {message.text}
        </div>
      )}

      <Form
        layout="vertical"
        form={form}
        style={{ maxWidth: 600 }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="studentId"
          label="Student ID"
          rules={[{ required: true, message: "Please input Student Id" }]}
        >
          <Input placeholder="e.g., SE00002" />
        </Form.Item>

        <Form.Item
          name="studentName"
          label="Full Name"
          rules={[{ required: true, message: "Please input Full Name" }]}
        >
          <Input placeholder="e.g., Tran Van A" />
        </Form.Item>

        <Form.Item
          name="dateOfBirth"
          label="Date of Birth"
          rules={[{ required: true, message: "Please input Date of Birth" }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Notification Email Address"
          rules={[
            {
              required: true,
              message: "Please input Notification Email Address",
            },
          ]}
        >
          <Input type="email" placeholder="e.g., student@university.edu" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit <Spin spinning={loading} />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
