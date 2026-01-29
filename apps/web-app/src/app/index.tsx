import Landing from "@/components/landing/Landing";
import { getSession } from "@/utils/session.server";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "NoteSync - Home" },
      {
        name: "description",
        content:
          "A collaborative platform to write down notes, share with the world and broadcast updates in realtime.",
      },
    ],
  }),
  beforeLoad: async () => {
    const session = await getSession();
    if (session) {
      throw redirect({
        to: "/note",
      });
    }
  },
});
