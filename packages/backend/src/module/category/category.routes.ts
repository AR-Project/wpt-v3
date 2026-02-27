import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
// import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { authProtectedMiddleware } from "@/middleware/auth.middleware";
import type { ProtectedType } from "@lib/auth";
import {
	category,
	type CreateCategoryDbPayload,
} from "@/db/schema/category.schema";
import { generateId } from "@/lib/idGenerator";
import { createCategorySchema, updateCategorySchema } from "@/shared";
import { zValidator } from "@/lib/validator-wrapper";

export const categoryRoute = new Hono<{ Variables: ProtectedType }>({
	strict: false,
})
	.use(authProtectedMiddleware)
	.get("/", async (c) => {
		const user = c.get("user");

		const categories = await db.query.category.findMany({
			where: (category, { eq }) => eq(category.userIdParent, user.parentId),
			columns: {
				id: true,
				name: true,
				sortOrder: true,
			},
		});
		return c.json(categories);
	})
	.post("/", zValidator("json", createCategorySchema), async (c) => {
		const payload = c.req.valid("json");
		const user = c.get("user");

		const dbPayload: CreateCategoryDbPayload = {
			id: `cat_${generateId(10)}`,
			name: payload.name,
			userIdParent: user.parentId,
			userIdCreator: user.id,
		};

		// TODO: Implement optional create category and update productId on it.

		const [createdCategory] = await db
			.insert(category)
			.values(dbPayload)
			.returning({ id: category.id, name: category.name });

		return c.json(createdCategory, 201);
	})
	.delete(
		"/",
		zValidator("json", z.object({ id: z.string().min(10) })),
		async (c) => {
			const payload = c.req.valid("json");
			const user = c.get("user");

			await db.transaction(async (tx) => {
				const categoryToDelete = await tx.query.category.findFirst({
					where: (category, { and, eq }) =>
						and(
							eq(category.id, payload.id),
							eq(category.userIdParent, user.parentId),
						),
					columns: {
						id: true,
						userIdParent: true,
					},
				});
				if (!categoryToDelete)
					throw new HTTPException(403, { message: "Category not exist" });

				const siblingUsers = await tx.query.user.findMany({
					where: (userOnDB, { eq }) => eq(userOnDB.parentId, user.parentId),
				});

				if (siblingUsers.some((user) => user.defaultCategoryId === payload.id))
					throw new HTTPException(403, {
						message: "Cannot delete default category",
					});

				await tx.delete(category).where(eq(category.id, payload.id));
			});

			return c.json({}, 200);
		},
	)
	.patch("/", zValidator("json", updateCategorySchema), async (c) => {
		const payload = c.req.valid("json");
		const user = c.get("user");

		await db.transaction(async (tx) => {
			const categoryToUpdate = await tx.query.category.findFirst({
				where: (category, { and, eq }) =>
					and(
						eq(category.id, payload.id),
						eq(category.userIdParent, user.parentId),
					),
				columns: {
					id: true,
					userIdParent: true,
				},
			});
			if (!categoryToUpdate)
				throw new HTTPException(403, { message: "Category not exist" });

			await tx
				.update(category)
				.set({ name: payload.name })
				.where(eq(category.id, payload.id));
		});

		return c.json({}, 200);
	});
