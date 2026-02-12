import { db } from '@/db'
import { authProtectedMiddleware, } from '@/middleware/auth.middleware'
import { zValidator } from '@hono/zod-validator'
import { auth, type ProtectedType } from '@lib/auth'
import { Hono } from 'hono'
import z from 'zod'


export const profileRoute = new Hono<{ Variables: ProtectedType }>({
  strict: false,
})
  .use(authProtectedMiddleware)
  .get("/", async (c) => {
    const user = c.get("user")
    return c.json({ message: `Hello ${user.name}` })
  })
  .post("/user/:parentId/children",
    zValidator("param", z.object({
      parentId: z.string()
    })),
    zValidator("json", z.object({
      email: z.string(),
      password: z.string(),
      name: z.string()
    })),
    async (c) => {
      const { parentId } = c.req.valid("param")
      const { email, name, password } = c.req.valid("json")
      const user = c.get("user")

      if (parentId !== user.id) return c.body(null, 403)

      const payload = {
        email,
        password,
        name,
        role: "user" as const,
        data: {
          parentId: user.id,
          defaultCategoryId: user.defaultCategoryId
        }
      }

      const childUser = await auth.api.createUser({
        body: payload
      })

      const childUserData = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.id, childUser.user.id)
      })

      return c.json({ message: "user created", user: childUserData }, 201)
    }
  )

