import { eq } from "drizzle-orm";

import { db } from "@db/index";
import { user } from "@db/schema/auth.schema";


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
    await db.delete(user).where(option?.userId ? eq(user.id, option.userId) : undefined
    )
  }
}