import { Button, Card, Col, Row, Space, Tag, theme, Typography } from "antd";
import { useAllGroupsWithUsers } from "../../apis/hooks/useGroups";
import { PlusOutlined, TeamOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;

export function SettingGroups() {
  const { data: groups, isLoading } = useAllGroupsWithUsers();
  const { token } = theme.useToken();

  return (
    <Card loading={isLoading}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space align="baseline">
            <TeamOutlined style={{ fontSize: 20, color: "#0D59A4" }} />
            <Title level={5} style={{ margin: 0 }}>
              Gestionar Grupos
            </Title>
          </Space>
          <Typography.Paragraph
            style={{
              color: token.colorTextSecondary,
              marginBottom: 16,
            }}
          >
            Crea y administra grupos para organizar tus gastos.
          </Typography.Paragraph>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{
              border: "none",
              borderRadius: 8,
              fontWeight: 500,
            }}
          >
            Nuevo Grupo
          </Button>
        </Col>
      </Row>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {groups?.map((group) => (
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
              background: "#f9fbfd",
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
        ))}
      </Space>
    </Card>
  );
}
