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

export const patch = z
	.object({
		vendorId: z.string().optional(),
		orderedAt: z.coerce.date().optional(),
		imageId: z.string().optional(),
	})
	.refine((data) => Object.keys({ ...data }).length > 0, {
		message: "At least one property required",
	});

export type PatchPayload = z.infer<typeof patch>;

export const patchSortOrder = z.object({
	newIdOrder: z.array(z.string()),
});

export type PatchSortOrderPayload = z.infer<typeof patchSortOrder>;
