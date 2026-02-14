import { z } from "zod";

export const createItemSchema = z.object({
	name: z.string(),
	categoryId: z.string().optional(),
});
export type CreateItemPayload = z.infer<typeof createItemSchema>;
