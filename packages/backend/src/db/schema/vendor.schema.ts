import { index, sqliteTable } from "drizzle-orm/sqlite-core";
import { user } from "./auth.schema";
import { relations } from "drizzle-orm";

export type VendorDbInsert = typeof vendor.$inferInsert;

export const vendor = sqliteTable(
	"item",
	(t) => ({
		id: t.text("id").primaryKey().unique().notNull(),
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
		index("vendor_name_idx").on(table.name),
		index("vendor_owner_idx").on(table.userIdParent),
		index("vendor_creator_idx").on(table.userIdCreator),
	],
);

export const vendorRelations = relations(vendor, ({ one }) => ({
	userParent: one(user, {
		fields: [vendor.userIdParent],
		references: [user.id],
		relationName: "parent",
	}),
	userCreator: one(user, {
		fields: [vendor.userIdCreator],
		references: [user.id],
		relationName: "creator",
	}),
}));
