import z from "zod";
export declare const patchChildrenPathParam: z.ZodObject<{
    childId: z.ZodString;
}, z.core.$strip>;
export declare const createChildren: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
export declare const updateChildrenPassword: z.ZodObject<{
    newPassword: z.ZodString;
}, z.core.$strip>;
export type SetPasswordPayload = z.infer<typeof updateChildrenPassword>;
export declare const updateChild: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodEmail>;
    image: z.ZodOptional<z.ZodString>;
    defaultCategoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateChildPayload = z.infer<typeof updateChild>;
//# sourceMappingURL=children.schema.d.ts.map