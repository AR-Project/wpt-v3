import { client } from "@/lib/hc";
import { queryOptions } from "@tanstack/react-query";

import { ServerError } from "@/lib/error/server-error";

export const vendorQueryKey = ["vendor"];

export const getVendorQueryOpt = queryOptions({
	queryKey: vendorQueryKey,
	queryFn: async () => {
		const res = await client.api.vendor.$get();
		if (res.status === 401) throw new ServerError("Unauthorized", res.status);
		return await res.json();
	},
	staleTime: 5 * 60 * 1000,
});
