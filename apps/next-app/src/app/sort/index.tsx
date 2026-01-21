import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sort/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <button onClick={() => console.log("NOT FOUND")}>NOT FOUND</button>;
}
