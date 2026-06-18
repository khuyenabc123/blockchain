import { Layout } from "antd";

const { Footer } = Layout;

const currentYear = new Date().getFullYear();

export default function FooterComponent() {
  return (
    <Footer style={{ textAlign: "center" }}>
      DTU Portal ©{currentYear} Created by Khuyen
    </Footer>
  );
}
