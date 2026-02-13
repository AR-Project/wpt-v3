import { eq } from "drizzle-orm";

import { db } from "@db/index";
import { account, session, user } from "@db/schema/auth.schema";
import { category, type CreateCategoryDbPayload } from "../schema/category.schema";


type CleanOption = {
  userId?: string | null
}

export const authTableHelper = {
  add: async (payload: CreateCategoryDbPayload) => {
    return await db.insert(category).values(payload).returning({ id: category.id })
  },
  find: async (email: string) => {
    return await db.query.user.findMany({
      where: (user, { eq }) => eq(user.email, email)
    })
  },
  findById: async (id: string) => {
    return await db.query.user.findMany({
      where: (user, { eq }) => eq(user.id, id)
    })
  },
  findAll: async () => await db.query.user.findMany(),
  clean: async (option?: CleanOption) => {
    await db.delete(session).where(option?.userId ? eq(session.userId, option.userId) : undefined)
    await db.delete(account).where(option?.userId ? eq(account.userId, option.userId) : undefined)
    await db.delete(user).where(option?.userId ? eq(user.id, option.userId) : undefined)
  }
}