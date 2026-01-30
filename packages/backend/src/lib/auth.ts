import { db } from "@db/index";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

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
});

export type AuthType = {
  "user": typeof auth.$Infer.Session.user | null
  "session": typeof auth.$Infer.Session.session | null
}