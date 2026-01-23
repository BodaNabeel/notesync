import { createServerFn } from "@tanstack/react-start";
import { zodValidator } from '@tanstack/zod-adapter'
import { DocumentLinkGenerationSchema, DocumentLinkRevocationSchema } from "./schema";
import { getSession } from "../session.server";
import { documentTable, eq } from "@note/db";
import { db } from "@/database/drizzle";



export const documentLinkGeneration = createServerFn({ method: "POST" })
    .inputValidator(zodValidator(DocumentLinkGenerationSchema))
    .handler(async ({ data }) => {
        const session = await getSession()
        if (!session) {
            throw new Error("Unauthenticated")
        }
        try {
            const { documentName, documentEditMode } = data
            await db
                .update(documentTable)
                .set({ documentEditMode: documentEditMode, documentAccessType: "public" })
                .where(eq(documentTable.id, documentName))
            return { success: true }
        } catch {
            return {
                success: false,
                error: "DOCUMENT_LINK_GENERATION_FAILED",
            };
        }
    });

export const documentLinkRevocation = createServerFn({ method: "POST" })
    .inputValidator(zodValidator(DocumentLinkRevocationSchema))
    .handler(async ({ data }) => {
        const { documentName } = data
        const session = await getSession()
        if (!session) {
            throw new Error("Unauthenticated")
        }
        try {
            await db.update(documentTable).set({ documentEditMode: null, documentAccessType: "private" }).where(eq(documentTable.id, documentName))
            return { success: true }
        } catch {
            return { success: false, error: "DOCUMENT_LINK_REVOCATION_FAILED" }
        }
    });