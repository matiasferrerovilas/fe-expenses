import { createFileRoute } from "@tanstack/react-router";
import ResumenGasto from "../../components/balance/ResumenGasto";
import { Button, Row } from "antd";
import { FileAddFilled } from "@ant-design/icons";
import { useState } from "react";

export const Route = createFileRoute("/expenses/live")({
  component: RouteComponent,
});

function RouteComponent() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <ResumenGasto />
      <Row align={"middle"}>
        <h1>Gastos</h1>
        <Button
          type="primary"
          icon=<FileAddFilled />
          style={{ marginLeft: "auto" }}
          onClick={() => setModalOpen(true)}
        >
          Cargar Gastos
        </Button>
      </Row>
    </div>
  );
}
