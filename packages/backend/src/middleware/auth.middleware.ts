import {
	auth,
	sanitizeUser,
	type ProtectedType,
	type PublicType,
} from "@/lib/auth";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

/**
 * @deprecated
 */
export const authPublicMiddleware = createMiddleware<{ Variables: PublicType }>(
	async (c, next) => {
		const session = await auth.api.getSession({ headers: c.req.raw.headers });

		if (!session) {
			c.set("user", null);
			c.set("session", null);
			await next();
			return;
		}

		c.set("user", session.user);
		c.set("session", session.session);
		await next();
	},
);

export const authProtectedMiddleware = createMiddleware<{
	Variables: ProtectedType;
}>(async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });
	if (!session) throw new HTTPException(401, { message: "unauthorized" });

	c.set("user", sanitizeUser(session.user));
	c.set("session", session.session);
	await next();
});
