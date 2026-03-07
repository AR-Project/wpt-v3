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

export type SetPasswordPayload = z.infer<typeof updateChildrenPassword>;

export const updateChild = z
	.object({
		name: z.string().optional(),
		email: z.email().optional(),
		image: z.string().optional(), // image url
		defaultCategoryId: z.string().optional(),
	})
	.refine(
		(...data) => {
			return Object.keys(data).length > 0;
		},
		{
			message: "No update data provided",
		},
	);

export type UpdateChildPayload = z.infer<typeof updateChild>;
