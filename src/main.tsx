import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryLoadingBoundary } from "./components/QueryLoadingBoundary.tsx";

const queryClient = new QueryClient();

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <QueryLoadingBoundary>
        <RouterProvider router={router} />
      </QueryLoadingBoundary>
    </QueryClientProvider>
  </StrictMode>
);
