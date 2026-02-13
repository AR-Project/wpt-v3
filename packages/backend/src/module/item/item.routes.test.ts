import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "bun:test";

import { app } from "@/main";
import { authTableHelper } from "@/db/_testHelper/authDbHelper";
import { signUpSignInHelper } from "../auth/auth.routes.test.helper";
import { itemTbHelper } from "@/db/_testHelper/itemDbHelper";



describe("item route", () => {
  let currentUserId: string | null = "";
  let cookie: string = "";
  let defaultCategoryId: string = ""


  beforeAll(async () => {
    const testUser = {
      email: "item@test.com",
      password: "Password123!",
      name: "test-user-item",
    };

    const userData = await signUpSignInHelper(testUser, app);
    cookie = userData.cookie;
    currentUserId = userData.id;
    defaultCategoryId = userData.defaultCategoryId
  });

  afterEach(async () => {
    await itemTbHelper.clean({ userId: currentUserId })
  });

  afterAll(async () => {
    await authTableHelper.clean({ userId: currentUserId });
  });

  test("GET should fail when accessing category signed out", async () => {
    const res = await app.request("/api/item");
    expect(res.status).toBe(401);
  });

  test("GET should return default category after signin up", async () => {
    await itemTbHelper.add({
      id: "item-123",
      name: "test-item-GET",
      userIdParent: currentUserId!,
      userIdCreator: currentUserId!,
      categoryId: defaultCategoryId
    })

    const res = await app.request("/api/item", {
      method: "GET",
      headers: {
        Cookie: cookie,
      },
    });

    const resJson = (await res.json()) as {
      id: string;
      name: string;
      sortOrder: number;
    }[];
    expect(resJson.length).toBe(1)

    const [item] = resJson

    expect(item?.name).toBe("test-item-GET")
    expect(item?.id).toBe("item-123")

  });

  /** ------------------------

  test('POST should return id and persist category with correct payload ', async () => {
    const payload = {
      name: "post-category"
    }

    const categoryRes = await app.request("/api/category", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify(payload),
    });

    const resJson = (await categoryRes.json()) as {
      id: string;
      name: string;
    };

    expect(categoryRes.status).toBe(201)

    expect(resJson.id).toBeDefined()
    expect(resJson.name).toBe("post-category")

    await categoryTbHelper.clean({ categoryId: resJson.id })

  });

  test('POST should fail with incorrect payload ', async () => {
    const payload = {
      name: "a"
    }

    const categoryRes = await app.request("/api/category", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify(payload),
    });

    expect(categoryRes.status).toBe(400);

  });

  test('DELETE should fail when tried deleting nonexist category', async () => {

    const res = await app.request("/api/category", {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify({ id: "notExistIdd" }),
    });
    expect(res.status).toBe(403)
  })

  test('DELETE should fail when tried deleting default category', async () => {

    const user = await authTableHelper.findById(currentUserId!)

    const res = await app.request("/api/category", {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify({ id: user[0]?.defaultCategoryId }),
    });
    expect(res.status).toBe(403)

  })

  test('DELETE should success', async () => {
    const payload = {
      name: "delete-category"
    }

    const postRes = await app.request("/api/category", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify(payload),
    });

    const postResJson = (await postRes.json()) as {
      id: string;
      name: string;
    };

    const res = await app.request("/api/category", {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify({ id: postResJson.id }),
    });

    expect(res.status).toBe(200)

  })

   --------------------------   */

});
