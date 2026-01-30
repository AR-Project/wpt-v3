/** biome-ignore-all assist/source/organizeImports: <meh> */
import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, type AnySQLiteColumn } from "drizzle-orm/sqlite-core";

export const userInfo = sqliteTable(
  "user_info",
  {
    id: text("id").primaryKey().unique().notNull(),
    role: text("role").notNull().default("admin"),
    parentId: text("parent_id")
      .references((): AnySQLiteColumn => userInfo.id, { onDelete: "cascade", })
      .notNull(),
    email: text("email").notNull(),
    allowLogin: integer("allow_login", { mode: "boolean" }).notNull().default(true),
    isDeleted: integer("is_deleted", { mode: "boolean" }).notNull().default(false),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().default(sql`(CURRENT_TIME)`),
    modifiedAt: integer("modified_at", { mode: "timestamp_ms" }),
    deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
  },
  (table) => [
    index("user_id_idx").on(table.id),
    index("user_email_idx").on(table.email),
  ]
);

export type UserInfo = typeof userInfo.$inferSelect
