import { HTTPException } from "hono/http-exception";
import { eq, inArray, sql, type SQL } from "drizzle-orm";

import type { NonNullableUser } from "@/lib/auth";
import { generateId } from "@/lib/idGenerator";
import { db, type Tx } from "@/db";
import {
	type PurchasePlanItemDbInsert,
	type PurchasePlanDbInsert,
	purchasePlanItem,
	purchasePlan,
} from "@/db/schema/";

import type * as piSchema from "./purchase-plan.schema";
import { haveMismatch } from "@/lib/utils/array-validator";

async function txFindFirstById(poId: string, tx: Tx) {
	return await tx.query.purchasePlan.findFirst({
		where: (po, { eq }) => eq(po.id, poId),
		with: {
			purchasePlanItem: {
				orderBy: (pi, { asc }) => asc(pi.sortOrder),
			},
		},
	});
}

export async function create(
	payload: piSchema.CreatePurchasePlanPayload,
	user: NonNullableUser,
) {
	return await db.transaction(async (tx) => {
		const purchasePlanId = `pp_${generateId(14)}`;

		const piProductids: string[] = payload.purchasePlanItems.map(
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

		const poPayload: PurchasePlanDbInsert = {
			id: purchasePlanId,
			userIdParent: user.parentId,
			userIdCreator: user.id,
			vendorId: payload.vendorId,
			totalCost: payload.totalCost,
			orderedAt: payload.orderedAt,
		};

		await db.insert(purchasePlan).values(poPayload);

		const ppiPayload: PurchasePlanItemDbInsert[] =
			payload.purchasePlanItems.map((pi, index) => ({
				...pi,
				id: `pi_${generateId(14)}`,
				userIdParent: user.parentId,
				userIdCreator: user.parentId,
				purchasePlanId,
				vendorId: payload.vendorId, // Tobe Delete! Redundant
				sortOrder: index,
			}));

		await db.insert(purchasePlanItem).values(ppiPayload);
		return purchasePlanId;
	});
}

export async function update(
	payload: piSchema.PatchPayload,
	poIdToUpdate: string,
	user: NonNullableUser,
) {
	await db.transaction(async (tx) => {
		const { vendorId, imageId } = payload;
		const po = await txFindFirstById(poIdToUpdate, tx);

		if (!po)
			throw new HTTPException(404, { message: "Purchase Order not found" });

		if (po.userIdParent !== user.parentId)
			throw new HTTPException(403, {
				message: `Not Authorized to change ${poIdToUpdate}`,
			});

		if (vendorId) {
			const vendor = await tx.query.vendor.findFirst({
				where: (v, { eq }) => eq(v.id, vendorId),
			});
			if (!vendor)
				throw new HTTPException(404, {
					message: "Vendor not found",
				});
		}

		if (imageId) {
			const image = await tx.query.image.findFirst({
				where: (i, { eq }) => eq(i.id, imageId),
			});
			if (!image)
				throw new HTTPException(404, {
					message: "Image not found",
				});
		}

		await db
			.update(purchasePlan)
			.set({ ...payload })
			.where(eq(purchasePlan.id, poIdToUpdate));
	});
}

export async function updateSortOrder(
	poIdToUpdate: string,
	payload: { newIdOrder: string[] },
) {
	await db.transaction(async (tx) => {
		const currPo = await txFindFirstById(poIdToUpdate, tx);

		if (!currPo)
			throw new HTTPException(404, { message: "Purchase Order Not Found" });

		const oldIdOrder = currPo.purchasePlanItem.map((pi) => pi.id);

		if (haveMismatch(payload.newIdOrder, oldIdOrder))
			throw new HTTPException(400, { message: "list not match" });

		const sqlChunks: SQL[] = []; // Empty sqlChunks array

		// generating
		sqlChunks.push(sql`(case`);
		payload.newIdOrder.forEach((id, index) => {
			sqlChunks.push(sql`when ${purchasePlanItem.id} = ${id} then ${index}`);
		});
		sqlChunks.push(sql`end)`);

		const finalSql: SQL = sql.join(sqlChunks, sql.raw(" "));

		await tx
			.update(purchasePlanItem)
			.set({ sortOrder: finalSql })
			.where(inArray(purchasePlanItem.id, payload.newIdOrder));
	});
}
