import { LineChartOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";

const items = [
  {
    key: "1",
    icon: <LineChartOutlined />,
    label: <Link to="/expenses">Gastos</Link>,
  },
  {
    key: "2",
    icon: <LineChartOutlined />,
    label: <Link to="/balance">Balance</Link>,
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
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
      />
    </Sider>
  );
}
