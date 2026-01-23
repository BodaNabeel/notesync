import { getSession } from "@/utils/session.server";
import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";

export const authMiddleware = createMiddleware().server(
  async ({ next, pathname }) => {
    const session = await getSession()

    if (!session) {
      const match = pathname.match(/^\/note\/(.+)$/);

      if (match) {
        const documentId = match[1];
        console.log(documentId)
        throw redirect({
          to: `/auth`,
          search: { documentName: documentId }
        });
      }

      throw redirect({ to: `/auth` });
    }

    return await next();
  }
);