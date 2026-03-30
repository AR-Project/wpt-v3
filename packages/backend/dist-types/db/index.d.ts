import { Database } from "bun:sqlite";
import * as schema from "@db/schema";
export declare const db: import("drizzle-orm/bun-sqlite").BunSQLiteDatabase<typeof schema> & {
    $client: Database;
};
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
//# sourceMappingURL=index.d.ts.map