import { eq, or } from "drizzle-orm";
import { db } from "@db/index";
import { item, type CreateItemDbPayload } from "../schema/item.schema";

type CleanOption = {
	userId?: string | null;
	itemId?: string | null;
};

export const itemTbHelper = {
	add: async (payload: CreateItemDbPayload) => {
		await db
			.insert(item)
			.values(payload)
			.returning({ id: item.id, name: item.name });
	},
	find: async (userId: string) => {
		return await db.query.item.findMany({
			where: (item, { eq, or }) =>
				or(eq(item.userIdCreator, userId), eq(item.userIdParent, userId)),
		});
	},
	findById: async (itemId: string) => {
		return await db.query.item.findMany({
			where: (item, { eq }) => eq(item.id, itemId),
		});
	},
	findAll: async () => await db.query.item.findMany(),
	clean: async (option?: CleanOption) => {
		const filter = () => {
			if (!option) return undefined;
			if (option.itemId) return eq(item.id, option.itemId);
			if (option.userId)
				return or(
					eq(item.userIdCreator, option.userId),
					eq(item.userIdParent, option.userId),
				);
		};

		await db.delete(item).where(filter());
	},
};
