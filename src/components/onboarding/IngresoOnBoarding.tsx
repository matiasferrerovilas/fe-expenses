import {
  Button,
  Col,
  Form,
  InputNumber,
  Select,
  Space,
  Typography,
} from "antd";
import { DollarOutlined } from "@ant-design/icons";
import { CurrencyEnum } from "../../enums/CurrencyEnum";
import { BankEnum } from "../../enums/BankEnum";

const { Text } = Typography;

interface Props {
  initialValues: any;
  onNext: (values: any) => void;
}

export default function IngresoOnBoarding({ initialValues, onNext }: Props) {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => onNext(values));
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Col xs={24} md={18} lg={24}>
          <Text strong>Banco</Text>
          <Form.Item
            name="bank"
            rules={[{ required: true, message: "Ingrese su banco" }]}
          >
            <Select placeholder="Ingrese Bannco">
              {Object.values(BankEnum).map((bank) => (
                <Select.Option key={bank} value={bank}>
                  {bank}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} md={18} lg={24}>
          <Text strong>Moneda</Text>
          <Form.Item
            name="currency"
            rules={[{ required: true, message: "Ingrese Moneda" }]}
          >
            <Select placeholder="Ingrese Moneda">
              {Object.values(CurrencyEnum).map((currency) => (
                <Select.Option key={currency} value={currency}>
                  {currency}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} md={18} lg={24}>
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

        <Col xs={24} md={18} lg={24}>
          <Button block type="primary" onClick={handleSubmit}>
            Siguiente
          </Button>
        </Col>
      </Form>
    </Space>
  );
}
