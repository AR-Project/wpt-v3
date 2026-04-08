import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hc";
import { getCategoryQueryOpt } from "./queries";
import type { InferRequestType } from "hono/client";

export type CreateCategoryPayload = InferRequestType<
	typeof client.api.category.$post
>["json"];

export const useGetCategory = () => {
	return useQuery(getCategoryQueryOpt);
};

export const useCreateCategory = () => {
	const query = useQueryClient();
	return useMutation({
		mutationFn: async (payload: CreateCategoryPayload) => {
			await client.api.category.$post({ json: payload });
		},
		onSuccess: async () =>
			await query.invalidateQueries({ queryKey: getCategoryQueryOpt.queryKey }),
		onError: (error) => console.error("Error while creating category: ", error),
	});
};

export const useDeleteCategory = () => {
	const query = useQueryClient();
	return useMutation({
		mutationFn: async (payload: { id: string }) => {
			await client.api.category.$delete({ json: payload });
		},
		onSuccess: async () =>
			await query.invalidateQueries({ queryKey: getCategoryQueryOpt.queryKey }),
		onError: (error) => console.error("Error while delete: ", error),
	});
};
