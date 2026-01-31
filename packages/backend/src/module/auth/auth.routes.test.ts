// tests/auth.test.ts
import { afterEach, describe, expect, it, test } from "bun:test";
import { app } from "@/main"
import { authTableHelper } from "@/db/_testHelper/authDbHelper";
import { categoryTbHelper } from "@/db/_testHelper/categoryDbHelper";
import type { AuthUserType } from "@/lib/auth";


describe("Authentication Flow", () => {
  let currentUserId: string = ""

  afterEach(async () => {
    await categoryTbHelper.clean({ userId: currentUserId })
    await authTableHelper.clean({ userId: currentUserId })
  })

  test("should sign up a new user", async () => {
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

    const data = await res.json() as { token: string, user: AuthUserType };
    const category = await categoryTbHelper.find(data.user.id)

    expect(res.status).toBe(200);
    expect(data.user.email).toBe(testUser.email);
    expect(category.length).toBe(1)
    expect(category[0]?.name).toBe("testuser's Category")

    currentUserId = data.user.id

  });

  test("should fail with wrong credentials", async () => {

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

    console.log(res.status);
    expect(res.status).toBe(401)


  })

  test("should sign in and return a session cookie", async () => {
    // register new user

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
});


/** Helper for test suite: registering new user */

type SignUpPayload = {
  email: string;
  password: string;
  name: string;
}

type HonoApp = typeof app

export async function signUpHelper(
  user: SignUpPayload,
  appInstance: HonoApp
) {
  const signUpRes = await appInstance.request("/api/auth/sign-up/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  return await signUpRes.json() as { token: string, user: AuthUserType };


}

export async function signInHelper(user: SignUpPayload, appInstance: HonoApp): Promise<{ id: string, cookie: string }> {
  const data = await signUpHelper(user, appInstance)

  const res = await appInstance.request("/api/auth/sign-in/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user.email,
      password: user.password,
    }),
  });

  expect(res.status).toBe(200)
  const cookie = res.headers.get("set-cookie");
  if (!cookie) throw new Error("Signin in failed")

  console.log(data.user.id);


  return { id: data.user.id, cookie }

}