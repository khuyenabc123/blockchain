import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Header } = Layout;

const items = [
  {
    key: "1",
    label: <Link to="/guide">How to use?</Link>,
  },
  {
    key: "2",
    label: <Link to="/certificate-search">Certificate Search</Link>,
  },
  {
    key: "3",
    label: <Link to="/admin">University Admin Console</Link>,
  },
  {
    key: "4",
    label: <Link to="/portal">Student Portal</Link>,
  },
];

export default function HeaderComponent() {
  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="demo-logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        items={items}
        style={{ flex: 1, minWidth: 0 }}
      />
    </Header>
  );
}
