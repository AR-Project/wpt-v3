import { eq, or } from "drizzle-orm";
import { db } from "@db/index";
import { item, type CreateItemDbPayload } from "../schema/item.schema";


type CleanOption = {
  userId?: string | null
  itemId?: string | null
}

export const itemTbHelper = {
  add: async (payload: CreateItemDbPayload) => {
    await db.insert(item).values(payload).returning({ id: item.id, name: item.name })
  },
  find: async (userId: string) => {
    return await db.query.item.findMany({
      where: (item, { eq, or }) =>
        or(
          eq(item.userIdCreator, userId),
          eq(item.userIdParent, userId)
        )
    })
  },
  findAll: async () => await db.query.item.findMany(),
  clean: async (option?: CleanOption) => {
    const byUserFilter = option?.userId
      ? or(
        eq(item.userIdCreator, option.userId),
        eq(item.userIdParent, option.userId),
      )
      : undefined
    const byIdFilter = option?.itemId ? eq(item.id, option.itemId) : undefined

    await db
      .delete(item)
      .where(or(byUserFilter, byIdFilter)
      )
  }
}