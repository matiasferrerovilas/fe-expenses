import { createFileRoute } from "@tanstack/react-router";
import ResumenGasto from "../components/balance/ResumenGasto";

export const Route = createFileRoute("/balance")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ResumenGasto />;
}
