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
import dayjs from "dayjs";
import { BankEnum } from "../../../enums/BankEnum";
import { TypeEnum } from "../../../enums/TypeExpense";
import { CurrencyEnum } from "../../../enums/CurrencyEnum";
import type { CreateExpenseForm } from "../../../routes/expenses/live";
import type { Category } from "../../../models/Category";

interface ExpenseTabProps {
  onSubmit: (values: CreateExpenseForm) => void;
  categories: Category[];
}
export default function ExpenseTab({ onSubmit, categories }: ExpenseTabProps) {
  const [form] = Form.useForm<CreateExpenseForm>();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        onSubmit(values);
        form.resetFields();
      }}
      initialValues={{
        date: dayjs(),
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
          <Form.Item
            name="type"
            label="Tipo"
            rules={[{ required: true, message: "Seleccione un tipo de Gasto" }]}
          >
            <Select placeholder="Seleccionar banco" style={{ width: "100%" }}>
              {Object.values(TypeEnum)
                .filter((type) => type != TypeEnum.INGRESO)
                .map((type) => (
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
          <Form.Item
            label="Descripcion"
            name="description"
            style={{ width: "100%" }}
          >
            <Input />
          </Form.Item>{" "}
        </Col>
        <Col span={12}>
          <Form.Item
            name="category"
            label="Categoria"
            rules={[{ required: true, message: "Seleccione un tipo de Gasto" }]}
          >
            <Select
              placeholder="Seleccionar banco"
              showSearch
              style={{ width: "100%" }}
            >
              {Object.values(categories).map((type) => (
                <Select.Option key={type.id} value={type.description}>
                  {type.description}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
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
