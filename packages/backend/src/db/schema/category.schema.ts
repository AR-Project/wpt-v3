import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth.schema";
import { product } from "./product.schema";

export type CreateCategoryDbPayload = typeof category.$inferInsert;

export const category = sqliteTable(
	"category",
	{
		id: text("id").primaryKey(),
		userIdParent: text("user_id_parent")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		userIdCreator: text("user_id_creator")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		name: text("name").notNull(),
		sortOrder: integer("sort_order"),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.$defaultFn(() => new Date())
			.notNull(),
		modifiedAt: integer("updated_at", { mode: "timestamp_ms" })
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("category_name_idx").on(table.name),
		index("category_user_id_parent_idx").on(table.userIdParent),
		index("category_user_id_creator_idx").on(table.userIdCreator),
	],
);

export const categoryRelations = relations(category, ({ one, many }) => ({
	userParent: one(user, {
		fields: [category.userIdParent],
		references: [user.id],
		relationName: "parent",
	}),
	userCreator: one(user, {
		fields: [category.userIdCreator],
		references: [user.id],
		relationName: "creator",
	}),
	items: many(product),
	usersDefault: many(user),
}));
