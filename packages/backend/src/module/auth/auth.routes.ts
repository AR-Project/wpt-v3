import { auth, type PublicType } from '@lib/auth'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'


export const authRoute = new Hono<{ Variables: PublicType }>({
  strict: false,
})
  .all("/admin/*", async (c) => { throw new HTTPException(404) })
  .on(['POST', 'GET'], '/*', (c) => {
    return auth.handler(c.req.raw)
  })
