import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosInterceptorProvider } from "./apis/AxiosInterceptorProvider";
import "./App.css";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ConfigProvider } from "antd";
import { WebSocketProvider } from "./apis/websocket/WebSocketProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
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
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
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
            <RouterProvider router={router} />
          </WebSocketProvider>
        </QueryClientProvider>
      </AxiosInterceptorProvider>
    </ConfigProvider>
  );
}

export default App;
