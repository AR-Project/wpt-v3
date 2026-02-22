import { HTTPException } from "hono/http-exception";

import type { NonNullableUser } from "@/lib/auth";
import { generateId } from "@/lib/idGenerator";
import { db } from "@/db";
import {
	purchaseItem,
	purchaseOrder,
	type PurchaseItemDbInsert,
	type PurchaseOrderDbInsert,
} from "@/db/schema";

import type { CreatePurchaseOrderPayload } from "./purchase-order.schema";

export async function create(
	payload: CreatePurchaseOrderPayload,
	user: NonNullableUser,
) {
	return await db.transaction(async (tx) => {
		const purchaseOrderId = `po_${generateId(14)}`;

		const piProductids: string[] = payload.purchaseItems.map(
			(pi) => pi.productId,
		);

		const [vendor, products] = await Promise.all([
			tx.query.vendor.findFirst({
				where: (vendor, { eq, and }) =>
					and(
						eq(vendor.id, payload.vendorId),
						eq(vendor.userIdParent, user.parentId),
					),
			}),
			tx.query.product.findMany({
				where: (product, { inArray, and, eq }) =>
					and(
						inArray(product.id, piProductids),
						eq(product.userIdParent, user.parentId),
					),
			}),
		]);

		if (!vendor) throw new HTTPException(400, { message: "vendor ID invalid" });

		if (products.length !== piProductids.length)
			throw new HTTPException(400, {
				message: "(some) product(s) ID invalid",
			});

		const poPayload: PurchaseOrderDbInsert = {
			id: purchaseOrderId,
			userIdParent: user.parentId,
			userIdCreator: user.id,
			vendorId: payload.vendorId,
			totalCost: payload.totalCost,
			orderedAt: payload.orderedAt,
			imageId: payload.imageId,
		};

		await db.insert(purchaseOrder).values(poPayload);

		const piPayload: PurchaseItemDbInsert[] = payload.purchaseItems.map(
			(pi, index) => ({
				...pi,
				id: `pi_${generateId(14)}`,
				userIdParent: user.parentId,
				userIdCreator: user.parentId,
				purchaseOrderId: purchaseOrderId,
				vendorId: payload.vendorId,
				sortOrder: index,
			}),
		);

		await db.insert(purchaseItem).values(piPayload);
		return purchaseOrderId;
	});
}
