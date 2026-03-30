import { z } from "zod";
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
    productId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateCategoryPayload = z.infer<typeof createCategorySchema>;
export declare const updateCategorySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
export type UpdateCategoryPayload = z.infer<typeof updateCategorySchema>;
//# sourceMappingURL=category.schema.d.ts.map