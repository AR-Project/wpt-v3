import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono().basePath("/api/v1");

app.use("*", logger());

app.get("/", (c) => {
  return c.json({
    message: "Hello from Hono running on Deno!",
    timestamp: new Date().toISOString(),
  });
});

export default {
  port: 8000,
  fetch: app.fetch,
} 