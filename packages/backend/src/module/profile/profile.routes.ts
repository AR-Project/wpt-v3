import { authProtectedMiddleware, } from '@/middleware/auth.middleware'
import type { ProtectedType } from '@lib/auth'
import { Hono } from 'hono'


export const profileRoute = new Hono<{ Variables: ProtectedType }>({
  strict: false,
})
  .use(authProtectedMiddleware)
  .get("/", async (c) => {
    const user = c.get("user")
    return c.json({ message: `Hello ${user.name}` })
  })
