import { index, sqliteTable } from "drizzle-orm/sqlite-core";
import { user } from "./auth.schema";
import { relations } from "drizzle-orm";

export type ImageDbInsert = typeof image.$inferInsert;

export const image = sqliteTable(
	"image",
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
		url: t.text("url").unique().notNull(),
		originalFileName: t.text("original_file_name").notNull(),
		createdAt: t
			.integer("created_at", { mode: "timestamp_ms" })
			.$defaultFn(() => new Date())
			.notNull(),
	}),
	(table) => [
		index("image_owner_idx").on(table.userIdParent),
		index("image_creator_idx").on(table.userIdCreator),
	],
);

export const imageRelations = relations(image, ({ one }) => ({
	userParent: one(user, {
		fields: [image.userIdParent],
		references: [user.id],
		relationName: "parent",
	}),
	userCreator: one(user, {
		fields: [image.userIdCreator],
		references: [user.id],
		relationName: "creator",
	}),
}));
