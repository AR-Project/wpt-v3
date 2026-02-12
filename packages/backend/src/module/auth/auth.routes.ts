import { auth, type PublicType } from '@lib/auth'
import { Hono } from 'hono'


export const authRoute = new Hono<{ Variables: PublicType }>({
  strict: false,
})
  .all("/admin/*", async (c) => c.json({ message: "not Found" }, 404))
  .on(['POST', 'GET'], '/*', (c) => {
    return auth.handler(c.req.raw)
  })
