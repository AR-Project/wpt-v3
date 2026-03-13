// purchase_items:	id, po_id, prod_id, cost_price, qty

import { index, sqliteTable } from "drizzle-orm/sqlite-core";
import { user } from "./auth.schema";
import { relations } from "drizzle-orm";
import { purchaseOrder } from "./purchaseOrder.schema";
import { vendor } from "./vendor.schema";
import { product } from "./product.schema";

export type PurchaseItemDbInsert = typeof purchaseItem.$inferInsert;

export const purchaseItem = sqliteTable(
	"purchase_item",
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
		purchaseOrderId: t
			.text("purchase_order_id")
			.notNull()
			.references(() => purchaseOrder.id, {
				onDelete: "cascade",
			}),

		// TO DELETE: duplicate information - Purchase Order already have vendor ID
		vendorId: t
			.text("vendor_id")
			.notNull()
			.references(() => vendor.id),

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
		index("purchase_item_owner_idx").on(table.userIdParent),
		index("purchase_item_creator_idx").on(table.userIdCreator),
	],
);

export const purchaseItemRelations = relations(purchaseItem, ({ one }) => ({
	userParent: one(user, {
		fields: [purchaseItem.userIdParent],
		references: [user.id],
		relationName: "parent",
	}),
	userCreator: one(user, {
		fields: [purchaseItem.userIdCreator],
		references: [user.id],
		relationName: "creator",
	}),
	vendor: one(vendor, {
		fields: [purchaseItem.vendorId],
		references: [vendor.id],
	}),
	purchaseOrder: one(purchaseOrder, {
		fields: [purchaseItem.purchaseOrderId],
		references: [purchaseOrder.id],
	}),
	product: one(product, {
		fields: [purchaseItem.productId],
		references: [product.id],
	}),
}));
