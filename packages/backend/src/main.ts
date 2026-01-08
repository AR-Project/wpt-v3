import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { logger } from "hono/logger";
import { trimTrailingSlash } from 'hono/trailing-slash'

export const app = new Hono().basePath("/api/v1");

app.use("*", logger());
app.use(trimTrailingSlash())

app.get("/", (c) => {

  setCookie(c, 'session_token', "test-123", {
    httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
    secure: true,   // Ensures the cookie is only sent over HTTPS (recommended)
    maxAge: 60 * 60 * 24 * 7, // Cookie expiration in seconds (e.g., 1 week)
    path: '/',      // Determines the path for which the cookie is valid
    sameSite: 'Strict' // Controls when cookies are sent with cross-site requests
  });

  return c.json({
    message: "success",
    timestamp: new Date().toISOString(),
  });
});

export default {
  port: 8000,
  fetch: app.fetch,
} 