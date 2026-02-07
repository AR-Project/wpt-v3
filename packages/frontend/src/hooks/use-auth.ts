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
    staleTime: 0,
    retry: false,
  })

  return query
}