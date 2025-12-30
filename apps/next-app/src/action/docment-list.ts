"use server";

import { db } from "@/database/drizzle";
import { auth } from "@/lib/auth";
import { desc, documentTable, count, eq } from "@note/db";
import { headers } from "next/headers";

export async function getDocuments(page = 1, limit = 10) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            throw new Error("Unauthenticated");
        }
        console.log(session)
        const offset = (page - 1) * limit;

        const documents = await db
            .select({
                title: documentTable.title,
                documentId: documentTable.id,
            })
            .from(documentTable)
            .where(eq(documentTable.ownerId, session.user.id))
            .orderBy(desc(documentTable.createdAt))
            .limit(limit)
            .offset(offset);

        const [{ total }] = await db
            .select({ total: count() })
            .from(documentTable)
            .where(eq(documentTable.ownerId, session.user.id));
        console.log(total)
        return {
            documents,
            total,
            nextCursor: offset + limit < total ? page + 1 : null,
        };
    } catch (error) {
        console.error("getDocuments failed:", error);
        throw new Error("Failed to fetch document list");
    }
}
