import { useState, useRef, useEffect } from "react";
import { Button, Card, Input, List, Avatar, Typography, Space } from "antd";
import { UserOutlined, RobotOutlined, SendOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface MessageItem {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export interface AIAgentProps {
  certificateData: any;
}

export default function AIAgent({ certificateData }: AIAgentProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "welcome-msg",
      sender: "ai",
      timestamp: new Date(),
      text: "👋 Welcome to NFT Certificate Verification Assistant.\n\nUpload a certificate first, then I can help explain ownership, blockchain records, IPFS storage, authenticity status, and verification results.",
    },
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const trimmedQuery = question.trim();
    if (!trimmedQuery || loading) return;

    const userMessage: MessageItem = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmedQuery,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    const aiMessageId = `ai-${Date.now()}`;
    const initialAiMessage: MessageItem = {
      id: aiMessageId,
      sender: "ai",
      text: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, initialAiMessage]);

    try {
      const response = await fetch("/api/ai/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedQuery,
          certificateData,
        }),
      });

      if (!response.body) {
        throw new Error(
          "No readable response pipe stream detected from server endpoint.",
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let completeText = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        completeText += decoder.decode(value, { stream: true });
      }

      const wordsArray = completeText.split(" ");

      let typedText = "";

      const typingSpeedMs = 60;

      for (let i = 0; i < wordsArray.length; i++) {
        typedText += (i === 0 ? "" : " ") + wordsArray[i];

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === aiMessageId ? { ...msg, text: typedText } : msg,
          ),
        );

        await new Promise((resolve) => setTimeout(resolve, typingSpeedMs));
      }
    } catch (err: any) {
      console.error("UI Stream Pacing Engine Failure:", err);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                text: "❌ Processing Failure: Connection broke off mid-stream or backend server timed out.",
              }
            : msg,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={
        <Space>
          <span>🤖</span>
          <span>AI Academic Verification Copilot</span>
        </Space>
      }
      style={{
        borderRadius: "12px",
        boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
        border: "1px solid #eaeaea",
      }}
    >
      <div
        style={{
          height: "400px",
          overflowY: "auto",
          overflowX: "hidden",
          padding: "20px",
          background: "#fafafa",
        }}
      >
        <List
          itemLayout="horizontal"
          dataSource={messages}
          split={false}
          renderItem={(item) => {
            const isUser = item.sender === "user";
            return (
              <List.Item
                style={{
                  justifyContent: isUser ? "flex-end" : "flex-start",
                  padding: "8px 0",
                  borderBottom: "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: isUser ? "row-reverse" : "row",
                    alignItems: "flex-start",
                    maxWidth: "85%",
                    gap: "10px",
                  }}
                >
                  <Avatar
                    icon={isUser ? <UserOutlined /> : <RobotOutlined />}
                    style={{
                      backgroundColor: isUser ? "#1677ff" : "#52c41a",
                      flexShrink: 0,
                      marginTop: "4px",
                    }}
                  />

                  <div
                    style={{
                      background: isUser ? "#1677ff" : "#fff",
                      color: isUser ? "#fff" : "#262626",
                      padding: "12px 16px",
                      borderRadius: isUser
                        ? "16px 4px 16px 16px"
                        : "4px 16px 16px 16px",
                      boxShadow: isUser ? "none" : "0 2px 6px rgba(0,0,0,0.03)",
                      border: isUser ? "none" : "1px solid #f0f0f0",
                      whiteSpace: "pre-wrap",
                      fontSize: "14px",
                      lineHeight: "1.5",
                      width: "-webkit-fill-available",
                    }}
                  >
                    {item.text === "" && item.sender === "ai" ? (
                      <Text type="secondary" italic>
                        Thinking...
                      </Text>
                    ) : (
                      item.text
                    )}

                    <div
                      style={{
                        textAlign: isUser ? "right" : "left",
                        fontSize: "10px",
                        marginTop: "6px",
                        opacity: 0.6,
                        color: isUser ? "#fff" : "#8c8c8c",
                      }}
                    >
                      {item.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
        <div ref={chatEndRef} />
      </div>

      <div
        style={{
          padding: "15px",
          background: "#fff",
          borderRadius: "0 0 12px 12px",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <Space.Compact style={{ width: "100%" }}>
          <Input
            placeholder="Type your verification question (e.g., Is this token active?)..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onPressEnter={handleSend}
            // disabled={loading}
            size="large"
            style={{ borderRadius: "8px 0 0 8px" }}
            disabled={!certificateData}
          />
          <Button
            type="primary"
            onClick={handleSend}
            icon={<SendOutlined />}
            loading={loading}
            size="large"
            style={{ borderRadius: "0 8px 8px 0" }}
            disabled={!certificateData}
          />
        </Space.Compact>
      </div>
    </Card>
  );
}
