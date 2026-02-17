import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import * as authSchema from "@db/schema/auth.schema";
import * as categorySchema from "@db/schema/category.schema";
import * as itemSchema from "@db/schema/item.schema";
import * as vendorSchema from "@db/schema/vendor.schema";

const dbFileName = Bun.env.DB_FILE_NAME;
if (!dbFileName) throw new Error("DB_FILE_NAME is required");

// .../packages/backend/src/db - current file path
const thisDir = dirname(fileURLToPath(import.meta.url));

// .../packages/backend - go to be root
const backendRoot = resolve(thisDir, "../..");

const dbPath = isAbsolute(dbFileName)
	? dbFileName
	: resolve(backendRoot, dbFileName);

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, {
	schema: {
		...authSchema,
		...categorySchema,
		...itemSchema,
		...vendorSchema,
	},
});

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
