import { Hono } from "hono";

import { authProtectedMiddleware } from "@/middleware/auth.middleware";
import { zValidator } from "@hono/zod-validator";
import { auth, type ProtectedType } from "@lib/auth";

import * as profileSchema from "./profile.schema";
import { HTTPException } from "hono/http-exception";

export const profileRoute = new Hono<{ Variables: ProtectedType }>({
	strict: false,
})
	.use(authProtectedMiddleware)
	.get("/", async (c) => {
		const user = c.get("user");
		return c.json({ message: `Hello ${user.name}` });
	})
	.post(
		"/children",
		zValidator("json", profileSchema.createChildren),
		async (c) => {
			const { email, name, password } = c.req.valid("json");
			const user = c.get("user");

			// Only admin can create user
			if (user.parentId !== user.id) throw new HTTPException(403);

			const payload = {
				email,
				password,
				name,
				role: "staff" as const,
				data: {
					parentId: user.id,
					defaultCategoryId: user.defaultCategoryId,
				},
			};

			const { user: childUser } = await auth.api.createUser({
				body: payload,
			});

			return c.json({ message: "user created", user: childUser }, 201);
		},
	);

// TODO: Implement new endpoint

/**
 * TODO - Endpoint for:
 * - update child user password - Implementation done, TODO TEST
 * - update child user information (name, email, image)
 * - get child users sessions (sessions state)
 * - ban
 * - unban
 * -
 *
 * NO NEED TODO - prefer to use auth api:
 * - update self information - https://www.better-auth.com/docs/concepts/users-accounts#update-user-information
 * - update self password - https://www.better-auth.com/docs/concepts/users-accounts#change-password
 */
