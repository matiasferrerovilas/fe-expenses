import {
  Card,
  Space,
  Typography,
  Tag,
  Button,
  Tooltip,
  Row,
  Col,
  InputNumber,
  message,
} from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ApartmentOutlined,
  EditOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import type { Service, ServiceToUpdate } from "../../models/Service";
import React, { useState } from "react";

const { Text, Title } = Typography;

interface ServiceCardProps extends React.HTMLAttributes<HTMLElement> {
  service: Service;
  handlePayServiceMutation: (service: Service) => Promise<void> | void;
  handleUpdateServiceMutation: (
    serviceToUpdate: ServiceToUpdate
  ) => Promise<void> | void;
}

export const ServiceCard = React.memo(function ServiceCard({
  service,
  handlePayServiceMutation,
  handleUpdateServiceMutation,
}: ServiceCardProps) {
  const status = service.isPaid ? "Pagado" : "Pendiente";

  const color = service.isPaid ? "#52c41a" : "#ff4d4f";
  const bgColor = service.isPaid ? "#f6ffed" : "#fff1f0";
  const [newAmount, setNewAmount] = useState<number>(service.amount);
  const [isEditing, setIsEditing] = useState(false);

  const icon = service.isPaid ? (
    <CheckCircleOutlined />
  ) : (
    <CloseCircleOutlined />
  );
  const handleSaveAmount = () => {
    if (newAmount <= 0) {
      message.warning("El monto debe ser mayor que 0");
      return;
    }
    const serviceToUpdate: ServiceToUpdate = {
      id: service.id,
      changes: {
        amount: newAmount,
      },
    };
    handleUpdateServiceMutation(serviceToUpdate);
    setIsEditing(false);
    message.success("Monto actualizado");
  };

  const handlePay = () => {
    setIsEditing(false);
    handlePayServiceMutation(service);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewAmount(service.amount);
  };
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
        <Row>
          <Col flex="auto">
            {isEditing ? (
              <InputNumber
                autoFocus
                value={newAmount}
                onChange={(value) => setNewAmount(value || 0)}
                onPressEnter={handleSaveAmount}
                min={0}
                precision={2}
                controls={false}
                style={{ width: "100%" }}
              />
            ) : (
              <Title level={3} style={{ margin: 0 }}>
                {service.amount.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}{" "}
                {service.currency?.symbol}
              </Title>
            )}
          </Col>
          {!service.isPaid && (
            <Col>
              {isEditing ? (
                <Space>
                  <Tooltip title="Guardar">
                    <Button
                      type="text"
                      icon={<CheckOutlined />}
                      style={{ color: "#52c41a" }}
                      onClick={handleSaveAmount}
                    />
                  </Tooltip>
                  <Tooltip title="Cancelar">
                    <Button
                      type="text"
                      icon={<CloseOutlined />}
                      style={{ color: "#ff4d4f" }}
                      onClick={handleCancelEdit}
                    />
                  </Tooltip>
                </Space>
              ) : (
                <Tooltip title="Editar monto">
                  <Button
                    type="text"
                    size="middle"
                    icon={<EditOutlined style={{ fontSize: 20 }} />}
                    style={{
                      color: "#1677ff",
                      borderRadius: 8,
                      padding: "0 8px",
                    }}
                    onClick={() => setIsEditing(true)}
                  />
                </Tooltip>
              )}
            </Col>
          )}
        </Row>
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
          onClick={handlePay}
        >
          {service.isPaid ? "Marcar como pendiente" : "Marcar como pagado"}
        </Button>
      )}
    </Card>
  );
});
