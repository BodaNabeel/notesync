import { db } from "@/database/drizzle";
import { account, jwks, session, user, verification } from "@note/db";
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins"
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
    telemetry: { enabled: false },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: { user, session, account, verification, jwks }

    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }
    },
    plugins: [
        jwt(),
        tanstackStartCookies()
    ]
});