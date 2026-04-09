import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType } from "hono/client";

import { getVendorQueryOpt } from "./queries";
import { client } from "@/lib/hc";

export type CreateVendorPayload = InferRequestType<
	typeof client.api.vendor.$post
>["json"];
export type DeleteVendorPayload = InferRequestType<
	typeof client.api.vendor.$delete
>["json"];
export type UpdateVendorPayload = InferRequestType<
	typeof client.api.vendor.$patch
>["json"];

export function useGetVendor() {
	return useQuery(getVendorQueryOpt);
}

export function useCreateVendor() {
	const query = useQueryClient();
	return useMutation({
		mutationFn: async (payload: CreateVendorPayload) => {
			await client.api.vendor.$post({ json: payload });
		},
		onSuccess: async () =>
			await query.invalidateQueries({ queryKey: getVendorQueryOpt.queryKey }),
		onError: (err) => console.log("Error creating vendor", err),
	});
}

export function useDeleteVendor() {
	const query = useQueryClient();
	return useMutation({
		mutationFn: async (payload: DeleteVendorPayload) => {
			await client.api.vendor.$delete({ json: payload });
		},
		onSuccess: async () =>
			await query.invalidateQueries({ queryKey: getVendorQueryOpt.queryKey }),
		onError: (err) => console.log("Error creating vendor", err),
	});
}

export function useUpdateVendor() {
	const query = useQueryClient();
	return useMutation({
		mutationFn: async (payload: UpdateVendorPayload) => {
			await client.api.vendor.$patch({ json: payload });
		},
		onSuccess: async () =>
			await query.invalidateQueries({ queryKey: getVendorQueryOpt.queryKey }),
		onError: (err) => console.log("Error creating vendor", err),
	});
}
