import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd";
import type { CreateExpenseForm } from "../../../routes/expenses/live";
import { BankEnum } from "../../../enums/BankEnum";
import dayjs from "dayjs";
import { TypeEnum } from "../../../enums/TypeExpense";
import { CurrencyEnum } from "../../../enums/CurrencyEnum";

interface IngresoTabProps {
  onSubmit: (values: CreateExpenseForm) => void;
}
export default function IngresoTab({ onSubmit }: IngresoTabProps) {
  const [form] = Form.useForm<CreateExpenseForm>();
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        onSubmit(values);
        form.resetFields();
        form.setFieldValue("type", TypeEnum.INGRESO);
      }}
      initialValues={{
        date: dayjs(),
        type: TypeEnum.INGRESO,
      }}
    >
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
          <Form.Item name="type" label="Tipo">
            <Select
              placeholder="Seleccionar banco"
              style={{ width: "100%" }}
              disabled
            ></Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col style={{ width: "100%" }}>
          <Form.Item
            label="Descripcion"
            name="description"
            style={{ width: "100%" }}
          >
            <Input />
          </Form.Item>{" "}
        </Col>
      </Row>

      <Form.Item
        label="Fecha"
        name="date"
        rules={[{ required: true, message: "Seleccione una fecha" }]}
      >
        <DatePicker style={{ width: "100%" }} defaultValue={dayjs()} />
      </Form.Item>
      <Row gutter={16}>
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

        <Col span={12}>
          <Form.Item
            label="Monto"
            name="amount"
            rules={[{ required: true, message: "Ingresar Monto" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
      <Button type="primary" onClick={() => form.submit()} block>
        Subir
      </Button>
    </Form>
  );
}
