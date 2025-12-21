"use server"

import { db } from "@/database/drizzle";
import { documentTable } from "@note/db";

type CreateDocumentResult =
    | { success: true; documentId: string }
    | { success: false; error: string };

export default async function createDocument(
    id: string,
    ownerId: string
): Promise<CreateDocumentResult> {
    try {
        if (!id || !ownerId) {
            return { success: false, error: "Missing required fields" };
        }
        await db.insert(documentTable).values({
            id: id,
            ownerId: ownerId,
        });
        return { success: true, documentId: id };
    } catch (error) {
        console.error("Failed to create document:", error);
        return { success: false, error: "Failed to create document" };
    }
}