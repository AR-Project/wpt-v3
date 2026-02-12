import { client } from "@/lib/hc";
import { queryOptions } from "@tanstack/react-query";

import { ServerError } from "@/lib/error/server-error";

export const categoryQueryKey = ['category']

export const getCategoryQueryOpt = queryOptions({
  queryKey: categoryQueryKey,
  queryFn: async () => {
    const res = await client.api.category.$get()
    if (res.status === 401) throw new ServerError("Unauthorized", res.status)
    return await res.json()
  },
})