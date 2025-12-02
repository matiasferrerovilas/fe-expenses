import { createFileRoute } from "@tanstack/react-router";
import { SettingIngreso } from "../components/settings/SettingIngreso";
import { Col, Row } from "antd";
import { SettingGroups } from "../components/settings/SettingGroups";
import { SettingInviteGroups } from "../components/settings/SettingInviteGroups";
import { protectedRouteGuard } from "../apis/auth/protectedRouteGuard";

export const Route = createFileRoute("/settings")({
  beforeLoad: protectedRouteGuard,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Col style={{ paddingTop: 30 }}>
      <Row gutter={[16, 16]} justify="center" style={{ paddingBottom: 10 }}>
        <Col xs={24} md={20} lg={16}>
          <SettingIngreso />
        </Col>
      </Row>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} md={20} lg={16}>
          <SettingInviteGroups />
        </Col>
      </Row>
      <Row gutter={24} justify="center">
        <Col xs={24} md={20} lg={16}>
          <SettingGroups />
        </Col>
      </Row>
    </Col>
  );
}
