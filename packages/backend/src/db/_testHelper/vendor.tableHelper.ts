import { eq, or } from "drizzle-orm";

import { db } from "@db/index";
import { vendor, type VendorDbInsert } from "../schema/vendor.schema";

type CleanOption = {
	userId?: string | null;
	vendorId?: string | null;
};

export async function add(payload: VendorDbInsert) {
	return await db
		.insert(vendor)
		.values(payload)
		.returning({ id: vendor.id, name: vendor.name });
}

export async function findByUserId(userId: string) {
	return await db.query.vendor.findMany({
		where: (vendor, { eq, or }) =>
			or(eq(vendor.userIdCreator, userId), eq(vendor.userIdParent, userId)),
	});
}

export async function findById(vendorId: string) {
	return await db.query.vendor.findMany({
		where: (category, { eq }) => eq(category.id, vendorId),
	});
}

export async function getAll() {
	return await db.query.vendor.findMany();
}

export async function clean(option?: CleanOption) {
	const byUser = option?.userId
		? or(
				eq(vendor.userIdCreator, option.userId),
				eq(vendor.userIdParent, option.userId),
			)
		: undefined;
	const byCategory = option?.vendorId
		? eq(vendor.id, option.vendorId)
		: undefined;

	await db.delete(vendor).where(or(byUser, byCategory));
}
