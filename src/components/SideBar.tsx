import {
  BookOutlined,
  LineChartOutlined,
  PieChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";

const items = [
  {
    key: "balance",
    icon: <PieChartOutlined />,
    label: <Link to="/balance">Balance</Link>,
  },
  {
    key: "servicios",
    icon: <BookOutlined />,
    label: <Link to="/services">Servicios</Link>,
  },
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
    key: "settings",
    icon: <SettingOutlined />,
    label: "Configuracion",
    children: [
      {
        key: "setting-account",
        label: <Link to="/settings">Ingresos</Link>,
      },
    ],
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
