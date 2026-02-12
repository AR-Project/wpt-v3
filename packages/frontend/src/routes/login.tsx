import { useState } from 'react'
import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { authClient } from '@/lib/auth-client'
import { authQueryKey } from '@/hooks/use-auth'

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  component: LoginPage,
})


function LoginPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ email, password }: { email: string, password: string }) => {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      })
      if (error) throw error
      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authQueryKey })
      navigate({ to: "/dashboard" })
    },
    onError: (err) => {
      console.error("Login Failed:", err)
    }
  })

  return (
    <div>
      <div className='flex flex-row gap-2'>
        <Link className='hover:underline' to="/dashboard">Dashboard</Link>
        <Link className='hover:underline' to="/register">Register</Link>

      </div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          mutate({ email, password })
        }}
      >
        <div>
          <label htmlFor='email'>Email: </label>
          <input name='email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor='password'>Password: </label>
          <input name='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button type="submit" disabled={isPending}>
          {isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}