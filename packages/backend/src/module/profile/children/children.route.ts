import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { zValidator } from "@hono/zod-validator";
import { auth, type ProtectedType } from "@lib/auth";

import * as childrenSchema from "./children.schema";
import { db } from "@/db";

export const profileChildrenRoute = new Hono<{ Variables: ProtectedType }>({
	strict: false,
})
	// .use(authProtectedMiddleware)
	.get("/", async (c) => {
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
	.post("/", zValidator("json", childrenSchema.createChildren), async (c) => {
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
	})
	.delete("/:childId/sessions", async (c) => {
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
		"/:childId/set-password",
		zValidator("param", childrenSchema.patchChildrenPathParam),
		zValidator("json", childrenSchema.updateChildrenPassword),
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
		"/:childId",
		zValidator("param", childrenSchema.patchChildrenPathParam),
		zValidator("json", childrenSchema.updateChild),
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
