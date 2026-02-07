import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import { useQueryClient } from '@tanstack/react-query'
import { authQueryKey } from '@/hooks/use-auth'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const router = useRouter()

  // 1. Get the user from the Route Context (The "Backpack")
  // We use Route.useRouteContext() to access data from __root.tsx
  const { auth } = Route.useRouteContext()

  if (!auth.user || auth.isLoading) return (<>
    <div>{JSON.stringify(auth)}</div>
    <div>Loading user...</div>
  </>)

  const handleLogout = async () => {
    await authClient.signOut()
    // Clear the cache and go to login
    await queryClient.invalidateQueries({ queryKey: authQueryKey })
    await router.invalidate()
    navigate({ to: '/login' })
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome back, <strong>{auth.user.name}</strong>!</p>
      <p>Your email is: {auth.user.email}</p>

      <hr />

      <button type='button' onClick={handleLogout}>Logout</button>
    </div>
  )
}