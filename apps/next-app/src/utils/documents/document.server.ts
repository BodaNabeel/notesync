
import { db } from "@/database/drizzle";
import { auth } from "@/lib/auth";
import { count, desc, documentTable, eq } from "@note/db";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
export const getDocuments = createServerFn()
    .inputValidator((data: { page?: number; limit?: number }) => data)
    .handler(async ({ data }) => {
        try {
            const headers = getRequestHeaders();
            const session = await auth.api.getSession({ headers });
            if (!session) {
                throw new Error("Unauthenticated");
            }
            const page = data.page || 1;
            const limit = data.limit || 10;
            const offset = (page - 1) * limit;

            const documents = await db
                .select({
                    title: documentTable.title,
                    documentId: documentTable.id,
                })
                .from(documentTable)
                .where(eq(documentTable.ownerId, session.user.id))
                .orderBy(desc(documentTable.createdAt), desc(documentTable.id))
                .limit(limit)
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
        } catch {
            throw new Error("Failed to fetch document list");
        }
    });

export const deleteDocument = createServerFn()
    .inputValidator((data: { documentId: string }) => data)
    .handler(async ({ data }) => {
        try {
            const headers = getRequestHeaders();
            const session = await auth.api.getSession({ headers });

            if (!session) {
                throw new Error("Unauthenticated");
            }

            await db
                .delete(documentTable)
                .where(eq(documentTable.id, data.documentId));

            return { success: true };
        } catch {
            throw new Error("Failed to delete document");
        }
    });

