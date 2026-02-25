import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { authProtectedMiddleware } from "@/middleware/auth.middleware";

import type { ProtectedType } from "@lib/auth";
import { zValidator } from "@/lib/validator-wrapper";
import { generateId } from "@/lib/idGenerator";
import { resolveFromRoot } from "@/lib/utils/file";
import { db } from "@/db";
import { image, type ImageDbInsert } from "@/db/schema";

import * as imageSchema from "@/module/image/image.schema";

const IMAGE_URL_PREFIX = "/api/image/file";
export const IMAGE_SERVER_PATH_PREFIX = "runtime-assets";

export const imageRoute = new Hono<{ Variables: ProtectedType }>({
	strict: false,
})
	.use(
		"/file/*", // "/api/image" from main.ts + "/file"
		serveStatic({
			root: resolveFromRoot(IMAGE_SERVER_PATH_PREFIX),
			rewriteRequestPath: (path) => path.slice(IMAGE_URL_PREFIX.length),
		}),
	)
	.use(authProtectedMiddleware)
	.post("/", zValidator("form", imageSchema.create), async (c) => {
		const payload = c.req.valid("form");
		const user = c.get("user");

		const timestamp = new Date();
		const currentImageId = `im_${generateId(15)}`;
		const fileName = `${currentImageId}.jpg`;

		const yearString = timestamp.getFullYear().toString();
		const monthStr = timestamp.getMonth().toString();
		const dateStr = timestamp.getDate().toString();

		const url = `${IMAGE_URL_PREFIX}/${yearString}/${monthStr}/${dateStr}/${fileName}`;

		const filePath = resolveFromRoot(
			"runtime-assets",
			yearString,
			monthStr,
			dateStr,
			fileName,
		);

		const imageDbPayload: ImageDbInsert = {
			url,
			id: currentImageId,
			userIdParent: user.parentId,
			userIdCreator: user.id,
			originalFileName: payload.image.name,
			createdAt: timestamp,
		};

		let isDatabaseWriten: boolean = false;
		let isFileWriten: boolean = false;

		try {
			await db.insert(image).values(imageDbPayload);
			isDatabaseWriten = true;

			await Bun.write(filePath, payload.image);
			isFileWriten = true;
		} catch (error) {
			console.log(error);

			// rollback
			if (isFileWriten) await Bun.file(filePath).delete();
			if (isDatabaseWriten)
				await db.delete(image).where(eq(image.id, currentImageId));

			throw new HTTPException(500, { message: "internal error" });
		}

		return c.json({ id: currentImageId, url }, 201);
	});
