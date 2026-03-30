import { z } from "zod";
export declare const create: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export type CreatePayload = z.infer<typeof create>;
export declare const update: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
export type UpdatePayload = z.infer<typeof update>;
export declare const remove: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type RemovePayload = z.infer<typeof remove>;
//# sourceMappingURL=vendor.schema.d.ts.map