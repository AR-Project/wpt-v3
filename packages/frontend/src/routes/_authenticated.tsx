import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({

  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
      })
    }

  },
  component: Component,
})

function Component() {
  return <Outlet /> // Renders the child route (like /dashboard or /profile)
}