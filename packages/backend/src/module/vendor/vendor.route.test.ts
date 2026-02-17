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

describe("vendor route", () => {
	let currentUserId: string = "";
	let cookie: string = "";

	beforeAll(async () => {
		const testUser = {
			email: "vendor@test.com",
			password: "Password123!",
			name: "vendor-test",
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
	describe("GET", () => {
		test("should prevent access without user", async () => {
			const profileRes = await app.request("/api/vendor");
			expect(profileRes.status).toBe(401);
		});

		test("should return vendor list", async () => {
			await vendorTbHelper.add({
				id: "vendor_GET",
				name: "vendor_GET",
				userIdParent: currentUserId,
				userIdCreator: currentUserId,
			});

			const res = await app.request("/api/vendor", {
				method: "GET",
				headers: {
					Cookie: cookie,
				},
			});

			const resJson = (await res.json()) as {
				id: string;
				name: string;
			}[];

			const [item] = resJson;

			expect(resJson.length).toBe(1);
			expect(item?.name).toBe("vendor_GET");

			await vendorTbHelper.clean({ vendorId: "vendor_GET" });
		});
	});

	describe("POST", () => {
		test("should persist vendor ", async () => {
			const payload = {
				name: "post-vendor",
			};

			const categoryRes = await app.request("/api/vendor", {
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
			expect(resJson.name).toBe("post-vendor");

			await vendorTbHelper.clean({ vendorId: resJson.id });
		});

		test("should reject incorrect payload ", async () => {
			const payload = { id: "bsca" };
			const categoryRes = await app.request("/api/vendor", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify(payload),
			});

			expect(categoryRes.status).toBe(400);
		});
	});

	/**

  

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
