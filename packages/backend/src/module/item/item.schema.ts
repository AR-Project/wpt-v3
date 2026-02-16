import { z } from "zod";

export const createItemSchema = z.object({
	name: z.string(),
	categoryId: z.string().optional(),
});
export type CreateItemPayload = z.infer<typeof createItemSchema>;

export const updateItemSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		categoryId: z.string().optional(),
		sortOrder: z.number().optional(),
	})
	.refine(
		(data) => {
			const { id, ...rest } = data;
			return Object.keys(rest).length > 0;
		},
		{
			message: "No update data provided",
		},
	);

export type UpdateItemPayload = z.infer<typeof updateItemSchema>;

export const updateItemsSortOrderSchema = z.object({
	itemIdsNewOrder: z.array(z.string()),
	categoryId: z.string(),
});

export type UpdateItemsSortOrderPayload = z.infer<
	typeof updateItemsSortOrderSchema
>;
