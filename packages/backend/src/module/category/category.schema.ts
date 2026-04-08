import { z } from "zod";

export const create = z.object({
	name: z.string().min(3),
	productId: z.string().optional(),
});
export type CreateCategoryPayload = z.infer<typeof create>;

export const update = z.object({
	id: z.string().min(10),
	name: z.string().min(3),
});
export type UpdateCategoryPayload = z.infer<typeof update>;
