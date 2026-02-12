import type { AppType } from "@wpt/backend"

import { hc } from "hono/client"

export const client = hc<AppType>("/", {
  init: {
    credentials: "include"
  },
})

