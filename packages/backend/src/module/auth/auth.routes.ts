import { auth, type PublicType } from '@lib/auth'
import { Hono } from 'hono'


export const authRoute = new Hono<{ Variables: PublicType }>({
  strict: false,
})

authRoute.on(['POST', 'GET'], '/auth/*', (c) => {
  return auth.handler(c.req.raw)
})
