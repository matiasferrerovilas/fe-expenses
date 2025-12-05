import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Layout, Grid } from "antd"; // 👈 Importar Grid
import { Content, Footer } from "antd/es/layout/layout";
import NavHeader from "../components/NavHeader";
import type { QueryClient } from "@tanstack/react-query";
import { memo } from "react";
import { QueryLoadingBoundary } from "../components/QueryLoadingBoundary";
import type { AuthContextState } from "../apis/auth/AuthContext";
import { ColorEnum } from "../enums/ColorEnum";
import type Keycloak from "keycloak-js";
const { useBreakpoint } = Grid;

export interface RootRouteContext {
  queryClient: QueryClient;
  auth: AuthContextState & {
    keycloak: Keycloak;
  };
  skipAuth: boolean;
}
const MemoizedNavHeader = memo(NavHeader);

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
      <Layout>
        <Content>
          <QueryLoadingBoundary>
            <ContentWrapper />
          </QueryLoadingBoundary>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            backgroundColor: ColorEnum.FONDO_GENERAL,
          }}
        >
          M-1 ©{new Date().getFullYear()} Created by Mati FV
        </Footer>
      </Layout>
    </Layout>
  ),
});
