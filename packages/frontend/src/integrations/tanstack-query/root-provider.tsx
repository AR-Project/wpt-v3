import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ServerError } from '@/lib/error/server-error'

export function getContext() {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => handleGlobalError(error),
    }),
    mutationCache: new MutationCache({
      onError: (error) => handleGlobalError(error),
    }),
  })

  function handleGlobalError(error: Error) {
    if (error instanceof ServerError && (error.status === 401)) {
      console.warn("Session expired or deleted on server. Kicking user...")
      window.location.href = '/login'
      queryClient.clear() // Wipe the poisoned cache
    }
  }

  return {
    queryClient,
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
