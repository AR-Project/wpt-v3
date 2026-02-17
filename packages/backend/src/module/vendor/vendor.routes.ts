import { Hono } from "hono";

import { authProtectedMiddleware } from "@/middleware/auth.middleware";

import type { ProtectedType } from "@lib/auth";
import { zValidator } from "@/lib/validator-wrapper";

export const vendorRoute = new Hono<{ Variables: ProtectedType }>({
	strict: false,
})
	.use(authProtectedMiddleware)
	.get("/", async (c) => {
		const user = c.get("user");

		return c.json({ todo: "todo" });
	});
