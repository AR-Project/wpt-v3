import { afterEach, describe, expect, test } from "bun:test";

import { app } from "@/main";
import { categoryTbHelper } from "@/db/_testHelper/categoryDbHelper";
import { authTableHelper } from "@/db/_testHelper/authDbHelper";

import { signInHelper, signUpHelper } from "../auth/auth.routes.test";

describe("profile route", () => {
  let currentUserId: string | null = "";

  afterEach(async () => {
    await categoryTbHelper.clean({ userId: currentUserId });
    await authTableHelper.clean({ userId: currentUserId });
  });

  test("should fail when accessing profile signed out", async () => {
    const profileRes = await app.request("/api/profile");
    expect(profileRes.status).toBe(401);
  });

  test("should success when access profile when signed out", async () => {
    const testUser = {
      email: "profile@test.com",
      password: "Password123!",
      name: "test-user-profile",
    };

    const data = await signInHelper(testUser, app);
    currentUserId = data.id

    const profileRes = await app.request("/api/profile", {
      headers: {
        Cookie: data.cookie
      },
    });

    const resJson = (await profileRes.json()) as { message: string };
    expect(resJson.message).toBeDefined();
    expect(resJson.message).toBe("Hello test-user-profile");
  });
});
