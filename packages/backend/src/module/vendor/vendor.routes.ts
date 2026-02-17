import { Hono } from "hono";

import { authProtectedMiddleware } from "@/middleware/auth.middleware";

import type { ProtectedType } from "@lib/auth";
import { zValidator } from "@/lib/validator-wrapper";
import * as vendorSchema from "@/module/vendor/vendor.schema";
import * as vendorRepo from "@/module/vendor/vendor.repository";

export const vendorRoute = new Hono<{ Variables: ProtectedType }>({
	strict: false,
})
	.use(authProtectedMiddleware)
	.get("/", async (c) => {
		const user = c.get("user");
		return c.json(await vendorRepo.getAll(user));
	});
// .post("/", zValidator("json", vendorSchema.create), async (c) => {
// 		const payload = c.req.valid("json");
// 		const user = c.get("user");

// 		const dbPayload: CreateCategoryDbPayload = {
// 			id: `cat_${generateId(10)}`,
// 			name: payload.name,
// 			userIdParent: user.parentId,
// 			userIdCreator: user.id,
// 		};

// 		const [createdCategory] = await db
// 			.insert(category)
// 			.values(dbPayload)
// 			.returning({ id: category.id, name: category.name });

// 		return c.json(createdCategory, 201);
// 	})
