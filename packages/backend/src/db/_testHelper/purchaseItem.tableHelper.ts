import { eq, or } from "drizzle-orm";

import { db } from "@db/index";
import { purchaseItem, type PurchaseItemDbInsert } from "../schema";

type CleanOption = {
	userId?: string | null;
	purchaseItemId?: string | null;
};

export async function add(payload: PurchaseItemDbInsert) {
	return await db
		.insert(purchaseItem)
		.values(payload)
		.returning({ id: purchaseItem.id });
}

export async function findByUserId(userId: string) {
	return await db.query.purchaseItem.findMany({
		where: (purchaseItem, { eq, or }) =>
			or(
				eq(purchaseItem.userIdCreator, userId),
				eq(purchaseItem.userIdParent, userId),
			),
	});
}

export async function findById(purchaseItemId: string) {
	return await db.query.purchaseItem.findMany({
		where: (purchaseItem, { eq }) => eq(purchaseItem.id, purchaseItemId),
	});
}

export async function getAll() {
	return await db.query.vendor.findMany();
}

export async function clean(option?: CleanOption) {
	const byUser = option?.userId
		? or(
				eq(purchaseItem.userIdCreator, option.userId),
				eq(purchaseItem.userIdParent, option.userId),
			)
		: undefined;
	const byCategory = option?.purchaseItemId
		? eq(purchaseItem.id, option.purchaseItemId)
		: undefined;

	await db.delete(purchaseItem).where(or(byUser, byCategory));
}
