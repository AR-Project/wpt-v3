import { auth, type PublicType } from '@lib/auth'
import { Hono } from 'hono'


export const authRoute = new Hono<{ Variables: PublicType }>({
  strict: false,
})
  .on(['POST', 'GET'], '/*', (c) => {
    return auth.handler(c.req.raw)
  })
