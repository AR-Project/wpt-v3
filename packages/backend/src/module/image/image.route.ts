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
	})
	.delete("/", zValidator("json", imageSchema.remove), async (c) => {
		const payload = c.req.valid("json");
		const user = c.get("user");

		await db.transaction(async (tx) => {
			const imageToDelete = await tx.query.image.findFirst({
				where: (image, { eq, and }) =>
					and(eq(image.id, payload.id), eq(image.userIdCreator, user.id)),
			});

			if (!imageToDelete)
				throw new HTTPException(404, { message: "image not found" });

			try {
				await Bun.file(
					resolveFromRoot(
						IMAGE_SERVER_PATH_PREFIX,
						...imageToDelete.url.slice(IMAGE_URL_PREFIX.length + 1).split("/"),
					),
				).delete();
			} catch (_) {
				throw new HTTPException(500, { message: "fail to delete image files" });
			}

			await tx.delete(image).where(eq(image.id, payload.id));
		});

		return c.json({ message: "image deleted" });
	})
	.get("/", async (c) => {
		const user = c.get("user");
		const images = await db.query.image.findMany({
			where: (image, { or, eq }) =>
				or(
					eq(image.userIdCreator, user.id),
					eq(image.userIdParent, user.parentId),
				),
		});

		return c.json(images);
	})
	.get("/:imageId", async (c) => {
		const user = c.get("user");
		const imageId = c.req.param("imageId");

		const images = await db.query.image.findFirst({
			where: (image, { or, and, eq }) =>
				and(
					or(
						eq(image.userIdCreator, user.id),
						eq(image.userIdParent, user.parentId),
					),
					eq(image.id, imageId),
				),
		});
		if (!images) throw new HTTPException(404, { message: "image not found" });

		return c.json(images);
	});
