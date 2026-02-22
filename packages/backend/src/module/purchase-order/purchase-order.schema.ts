import { z } from "zod";

export const create = z.object({
	vendorId: z.string(),
	totalCost: z.number(),
	orderedAt: z.coerce.date(),
	imageId: z.string().optional(),
	purchaseItems: z.array(
		z.object({
			productId: z.string(),
			quantity: z.number(),
			costPrice: z.number(),
		}),
	),
});
export type CreatePurchaseOrderPayload = z.infer<typeof create>;
