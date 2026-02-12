import { client } from "@/lib/hc";
import { queryOptions } from "@tanstack/react-query";

export const categoryQueryKey = ['category']

export const getCategoryQueryOpt = queryOptions({
  queryKey: categoryQueryKey,
  queryFn: async () => {
    const res = await client.api.category.$get()
    return await res.json()
  },
})