import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import SideBar from "../components/common/SideBar";
import { Layout } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import NavHeader from "../components/NavHeader";
import type { QueryClient } from "@tanstack/react-query";
import { memo } from "react";

interface RootRouteContext {
  queryClient: QueryClient;
}
const MemoizedNavHeader = memo(NavHeader);
const MemoizedSideBar = memo(SideBar);

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: () => (
    <Layout style={{ minHeight: "100vh" }}>
      <MemoizedNavHeader />
      <MemoizedSideBar />

      <Layout>
        <Content style={{ margin: "0 16px" }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          M-1 ©{new Date().getFullYear()} Created by Mati FV
        </Footer>
      </Layout>
    </Layout>
  ),
});
