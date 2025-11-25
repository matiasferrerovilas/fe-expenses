import { Button, Col, Form, Row, Select, Space, Typography } from "antd";

const { Text } = Typography;

interface Props {
  initialValues: any;
  onNext: (values: any) => void;
  onPrev: () => void;
}

export default function GrupoOnboarding({
  initialValues,
  onNext,
  onPrev,
}: Props) {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => onNext(values));
  };

  const groups = [
    { label: "Personal", value: "personal" },
    { label: "Familia", value: "familia" },
    { label: "Trabajo", value: "trabajo" },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Col span={24}>
          <Text strong>Grupos en los que participás</Text>
          <Form.Item
            name="groups"
            rules={[{ required: true, message: "Seleccione al menos uno" }]}
          >
            <Select
              mode="multiple"
              placeholder="Selecciona grupos"
              options={groups}
            />
          </Form.Item>
        </Col>

        <Row gutter={16} justify="space-between">
          <Col xs={12} md={9} lg={12}>
            <Button block type="primary" onClick={onPrev}>
              Volver
            </Button>
          </Col>
          <Col xs={12} md={9} lg={12}>
            <Button block type="primary" onClick={handleSubmit}>
              Finalizar
            </Button>
          </Col>
        </Row>
      </Form>
    </Space>
  );
}
