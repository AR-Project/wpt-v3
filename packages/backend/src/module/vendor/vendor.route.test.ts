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

import * as vendorTbHelper from "@db/_testHelper/vendor.tableHelper";

describe("category route", () => {
	let currentUserId: string | null = "";
	let cookie: string = "";

	beforeAll(async () => {
		const testUser = {
			email: "category@test.com",
			password: "Password123!",
			name: "test-user-category",
		};

		const userData = await signUpSignInHelper(testUser, app);
		cookie = userData.cookie;
		currentUserId = userData.id;
	});

	afterEach(async () => {});

	afterAll(async () => {
		await vendorTbHelper.clean({ userId: currentUserId });
		await authTableHelper.clean({ userId: currentUserId });
	});

	test("GET should fail when accessing category signed out", async () => {
		const profileRes = await app.request("/api/vendor");
		expect(profileRes.status).toBe(401);
	});

	/**

  test("GET should return default category after signin up", async () => {
    const categoryRes = await app.request("/api/category", {
      method: "GET",
      headers: {
        Cookie: cookie,
      },
    });

    const resJson = (await categoryRes.json()) as {
      id: string;
      name: string;
      sortOrder: number;
    }[];
    expect(resJson.length).toBe(1);

    const [defaultCategory] = resJson;

    expect(defaultCategory?.name).toBe("test-user-category's Category");
  });

  test("POST should return id and persist category with correct payload ", async () => {
    const payload = {
      name: "post-category",
    };

    const categoryRes = await app.request("/api/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      body: JSON.stringify(payload),
    });

    const resJson = (await categoryRes.json()) as {
      id: string;
      name: string;
    };

    expect(categoryRes.status).toBe(201);

    expect(resJson.id).toBeDefined();
    expect(resJson.name).toBe("post-category");

    await categoryTbHelper.clean({ categoryId: resJson.id });
  });

  test("POST should fail with incorrect payload ", async () => {
    const payload = {
      name: "a",
    };

    const categoryRes = await app.request("/api/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      body: JSON.stringify(payload),
    });

    expect(categoryRes.status).toBe(400);
  });

  test("DELETE should fail when tried deleting nonexist category", async () => {
    const res = await app.request("/api/category", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      body: JSON.stringify({ id: "notExistIdd" }),
    });
    expect(res.status).toBe(403);
  });

  test("DELETE should fail when tried deleting default category", async () => {
    const user = await authTableHelper.findById(currentUserId!);

    const res = await app.request("/api/category", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      body: JSON.stringify({ id: user[0]?.defaultCategoryId }),
    });
    expect(res.status).toBe(403);
  });

  test("DELETE should success", async () => {
    const payload = {
      name: "delete-category",
    };

    const postRes = await app.request("/api/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      body: JSON.stringify({ id: postResJson.id }),
    });

    expect(res.status).toBe(200);
  });

  test("PATCH should fail with incorrect payload", async () => {
    const res = await app.request("/api/category", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      body: JSON.stringify({ id: "not-exist-id" }),
    });

    expect(res.status).toBe(400);
  });

  test("PATCH should success and persist data", async () => {
    const payload = {
      name: "update-category",
    };

    const postRes = await app.request("/api/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      body: JSON.stringify(payload),
    });

    const postResJson = (await postRes.json()) as {
      id: string;
      name: string;
    };

    const res = await app.request("/api/category", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      body: JSON.stringify({
        id: postResJson.id,
        name: "update-category-new-name",
      }),
    });

    expect(res.status).toBe(200);
    const category = await categoryTbHelper.findById(postResJson.id);

    expect(category.length).toBe(1);
    expect(category[0]?.name).toBe("update-category-new-name");

    await categoryTbHelper.clean({ categoryId: postResJson.id });
  });

   */
});
