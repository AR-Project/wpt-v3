import { Hono } from "hono";
import z from "zod";
import { HTTPException } from "hono/http-exception";
import { eq, inArray, sql, type SQL } from "drizzle-orm";

import type { ProtectedType } from "@lib/auth";
import { generateId } from "@/lib/idGenerator";
import { zValidator } from "@/lib/validator-wrapper";
import { arraysHaveEqualElements } from "@/lib/utils/array-validator";

import { db } from "@/db";
import { item, type CreateItemDbPayload } from "@/db/schema/item.schema";

import { authProtectedMiddleware } from "@/middleware/auth.middleware";

import {
	createItemSchema,
	updateItemSchema,
	updateItemsSortOrderSchema,
} from "./item.schema";

export const itemRoute = new Hono<{ Variables: ProtectedType }>({
	strict: false,
})
	.use(authProtectedMiddleware)
	.get("/", async (c) => {
		const user = c.get("user");

		const items = await db.query.item.findMany({
			where: (item, { eq }) => eq(item.userIdParent, user.parentId),
			columns: {
				id: true,
				name: true,
				sortOrder: true,
			},
		});
		return c.json(items);
	})
	.post("/", zValidator("json", createItemSchema), async (c) => {
		const { name, categoryId } = c.req.valid("json");
		const user = c.get("user");

		const dbPayload: CreateItemDbPayload = {
			id: `cat_${generateId(10)}`,
			name: name,
			categoryId: categoryId ? categoryId : user.defaultCategoryId,
			userIdParent: user.parentId,
			userIdCreator: user.id,
		};

		const [createdItem] = await db.transaction(async (tx) => {
			let sortOrder: number = 0;

			if (categoryId) {
				const categoryExist = await tx.query.category.findFirst({
					where: (ctg, { eq }) => eq(ctg.id, categoryId),
					with: {
						items: true,
					},
				});
				if (!categoryExist)
					throw new HTTPException(403, { message: "category not exist" });
				sortOrder = categoryExist.items.length;
			} else {
				const defaultCategory = await tx.query.category.findFirst({
					where: (category, { eq }) => eq(category.id, user.defaultCategoryId),
					with: {
						items: true,
					},
				});

				if (!defaultCategory)
					throw new HTTPException(500, { message: "this should never throw" });
				sortOrder = defaultCategory.items.length;
			}

			return await tx
				.insert(item)
				.values({ ...dbPayload, sortOrder })
				.returning({
					id: item.id,
					name: item.name,
					categoryId: item.categoryId,
				});
		});

		return c.json(createdItem, 201);
	})
	.delete("/", zValidator("json", z.object({ id: z.string() })), async (c) => {
		const payload = c.req.valid("json");
		const user = c.get("user");

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

		return c.json({ message: "ok" }, 200);
	})
	.patch("/", zValidator("json", updateItemSchema), async (c) => {
		const { id, ...dataToUpdate } = c.req.valid("json");
		const user = c.get("user");

		await db.transaction(async (tx) => {
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

		return c.json({ message: "ok" }, 200);
	})
	.patch(
		"/sort-order",
		zValidator("json", updateItemsSortOrderSchema),
		async (c) => {
			const { itemIdsNewOrder, categoryId: categoryIdToUpdate } =
				c.req.valid("json");
			const user = c.get("user");

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

			return c.json({ message: "ok" }, 200);
		},
	);
