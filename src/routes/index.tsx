import { useKeycloak } from "@react-keycloak/web";
import { createFileRoute } from "@tanstack/react-router";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { CurrencyEnum } from "../enums/CurrencyEnum";
import { BankEnum } from "../enums/BankEnum";
import { MailOutlined } from "@ant-design/icons";
import { protectedRouteGuard } from "../apis/auth/protectedRouteGuard";
const { Text, Title } = Typography;

export const Route = createFileRoute("/")({
  beforeLoad: protectedRouteGuard,
  component: RouteComponent,
});
interface OnboardingFormValues {
  email: string;
  bank: BankEnum;
  currency: CurrencyEnum;
  amount: number;
}

function RouteComponent() {
  const [form] = Form.useForm<OnboardingFormValues>();
  const { keycloak } = useKeycloak();
  const emailFromToken = keycloak.tokenParsed?.email;

  const onFinish = (values: OnboardingFormValues) => {
    console.log("Datos de Onboarding:", values);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        style={{
          width: 450,
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Space
          direction="vertical"
          size="small"
          style={{ width: "100%", marginBottom: 20 }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Bienvenido
          </Title>
          <Text type="secondary">Completa tu información para comenzar</Text>
        </Space>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            email: emailFromToken,
            monthlySalary: 0,
            currency: CurrencyEnum.ARS,
            bank: BankEnum.GALICIA,
          }}
          onFinish={onFinish}
        >
          <Form.Item name="email" label="Correo electrónico">
            <Input prefix={<MailOutlined />} disabled />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="bank"
                label="Banco"
                rules={[{ required: true, message: "Seleccione un banco" }]}
              >
                <Select placeholder="Seleccionar banco">
                  {Object.values(BankEnum).map((bank) => (
                    <Select.Option key={bank} value={bank}>
                      {bank}
                    </Select.Option>
                  ))}
                </Select>
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
          <Form.Item
            name="amount"
            label="Monto del"
            rules={[{ required: true, message: "Ingrese el monto" }]}
          >
            <InputNumber
              precision={2}
              style={{ width: "100%" }}
              controls={false}
              placeholder="Monto del Ingreso"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 30 }}>
            <Button type="primary" htmlType="submit" block size="large">
              Continuar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
