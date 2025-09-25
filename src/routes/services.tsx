import { createFileRoute } from "@tanstack/react-router";
import { Col, Row } from "antd";

export const Route = createFileRoute("/services")({
  component: RouteComponent,
});

function RouteComponent() {
  const items = Array.from({ length: 10 }, (_, i) => i + 1); // 10 cuadraditos de ejemplo

  return (
    <div
      style={{
        display: "grid",
        paddingTop: "16px",
        gridTemplateRows: "auto 1fr",
        gap: "16px",
        height: "100%",
        width: "100%",
      }}
    >
      <Row gutter={[8, 8]} justify="center">
        {items.map((item) => (
          <Col key={item}>
            <div
              style={{
                height: "12vh",
                aspectRatio: "1",
                margin: "0 auto",
                alignItems: "center",
                justifySelf: "center",
                justifyContent: "center",
                backgroundColor: "white",
                border: "3px dashed #1890ff",
                borderRadius: "8px",
              }}
            />
          </Col>
        ))}
      </Row>

      <Row
        gutter={[6, 8]}
        style={{
          height: "70vh",
          width: "90%",
          margin: "0 auto",
          alignItems: "center",
          justifySelf: "center",
          justifyContent: "center",
          backgroundColor: "white",
          border: "3px dashed #1890ff",
          borderRadius: "8px",
        }}
      >
        <Col></Col>
      </Row>
    </div>
  );
}
