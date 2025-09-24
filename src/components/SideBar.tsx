import { LineChartOutlined, SettingOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";

const items = [
  {
    key: "expenses",
    icon: <LineChartOutlined />,
    label: "Gastos",
    children: [
      {
        key: "expenses-live",
        label: <Link to="/expenses/live">Live</Link>,
      },
      {
        key: "expenses-history",
        label: <Link to="/expenses/history">Historial</Link>,
      },
    ],
  },
  {
    key: "balance",
    icon: <LineChartOutlined />,
    label: <Link to="/balance">Balance</Link>,
  },
  {
    key: "servicios",
    icon: <SettingOutlined />,
    label: <Link to="/services">Servicios</Link>,
  },
];

export default function SideBar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className="demo-logo-vertical" />
      <Menu
        defaultSelectedKeys={["expenses"]}
        defaultOpenKeys={["expenses"]} // 👈 así arranca expandido Gastos
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
      />
    </Sider>
  );
}
