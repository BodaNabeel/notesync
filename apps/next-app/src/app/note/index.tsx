import { createFileRoute } from "@tanstack/react-router";
import { authMiddleware } from "../middleware/auth";

export const Route = createFileRoute("/note/")({
  component: RouteComponent,
  server: {
    middleware: [authMiddleware],
  },
});

function RouteComponent() {
  return <div>Hello note</div>;
}
