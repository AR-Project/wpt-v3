import { eq, or } from "drizzle-orm";

import { db } from "@db/index";
import {
	category,
	type CreateCategoryDbPayload,
} from "../schema/category.schema";

type CleanOption = {
	userId?: string | null;
	categoryId?: string | null;
};

export const categoryTbHelper = {
	add: async (payload: CreateCategoryDbPayload) => {
		return await db
			.insert(category)
			.values(payload)
			.returning({ id: category.id, name: category.name });
	},
	find: async (userId: string) => {
		return await db.query.category.findMany({
			where: (category, { eq, or }) =>
				or(
					eq(category.userIdCreator, userId),
					eq(category.userIdParent, userId),
				),
		});
	},
	findById: async (categoryId: string) => {
		return await db.query.category.findMany({
			where: (category, { eq }) => eq(category.id, categoryId),
		});
	},
	getAll: async () => await db.query.category.findMany(),
	clean: async (option?: CleanOption) => {
		const byUser = option?.userId
			? or(
					eq(category.userIdCreator, option.userId),
					eq(category.userIdParent, option.userId),
				)
			: undefined;
		const byCategory = option?.categoryId
			? eq(category.id, option.categoryId)
			: undefined;

		await db.delete(category).where(or(byUser, byCategory));
	},
};
