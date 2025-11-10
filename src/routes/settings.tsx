import { createFileRoute } from "@tanstack/react-router";
import { SettingIngreso } from "../components/settings/SettingIngreso";
import { Col, Row, Space } from "antd";
import { SettingGroups } from "../components/settings/SettingGroups";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Row gutter={8}>
        <Col span={24}>
          <SettingIngreso />
        </Col>
      </Row>

      <Row gutter={8}>
        <Col span={24}>
          <SettingGroups />
        </Col>
      </Row>
    </Space>
  );
}
