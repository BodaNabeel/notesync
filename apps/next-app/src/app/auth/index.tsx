import SignUp from "@/components/SignUp";
import { auth } from "@/lib/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import z from "zod";

const getSession = createServerFn().handler(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });
  return session;
});
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
