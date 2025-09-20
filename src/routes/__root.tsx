import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import SideBar from "../components/SideBar";
import { Layout } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import NavHeader from "../components/NavHeader";

export const Route = createRootRoute({
  component: () => (
    <Layout style={{ minHeight: "100vh" }}>
      <NavHeader />
      <Layout>
        <SideBar />
        <Layout>
          <Content style={{ margin: "0 16px" }}>
            <Outlet />
            <TanStackRouterDevtools />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            M-1 ©{new Date().getFullYear()} Created by Mati FV
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  ),
});
