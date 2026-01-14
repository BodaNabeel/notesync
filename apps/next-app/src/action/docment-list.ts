"use server";

import { db } from "@/database/drizzle";
import { auth } from "@/lib/auth";
import { and, desc, documentTable, eq, lt } from "@note/db";
import { headers } from "next/headers";

export async function fetchDocuments(cursor: string | null) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            throw new Error("Unauthenticated");
        }
        // const offset = (page - 1) * limit;
        const documents = await db
            .select({
                title: documentTable.title,
                documentId: documentTable.id,
                createdAt: documentTable.createdAt,
            })
            .from(documentTable)
            .where(
                and(
                    eq(documentTable.ownerId, session.user.id),
                    cursor
                        ? lt(documentTable.createdAt, new Date(cursor))
                        : undefined
                )
            )
            .orderBy(desc(documentTable.createdAt))
            .limit(30);
        return {

            documents,
            nextCursor:
                documents.length > 0
                    ? documents[documents.length - 1].createdAt.toISOString()
                    : null,
        };
    } catch (_error) {
        throw new Error("Failed to fetch document list");
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