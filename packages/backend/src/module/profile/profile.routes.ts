import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { authProtectedMiddleware } from "@/middleware/auth.middleware";
import { zValidator } from "@hono/zod-validator";
import { auth, type ProtectedType } from "@lib/auth";

import * as profileSchema from "./profile.schema";
import { db } from "@/db";

export const profileRoute = new Hono<{ Variables: ProtectedType }>({
	strict: false,
})
	.use(authProtectedMiddleware)
	.get("/", async (c) => {
		const user = c.get("user");
		return c.json({ message: `Hello ${user.name}` });
	})
	.get("/children", async (c) => {
		const user = c.get("user");

		if (user.id !== user.parentId)
			throw new HTTPException(403, { message: "not an admin" });

		const childUser = await db.query.user.findMany({
			where: (childUser, { eq, and, ne }) =>
				and(eq(childUser.parentId, user.id), ne(childUser.id, user.id)),

			with: {
				sessions: true,
			},
		});

		return c.json(childUser);
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
	)
	.delete("/children/:childId/sessions", async (c) => {
		const { childId } = c.req.param();
		const user = c.get("user");

		if (user.parentId !== user.id)
			throw new HTTPException(403, { message: "role not allowed" });

		const userOnDb = await db.query.user.findFirst({
			where: (userRow, { eq }) => eq(userRow.id, childId),
		});

		if (!userOnDb)
			throw new HTTPException(404, { message: "child user not found" });

		await auth.api.revokeUserSessions({
			body: {
				userId: childId, // required
			},
			// This endpoint requires session cookies.
			headers: c.req.raw.headers,
		});
		return c.body(null, 204);
	})
	.patch(
		"/children/:childId/set-password",
		zValidator("param", profileSchema.patchChildrenPathParam),
		zValidator("json", profileSchema.updateChildrenPassword),
		async (c) => {
			const { childId } = c.req.valid("param");
			const { newPassword } = c.req.valid("json");
			const user = c.get("user");

			if (user.parentId !== user.id) throw new HTTPException(403);

			await auth.api.setUserPassword({
				body: {
					newPassword,
					userId: childId,
				},
				headers: c.req.raw.headers,
			});

			return c.json({ message: "success" });
		},
	)
	.patch(
		"/children/:childId",
		zValidator("param", profileSchema.patchChildrenPathParam),
		zValidator("json", profileSchema.updateChild),
		async (c) => {
			const { childId } = c.req.valid("param");
			const payload = c.req.valid("json");
			const user = c.get("user");

			if (user.parentId !== user.id) throw new HTTPException(403);

			const userOnDb = await db.query.user.findFirst({
				where: (userRow, { eq }) => eq(userRow.id, childId),
			});

			if (!userOnDb)
				throw new HTTPException(404, { message: "child user not found" });

			await auth.api.adminUpdateUser({
				body: {
					userId: childId, // required
					data: payload, // required
				},

				headers: c.req.raw.headers,
			});

			return c.json({ message: "success" });
		},
	);

// TODO: Implement new endpoint

/**
 * TODO - Endpoint for:
 * - ban
 * - unban
 */
