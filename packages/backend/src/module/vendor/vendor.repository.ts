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
