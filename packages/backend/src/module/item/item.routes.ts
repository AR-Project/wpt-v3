import { Hono } from "hono";

import { authProtectedMiddleware } from "@/middleware/auth.middleware";

import type { ProtectedType } from "@lib/auth";
import { zValidator } from "@/lib/validator-wrapper";
import {
	createItemSchema,
	deleteItemSchema,
	updateItemSchema,
	updateItemsSortOrderSchema,
} from "./item.schema";
import {
	createItemRepo,
	deleteItemRepo,
	getItems,
	updateItemRepo,
	updateItemSortOrderRepo,
} from "./item.repository";

export const itemRoute = new Hono<{ Variables: ProtectedType }>({
	strict: false,
})
	.use(authProtectedMiddleware)
	.get("/", async (c) => {
		const user = c.get("user");

		const items = await getItems(user);

		return c.json(items);
	})
	.post("/", zValidator("json", createItemSchema), async (c) => {
		const payload = c.req.valid("json");
		const user = c.get("user");
		const [createdItem] = await createItemRepo(payload, user);

		return c.json(createdItem, 201);
	})
	.delete("/", zValidator("json", deleteItemSchema), async (c) => {
		const payload = c.req.valid("json");
		const user = c.get("user");

		await deleteItemRepo(payload, user);

		return c.json({ message: "ok" }, 200);
	})
	.patch("/", zValidator("json", updateItemSchema), async (c) => {
		const payload = c.req.valid("json");
		const user = c.get("user");

		await updateItemRepo(payload, user);

		return c.json({ message: "ok" }, 200);
	})
	.patch(
		"/sort-order",
		zValidator("json", updateItemsSortOrderSchema),
		async (c) => {
			const { itemIdsNewOrder, categoryId: categoryIdToUpdate } =
				c.req.valid("json");
			const user = c.get("user");

			await updateItemSortOrderRepo(categoryIdToUpdate, user, itemIdsNewOrder);

			return c.json({ message: "ok" }, 200);
		},
	);
