import { eq, or } from "drizzle-orm";

import { db } from "@db/index";
import {
	purchasePlanItem,
	type PurchasePlanItemDbInsert,
} from "../schema/purchasePlanItem.schema";

type CleanOption = {
	userId?: string | null;
	purchasePlanItemId?: string | null;
};

export async function add(payload: PurchasePlanItemDbInsert) {
	return await db
		.insert(purchasePlanItem)
		.values(payload)
		.returning({ id: purchasePlanItem.id });
}

export async function findByUserId(userId: string) {
	return await db.query.purchasePlanItem.findMany({
		where: (purchasePlanItem, { eq, or }) =>
			or(
				eq(purchasePlanItem.userIdCreator, userId),
				eq(purchasePlanItem.userIdParent, userId),
			),
	});
}

export async function findById(purchasePlanItemId: string) {
	return await db.query.purchasePlanItem.findMany({
		where: (purchasePlanItem, { eq }) =>
			eq(purchasePlanItem.id, purchasePlanItemId),
	});
}

export async function getAll() {
	return await db.query.vendor.findMany();
}

export async function clean(option?: CleanOption) {
	const byUser = option?.userId
		? or(
				eq(purchasePlanItem.userIdCreator, option.userId),
				eq(purchasePlanItem.userIdParent, option.userId),
			)
		: undefined;
	const byCategory = option?.purchasePlanItemId
		? eq(purchasePlanItem.id, option.purchasePlanItemId)
		: undefined;

	await db.delete(purchasePlanItem).where(or(byUser, byCategory));
}

export async function nuke() {
	await db.delete(purchasePlanItem);
}
