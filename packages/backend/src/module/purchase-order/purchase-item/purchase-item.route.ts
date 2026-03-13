/**
 * Notes:
 * - patch purchase Item - (side effect: changing costPrice shoud recalculate purchase order total cost)
 */

import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { zValidator } from "@/lib/validator-wrapper";
import type { ProtectedType } from "@lib/auth";
import { purchaseItem, purchaseOrder } from "@/db/schema";

import * as piSchema from "@module/purchase-order/purchase-item/purchase-item.schema";

type VariablesTypes = ProtectedType & {
	purchaseOrderId: string;
};

export const purchaseItemRoute = new Hono<{ Variables: VariablesTypes }>({
	strict: false,
}).patch(
	"/:purchaseItemId",
	zValidator(
		"param",
		z.object({
			purchaseOrderId: z.string(),
		}),
	),
	zValidator("json", piSchema.update),
	async (c) => {
		const { purchaseOrderId } = c.req.valid("param");
		const piId = c.req.param("purchaseItemId");
		const payload = c.req.valid("json");

		await db.transaction(async (tx) => {
			// DB get po from pi
			const currPi = await tx.query.purchaseItem.findFirst({
				where: (pi, { eq }) => eq(pi.id, piId),
				with: { purchaseOrder: true },
			});

			// validate po and pi
			if (!currPi)
				throw new HTTPException(404, { message: "Purchase Item not found" });
			if (currPi.purchaseOrderId !== purchaseOrderId)
				throw new HTTPException(400, { message: "Purchase Order invalid" });

			// calculate new po.totalCost
			const newPoTotalCost =
				currPi.purchaseOrder.totalCost - currPi.costPrice + payload.costPrice;

			// DB update pi and update po
			await Promise.all([
				tx.update(purchaseItem).set(payload).where(eq(purchaseItem.id, piId)),
				tx
					.update(purchaseOrder)
					.set({ totalCost: newPoTotalCost })
					.where(eq(purchaseOrder.id, currPi.purchaseOrderId)),
			]);
		});
		return c.json({ message: "todo" });
	},
);
