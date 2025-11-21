import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import SideBar from "../components/common/SideBar";
import { Layout, Grid } from "antd"; // 👈 Importar Grid
import { Content, Footer } from "antd/es/layout/layout";
import NavHeader from "../components/NavHeader";
import type { QueryClient } from "@tanstack/react-query";
import { memo } from "react";
import { QueryLoadingBoundary } from "../components/QueryLoadingBoundary";

const { useBreakpoint } = Grid; // 👈 Definir useBreakpoint

interface RootRouteContext {
  queryClient: QueryClient;
}
const MemoizedNavHeader = memo(NavHeader);
const MemoizedSideBar = memo(SideBar);

const ContentWrapper: React.FC = () => {
  const screens = useBreakpoint();

  const paddingHorizontal = screens.lg ? 100 : screens.md ? 40 : 16;

  return (
    <div
      style={{
        paddingInline: paddingHorizontal,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <Outlet />
    </div>
  );
};

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: () => (
    <Layout style={{ minHeight: "100vh" }}>
      <MemoizedNavHeader />
      <MemoizedSideBar />
      <Layout>
        <Content style={{ margin: "0 16px" }}>
          <QueryLoadingBoundary>
            <ContentWrapper />
          </QueryLoadingBoundary>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          M-1 ©{new Date().getFullYear()} Created by Mati FV
        </Footer>
      </Layout>
    </Layout>
  ),
});
