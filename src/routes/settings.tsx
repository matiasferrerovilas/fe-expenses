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
    <div>
      <Row gutter={24} justify="center">
        <Col xs={24} md={20} lg={16}>
          <SettingIngreso />
        </Col>
      </Row>
      <Row gutter={24} justify="center">
        <Col xs={24} md={20} lg={16}>
          <SettingInviteGroups />
        </Col>
      </Row>
      <Row gutter={24} justify="center">
        <Col xs={24} md={20} lg={16}>
          <SettingGroups />
        </Col>
      </Row>
    </div>
  );
}
