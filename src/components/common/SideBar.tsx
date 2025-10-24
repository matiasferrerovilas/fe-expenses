import {
  BookOutlined,
  LineChartOutlined,
  PieChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useRouter } from "@tanstack/react-router";
import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";

const items = [
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

export default function SideBar() {
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  const handleClick = (item: any) => {
    setActive(item.key);
    if (item.path) router.navigate({ to: item.path });
  };
  const getActiveKey = () => {
    const activeItem = items.find((item) => item.path === currentPath);
    return activeItem?.key || "balance";
  };

  const [active, setActive] = useState(getActiveKey());

  useEffect(() => {
    setActive(getActiveKey());
  }, [currentPath]);
  return (
    <Row justify="center" style={{ padding: "24px 8px" }}>
      {items.map((item) => {
        const isActive = active === item.key;
        return (
          <Col key={item.key} style={{ padding: 2 }}>
            <Card
              hoverable
              onClick={() => handleClick(item)}
              style={{
                width: 220,
                height: 100,
                textAlign: "center",
                border: isActive ? "2px solid #1677ff" : "1px solid #f0f0f0",
                background: isActive ? "#f5faff" : "#fff",
                boxShadow: isActive ? "0 0 8px rgba(22,119,255,0.2)" : "none",
                borderRadius: 12,
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              styles={{
                body: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  color: isActive ? "#1677ff" : "rgba(0,0,0,0.65)",
                  fontWeight: isActive ? 600 : 500,
                  height: "100%",
                },
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
