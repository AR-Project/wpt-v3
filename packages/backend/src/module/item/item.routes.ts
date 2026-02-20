import { Hono } from "hono";

import { authProtectedMiddleware } from "@/middleware/auth.middleware";

import type { ProtectedType } from "@lib/auth";
import { zValidator } from "@/lib/validator-wrapper";
import * as productSchema from "./product.schema";
import * as productRepo from "./product.repository";

export const itemRoute = new Hono<{ Variables: ProtectedType }>({
	strict: false,
})
	.use(authProtectedMiddleware)
	.get("/", async (c) => {
		const user = c.get("user");

		const items = await productRepo.getAllByUser(user);

		return c.json(items);
	})
	.post("/", zValidator("json", productSchema.create), async (c) => {
		const payload = c.req.valid("json");
		const user = c.get("user");
		const [createdItem] = await productRepo.create(payload, user);

		return c.json(createdItem, 201);
	})
	.delete("/", zValidator("json", productSchema.remove), async (c) => {
		const payload = c.req.valid("json");
		const user = c.get("user");

		await productRepo.remove(payload, user);

		return c.json({ message: "ok" }, 200);
	})
	.patch("/", zValidator("json", productSchema.update), async (c) => {
		const payload = c.req.valid("json");
		const user = c.get("user");

		await productRepo.update(payload, user);

		return c.json({ message: "ok" }, 200);
	})
	.patch(
		"/sort-order",
		zValidator("json", productSchema.updateSortOrderMultiple),
		async (c) => {
			const { itemIdsNewOrder, categoryId: categoryIdToUpdate } =
				c.req.valid("json");
			const user = c.get("user");

			await productRepo.updateSortOrderMultiple(
				categoryIdToUpdate,
				user,
				itemIdsNewOrder,
			);

			return c.json({ message: "ok" }, 200);
		},
	);
