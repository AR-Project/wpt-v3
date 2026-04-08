import { z } from "zod";
export declare const create: z.ZodObject<{
    name: z.ZodString;
    productId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateCategoryPayload = z.infer<typeof create>;
export declare const update: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
export type UpdateCategoryPayload = z.infer<typeof update>;
//# sourceMappingURL=category.schema.d.ts.map