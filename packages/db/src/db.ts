import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema.js";


export function createDb(connectionString: string) {
    if (!connectionString) {
        throw new Error("Database connection string is required");
    }

    const sql = neon(connectionString);

    return drizzle(sql, { schema });
}
