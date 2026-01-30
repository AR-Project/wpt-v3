import type { CreateCategoryDbPayload } from "@/db/schema/category.schema";
import { createCategoryTx } from "@/module/category/category.repository";
import { db } from "@db/index";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { generateId } from "./idGenerator";
import { user } from "@/db/schema/auth.schema";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "mysql", "sqlite"
  }),
  user: {
    additionalFields: {
      // Copy this value into `inferAddtionalFields` on client SDK
      role: {
        type: "string",
        defaultValue: "admin",
      },
      isSignInAllowed: {
        type: "boolean",
        defaultValue: true,
      },
      defaultCategory: {
        type: "string",
        required: false,
        input: false
      },
      parentId: {
        type: "string",
        required: false,
        input: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }) => {
      // Check if we are in development to prevent accidental production leaks
      if (process.env.NODE_ENV === 'development') {
        console.log("\n⚠️  [DEV MODE] MANUAL PASSWORD RESET  ⚠️");
        console.log(`User:  ${user.email}`);
        console.log(`Token: ${token}`);
        console.log(`Link:  ${url}`);
        console.log("------------------------------------------\n");

        // return early so no email is sent
        return;
      }

      // TODO: Normal email sending logic for production goes here ...
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (userFromAuth) => {
          await db.transaction(async (tx) => {
            const DEFAULT_NAME = `${userFromAuth.name}'s Category`

            const categoryId = `cat_${generateId()}`

            const createCategoryPayload: CreateCategoryDbPayload = {
              id: categoryId,
              name: DEFAULT_NAME,
              userIdOwner: userFromAuth.id,
              userIdCreator: userFromAuth.id,
            }

            const [newCategory] = await createCategoryTx(tx, createCategoryPayload)

            await tx.update(user).set({ defaultCategoryId: newCategory?.id }).where(eq(user.id, userFromAuth.id))

          })
        },
      }
    }
  }
});

export type AuthType = {
  "user": typeof auth.$Infer.Session.user | null
  "session": typeof auth.$Infer.Session.session | null
}

export type AuthTypeUser = typeof auth.$Infer.Session.user