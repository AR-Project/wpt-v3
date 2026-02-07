import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins";


export const authClient = createAuthClient({
  plugins: [inferAdditionalFields({
    user: {
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
  })],
})

export type User = typeof authClient.$Infer.Session.user
export type Session = typeof authClient.$Infer.Session