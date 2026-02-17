import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { db } from "@/db";
import { vendor, type VendorDbInsert } from "@/db/schema/vendor.schema";
import type { NonNullableUser } from "@/lib/auth";
import { generateId } from "@/lib/idGenerator";

import type * as vendorSchema from "@/module/vendor/vendor.schema";

export async function getAll(user: NonNullableUser) {
	return await db.query.vendor.findMany({
		where: (vendor, { eq }) => eq(vendor.userIdParent, user.parentId),
		columns: {
			id: true,
			name: true,
		},
	});
}

export async function create(
	payload: vendorSchema.CreatePayload,
	user: NonNullableUser,
) {
	const dbPayload: VendorDbInsert = {
		id: `cat_${generateId(10)}`,
		name: payload.name,
		userIdParent: user.parentId,
		userIdCreator: user.id,
	};

	return await db
		.insert(vendor)
		.values(dbPayload)
		.returning({ id: vendor.id, name: vendor.name });
}

export async function remove(payload: { id: string }, user: NonNullableUser) {
	await db.transaction(async (tx) => {
		const vendorToDelete = await tx.query.vendor.findFirst({
			where: (vendor, { eq }) => eq(vendor.id, payload.id),
		});
		if (!vendorToDelete)
			throw new HTTPException(404, { message: "vendor not exist" });

		if (vendorToDelete.userIdParent !== user.parentId)
			throw new HTTPException(403, { message: "user not allowed" });

		await tx.delete(vendor).where(eq(vendor.id, payload.id));
	});
}
