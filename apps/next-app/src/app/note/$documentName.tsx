import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/note/$documentName")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello /note/$documentName!</div>;
}
