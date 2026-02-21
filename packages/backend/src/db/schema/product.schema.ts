import { index, sqliteTable } from "drizzle-orm/sqlite-core";
import { user } from "./auth.schema";
import { category } from "./category.schema";
import { relations } from "drizzle-orm";

export type ProductDbInsert = typeof product.$inferInsert;

export const product = sqliteTable(
	"product",
	(t) => ({
		id: t.text("id").primaryKey(),
		userIdParent: t
			.text("user_id_parent")
			.notNull()
			.references(() => user.id, {
				onDelete: "cascade",
			}),
		userIdCreator: t
			.text("user_id_creator")
			.notNull()
			.references(() => user.id, {
				onDelete: "cascade",
			}),
		name: t.text("name").notNull(),
		categoryId: t
			.text("category_id")
			.notNull()
			.references(() => category.id, {
				onDelete: "set null",
			}),
		sortOrder: t.integer("sort_order"),
		// Display unit act as divider for qty.
		// 1 means 1 qty / 1 = 1 display_qty.
		// 100 means 100 qty / 100 = 1 display_qty
		displayQtyDivider: t.integer("display_qty_divider").default(1),
		createdAt: t
			.integer("created_at", { mode: "timestamp_ms" })
			.$defaultFn(() => new Date())
			.notNull(),
		modifiedAt: t
			.integer("last_modified_at", { mode: "timestamp_ms" })
			.$onUpdateFn(() => new Date())
			.notNull(),
	}),
	(table) => [
		index("product_name").on(table.name),
		index("product_owner_idx").on(table.userIdParent),
		index("product_creator_idx").on(table.userIdCreator),
	],
);

export const productRelations = relations(product, ({ one }) => ({
	userParent: one(user, {
		fields: [product.userIdParent],
		references: [user.id],
		relationName: "parent",
	}),
	userCreator: one(user, {
		fields: [product.userIdCreator],
		references: [user.id],
		relationName: "creator",
	}),
	category: one(category, {
		fields: [product.categoryId],
		references: [category.id],
	}),
}));
