import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth.schema";

export type CreateCategoryDbPayload = typeof category.$inferInsert;

export const category = sqliteTable(
  "category",
  {
    id: text("id").primaryKey().unique().notNull(),
    userIdOwner: text("user_id_owner")
      .references(() => user.id, { onDelete: "cascade", })
      .notNull(),
    userIdCreator: text("user_id_creator")
      .references(() => user.id, { onDelete: "cascade", })
      .notNull(),
    name: text("name").notNull(),
    sortOrder: integer("sort_order"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(CURRENT_TIME)`)
      .notNull(),
    modifiedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("category_name_idx").on(table.name),
    index("category_user_id_owner_idx").on(table.userIdOwner),
    index("category_user_id_creator_idx").on(table.userIdCreator),
  ]
);

export const categoryRelations = relations(category, ({ one, many }) => ({
  owner: one(user, {
    fields: [category.userIdOwner],
    references: [user.id],
    relationName: "owner",
  }),
  creator: one(user, {
    fields: [category.userIdCreator],
    references: [user.id],
    relationName: "creator",
  }),
  usersDefault: many(user),
}));
