import { createFileRoute, useNavigate, Link, redirect } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import { useState } from 'react'

export const Route = createFileRoute('/register')({
  beforeLoad: async ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },

  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  // 1. Setup the Mutation
  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ email, password, name }: { email: string, password: string, name: string }) => {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      })
      if (error) throw error
      return data
    },
    onSuccess: async () => {
      // 2. Redirect to login on success
      navigate({ to: '/login' })
    },
  })

  return (
    <div>
      <h2>Create Account</h2>
      {/* 3. Show Error if it happens */}
      {error && <p style={{ color: 'red' }}>{error.message}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          mutate({ email, password, name }) // Trigger the mutation
        }}
      >
        <div>
          <label htmlFor='name'>Name: </label>
          <input name="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor='email'>Email: </label>
          <input name='email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor='password'>Password: </label>
          <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type="submit" disabled={isPending}>
          {isPending ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  )
}