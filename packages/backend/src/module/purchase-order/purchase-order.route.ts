import { Hono } from "hono";

import { zValidator } from "@/lib/validator-wrapper";
import { authProtectedMiddleware } from "@/middleware/auth.middleware";

import type { ProtectedType } from "@lib/auth";
import * as purchaseOrderSchema from "@module/purchase-order/purchase-order.schema";

import * as purchaseOrderRepo from "./purchase-order.repository";

export const purchaseOrderRoute = new Hono<{ Variables: ProtectedType }>({
	strict: false,
})
	.use(authProtectedMiddleware)
	.post("/", zValidator("json", purchaseOrderSchema.create), async (c) => {
		const user = c.get("user");
		const payload = c.req.valid("json");

		const purchaseOrderId = await purchaseOrderRepo.create(payload, user);

		return c.json({ message: `Success`, data: purchaseOrderId }, 201);
	});
