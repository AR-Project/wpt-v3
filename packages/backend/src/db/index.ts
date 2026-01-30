import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

import * as authSchema from "@db/schema/auth.schema";


const sqlite = new Database(Bun.env.DB_FILE_NAME!);
export const db = drizzle(sqlite, {
  schema: { ...authSchema },
});