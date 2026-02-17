import { Hono } from "hono";

import { authProtectedMiddleware } from "@/middleware/auth.middleware";

import type { ProtectedType } from "@lib/auth";
import { zValidator } from "@/lib/validator-wrapper";
import * as itemSchema from "./item.schema";
import * as itemRepo from "./item.repository";

export const itemRoute = new Hono<{ Variables: ProtectedType }>({
	strict: false,
})
	.use(authProtectedMiddleware)
	.get("/", async (c) => {
		const user = c.get("user");

		const items = await itemRepo.getAllByUser(user);

		return c.json(items);
	})
	.post("/", zValidator("json", itemSchema.create), async (c) => {
		const payload = c.req.valid("json");
		const user = c.get("user");
		const [createdItem] = await itemRepo.create(payload, user);

		return c.json(createdItem, 201);
	})
	.delete("/", zValidator("json", itemSchema.remove), async (c) => {
		const payload = c.req.valid("json");
		const user = c.get("user");

		await itemRepo.remove(payload, user);

		return c.json({ message: "ok" }, 200);
	})
	.patch("/", zValidator("json", itemSchema.update), async (c) => {
		const payload = c.req.valid("json");
		const user = c.get("user");

		await itemRepo.update(payload, user);

		return c.json({ message: "ok" }, 200);
	})
	.patch(
		"/sort-order",
		zValidator("json", itemSchema.updateSortOrderMultiple),
		async (c) => {
			const { itemIdsNewOrder, categoryId: categoryIdToUpdate } =
				c.req.valid("json");
			const user = c.get("user");

			await itemRepo.updateSortOrderMultiple(
				categoryIdToUpdate,
				user,
				itemIdsNewOrder,
			);

			return c.json({ message: "ok" }, 200);
		},
	);
