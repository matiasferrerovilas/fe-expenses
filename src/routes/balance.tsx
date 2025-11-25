import { createFileRoute } from "@tanstack/react-router";
import ResumenMensual from "../components/balance/ResumenMensual";
import BalanceGrafico from "../components/balance/BalanceGrafico";
import { protectedRouteGuard } from "../apis/auth/protectedRouteGuard";

export const Route = createFileRoute("/balance")({
  beforeLoad: protectedRouteGuard,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div style={{ paddingTop: 30 }}>
      <ResumenMensual />

      <BalanceGrafico />
    </div>
  );
}
