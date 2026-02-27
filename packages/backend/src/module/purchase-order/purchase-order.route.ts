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

// TODO: Endpoint for update purchase items "sortOrder" (bulk update) - main entity is still purchase Order.

// TODO: Endpoint for update purchaseOrder information (vendor, orderedAt, imageId) - but prevent total cost.
// Total cost should be calculated, and become side effect when updating "purchase item"
