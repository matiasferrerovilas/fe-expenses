import {
  BankOutlined,
  DollarOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { createFileRoute } from "@tanstack/react-router";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Steps,
  Typography,
} from "antd";
import { useState } from "react";
import { CurrencyEnum } from "../enums/CurrencyEnum";
const { Title, Text } = Typography;

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const Route = createFileRoute("/onboarding")({
  component: RouteComponent,
});

export interface OnboardingForm {
  amount: number;
  bank: string;
  currency: string;
}

function RouteComponent() {
  const [form] = Form.useForm<OnboardingForm>();

  const bankOptions = [
    { label: "BBVA", value: "bbva" },
    { label: "Santander", value: "santander" },
    { label: "Galicia", value: "galicia" },
    { label: "Macro", value: "macro" },
  ];

  return (
    <Col xs={24} sm={12} lg={8} style={{ paddingTop: 10 }}>
      <Card>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Title level={3}>Bienvenido a Control de Gastos</Title>
          <Text>Configuremos tu cuenta en unos simples pasos</Text>
        </div>

        <Steps
          current={0}
          items={[
            { title: "Ingresos" },
            { title: "Grupos" },
            { title: "Gastos" },
          ]}
          style={{ marginBottom: 40 }}
        />

        <Space direction="vertical" size={20} style={{ width: "100%" }}>
          <Form form={form} layout="vertical" style={{ width: "100%" }}>
            <Col xs={24} sm={12} lg={24}>
              <Text strong>Moneda</Text>
              <Form.Item
                name="currency"
                rules={[{ required: true, message: "Ingrese Moneda" }]}
              >
                <Select placeholder="Ingrese Moneda" style={{ width: "100%" }}>
                  {Object.values(CurrencyEnum).map((currency) => (
                    <Select.Option key={currency} value={currency}>
                      {currency}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={24}>
              <Text strong>¿Cuál es tu sueldo mensual?</Text>
              <Form.Item
                name="amount"
                rules={[{ required: true, message: "Ingresar Monto" }]}
              >
                <InputNumber
                  precision={2}
                  placeholder="50000"
                  prefix={<DollarOutlined />}
                  style={{ width: "100%" }}
                  controls={false}
                />
              </Form.Item>
            </Col>
          </Form>
        </Space>
      </Card>
    </Col>
  );
}
