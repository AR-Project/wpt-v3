import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

import * as authSchema from "@db/schema/auth.schema";
import * as userProfileSchema from "@db/schema/userProfile.schema";

const sqlite = new Database(Bun.env.DB_FILE_NAME!);
export const db = drizzle(sqlite, {
  schema: { ...userProfileSchema, ...authSchema },
});