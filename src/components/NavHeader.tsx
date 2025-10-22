import { Avatar, Col, Space, theme, Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import { UserOutlined, WalletOutlined } from "@ant-design/icons";
import { useKeycloak } from "@react-keycloak/web";
const { Title, Text } = Typography;

export default function NavHeader() {
  const { token: themeToken } = theme.useToken();
  const { keycloak } = useKeycloak();

  const user = keycloak.tokenParsed;
  const username = user?.preferred_username;
  const email = user?.email;

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        width: "100%",
        zIndex: 100,
        backgroundColor: themeToken.colorBgContainer,
        boxShadow: themeToken.boxShadow,
      }}
    >
      <Header
        style={{
          backgroundColor: themeToken.colorBgContainer,
          paddingInline: themeToken.paddingContentHorizontalLG,
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Col>
          <Space align="center" size={8}>
            <WalletOutlined style={{ fontSize: 24, color: "#1677ff" }} />
            <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
              Mi Billetera
            </Title>
          </Space>
        </Col>

        <Col style={{ display: "flex", alignItems: "center" }}>
          {" "}
          <Space align="center" size={16}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Text strong>{username}</Text>
              <Text type="secondary" style={{ fontSize: 14 }}>
                {email}
              </Text>
            </div>
            <Avatar
              size={40}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1677ff", color: "#fff" }}
            />
          </Space>
        </Col>
      </Header>
    </nav>
  );
}
