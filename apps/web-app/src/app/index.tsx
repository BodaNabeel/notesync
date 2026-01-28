import Landing from "@/components/landing/Landing";
import { getSession } from "@/utils/session.server";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Landing,
  beforeLoad: async () => {
    const session = await getSession();
    if (session) {
      throw redirect({
        to: "/note",
      });
    }
  },
});
