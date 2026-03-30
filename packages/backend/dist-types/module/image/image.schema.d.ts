import { z } from "zod";
export declare const create: z.ZodObject<{
    image: z.ZodCustom<File, File>;
}, z.core.$strip>;
export type CreatePayload = z.infer<typeof create>;
export declare const remove: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type RemovePayload = z.infer<typeof remove>;
//# sourceMappingURL=image.schema.d.ts.map