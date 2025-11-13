import { MailOutlined } from "@ant-design/icons";
import { Badge, Card, Space, Typography } from "antd";
import { useInvitations } from "../../apis/hooks/useGroups";
import type { Invitations } from "../../models/UserGroup";
import SettingInviteGroupCard from "./SettingInviteGroupCard";
const { Text } = Typography;

export function SettingInviteGroups() {
  const { data: invitations, isFetching } = useInvitations();

  if (!invitations || invitations.length === 0) {
    return null;
  }

  return (
    <Card
      loading={isFetching}
      title={
        <Space align="center">
          <MailOutlined style={{ color: "#1677ff", fontSize: 18 }} />
          <Text strong>Invitaciones Pendientes</Text>
          <Badge
            count={invitations?.length}
            style={{
              backgroundColor: "#1677ff",
              fontWeight: "bold",
            }}
          />
        </Space>
      }
      style={{
        backgroundColor: "#f5f9ff",
        borderRadius: 12,
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
      styles={{
        header: {
          borderBottom: "none",
          padding: "12px 16px",
        },
        body: {
          display: "flex",
          justifyContent: "space-between",
          padding: "12px 16px",
          cursor: "default",
          transition: "all 0.2s ease",
        },
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {invitations?.map((invite: Invitations) => (
          <SettingInviteGroupCard key={invite.id} invite={invite} />
        ))}
      </Space>
    </Card>
  );
}
