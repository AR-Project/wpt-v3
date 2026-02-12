import { afterEach, describe, expect, test } from "bun:test";
import { app } from "@/main"
import { authTableHelper } from "@/db/_testHelper/authDbHelper";
import { categoryTbHelper } from "@/db/_testHelper/categoryDbHelper";
import type { AuthUser } from "@/lib/auth";
import { signUpHelper } from "./auth.routes.test.helper";






describe("auth routes", () => {
  let currentUserId: string = ""

  afterEach(async () => {
    await categoryTbHelper.clean({ userId: currentUserId })
    await authTableHelper.clean({ userId: currentUserId })
  })

  test.serial("should sign up a new user", async () => {
    const testUser = {
      email: "signup@example.com",
      password: "Password123!",
      name: "testuser",
    };

    const res = await app.request("/api/auth/sign-up/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });

    const data = await res.json() as { token: string, user: AuthUser };
    const category = await categoryTbHelper.find(data.user.id)

    expect(res.status).toBe(200);
    expect(data.user.email).toBe(testUser.email);
    expect(category.length).toBe(1)
    expect(category[0]?.name).toBe("testuser's Category")

    currentUserId = data.user.id
  });

  test.serial("should fail with wrong credentials", async () => {
    const testUser = {
      email: "fail-sign-up@example.com",
      password: "Password123!",
      name: "testuser",
    };

    const res = await app.request("/api/auth/sign-in/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    expect(res.status).toBe(401)
  })

  test.serial("should sign in and return a session cookie", async () => {
    const testUser = {
      email: "signup-signin-cookie@example.com",
      password: "Password123!",
      name: "testuser",
    };

    const data = await signUpHelper(testUser, app)
    currentUserId = data.user.id

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

  test.serial("should fail 404 when accessing admin via public", async () => {


    const res = await app.request("/api/auth/admin/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "email@email.com",
        password: "password",
        name: "test",
        role: "user",
        data: {
          parentId: "invalid",
          defaultCategoryId: "invalid"
        }
      }),
    });

    expect(res.status).toBe(404)
  });
});