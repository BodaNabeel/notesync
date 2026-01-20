"use server";

import { db } from "@/database/drizzle";
import { auth } from "@/lib/auth";
import { desc, documentTable, count, eq } from "@note/db";
import { headers } from "next/headers";
import * as z from "zod"

export async function getDocuments(page = 1, limit = 10) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            throw new Error("Unauthenticated");
        }
        const offset = (page - 1) * limit;

        const documents = await db
            .select({
                title: documentTable.title,
                documentId: documentTable.id,
            })
            .from(documentTable)
            .where(eq(documentTable.ownerId, session.user.id))
            .orderBy(
                desc(documentTable.createdAt),
                desc(documentTable.id)
            ).limit(limit)
            .offset(offset);

        const [{ total }] = await db
            .select({ total: count() })
            .from(documentTable)
            .where(eq(documentTable.ownerId, session.user.id));
        return {
            documents,
            total,
            nextCursor: offset + limit < total ? page + 1 : null,
        };
    } catch (_error) {
        throw new Error("Failed to fetch document list");
    }
}

export async function fetchDocumentTitle(documentId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            throw new Error("Unauthenticated");
        }
        const [result] = await db
            .select({ title: documentTable.title })
            .from(documentTable)
            .where(eq(documentTable.id, documentId))
            .limit(1);
        return result?.title

    } catch {
        throw new Error("Failed to fetch document title")
    }
}

export async function deleteDocument(documentId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            throw new Error("Unauthenticated");
        }
        await db.delete(documentTable).where(eq(documentTable.id, documentId))

    } catch {
        throw new Error("Failed to delete document")
    }
}

const DocumentEditModeSchema = z.enum(["editor", "viewer"]);
const DocumentLinkGenerationSchema = z.object({
    documentName: z.uuid(),
    documentEditMode: DocumentEditModeSchema,
});


export async function documentLinkGeneration(input: unknown) {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthenticated");
    }

    try {
        const { documentName, documentEditMode } =
            DocumentLinkGenerationSchema.parse(input);
        await db.update(documentTable).set({ documentEditMode: documentEditMode, documentAccessType: "public" }).where(eq(documentTable.id, documentName))
        return { success: true }
    } catch {
        return {
            success: false,
            error: "DOCUMENT_LINK_GENERATION_FAILED",
        };
    }
}

export async function documentLinkRevocation(documentId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthenticated");
    }
    try {
        await db.update(documentTable).set({ documentEditMode: null, documentAccessType: "private" }).where(eq(documentTable.id, documentId))
        return { success: true }
    } catch {
        return { success: false, error: "DOCUMENT_LINK_REVOCATION_FAILED" }
    }
}