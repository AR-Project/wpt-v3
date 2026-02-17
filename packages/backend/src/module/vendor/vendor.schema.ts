import { z } from "zod";

export const create = z.object({
	name: z.string(),
});
export type CreatePayload = z.infer<typeof create>;

export const update = z.object({
	id: z.string(),
	name: z.string().optional(),
});
export type UpdatePayload = z.infer<typeof update>;

export const remove = z.object({ id: z.string() });
export type RemovePayload = z.infer<typeof remove>;
