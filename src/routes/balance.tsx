import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/balance")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/balance"!</div>;
}
