import { db } from "@/db";
import type { NonNullableUser } from "@/lib/auth";

export async function getAll(user: NonNullableUser) {
	return await db.query.vendor.findMany({
		where: (vendor, { eq }) => eq(vendor.userIdParent, user.parentId),
		columns: {
			id: true,
			name: true,
		},
	});
}
