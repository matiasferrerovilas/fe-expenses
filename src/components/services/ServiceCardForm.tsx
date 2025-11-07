import { useState } from "react";
import {
  Card,
  Space,
  Typography,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Switch,
  Row,
  Col,
} from "antd";
import {
  ApartmentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { CurrencyEnum } from "../../enums/CurrencyEnum";
import type { ServiceToAdd } from "../../apis/ServiceApi";

const { Title } = Typography;

interface ServiceCardFormProps extends React.HTMLAttributes<HTMLElement> {
  handleAddService: (service: ServiceToAdd) => Promise<void> | void;
}

export const ServiceCardForm = ({ handleAddService }: ServiceCardFormProps) => {
  const [form] = Form.useForm();
  const [isPaid, setIsPaid] = useState(false);

  const onFinish = (values: any) => {
    const service: ServiceToAdd = {
      description: values.description,
      amount: values.amount,
      lastPayment: values.lastPayment ? values.lastPayment.toDate() : null,
      isPaid: values.isPaid,
      currency: { symbol: values.currency },
    };
    handleAddService(service);
    form.resetFields();
    setIsPaid(false);
  };

  const icon = isPaid ? (
    <CheckCircleOutlined style={{ color: "#52c41a" }} />
  ) : (
    <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
  );

  return (
    <Card
      variant="outlined"
      style={{
        borderRadius: 16,
        borderColor: isPaid ? "#b7eb8f" : "#ffa39e",
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
              backgroundColor: isPaid ? "#f6ffed" : "#fff1f0",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ApartmentOutlined
              style={{ color: isPaid ? "#52c41a" : "#ff4d4f" }}
            />
          </div>
          <Title level={5} style={{ margin: 0 }}>
            Nuevo Servicio
          </Title>
        </Space>
        {icon}
      </Space>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="description"
          label="Descripción"
          rules={[{ required: true, message: "Ingrese una descripción" }]}
        >
          <Input placeholder="Ej: Internet, Luz, Netflix..." />
        </Form.Item>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="amount"
              label="Monto"
              rules={[{ required: true, message: "Ingrese el monto" }]}
            >
              <InputNumber
                precision={2}
                style={{ width: "100%" }}
                controls={false}
                placeholder="Monto del servicio"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="currency"
              label="Moneda"
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
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="isPaid"
              label="¿Está pagado?"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="Pagado"
                unCheckedChildren="Pendiente"
                style={{ width: "100%" }}
                onChange={(checked) => setIsPaid(checked)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            {isPaid && (
              <Form.Item
                name="lastPayment"
                label="Fecha de pago"
                rules={[
                  { required: true, message: "Seleccione la fecha de pago" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  disabledDate={(d) => d.isAfter(dayjs())}
                />
              </Form.Item>
            )}
          </Col>
        </Row>

        <Button
          type="primary"
          htmlType="submit"
          block
          style={{ borderRadius: 8 }}
        >
          Agregar Servicio
        </Button>
      </Form>
    </Card>
  );
};
