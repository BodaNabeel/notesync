import { db } from "@/database/drizzle";
import { getSession } from "@/utils/session.server";
import { desc, documentTable, eq } from "@note/db";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

const getLatestDocument = createServerFn()
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const [document] = await db
      .select({ documentName: documentTable.id })
      .from(documentTable)
      .where(eq(documentTable.ownerId, data.userId))
      .limit(1)
      .orderBy(desc(documentTable.createdAt), desc(documentTable.id));

    return document;
  });

const searchSchema = z.object({
  new: z.boolean().optional(),
});
export const Route = createFileRoute("/note/")({
  validateSearch: searchSchema,

  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({
        to: "/auth",
      });
    }

    const document = await getLatestDocument({
      data: { userId: session.user.id },
    });

    if (document) {
      throw redirect({
        to: "/note/$documentName",
        params: {
          documentName: document.documentName,
        },
      });
    }
  },
});
