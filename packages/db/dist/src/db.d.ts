import * as schema from "./schema.js";
export declare function createDb(connectionString: string): import("drizzle-orm/neon-http").NeonHttpDatabase<typeof schema> & {
    $client: import("@neondatabase/serverless").NeonQueryFunction<false, false>;
};
