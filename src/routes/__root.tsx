import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Navbar from "../components/Navbar";
import { Layout, Menu, type MenuProps } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";

const items1: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
}));

export const Route = createRootRoute({
  component: () => (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={items1}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Layout>
        <Navbar />
        <Layout>
          <Content style={{ margin: "0 16px" }}>
            <Outlet />
            <TanStackRouterDevtools />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            M-1 ©{new Date().getFullYear()} Created by helios
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  ),
});
