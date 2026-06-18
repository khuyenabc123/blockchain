import { Button, Form, Input, Typography } from "antd";

const { Title, Text } = Typography;

export interface LoginFormProps {
  searchForm: ReturnType<typeof Form.useForm>[0];
  statusMsg: string;
  handleStudentLogin: () => void;
}

export default function LoginForm({
  searchForm,
  statusMsg,
  handleStudentLogin,
}: LoginFormProps) {
  return (
    <div
      style={{
        maxWidth: "450px",
        margin: "100px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <Title
        level={3}
        style={{ marginTop: 0, color: "#111", textAlign: "center" }}
      >
        🎓 Student Portal
      </Title>

      <Text style={{ color: "#666", textAlign: "center", fontSize: "14px" }}>
        Please enter your official student account to access your profile.
      </Text>

      {statusMsg && (
        <Text
          style={{
            padding: "10px",
            background: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            marginBottom: "15px",
            fontSize: "14px",
          }}
        >
          {statusMsg}
        </Text>
      )}

      <Form
        layout="vertical"
        form={searchForm}
        style={{ maxWidth: 600, marginTop: 20 }}
        onFinish={handleStudentLogin}
      >
        <Form.Item
          name="studentId"
          rules={[{ required: true, message: "Please input Student Id" }]}
        >
          <Input placeholder="e.g., SE00002" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input Password" }]}
        >
          <Input placeholder="Your password" />
        </Form.Item>

        <Form.Item>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
          >
            Access Profile
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
