import { Card, Space, Typography, Tag, Button } from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import type { Service } from "../../models/Service";
import React from "react";

const { Text, Title } = Typography;

interface ServiceCardProps extends React.HTMLAttributes<HTMLElement> {
  service: Service;
  handleUpdateService: (service: Service) => Promise<void> | void;
}

export const ServiceCard = React.memo(function ServiceCard({
  service,
  handleUpdateService,
}: ServiceCardProps) {
  const status = service.isPaid ? "Pagado" : "Pendiente";

  const color = service.isPaid ? "#52c41a" : "#ff4d4f";
  const bgColor = service.isPaid ? "#f6ffed" : "#fff1f0";
  const icon = service.isPaid ? (
    <CheckCircleOutlined />
  ) : (
    <CloseCircleOutlined />
  );

  return (
    <Card
      variant="outlined"
      style={{
        borderWidth: 2,
        borderRadius: 16,
        borderColor: service.isPaid ? "#b7eb8f" : "#ffa39e",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
      styles={{
        body: { padding: 20 },
      }}
    >
      <Space
        direction="horizontal"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <Space align="center">
          <div
            style={{
              backgroundColor: bgColor,
              color,
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ApartmentOutlined />
          </div>
          <Title level={5} style={{ margin: 0 }}>
            {service.description}
          </Title>
        </Space>
        <Tag
          icon={icon}
          color={service.isPaid ? "success" : "error"}
          style={{
            borderRadius: 16,
            fontWeight: 500,
          }}
        >
          {status}
        </Tag>
      </Space>

      <div style={{ marginTop: 16 }}>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Monto
        </Text>
        <Title level={3} style={{ margin: 0 }}>
          {service.amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}{" "}
          {service.currency?.symbol}
        </Title>
      </div>

      <div
        style={{
          borderBottom: "1px solid #f0f0f0",
          margin: "12px 0",
        }}
      />

      <Space direction="vertical" size={8}>
        <Space>
          <CalendarOutlined />
          <Text>
            <Text strong>Último pago:</Text> {service.lastPayment?.toString()}
          </Text>
        </Space>
      </Space>

      {!service.isPaid && (
        <Button
          block
          style={{
            marginTop: 16,
            borderRadius: 8,
            borderColor: color,
            color,
          }}
          onClick={() => handleUpdateService(service)}
        >
          {service.isPaid ? "Marcar como pendiente" : "Marcar como pagado"}
        </Button>
      )}
    </Card>
  );
});
