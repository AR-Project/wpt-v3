import { Hono } from "hono";

import { authProtectedMiddleware } from "@/middleware/auth.middleware";
import type { ProtectedType } from "@lib/auth";

import { profileChildrenRoute } from "./children/children.route";

export const profileRoute = new Hono<{ Variables: ProtectedType }>({
	strict: false,
})
	.use(authProtectedMiddleware)
	.get("/", async (c) => {
		const user = c.get("user");
		return c.json({ message: `Hello ${user.name}` });
	})
	.route("/children", profileChildrenRoute);
