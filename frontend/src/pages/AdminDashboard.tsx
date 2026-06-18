import React, { useState } from "react";
import { AddStudent } from "../components/admin/AddStudent";
import { EligibilityPanel } from "../components/admin/EligibilityPanel";
import { MintCertificateForm } from "../components/admin/MintCertificateForm";
import { Tabs, type TabsProps } from "antd";

type AdminTab = "register" | "eligibility" | "mint";

const items: TabsProps["items"] = [
  {
    key: "register",
    label: "Create Student Profile",
    children: <AddStudent />,
  },
  {
    key: "eligibility",
    label: "Check Student Eligibility and Records",
    children: <EligibilityPanel />,
  },
  {
    key: "mint",
    label: "Dynamic NFT Minting Hub",
    children: <MintCertificateForm />,
  },
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("register");

  const onChange = (key: string) => {
    setActiveTab(key as AdminTab);
  };

  return (
    <div
      style={{
        margin: "30px auto",
        padding: "0 20px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <Tabs
        activeKey={activeTab}
        defaultActiveKey="register"
        items={items}
        onChange={onChange}
      />
    </div>
  );
};

export default AdminDashboard;
