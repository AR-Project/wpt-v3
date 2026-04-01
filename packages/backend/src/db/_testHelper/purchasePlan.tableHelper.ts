import { eq, or } from "drizzle-orm";

import { db } from "@db/index";
import {
	purchasePlan,
	type PurchasePlanDbInsert,
} from "../schema/purchasePlan.schema";

type CleanOption = {
	userId?: string | null;
	purchasePlanId?: string | null;
};

type FindOptions = {
	withItems?: true;
};

export async function add(payload: PurchasePlanDbInsert) {
	return await db
		.insert(purchasePlan)
		.values(payload)
		.returning({ id: purchasePlan.id });
}

export async function findByUserId(userId: string, option?: FindOptions) {
	return await db.query.purchasePlan.findMany({
		where: (purchasePlan, { eq, or }) =>
			or(
				eq(purchasePlan.userIdCreator, userId),
				eq(purchasePlan.userIdParent, userId),
			),
		with: {
			purchasePlanItem: option?.withItems,
		},
	});
}

export async function findById(purchasePlanId: string, option?: FindOptions) {
	return await db.query.purchasePlan.findMany({
		where: (purchasePlan, { eq }) => eq(purchasePlan.id, purchasePlanId),
		with: {
			purchasePlanItem: option?.withItems
				? {
						orderBy: (ppi, { asc }) => asc(ppi.sortOrder),
					}
				: undefined,
		},
	});
}

export async function getAll() {
	return await db.query.vendor.findMany();
}

export async function clean(option?: CleanOption) {
	const byUser = option?.userId
		? or(
				eq(purchasePlan.userIdCreator, option.userId),
				eq(purchasePlan.userIdParent, option.userId),
			)
		: undefined;
	const byCategory = option?.purchasePlanId
		? eq(purchasePlan.id, option.purchasePlanId)
		: undefined;

	await db.delete(purchasePlan).where(or(byUser, byCategory));
}

export async function nuke() {
	await db.delete(purchasePlan);
}
