import React, { useEffect, useState } from "react";
import { Avatar, Card, Grid, Typography, Space } from "antd";
import {
  BookOutlined,
  LineChartOutlined,
  PieChartOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useKeycloak } from "@react-keycloak/web";
import { useRouter } from "@tanstack/react-router";
import { ColorEnum } from "../enums/ColorEnum";

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

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        width: "100%",
        zIndex: 100,
        padding: "12px 16px",
        background: "white",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: 16,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              maxWidth: 1100,
              width: "100%",
              padding: "4px 0",
            }}
          >
            {items.map((item) => {
              const isActive = active === item.key;
              return (
                <Card
                  key={item.key}
                  hoverable
                  onClick={() => handleClick(item)}
                  styles={{
                    body: {
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      height: "100%",
                      padding: 16,
                      color: isActive ? "#1677ff" : "rgba(0,0,0,0.65)",
                      fontWeight: isActive ? 600 : 500,
                    },
                  }}
                  style={{
                    flex: "0 1 220px",
                    maxWidth: 220,
                    minWidth: 160,
                    height: 100,
                    textAlign: "center",
                    border: isActive
                      ? "3px solid #1677ff"
                      : "2px solid #f0f0f0",
                    background: isActive
                      ? ColorEnum.FONDO_BOTON_ACTIVO
                      : "#fff",
                    boxShadow: isActive
                      ? "0 0 8px rgba(22,119,255,0.12)"
                      : "none",
                    borderRadius: 12,
                    transition: "all 0.16s ease",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                  <span style={{ marginTop: 6 }}>{item.label}</span>
                </Card>
              );
            })}
          </div>
        </div>

        <div
          style={{
            alignSelf: isMobile ? "stretch" : "center",
            display: "flex",
            justifyContent: isMobile ? "center" : "flex-end",
            width: isMobile ? "100%" : "auto",
            marginTop: isMobile ? 8 : 0,
            paddingLeft: isMobile ? 0 : 8,
          }}
        >
          <Space align="center" size={12}>
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
        </div>
      </div>
    </nav>
  );
}
