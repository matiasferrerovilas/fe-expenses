import { createFileRoute } from "@tanstack/react-router";
import ResumenMensual from "../components/balance/ResumenMensual";
import BalanceGrafico from "../components/balance/BalanceGrafico";

export const Route = createFileRoute("/balance")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <ResumenMensual />

      <BalanceGrafico />
    </>
  );
}
