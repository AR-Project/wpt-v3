import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'

import { db } from "@/db";
import { authProtectedMiddleware } from "@/middleware/auth.middleware";
import type { ProtectedType } from "@lib/auth"

import { generateId } from "@/lib/idGenerator"
import { createItemSchema } from "@/shared"
import { item, type CreateItemDbPayload } from '@/db/schema/item.schema';


export const itemRoute = new Hono<{ Variables: ProtectedType }>({
  strict: false,
})
  .use(authProtectedMiddleware)
  .get("/", async (c) => {
    const user = c.get("user")

    const items = await db.query.item.findMany({
      where: (item, { eq }) => eq(item.userIdParent, user.parentId),
      columns: {
        id: true,
        name: true,
        sortOrder: true,
      },
    })
    return c.json(items)
  })
  .post("/", zValidator("json", createItemSchema), async (c) => {
    const payload = c.req.valid("json")
    const user = c.get("user")

    const dbPayload: CreateItemDbPayload = {
      id: `cat_${generateId(10)}`,
      name: payload.name,
      categoryId: payload.categoryId ? payload.categoryId : user.defaultCategoryId,
      userIdParent: user.parentId,
      userIdCreator: user.id,
    }

    const [createdItem] = await db
      .insert(item)
      .values(dbPayload)
      .returning({ id: item.id, name: item.name })

    return c.json(createdItem, 201)
  })
