import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Navbar from "../components/Navbar";
import { Layout } from "antd";
import { Content, Footer } from "antd/es/layout/layout";

export const Route = createRootRoute({
  component: () => (
    <Layout style={{ minHeight: "100vh" }}>
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
  ),
});
