import { eq, or } from "drizzle-orm";

import { db } from "@db/index";
import { category } from "../schema/category.schema";


type CleanOption = {
  userId?: string | null
}

export const categoryTbHelper = {
  find: async (userId: string) => {
    return await db.query.category.findMany({
      where: (category, { eq, or }) =>
        or(
          eq(category.userIdCreator, userId),
          eq(category.userIdOwner, userId)
        )
    })

  },

  clean: async (option?: CleanOption) => {
    await db
      .delete(category)
      .where(option?.userId
        ? or(eq(category.userIdCreator, option.userId), eq(category.userIdOwner, option.userId))
        : undefined
      )
  }
}