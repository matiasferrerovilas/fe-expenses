import { Card, Row } from "antd";

export default function ResumenGasto() {
  return (
    <Row gutter={16} justify="center" style={{ marginTop: 20, gap: 20 }}>
      <Card style={{ width: 300, alignContent: "center", textAlign: "center" }}>
        <h2>$20.000 ARS</h2>
      </Card>
      <Card style={{ width: 300, alignContent: "center", textAlign: "center" }}>
        <h2>$20.000 ARS</h2>
      </Card>
      <Card style={{ width: 300, alignContent: "center", textAlign: "center" }}>
        <h2>$20.000 ARS</h2>
      </Card>
    </Row>
  );
}
