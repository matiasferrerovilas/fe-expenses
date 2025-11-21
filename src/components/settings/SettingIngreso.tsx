import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Row,
  Select,
  theme,
  Typography,
} from "antd";
import { useSettingsLastIngreso } from "../../apis/hooks/useSettings";
import type { IngresoSettingForm } from "../../models/Settings";
import { BankEnum } from "../../enums/BankEnum";
import { CurrencyEnum } from "../../enums/CurrencyEnum";
import { useMutation } from "@tanstack/react-query";
import { updateIngreso } from "../../apis/SettingApi";
import { useGroups } from "../../apis/hooks/useGroups";

export function SettingIngreso() {
  const [form] = Form.useForm<IngresoSettingForm>();
  const { data: ingreso, isLoading } = useSettingsLastIngreso();
  const { token } = theme.useToken();
  const { data: userGroups = [] } = useGroups();

  const addGroupMutation = useMutation({
    mutationFn: ({ ingreso }: { ingreso: IngresoSettingForm }) =>
      updateIngreso(ingreso),
    onError: (err) => {
      console.error("Error subiendo el ingreso:", err);
    },
  });
  const onFinish = (values: IngresoSettingForm) => {
    console.log("Ingreso values:", values);
    addGroupMutation.mutate({ ingreso: values });
    form.resetFields();
  };
  return (
    <Card loading={isLoading} title="Configuración de Ingreso">
      <Typography.Paragraph
        style={{
          color: token.colorTextSecondary,
          marginBottom: 16,
        }}
      >
        Define tu ingreso mensual y la moneda que utilizas.
      </Typography.Paragraph>
      <Row
        gutter={16}
        align="middle"
        justify="center"
        title="Configuracion de Ingreso"
      >
        <Form
          key={ingreso?.id ?? "empty"}
          form={form}
          layout="vertical"
          style={{ width: "100%" }}
          onFinish={onFinish}
          initialValues={
            ingreso &&
            userGroups && {
              bank: ingreso.bank,
              currency: ingreso.currency?.symbol ?? CurrencyEnum.ARS,
              amount: ingreso.amount,
              group: userGroups[0]?.description,
            }
          }
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={12}>
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
            <Col xs={24} sm={12} lg={12}>
              <Form.Item
                name="group"
                label="Grupo"
                rules={[{ required: true, message: "Seleccione un grupo" }]}
              >
                <Select placeholder="Seleccionar grupo">
                  {userGroups.map((group) => (
                    <Select.Option key={group.id} value={group.description}>
                      {group.description}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12} lg={12}>
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

            <Col xs={24} sm={12} lg={12}>
              <Form.Item
                label="Monto"
                name="amount"
                rules={[{ required: true, message: "Ingresar Monto" }]}
              >
                <InputNumber
                  precision={2}
                  style={{ width: "100%" }}
                  controls={false}
                />
              </Form.Item>
            </Col>
          </Row>
          <Button
            block
            htmlType="submit"
            style={{
              marginTop: 16,
              borderRadius: 8,
            }}
            type="primary"
          >
            Guardar
          </Button>
        </Form>
      </Row>
    </Card>
  );
}
