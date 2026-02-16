import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import z from "zod";

import type { ProtectedType } from "@lib/auth";
import { generateId } from "@/lib/idGenerator";

import { db } from "@/db";
import { item, type CreateItemDbPayload } from "@/db/schema/item.schema";

import { authProtectedMiddleware } from "@/middleware/auth.middleware";
import { createItemSchema } from "./item.schema";
import { eq } from "drizzle-orm";

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
			if (categoryId) {
				const categoryExist = await tx.query.category.findFirst({
					where: (ctg, { eq }) => eq(ctg.id, categoryId),
				});
				if (!categoryExist)
					throw new HTTPException(403, { message: "category not exist" });
			}

			return await tx.insert(item).values(dbPayload).returning({
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
	});
