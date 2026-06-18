import { Layout } from "antd";
import HeaderComponent from "./Header";
import FooterComponent from "./Footer";
import { Breadcrumb } from "antd";

const { Content } = Layout;

const colorBgContainer = "#fff";
const borderRadiusLG = "8px";

export default function LayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <HeaderComponent />
      <Content style={{ padding: "0 48px" }}>
        <Breadcrumb
          style={{ margin: "16px 0" }}
          items={[{ title: "Home" }, { title: "List" }, { title: "App" }]}
        />
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>

      <FooterComponent />
    </Layout>
  );
}
