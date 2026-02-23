import { Hono } from "hono";

import { authProtectedMiddleware } from "@/middleware/auth.middleware";

import type { ProtectedType } from "@lib/auth";
import { zValidator } from "@/lib/validator-wrapper";
import * as imageSchema from "@/module/image/image.schema";
import { HTTPException } from "hono/http-exception";
import { resolveFromRoot } from "@/lib/utils/file";
import { generateId } from "@/lib/idGenerator";
import { db } from "@/db";
import { image, type ImageDbInsert } from "@/db/schema";
import { eq } from "drizzle-orm";

export const imageRoute = new Hono<{ Variables: ProtectedType }>({
	strict: false,
})
	.use(authProtectedMiddleware)
	.post("/", zValidator("form", imageSchema.create), async (c) => {
		const payload = c.req.valid("form");
		const user = c.get("user");

		let isDatabaseWriten: boolean = false;
		let isFileWriten: boolean = false;

		const timestamp = new Date();
		const currentImageId = `im_${generateId(15)}`;
		const fileName = `${currentImageId}.jpg`;

		const yearString = timestamp.getFullYear().toString();
		const monthStr = timestamp.getMonth().toString();
		const dateStr = timestamp.getDate().toString();

		const url = `/api/image/file/${yearString}/${monthStr}/${dateStr}/${fileName}`;

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

		try {
			await db.insert(image).values(imageDbPayload);
			isDatabaseWriten = true;

			await Bun.write(filePath, payload.image);
			isFileWriten = true;
		} catch (error) {
			console.log(error);

			// rollback
			if (isFileWriten) {
				await Bun.file(filePath).delete();
			}

			if (isDatabaseWriten) {
				await db.delete(image).where(eq(image.id, currentImageId));
			}

			throw new HTTPException(500, { message: "internal error" });
		}

		return c.json({ id: currentImageId, url }, 201);
	});
