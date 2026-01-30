// tests/auth.test.ts
import { afterEach, describe, expect, it, test } from "bun:test";
import { app } from "@/main"
import { authTableHelper } from "@/db/_testHelper/authDbHelper";
import type { AuthType } from "@/lib/auth";

describe("Authentication Flow", () => {
  afterEach(async () => {
    await authTableHelper.clean()
  })

  const testUser = {
    email: "test@example.com",
    password: "Password123!",
    name: "Test User",
  };

  it("should sign up a new user", async () => {
    const res = await app.request("/api/auth/sign-up/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    // @ts-expect-error 
    expect(data.user.email).toBe(testUser.email);
  });

  test("should fail with wrong credentials", async () => {

    const res = await app.request("/api/auth/sign-in/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    console.log(res.status);
    expect(res.status).toBe(401)


  })

  it("should sign in and return a session cookie", async () => {
    // register new user
    await app.request("/api/auth/sign-up/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });

    const res = await app.request("/api/auth/sign-in/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    expect(res.status).toBe(200)


    const cookie = res.headers.get("set-cookie");
    expect(cookie).toContain("better-auth.session_token");
  });
});