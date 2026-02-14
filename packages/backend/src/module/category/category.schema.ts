import { z } from "zod";

export const createCategorySchema = z.object({
	name: z.string().min(3),
});
export type CreateCategoryPayload = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
	id: z.string().min(10),
	name: z.string().min(3),
});
export type UpdateCategoryPayload = z.infer<typeof updateCategorySchema>;
