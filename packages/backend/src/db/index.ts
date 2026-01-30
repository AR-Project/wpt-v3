import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

import * as authSchema from "@db/schema/auth.schema";
import * as categorySchema from "@db/schema/category.schema"


const sqlite = new Database(Bun.env.DB_FILE_NAME!);
export const db = drizzle(sqlite, {
  schema: { ...authSchema, ...categorySchema },
});


export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];