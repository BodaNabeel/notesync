import { createFileRoute } from "@tanstack/react-router";
import { authMiddleware } from "../middleware/auth";

export const Route = createFileRoute("/note/$documentName")({
  component: RouteComponent,
  server: {
    middleware: [authMiddleware],
  },
});

function RouteComponent() {
  return <div>Hello /note/$documentName!</div>;
}
