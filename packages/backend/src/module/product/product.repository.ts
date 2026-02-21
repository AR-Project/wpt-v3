import { eq, inArray, sql, type SQL } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import type { NonNullableUser } from "@/lib/auth";
import { arraysHaveEqualElements } from "@/lib/utils/array-validator";

import { db } from "@/db";
import { product, type ProductDbInsert } from "@/db/schema/product.schema";
import type {
	CreateItemPayload,
	DeleteItemPayload,
	UpdateItemPayload,
} from "./product.schema";
import { generateId } from "@/lib/idGenerator";

export async function getAllByUser(user: NonNullableUser) {
	return await db.query.product.findMany({
		where: (product, { eq }) => eq(product.userIdParent, user.parentId),
		columns: {
			id: true,
			name: true,
			sortOrder: true,
		},
	});
}

export async function create(
	payload: CreateItemPayload,
	user: NonNullableUser,
) {
	return await db.transaction(async (tx) => {
		const { name, categoryId } = payload;

		const dbPayload: ProductDbInsert = {
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

		return await tx.insert(product).values(dbPayload).returning({
			id: product.id,
			name: product.name,
			categoryId: product.categoryId,
		});
	});
}

export async function update(
	payload: UpdateItemPayload,
	user: NonNullableUser,
) {
	await db.transaction(async (tx) => {
		const { id, ...dataToUpdate } = payload;

		const itemToUpdate = await tx.query.product.findFirst({
			where: (product, { eq }) => eq(product.id, id),
		});
		if (!itemToUpdate)
			throw new HTTPException(403, { message: "item not exist" });

		// only the creator itself can update the item, not allowed to update parent item OR siblings item.
		if (itemToUpdate.userIdCreator !== user.id)
			throw new HTTPException(403, { message: "user not allowed" });

		await tx.update(product).set(dataToUpdate).where(eq(product.id, id));
	});
}

export async function remove(
	payload: DeleteItemPayload,
	user: NonNullableUser,
) {
	await db.transaction(async (tx) => {
		const itemToDelete = await tx.query.product.findFirst({
			where: (product, { eq }) => eq(product.id, payload.id),
		});
		if (!itemToDelete)
			throw new HTTPException(403, { message: "item not exist" });
		if (itemToDelete.userIdCreator !== user.id)
			throw new HTTPException(403, { message: "user not allowed" });

		await tx.delete(product).where(eq(product.id, payload.id));
	});
}

export async function updateSortOrderMultiple(
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
			sqlChunks.push(sql`when ${product.id} = ${id} then ${index}`);
		});
		sqlChunks.push(sql`end)`);
		const finalSql: SQL = sql.join(sqlChunks, sql.raw(" "));

		await tx
			.update(product)
			.set({ sortOrder: finalSql })
			.where(inArray(product.id, itemIdsNewOrder));
	});
}
