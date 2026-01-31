import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { trimTrailingSlash } from 'hono/trailing-slash'

import { authRoute } from "module/auth/auth.routes";
import { profileRoute } from "./module/profile/profile.routes";

export const app = new Hono().basePath("/api/");

if (process.env.NODE_ENV !== 'test') {
  app.use("*", logger());

}
app.use(trimTrailingSlash())

app.route("/", authRoute)
app.route("/", profileRoute)

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return error.getResponse()
  }

  return c.json({ message: "Internal Error" }, 500)


})

export default {
  port: 8000,
  fetch: app.fetch,
} 