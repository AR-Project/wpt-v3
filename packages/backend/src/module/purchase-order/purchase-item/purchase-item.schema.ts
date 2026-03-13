import { z } from "zod";

export const update = z.object({
	quantity: z.number(),
	costPrice: z.number(),
});
