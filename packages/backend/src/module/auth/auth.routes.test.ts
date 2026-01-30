// tests/auth.test.ts
import { afterEach, describe, expect, it, test } from "bun:test";
import { app } from "@/main"
import { authTableHelper } from "@/db/_testHelper/authDbHelper";
import { categoryTbHelper } from "@/db/_testHelper/categoryDbHelper";
import type { AuthType, AuthTypeUser } from "@/lib/auth";

describe("Authentication Flow", () => {
  afterEach(async () => {
    await categoryTbHelper.clean()
    await authTableHelper.clean()
  })

  const testUser = {
    email: "test@example.com",
    password: "Password123!",
    name: "testuser",
  };

  it("should sign up a new user", async () => {
    const res = await app.request("/api/auth/sign-up/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });

    const data = await res.json() as { token: string, user: AuthTypeUser };
    const category = await categoryTbHelper.find(data.user.id)

    expect(res.status).toBe(200);
    expect(data.user.email).toBe(testUser.email);
    expect(category.length).toBe(1)
    expect(category[0]?.name).toBe("testuser's Category")


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