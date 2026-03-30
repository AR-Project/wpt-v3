import { z } from "zod";
export declare const create: z.ZodObject<{
    vendorId: z.ZodString;
    totalCost: z.ZodNumber;
    orderedAt: z.ZodCoercedDate<unknown>;
    imageId: z.ZodOptional<z.ZodString>;
    purchaseItems: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        quantity: z.ZodNumber;
        costPrice: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreatePurchaseOrderPayload = z.infer<typeof create>;
export declare const patch: z.ZodObject<{
    vendorId: z.ZodOptional<z.ZodString>;
    orderedAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    imageId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type PatchPayload = z.infer<typeof patch>;
export declare const patchSortOrder: z.ZodObject<{
    newIdOrder: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type PatchSortOrderPayload = z.infer<typeof patchSortOrder>;
//# sourceMappingURL=purchase-order.schema.d.ts.map