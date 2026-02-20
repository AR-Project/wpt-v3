import { eq, or } from "drizzle-orm";
import { db } from "@db/index";
import { product, type CreateItemDbPayload } from "../schema/item.schema";

type CleanOption = {
	userId?: string | null;
	itemId?: string | null;
};

export const itemTbHelper = {
	add: async (payload: CreateItemDbPayload) => {
		await db
			.insert(product)
			.values(payload)
			.returning({ id: product.id, name: product.name });
	},
	find: async (userId: string) => {
		return await db.query.product.findMany({
			where: (product, { eq, or }) =>
				or(eq(product.userIdCreator, userId), eq(product.userIdParent, userId)),
		});
	},
	findById: async (itemId: string) => {
		return await db.query.product.findMany({
			where: (product, { eq }) => eq(product.id, itemId),
		});
	},
	findAll: async () => await db.query.product.findMany(),
	clean: async (option?: CleanOption) => {
		const filter = () => {
			if (!option) return undefined;
			if (option.itemId) return eq(product.id, option.itemId);
			if (option.userId)
				return or(
					eq(product.userIdCreator, option.userId),
					eq(product.userIdParent, option.userId),
				);
		};

		await db.delete(product).where(filter());
	},
};
