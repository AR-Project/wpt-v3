import { z } from "zod";
export declare const create: z.ZodObject<{
    name: z.ZodString;
    categoryId: z.ZodOptional<z.ZodString>;
    displayQtyDivider: z.ZodOptional<z.ZodNumber>;
    displayUnitName: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateItemPayload = z.infer<typeof create>;
export declare const update: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    displayQtyDivider: z.ZodOptional<z.ZodNumber>;
    displayUnitName: z.ZodOptional<z.ZodString>;
    imageId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateItemPayload = z.infer<typeof update>;
export declare const remove: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type DeleteItemPayload = z.infer<typeof remove>;
export declare const updateSortOrderMultiple: z.ZodObject<{
    itemIdsNewOrder: z.ZodArray<z.ZodString>;
    categoryId: z.ZodString;
}, z.core.$strip>;
export type UpdateItemsSortOrderPayload = z.infer<typeof updateSortOrderMultiple>;
//# sourceMappingURL=product.schema.d.ts.map