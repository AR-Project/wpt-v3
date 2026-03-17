import { relations } from "drizzle-orm";
import { index, sqliteTable } from "drizzle-orm/sqlite-core";

import { user } from "./auth.schema";
import { product } from "./product.schema";
import { purchasePlan } from "./purchasePlan.schema";

export type PurchasePlanItemDbInsert = typeof purchasePlanItem.$inferInsert;

export const purchasePlanItem = sqliteTable(
	"purchase_plan_item",
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
		purchasePlanId: t
			.text("estimate_order_id")
			.notNull()
			.references(() => purchasePlan.id, {
				onDelete: "cascade",
			}),

		// From User
		productId: t
			.text("product_id")
			.notNull()
			.references(() => product.id),

		// This is total cost. Value for cost Per Unit / per item calculated on runtime
		costPrice: t.integer("cost_price").notNull(),

		// Respect product.displayDivider
		quantity: t.integer("quantity").notNull(),
		sortOrder: t.integer("sort_order"),
		createdAt: t
			.integer("created_at", { mode: "timestamp_ms" })
			.$defaultFn(() => new Date())
			.notNull(),
		modifiedAt: t
			.integer("modified_at", { mode: "timestamp_ms" })
			.$onUpdateFn(() => new Date())
			.notNull(),
	}),
	(table) => [
		index("purchase_plan_item_owner_idx").on(table.userIdParent),
		index("purchase_plan_item_creator_idx").on(table.userIdCreator),
	],
);

export const purchasePlanItemRelations = relations(
	purchasePlanItem,
	({ one }) => ({
		userParent: one(user, {
			fields: [purchasePlanItem.userIdParent],
			references: [user.id],
			relationName: "parent",
		}),
		userCreator: one(user, {
			fields: [purchasePlanItem.userIdCreator],
			references: [user.id],
			relationName: "creator",
		}),
		purchasePlan: one(purchasePlan, {
			fields: [purchasePlanItem.purchasePlanId],
			references: [purchasePlan.id],
		}),
		product: one(product, {
			fields: [purchasePlanItem.productId],
			references: [product.id],
		}),
	}),
);
