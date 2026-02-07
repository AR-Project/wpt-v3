import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { trimTrailingSlash } from 'hono/trailing-slash'

import { authRoute } from "module/auth/auth.routes";
import { profileRoute } from "./module/profile/profile.routes";
import { categoryRoute } from "./module/category/category.routes";

// if (process.env.NODE_ENV !== 'test') {
//   app.use("*", logger());
// }
export const app = new Hono().basePath("/api")
  .use(trimTrailingSlash())
  .route("/auth", authRoute)
  .route("/profile", profileRoute)
  .route("/category", categoryRoute)
  .get("/hello", async (c) => c.json({ message: "hello from api" }))
  .onError((error, c) => {
    if (error instanceof HTTPException) {
      return error.getResponse()
    }

    return c.json({ message: "Internal Error" }, 500)


  })

export type AppType = typeof app

export default {
  port: 8000,
  fetch: app.fetch,
} 