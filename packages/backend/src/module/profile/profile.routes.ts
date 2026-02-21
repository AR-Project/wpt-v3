import { Hono } from "hono";
import z from "zod";

import { authProtectedMiddleware } from "@/middleware/auth.middleware";
import { zValidator } from "@hono/zod-validator";
import { auth, type ProtectedType } from "@lib/auth";

export const profileRoute = new Hono<{ Variables: ProtectedType }>({
	strict: false,
})
	.use(authProtectedMiddleware)
	.get("/", async (c) => {
		const user = c.get("user");
		return c.json({ message: `Hello ${user.name}` });
	})
	.post(
		"/user/:parentId/children",
		zValidator(
			"param",
			z.object({
				parentId: z.string(),
			}),
		),
		zValidator(
			"json",
			z.object({
				email: z.email(),
				password: z.string().min(10),
				name: z.string(),
			}),
		),
		async (c) => {
			const { parentId } = c.req.valid("param");
			const { email, name, password } = c.req.valid("json");
			const user = c.get("user");

			if (parentId !== user.id) return c.body(null, 403);

			const payload = {
				email,
				password,
				name,
				role: "user" as const,
				data: {
					parentId: user.id,
					defaultCategoryId: user.defaultCategoryId,
				},
			};

			const childUser = await auth.api.createUser({
				body: payload,
			});

			return c.json({ message: "user created", user: childUser }, 201);
		},
	);
