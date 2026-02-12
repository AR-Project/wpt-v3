import { betterAuth } from "better-auth";
import { eq } from "drizzle-orm";
import { admin } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@db/index";
import type { CreateCategoryDbPayload } from "@/db/schema/category.schema";
import { user } from "@/db/schema/auth.schema";

import { createCategoryTx } from "@/module/category/category.repository";

import type { EnsureNonNullable } from "./types-helper";
import { generateId } from "./idGenerator";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "mysql", "sqlite"
  }),
  plugins: [admin({
    defaultRole: "admin"
    // TODO: define roles https://www.better-auth.com/docs/plugins/admin#custom-permissions
  })],
  trustedOrigins: [
    'http://localhost:3000',
    // ... any production URLs
  ],
  disabledPaths: [
    '/admins/*'
  ],
  user: {
    additionalFields: {
      // Copy this value into `inferAddtionalFields` on client SDK
      defaultCategoryId: {
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

      // FUTURE: Normal email sending logic for production goes here ...
    },
  },

  logger: {
    disabled: Bun.env.BETTER_AUTH_DISABLE_LOG === "true"
  },

  databaseHooks: {
    user: {
      create: {
        after: async (userFromAuth) => {
          await db.transaction(async (tx) => {
            // create user via admin api - set created user as user
            if (userFromAuth.parentId && userFromAuth.defaultCategoryId) {
              await tx
                .update(user)
                .set({
                  defaultCategoryId: userFromAuth.defaultCategoryId as string,
                  parentId: userFromAuth.parentId as string,
                })
                .where(eq(user.id, userFromAuth.id))

              return
            }

            // regular sign up via public - set created user as admin
            const DEFAULT_NAME = `${userFromAuth.name}'s Category`
            const categoryId = `cat_${generateId()}`

            const createCategoryPayload: CreateCategoryDbPayload = {
              id: categoryId,
              name: DEFAULT_NAME,
              userIdOwner: userFromAuth.id,
              userIdCreator: userFromAuth.id,
              createdAt: new Date()
            }

            const [newCategory] = await createCategoryTx(tx, createCategoryPayload)

            if (!newCategory) throw new Error("fail to create default category")

            await tx
              .update(user)
              .set({
                defaultCategoryId: newCategory.id,
                parentId: userFromAuth.id,
              })
              .where(eq(user.id, userFromAuth.id))

            return
          })
        },
      },
    }

  }
});


/** Utils for assigning parentId. Making sure that `parentId` will never be null*/
export function sanitizeUser(user: AuthUser) {
  const { parentId, defaultCategoryId, role, ...rest } = user
  return {
    ...rest,
    role: role as string,
    defaultCategoryId: defaultCategoryId as string,
    parentId: parentId ? parentId : user.id
  }
}

export type AuthUser = typeof auth.$Infer.Session.user

type NonNullableUser = EnsureNonNullable<AuthUser, "parentId" | "defaultCategoryId">

export type PublicType = {
  "user": typeof auth.$Infer.Session.user | null
  "session": typeof auth.$Infer.Session.session | null
}
export type ProtectedType = {
  "user": NonNullableUser
  "session": typeof auth.$Infer.Session.session
}

export type AuthUserType = NonNullableUser