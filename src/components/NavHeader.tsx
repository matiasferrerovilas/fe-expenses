import React, { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Grid,
  Typography,
  Space,
  Menu,
  Dropdown,
  type MenuProps,
} from "antd";
import BookOutlined from "@ant-design/icons/BookOutlined";
import LineChartOutlined from "@ant-design/icons/LineChartOutlined";
import LogoutOutlined from "@ant-design/icons/LogoutOutlined";
import PieChartOutlined from "@ant-design/icons/PieChartOutlined";
import SettingOutlined from "@ant-design/icons/SettingOutlined";
import UserOutlined from "@ant-design/icons/UserOutlined";
import { useKeycloak } from "@react-keycloak/web";
import { useRouter } from "@tanstack/react-router";
import { ColorEnum } from "../enums/ColorEnum";
import { Header } from "antd/es/layout/layout";

const { Text } = Typography;
const { useBreakpoint } = Grid;

type SideBarItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
};

const items: SideBarItem[] = [
  {
    key: "balance",
    icon: <PieChartOutlined />,
    label: "Balance",
    path: "/balance",
  },
  {
    key: "servicios",
    icon: <BookOutlined />,
    label: "Servicios",
    path: "/services",
  },
  {
    key: "expenses",
    icon: <LineChartOutlined />,
    label: "Gastos",
    path: "/movement",
  },
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Configuración",
    path: "/settings",
  },
];

export default function NavHeader() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { keycloak } = useKeycloak();
  const user = keycloak?.tokenParsed;
  const username = user?.preferred_username;
  const email = user?.email;

  const router = useRouter();
  const currentPath = router.state.location.pathname;

  const getActiveKey = () =>
    items.find((i) => i.path === currentPath)?.key || "balance";
  const [active, setActive] = useState(getActiveKey());

  useEffect(() => setActive(getActiveKey()), [currentPath]);

  const handleClick = (item: SideBarItem) => {
    setActive(item.key);
    router.navigate({ to: item.path });
  };
  const dropdownItems: MenuProps["items"] = [
    {
      key: "logout",
      label: "Cerrar sesión",
      icon: <LogoutOutlined />,
      onClick: () => keycloak.logout(),
    },
  ];
  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        width: "100%",
        zIndex: 100,
        background: "white",
        padding: "12px 16px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[active]}
        style={{
          flex: 1,
          minWidth: 0,
          background: "transparent",
          display: "flex",
          justifyContent: "center",
          border: "none",
        }}
        items={items.map((item) => ({
          key: item.key,
          label: (
            <Card
              hoverable
              onClick={() => handleClick(item)}
              styles={{
                body: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "10px 12px",
                  height: "100%",
                  color:
                    active === item.key
                      ? ColorEnum.TEXTO_ACTIVO_AZUL
                      : "rgba(0,0,0,0.65)",
                  fontWeight: active === item.key ? 600 : 500,
                },
              }}
              style={{
                width: 140,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                background:
                  active === item.key
                    ? ColorEnum.FONDO_BOTON_ACTIVO
                    : "transparent",

                border: "none",
                boxShadow: "none",

                borderTopLeftRadius: active === item.key ? 10 : 0,
                borderTopRightRadius: active === item.key ? 10 : 0,
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 14 }}>{item.label}</span>
            </Card>
          ),
        }))}
      />

      <Dropdown
        menu={{ items: dropdownItems }}
        placement="bottomRight"
        trigger={["click"]}
      >
        <Space align="center" size={12} style={{ cursor: "pointer" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMobile ? "center" : "flex-end",
            }}
          >
            <Text strong>{username}</Text>
            <Text type="secondary" style={{ fontSize: 14 }}>
              {email}
            </Text>
          </div>

          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#686f79", color: "#fff" }}
          />
        </Space>
      </Dropdown>
    </Header>
  );
}
