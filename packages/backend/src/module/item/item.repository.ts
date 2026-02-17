import { eq, inArray, sql, type SQL } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import type { NonNullableUser } from "@/lib/auth";
import { arraysHaveEqualElements } from "@/lib/utils/array-validator";

import { db } from "@/db";
import { item, type CreateItemDbPayload } from "@/db/schema/item.schema";
import type {
	CreateItemPayload,
	DeleteItemPayload,
	UpdateItemPayload,
} from "./item.schema";
import { generateId } from "@/lib/idGenerator";

export async function getItems(user: NonNullableUser) {
	return await db.query.item.findMany({
		where: (item, { eq }) => eq(item.userIdParent, user.parentId),
		columns: {
			id: true,
			name: true,
			sortOrder: true,
		},
	});
}

export async function createItemRepo(
	payload: CreateItemPayload,
	user: NonNullableUser,
) {
	return await db.transaction(async (tx) => {
		const { name, categoryId } = payload;

		const dbPayload: CreateItemDbPayload = {
			id: `cat_${generateId(10)}`,
			name: name,
			categoryId: "", // updated below
			userIdParent: user.parentId,
			userIdCreator: user.id,
		};

		if (categoryId) {
			const categoryExist = await tx.query.category.findFirst({
				where: (ctg, { eq }) => eq(ctg.id, categoryId),
				with: {
					items: true,
				},
			});
			if (!categoryExist)
				throw new HTTPException(403, { message: "category not exist" });
			dbPayload.sortOrder = categoryExist.items.length;
			dbPayload.categoryId = categoryId;
		} else {
			const defaultCategory = await tx.query.category.findFirst({
				where: (category, { eq }) => eq(category.id, user.defaultCategoryId),
				with: {
					items: true,
				},
			});

			if (!defaultCategory)
				throw new HTTPException(500, { message: "this should never throw" });
			dbPayload.sortOrder = defaultCategory.items.length;
			dbPayload.categoryId = user.defaultCategoryId;
		}

		return await tx.insert(item).values(dbPayload).returning({
			id: item.id,
			name: item.name,
			categoryId: item.categoryId,
		});
	});
}

export async function updateItemRepo(
	payload: UpdateItemPayload,
	user: NonNullableUser,
) {
	await db.transaction(async (tx) => {
		const { id, ...dataToUpdate } = payload;

		const itemToUpdate = await tx.query.item.findFirst({
			where: (item, { eq }) => eq(item.id, id),
		});
		if (!itemToUpdate)
			throw new HTTPException(403, { message: "item not exist" });

		// only the creator itself can update the item, not allowed to update parent item OR siblings item.
		if (itemToUpdate.userIdCreator !== user.id)
			throw new HTTPException(403, { message: "user not allowed" });

		await tx.update(item).set(dataToUpdate).where(eq(item.id, id));
	});
}

export async function deleteItemRepo(
	payload: DeleteItemPayload,
	user: NonNullableUser,
) {
	await db.transaction(async (tx) => {
		const itemToDelete = await tx.query.item.findFirst({
			where: (item, { eq }) => eq(item.id, payload.id),
		});
		if (!itemToDelete)
			throw new HTTPException(403, { message: "item not exist" });
		if (itemToDelete.userIdCreator !== user.id)
			throw new HTTPException(403, { message: "user not allowed" });

		await tx.delete(item).where(eq(item.id, payload.id));
	});
}

export async function updateItemSortOrderRepo(
	categoryIdToUpdate: string,
	user: NonNullableUser,
	itemIdsNewOrder: string[],
) {
	await db.transaction(async (tx) => {
		const categoryWithItems = await tx.query.category.findFirst({
			where: (category, { eq }) => eq(category.id, categoryIdToUpdate),
			with: {
				items: {
					columns: {
						id: true,
					},
					orderBy: (item, { asc }) => asc(item.sortOrder),
				},
			},
		});

		if (!categoryWithItems)
			throw new HTTPException(404, { message: "category not found" });

		if (user.parentId !== categoryWithItems.userIdParent)
			throw new HTTPException(403, { message: "user not allowed" });

		const itemIdsOldOrder = categoryWithItems.items.map((item) => item.id);

		if (arraysHaveEqualElements(itemIdsOldOrder, itemIdsNewOrder) === false)
			throw new HTTPException(400, {
				message: "item id(s) different from category",
			});

		const sqlChunks: SQL[] = [];
		sqlChunks.push(sql`(case`);
		itemIdsNewOrder.forEach((id, index) => {
			sqlChunks.push(sql`when ${item.id} = ${id} then ${index}`);
		});
		sqlChunks.push(sql`end)`);
		const finalSql: SQL = sql.join(sqlChunks, sql.raw(" "));

		await tx
			.update(item)
			.set({ sortOrder: finalSql })
			.where(inArray(item.id, itemIdsNewOrder));
	});
}
