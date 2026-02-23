import { eq, or } from "drizzle-orm";

import { db } from "@db/index";
import { image, type ImageDbInsert } from "../schema";

type CleanOption = {
	userId?: string | null;
	imageId?: string | null;
};

export async function add(payload: ImageDbInsert) {
	return await db
		.insert(image)
		.values(payload)
		.returning({ id: image.id, url: image.url });
}

export async function findByUserId(userId: string) {
	return await db.query.image.findMany({
		where: (image, { eq, or }) =>
			or(eq(image.userIdCreator, userId), eq(image.userIdParent, userId)),
	});
}

export async function findById(imageId: string) {
	return await db.query.image.findMany({
		where: (image, { eq }) => eq(image.id, imageId),
	});
}

export async function getAll() {
	return await db.query.image.findMany();
}

export async function clean(option?: CleanOption) {
	const byUser = option?.userId
		? or(
				eq(image.userIdCreator, option.userId),
				eq(image.userIdParent, option.userId),
			)
		: undefined;
	const byCategory = option?.imageId ? eq(image.id, option.imageId) : undefined;

	await db.delete(image).where(or(byUser, byCategory));
}
