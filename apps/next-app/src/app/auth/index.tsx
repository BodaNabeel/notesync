import SignUp from "@/components/SignUp";
import { getSession } from "@/utils/session.server";
import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";

const searchSchema = z.object({
  documentName: z.string().optional(),
});
export const Route = createFileRoute("/auth/")({
  component: Page,
  validateSearch: searchSchema,
  beforeLoad: async () => {
    const session = await getSession();
    if (session) {
      throw redirect({ to: "/note" });
    }
  },
});

function Page() {
  const { documentName } = Route.useSearch();
  return <SignUp documentName={documentName} />;
}
