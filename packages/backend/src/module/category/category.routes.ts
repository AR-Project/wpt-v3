import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'

import { db } from '@/db'
import { authProtectedMiddleware, } from '@/middleware/auth.middleware'
import { sanitizeUser, type ProtectedType } from '@lib/auth'
import { category, type CreateCategoryDbPayload } from '@/db/schema/category.schema'
import { generateId } from '@/lib/idGenerator'
import { createCategorySchema } from '@/shared'
import z from 'zod'
import { eq } from 'drizzle-orm'


export const categoryRoute = new Hono<{ Variables: ProtectedType }>({
  strict: false,
})
  .use(authProtectedMiddleware)
  .get("/", async (c) => {
    const user = sanitizeUser(c.get("user"))

    try {
      const categories = await db.query.category.findMany({
        where: (category, { eq }) => eq(category.userIdOwner, user.parentId),
        columns: {
          id: true,
          name: true,
          sortOrder: true,
        },
      })
      return c.json(categories)
    } catch (_) {
      throw new HTTPException(500)
    }
  })
  .post("/",
    zValidator("json", createCategorySchema),
    async (c) => {
      const payload = c.req.valid("json")
      const user = sanitizeUser(c.get("user"))

      const dbPayload: CreateCategoryDbPayload = {
        id: `cat-${generateId(10)}`,
        name: payload.name,
        userIdOwner: user.parentId,
        userIdCreator: user.id
      }

      try {
        const [createdCategory] = await db
          .insert(category)
          .values(dbPayload)
          .returning({ id: category.id, name: category.name })
        if (!createdCategory) throw new HTTPException(500)

        return c.json(createdCategory, 201)
      } catch (e) {
        console.log(e);
        throw new HTTPException(500)
      }
    }
  )
  .delete("/",
    zValidator("json", z.object({ id: z.string().min(10) })),
    async (c) => {
      const payload = c.req.valid("json")
      // const user = sanitizeUser(c.get("user"))

      /**
       * TODO: Validate user creation
       * 1. Validate category ownership
       * 2. Prevent user deleting default category
       */

      try {

        await db
          .delete(category)
          .where(eq(category.id, payload.id))



        return c.json({}, 200)
      } catch (e) {
        console.log(e);
        throw new HTTPException(500)
      }
    }

  )
