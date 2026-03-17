import { Hono } from "hono";

import { zValidator } from "@/lib/validator-wrapper";
import { authProtectedMiddleware } from "@/middleware/auth.middleware";

import type { ProtectedType } from "@lib/auth";

import * as purchasePlanSchema from "@module/purchase-plan/purchase-plan.schema";
import * as purchasePlanRepo from "@module/purchase-plan/purchase-plan.repository";
import { purchasePlanItemRoute } from "@module/purchase-plan/purchase-plan-item/purchase-plan-item.route";

export const purchasePlanRoute = new Hono<{ Variables: ProtectedType }>({
	strict: false,
})
	.use(authProtectedMiddleware)
	.post("/", zValidator("json", purchasePlanSchema.create), async (c) => {
		const user = c.get("user");
		const payload = c.req.valid("json");

		const purchaseOrderId = await purchasePlanRepo.create(payload, user);

		return c.json({ message: `Success`, data: purchaseOrderId }, 201);
	})

	// Register subpath
	.route("/:purchasePlanId/ppi", purchasePlanItemRoute)

	// Endpoints
	.patch(
		"/:purchasePlanId",
		zValidator("json", purchasePlanSchema.patch),
		async (c) => {
			const poIdToUpdate = c.req.param("purchasePlanId");
			const user = c.get("user");
			const payload = c.req.valid("json");

			await purchasePlanRepo.update(payload, poIdToUpdate, user);

			return c.json({ message: "success" });
		},
	)
	.patch(
		"/:purchasePlanId/sort-order",
		zValidator("json", purchasePlanSchema.patchSortOrder),
		async (c) => {
			const payload = c.req.valid("json");
			const poIdToUpdate = c.req.param("purchasePlanId");

			await purchasePlanRepo.updateSortOrder(poIdToUpdate, payload);

			return c.json({ message: "Success" });
		},
	);
