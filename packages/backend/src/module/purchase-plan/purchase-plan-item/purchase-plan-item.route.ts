import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { purchasePlanItem, purchasePlan } from "@/db/schema";
import { zValidator } from "@/lib/validator-wrapper";
import type { ProtectedType } from "@lib/auth";

import * as piSchema from "@module/purchase-order/purchase-item/purchase-item.schema";

type VariablesTypes = ProtectedType & {
	purchasePlanId: string; // From parent path
};

export const purchasePlanItemRoute = new Hono<{ Variables: VariablesTypes }>({
	strict: false,
}).patch(
	"/:purchasePlanItemId",
	zValidator(
		"param",
		z.object({
			purchasePlanId: z.string(),
			purchasePlanItemId: z.string(),
		}),
	),
	zValidator("json", piSchema.update),
	async (c) => {
		const { purchasePlanId, purchasePlanItemId } = c.req.valid("param");
		const payload = c.req.valid("json");

		await db.transaction(async (tx) => {
			// DB get po from pi
			const currPPI = await tx.query.purchasePlanItem.findFirst({
				where: (ppi, { eq }) => eq(ppi.id, purchasePlanItemId),
				with: { purchasePlan: true },
			});

			// validate po and pi
			if (!currPPI)
				throw new HTTPException(404, {
					message: "Purchase Plan Item not found",
				});
			if (currPPI.purchasePlanId !== purchasePlanId)
				throw new HTTPException(400, { message: "Purchase Plan invalid" });

			// calculate new po.totalCost
			const newPPTotalCost =
				currPPI.purchasePlan.totalCost - currPPI.costPrice + payload.costPrice;

			// DB update pi and update po
			await Promise.all([
				tx
					.update(purchasePlanItem)
					.set(payload)
					.where(eq(purchasePlanItem.id, purchasePlanItemId)),
				tx
					.update(purchasePlan)
					.set({ totalCost: newPPTotalCost })
					.where(eq(purchasePlan.id, currPPI.purchasePlanId)),
			]);
		});
		return c.json({ message: "todo" });
	},
);
