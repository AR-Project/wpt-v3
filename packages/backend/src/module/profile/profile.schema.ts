import z from "zod";

export const patchChildrenPathParam = z.object({
	childId: z.string(),
});

export const createChildren = z.object({
	email: z.email(),
	password: z.string().min(10),
	name: z.string(),
});

export const updateChildrenPassword = z.object({
	newPassword: z.string().min(8),
});
