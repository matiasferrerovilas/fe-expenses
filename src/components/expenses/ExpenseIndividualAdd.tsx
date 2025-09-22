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
import type { CreateExpenseForm } from "../../routes/expenses/live";
import { BankEnum } from "../../enums/BankEnum";
import { TypeEnum } from "../../enums/TypeExpense";
import { CurrencyEnum } from "../../enums/CurrencyEnum";

export default function ExpenseIndividualAdd() {
  const [form] = Form.useForm<CreateExpenseForm>();
  const handleFinish = (values: CreateExpenseForm) => {
    console.log(values);
    form.resetFields();
  };
  return (
    <Row
      gutter={[6, 8]}
      style={{
        height: "80vh",
        width: "80%",
        margin: "0 auto",
        alignItems: "center",
        justifySelf: "center",
        justifyContent: "center",
        backgroundColor: "white",
        border: "3px dashed #1890ff",
        borderRadius: "8px",
      }}
    >
      <Col>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
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
                name="type"
                label="Tipo"
                rules={[
                  { required: true, message: "Seleccione un tipo de Gasto" },
                ]}
              >
                <Select placeholder="Seleccionar banco">
                  {Object.values(TypeEnum).map((type) => (
                    <Select.Option key={type} value={type}>
                      {type}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {Form.useWatch("type", form) === TypeEnum.CREDITO && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Cuota Actual"
                  name="cuotaActual"
                  rules={[
                    { required: true, message: "Ingresar cuota actual" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const total = getFieldValue("cuotasTotales");
                        if (!value || !total || value <= total) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "La cuota actual no puede ser mayor que el total"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>{" "}
              <Col span={12}>
                <Form.Item
                  label="Cuotas Totales"
                  name="cuotasTotales"
                  rules={[
                    { required: true, message: "Ingresar cantidad de cuotas" },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>{" "}
            </Row>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Descripcion" name="description">
                <Input />
              </Form.Item>{" "}
            </Col>
            <Col span={12}>
              <Form.Item label="Categoria" name="category">
                <Input />
              </Form.Item>{" "}
            </Col>
          </Row>

          <Form.Item
            label="Fecha"
            name="date"
            rules={[{ required: true, message: "Seleccione una fecha" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="currency"
                label="Moneda"
                rules={[{ required: true, message: "Seleccione una moneda" }]}
              >
                <Select placeholder="Seleccionar moneda">
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
      </Col>
    </Row>
  );
}
