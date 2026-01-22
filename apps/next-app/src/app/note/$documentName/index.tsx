import { authMiddleware } from "@/app/middleware/auth";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const searchSchema = z.object({
  new: z.boolean().optional(),
});
export const Route = createFileRoute("/note/$documentName/")({
  component: RouteComponent,
  validateSearch: searchSchema,
  server: {
    middleware: [authMiddleware],
  },
});

function RouteComponent() {
  const { documentName } = Route.useParams();
  return <div>Hello {documentName}</div>;
}
