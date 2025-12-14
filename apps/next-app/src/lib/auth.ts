import { db } from "@/database/drizzle";
import { account, session, user, verification } from "@note/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
    telemetry: { enabled: false },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: { user, session, account, verification }

    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }
    }
});