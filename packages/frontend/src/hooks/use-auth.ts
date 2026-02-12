import { useQuery } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"

export const authQueryKey = ["authUser"]

export async function getSession() {
  const { data, error } = await authClient.getSession()
  if (error) throw error
  return data
}

export const useAuth = () => {
  const query = useQuery({
    queryKey: authQueryKey,
    queryFn: getSession,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false
  })

  return query
}