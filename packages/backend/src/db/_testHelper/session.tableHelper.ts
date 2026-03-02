import { db } from "..";

export const findByUserId = async (userId: string) =>
	await db.query.session.findMany({
		where: (session, { eq }) => eq(session.userId, userId),
	});
