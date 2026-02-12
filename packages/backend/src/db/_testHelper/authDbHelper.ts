import { eq } from "drizzle-orm";

import { db } from "@db/index";
import { account, session, user } from "@db/schema/auth.schema";


type CleanOption = {
  userId?: string | null
}

export const authTableHelper = {
  find: async (email: string) => {
    return await db.query.user.findMany({
      where: (user, { eq }) => eq(user.email, email)
    })
  },
  findAll: async () => await db.query.user.findMany(),
  clean: async (option?: CleanOption) => {
    await db.delete(session).where(option?.userId ? eq(session.userId, option.userId) : undefined)
    await db.delete(account).where(option?.userId ? eq(account.userId, option.userId) : undefined)
    await db.delete(user).where(option?.userId ? eq(user.id, option.userId) : undefined)
  }
}