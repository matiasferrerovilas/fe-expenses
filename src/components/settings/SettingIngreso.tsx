import { Button, Card, Col, Form, InputNumber, Row, Select } from "antd";
import { useSettingsLastIngreso } from "../../apis/hooks/useSettings";
import type { IngresoSettingForm } from "../../models/Settings";
import { BankEnum } from "../../enums/BankEnum";
import { CurrencyEnum } from "../../enums/CurrencyEnum";

export function SettingIngreso() {
  const [form] = Form.useForm<IngresoSettingForm>();
  const { data: ingreso, isLoading } = useSettingsLastIngreso();

  return (
    <Row gutter={16} align="middle" justify="center">
      <Card loading={isLoading}>
        <Form
          key={ingreso?.id ?? "empty"}
          form={form}
          layout="vertical"
          style={{ width: "100%" }}
          initialValues={
            ingreso && {
              bank: ingreso.bank,
              currency: ingreso.currency?.symbol,
              amount: ingreso.amount,
            }
          }
        >
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
                <InputNumber
                  style={{ width: "100%" }}
                  controls={false}
                  formatter={(value) =>
                    value
                      ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                      : ""
                  }
                  parser={(value) =>
                    value
                      ? value.replace(/\$\s?|(,*)|\./g, "").replace(",", ".")
                      : ""
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Button
            block
            style={{
              marginTop: 16,
              borderRadius: 8,
            }}
            type="primary"
          >
            Guardar
          </Button>
        </Form>
      </Card>
    </Row>
  );
}
