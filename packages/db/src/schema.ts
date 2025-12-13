import { customType, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";


export const bytea = customType<{
    data: Uint8Array;
    driverData: Buffer;
}>({
    dataType() {
        return "bytea";
    },

    toDriver: (value) => {
        return Buffer.from(value);
    },

    fromDriver: (value) => {
        return new Uint8Array(value);
    },
});

export const documentTable = pgTable("document_table", {
    id: uuid("id").primaryKey().notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    lastModified: timestamp("lastModified").notNull().defaultNow(),
    title: text("title").notNull().default("Untitled Doc"),
    document: bytea("document").notNull(),
    documentAccessType: text("document_access_type")
        .$type<"private" | "public">()
        .notNull()
        .default("private"),
});

export type InswertDocument = typeof documentTable.$inferInsert;
export type SelectDocument = typeof documentTable.$inferSelect;
