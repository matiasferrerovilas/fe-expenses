import { Col, Row, theme } from "antd";
import { Header } from "antd/es/layout/layout";
import module from "../../package.json";

export default function NavHeader() {
  const { token: themeToken } = theme.useToken();
  const menuTheme = {
    components: {
      Menu: {
        darkItemBg: themeToken.colorBgContainer,
      },
    },
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "center",
        position: "sticky",
        top: "0",
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
          height: "54px",
          lineHeight: "40px",
          width: "100%",
        }}
      >
        <Row gutter={16} align="middle" justify="space-between">
          <Col className="sm-hidden">
            <span
              style={{
                color: themeToken.colorText,
                fontWeight: "600",
                fontSize: "24px",
                lineHeight: "40px",
              }}
            >
              Expenses
              <sup>
                <small>
                  <code> v{module.version}</code>
                </small>
              </sup>
            </span>
          </Col>
          <Col>
            {" "}
            <span
              style={{
                color: themeToken.colorTextSecondary,
                fontWeight: "500",
              }}
            >
              Mati
            </span>
          </Col>
        </Row>
      </Header>
    </nav>
  );
}
