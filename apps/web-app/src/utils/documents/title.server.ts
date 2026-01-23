import { db } from "@/database/drizzle";
import { documentTable, eq } from "@note/db";
import { createServerFn } from "@tanstack/react-start";
import { zodValidator } from "@tanstack/zod-adapter";
import { getSession } from "../session.server";
import { DocumentTitleSchema } from "./schema";

export const getDocumentTitle = createServerFn().inputValidator(zodValidator(DocumentTitleSchema)).handler(async ({ data }) => {
    const { documentName } = data
    const session = await getSession()
    if (!session) {
        throw new Error("Unauthenticated");
    }
    try {
        const [result] = await db
            .select({ title: documentTable.title })
            .from(documentTable)
            .where(eq(documentTable.id, documentName))
            .limit(1);
        return result?.title

    } catch {
        throw new Error("Failed to fetch document title")
    }
})  