import type { AppType } from "@wpt/backend/shared";
import { hc } from "hono/client";

export const client = hc<AppType>("/", {
	init: {
		credentials: "include",
	},
});
