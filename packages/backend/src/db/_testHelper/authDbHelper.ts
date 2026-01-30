import { eq } from "drizzle-orm";

import { db } from "@db/index";
import { account, session, user } from "@db/schema/auth.schema";


type CleanOption = {
  userId?: string
}

export const authTableHelper = {
  find: async (email: string) => {
    return await db.query.user.findMany({
      where: (user, { eq }) => eq(user.email, email)
    })

  },
  clean: async (option?: CleanOption) => {
    await db.delete(user).where(option?.userId ? eq(user.id, option.userId) : undefined)
    await db.delete(account).where(option?.userId ? eq(account.id, option.userId) : undefined)
    await db.delete(session).where(option?.userId ? eq(session.id, option.userId) : undefined)
  }
}