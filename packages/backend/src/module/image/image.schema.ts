import { z } from "zod";

export const create = z.object({
	image: z
		.instanceof(File)
		.refine(
			(file) => file.size <= 5 * 1024 * 1024,
			"File size must be less than 5MB",
		)
		.refine(
			(file) => file.type.startsWith("image/"),
			"File must be a valid image format",
		)
		.refine(async (file) => {
			const header = await file.bytes();
			return header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
		}, "File must be a valid jpeg format"),
});
export type CreatePayload = z.infer<typeof create>;

export const remove = z.object({ id: z.string() });
export type RemovePayload = z.infer<typeof remove>;
