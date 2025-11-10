import { TeamOutlined } from "@ant-design/icons";
import { Card, Space, Tag, Typography } from "antd";
import type { GroupWithUsersrs } from "../../models/UserGroup";
const { Text } = Typography;

interface SettingGroupCardProps {
  group: GroupWithUsersrs;
}
export default function SettingGroupCard({ group }: SettingGroupCardProps) {
  return (
    <Card
      key={group.id}
      styles={{
        body: {
          display: "flex",
          justifyContent: "space-between",
          padding: "12px 16px",
        },
      }}
      style={{
        borderRadius: 12,
        background: "#e8ebf0",
        padding: "12px 16px",
      }}
    >
      <Space>
        <div
          style={{
            background: "#0D59A4",
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TeamOutlined style={{ color: "#fff", fontSize: 18 }} />
        </div>
        <div>
          <Space>
            <Text strong>{group.description}</Text>
            {group.description == "DEFAULT" && (
              <Tag color="default" style={{ fontSize: 11 }}>
                Por defecto
              </Tag>
            )}
          </Space>
          <br />
          <Text type="secondary" style={{ fontSize: 13 }}>
            {group.memberCount} miembro{group.memberCount > 1 && "s"}
          </Text>
        </div>
      </Space>
    </Card>
  );
}
