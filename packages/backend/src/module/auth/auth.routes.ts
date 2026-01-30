import { auth, type AuthType } from '@lib/auth'
import { Hono } from 'hono'


export const authRoute = new Hono<{ Bindings: AuthType }>({
  strict: false,
})

authRoute.on(['POST', 'GET'], '/auth/*', (c) => {
  return auth.handler(c.req.raw)
})
