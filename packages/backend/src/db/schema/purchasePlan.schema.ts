import { relations } from "drizzle-orm";
import { index, sqliteTable } from "drizzle-orm/sqlite-core";

import { user } from "./auth.schema";
import { vendor } from "./vendor.schema";
import { purchasePlanItem } from "./purchasePlanItem.schema";

export type PurchasePlanDbInsert = typeof purchasePlan.$inferInsert;

export const purchasePlan = sqliteTable(
	"purchase_plan",
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
		index("purchase_plan_owner_idx").on(table.userIdParent),
		index("purchase_plan_creator_idx").on(table.userIdCreator),
	],
);

export const purchasePlanRelations = relations(
	purchasePlan,
	({ one, many }) => ({
		userParent: one(user, {
			fields: [purchasePlan.userIdParent],
			references: [user.id],
			relationName: "parent",
		}),
		userCreator: one(user, {
			fields: [purchasePlan.userIdCreator],
			references: [user.id],
			relationName: "creator",
		}),
		vendor: one(vendor, {
			fields: [purchasePlan.vendorId],
			references: [vendor.id],
		}),
		purchasePlanItem: many(purchasePlanItem),
	}),
);
