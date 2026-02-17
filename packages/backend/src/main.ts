import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";
import { createMiddleware } from "hono/factory";

import { authRoute } from "@module/auth/auth.routes";
import { profileRoute } from "@module/profile/profile.routes";
import { categoryRoute } from "@module/category/category.routes";
import { itemRoute } from "@module/item/item.routes";

const conditionalLogger = () => {
	return process.env.NODE_ENV === "test"
		? createMiddleware(async (_c, next) => await next())
		: logger();
};

export const app = new Hono()
	.basePath("/api")
	.use(conditionalLogger())
	.use(trimTrailingSlash())
	.route("/auth", authRoute)
	.route("/profile", profileRoute)
	.route("/category", categoryRoute)
	.route("/item", itemRoute)
	.get("/hello", async (c) => c.json({ message: "hello from api" }))
	.onError((error, c) => {
		if (error instanceof HTTPException)
			return c.json({ message: error.message }, error.status);
		return c.json({ message: "Internal Error" }, 500);
	});

export type AppType = typeof app;

export default {
	port: 8000,
	fetch: app.fetch,
};
