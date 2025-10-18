import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosInterceptorProvider } from "./apis/AxiosInterceptorProvider";
import "./App.css";
import { QueryLoadingBoundary } from "./components/QueryLoadingBoundary";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ConfigProvider } from "antd";
import { WebSocketProvider } from "./apis/websocket/WebSocketProvider";

const queryClient = new QueryClient();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
});

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Inter",
          borderRadius: 10,
        },
      }}
    >
      <AxiosInterceptorProvider>
        <QueryClientProvider client={queryClient}>
          <WebSocketProvider>
            <QueryLoadingBoundary>
              <RouterProvider router={router} />
            </QueryLoadingBoundary>
          </WebSocketProvider>
        </QueryClientProvider>
      </AxiosInterceptorProvider>
    </ConfigProvider>
  );
}

export default App;
