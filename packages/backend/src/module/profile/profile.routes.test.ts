import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { app } from "@/main";
import { categoryTbHelper } from "@/db/_testHelper/categoryDbHelper";
import { authTableHelper } from "@/db/_testHelper/authDbHelper";

import type { AuthUser } from "@/lib/auth";
import { signUpSignInHelper } from "../auth/auth.routes.test.helper";

type CreateChildUserRes = {
  message: string,
  user: AuthUser
}

describe("profile route", () => {
  let currentUserId: string | null = "";
  let cookie: string = ""

  beforeAll(async () => {
    const testUser = {
      email: "profile@test.com",
      password: "Password123!",
      name: "test-user-on-profile-route",
    };

    // For all test suite, use one user to do multiple request, reduce time needed for user creation
    const data = await signUpSignInHelper(testUser, app);
    currentUserId = data.id
    cookie = data.cookie
  })

  afterAll(async () => {
    await categoryTbHelper.clean({ userId: currentUserId });
    await authTableHelper.clean({ userId: currentUserId });
  });

  test("should fail when accessing profile signed out", async () => {
    const profileRes = await app.request("/api/profile");
    expect(profileRes.status).toBe(401);
  });

  test("should success when access profile when signed out", async () => {

    const profileRes = await app.request("/api/profile", {
      headers: {
        Cookie: cookie
      },
    });

    const resJson = (await profileRes.json()) as { message: string };
    expect(profileRes.status).toBe(200)
    expect(resJson.message).toBeDefined();
    expect(resJson.message).toBe("Hello test-user-on-profile-route");
  });

  test('should fail creating child user with invalid payload', async () => {

    const createUserRes = await app.request(`/api/profile/user/hello-world/children`, {
      headers: {
        Cookie: cookie
      },
      method: "post"
    });

    expect(createUserRes.status).toBe(400)
  })
  test('should fail when userId on param and userId on cookie does not match', async () => {

    const payload = {
      email: "child-user-create@test.com",
      password: "password123!",
      name: "hello"
    }

    const createUserRes = await app.request(`/api/profile/user/notMatchnotMatchnotMatchnotMatc/children`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie
      },
      body: JSON.stringify(payload),
      method: "POST",
    });
    expect(createUserRes.status).toBe(403)
  })

  test('should success creating child user', async () => {
    const payload = {
      email: "child-user-create@test.com",
      password: "password123!",
      name: "child-user"
    }

    const createUserRes = await app.request(`/api/profile/user/${currentUserId}/children`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie
      },
      body: JSON.stringify(payload),
      method: "POST",
    });
    expect(createUserRes.status).toBe(201)
    const json = await createUserRes.json() as CreateChildUserRes

    // Clean child user
    await authTableHelper.clean({ userId: json.user.id })

  })

  // TODO: test child user for signin in
});
