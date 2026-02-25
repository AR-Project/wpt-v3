import { relations } from "drizzle-orm";
import { index, sqliteTable } from "drizzle-orm/sqlite-core";

import { user } from "./auth.schema";
import { vendor } from "./vendor.schema";
import { purchaseItem } from "./purchaseItem.schema";
import { image } from "./image.schema";

export type PurchaseOrderDbInsert = typeof purchaseOrder.$inferInsert;

export const purchaseOrder = sqliteTable(
	"purchase_order",
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
		vendorId: t
			.text("vendor_id")
			.notNull()
			.references(() => vendor.id),
		totalCost: t.integer("total_cost").notNull(),
		imageId: t.text("image_id").references(() => image.id, {
			onDelete: "set null",
		}),
		createdAt: t
			.integer("created_at", { mode: "timestamp_ms" })
			.$defaultFn(() => new Date())
			.notNull(),
		orderedAt: t
			.integer("ordered_at", { mode: "timestamp_ms" })
			.$defaultFn(() => new Date())
			.notNull(),
		modifiedAt: t
			.integer("modified_at", { mode: "timestamp_ms" })
			.$onUpdateFn(() => new Date())
			.notNull(),
	}),
	(table) => [
		index("purchase_order_owner_idx").on(table.userIdParent),
		index("purchase_order_creator_idx").on(table.userIdCreator),
	],
);

export const purchaseOrderRelations = relations(
	purchaseOrder,
	({ one, many }) => ({
		userParent: one(user, {
			fields: [purchaseOrder.userIdParent],
			references: [user.id],
			relationName: "parent",
		}),
		userCreator: one(user, {
			fields: [purchaseOrder.userIdCreator],
			references: [user.id],
			relationName: "creator",
		}),
		vendor: one(vendor, {
			fields: [purchaseOrder.vendorId],
			references: [vendor.id],
		}),
		image: one(image, {
			fields: [purchaseOrder.imageId],
			references: [image.id],
		}),
		purchaseItem: many(purchaseItem),
	}),
);
