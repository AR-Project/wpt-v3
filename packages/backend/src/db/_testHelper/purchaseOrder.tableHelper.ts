import { eq, or } from "drizzle-orm";

import { db } from "@db/index";
import {
	purchaseOrder,
	type PurchaseOrderDbInsert,
} from "../schema/purchaseOrder.schema";

type CleanOption = {
	userId?: string | null;
	purchaseOrderId?: string | null;
};

type FindOptions = {
	withItems?: true;
};

export async function add(payload: PurchaseOrderDbInsert) {
	return await db
		.insert(purchaseOrder)
		.values(payload)
		.returning({ id: purchaseOrder.id });
}

export async function findByUserId(userId: string, option?: FindOptions) {
	return await db.query.purchaseOrder.findMany({
		where: (purchaseOrder, { eq, or }) =>
			or(
				eq(purchaseOrder.userIdCreator, userId),
				eq(purchaseOrder.userIdParent, userId),
			),
		with: {
			purchaseItem: option?.withItems,
		},
	});
}

export async function findById(purchaseOrderId: string, option?: FindOptions) {
	return await db.query.purchaseOrder.findMany({
		where: (purchaseOrder, { eq }) => eq(purchaseOrder.id, purchaseOrderId),
		with: {
			purchaseItem: option?.withItems,
		},
	});
}

export async function getAll() {
	return await db.query.vendor.findMany();
}

export async function clean(option?: CleanOption) {
	const byUser = option?.userId
		? or(
				eq(purchaseOrder.userIdCreator, option.userId),
				eq(purchaseOrder.userIdParent, option.userId),
			)
		: undefined;
	const byCategory = option?.purchaseOrderId
		? eq(purchaseOrder.id, option.purchaseOrderId)
		: undefined;

	await db.delete(purchaseOrder).where(or(byUser, byCategory));
}
