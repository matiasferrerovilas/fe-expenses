import { createFileRoute } from "@tanstack/react-router";
import { SettingIngreso } from "../components/settings/SettingIngreso";
import { Col, Row, Space } from "antd";
import { SettingGroups } from "../components/settings/SettingGroups";
import { SettingInviteGroups } from "../components/settings/SettingInviteGroups";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Row gutter={8}>
        <Col xs={24} sm={12} lg={8}>
          <SettingIngreso />
        </Col>
      </Row>
      <Row gutter={8}>
        <Col xs={24} sm={12} lg={8}>
          <SettingInviteGroups />
        </Col>
      </Row>
      <Row gutter={8}>
        <Col xs={24} sm={12} lg={8}>
          <SettingGroups />
        </Col>
      </Row>
    </Space>
  );
}
