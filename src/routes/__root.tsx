import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex h-screen">
        <div className="flex flex-col flex-1">
          <main className="flex-1 p-4 bg-white-100">
            <Outlet />
            <TanStackRouterDevtools />
          </main>
        </div>
      </div>
    </>
  ),
});
