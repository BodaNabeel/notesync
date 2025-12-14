import { createDb } from "@note/db";
import { config } from "dotenv";


config({ path: ".env" })
export const db = createDb(process.env.DATABASE_URL!);
