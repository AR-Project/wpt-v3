import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins";


export const authClient = createAuthClient({
  plugins: [inferAdditionalFields({
    user: {
      role: {
        type: "string",
        defaultValue: "admin",
      },
      banned: {
        type: "string",
        required: false,
        input: false
      },
      banReason: {
        type: "boolean",
        required: false,
        input: false
      },
      banExpires: {
        type: "date",
        required: false,
        input: false
      },


      // wpt-3
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
    },
    session: {
      impersonatedBy: {
        type: "string",
        required: false,
        input: false
      }
    }
  })],
})

export type User = typeof authClient.$Infer.Session.user
export type Session = typeof authClient.$Infer.Session