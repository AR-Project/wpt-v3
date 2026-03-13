import {
	afterAll,
	afterEach,
	beforeAll,
	describe,
	expect,
	test,
} from "bun:test";

import { app } from "@/main";
import { categoryTbHelper } from "@/db/_testHelper/categoryDbHelper";
import { authTableHelper } from "@/db/_testHelper/authDbHelper";
import { productTbHelper } from "@/db/_testHelper/product.tableHelper";
import { signUpSignInHelper } from "../auth/auth.routes.test.helper";

describe("category route", () => {
	let currentUserId: string | null = "";
	let cookie: string = "";
	let defaultCategoryId: string = "";

	beforeAll(async () => {
		const testUser = {
			email: "category@test.com",
			password: "Password123!",
			name: "test-user-category",
		};

		const userData = await signUpSignInHelper(testUser, app);
		cookie = userData.cookie;
		currentUserId = userData.id;
		defaultCategoryId = userData.defaultCategoryId;
	});

	afterEach(async () => {});

	afterAll(async () => {
		await categoryTbHelper.clean({ userId: currentUserId });
		await authTableHelper.clean({ userId: currentUserId });
	});

	describe("GET", () => {
		test.serial("should fail when accessing category signed out", async () => {
			const profileRes = await app.request("/api/category");
			expect(profileRes.status).toBe(401);
		});

		test.serial("should return default category after signin up", async () => {
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
	});

	describe("POST", () => {
		test.serial("should success and return id", async () => {
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

		test.serial("should fail when product id invalid", async () => {
			const payload = {
				name: "post-category-invalid-product",
				productId: "product_invalid_category_route_000",
			};

			const categoryRes = await app.request("/api/category", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify(payload),
			});

			const resJson = (await categoryRes.json()) as { message: string };

			expect(categoryRes.status).toBe(404);
			expect(resJson.message).toBe("Product not found");
		});

		test.serial("should success when product id is valid", async () => {
			const productId = "product_valid_category_route_000";

			await productTbHelper.add({
				id: productId,
				name: "post-category-product-valid",
				userIdParent: currentUserId!,
				userIdCreator: currentUserId!,
				categoryId: defaultCategoryId,
			});

			const payload = {
				name: "post-category-valid-product",
				productId,
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
			expect(resJson.name).toBe("post-category-valid-product");

			const [updatedProduct] = await productTbHelper.findById(productId);
			expect(updatedProduct?.categoryId).toBe(resJson.id);

			await categoryTbHelper.clean({ categoryId: resJson.id });
			await productTbHelper.clean({ productId });
		});

		test.serial("should fail with incorrect payload ", async () => {
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
	});

	describe("DELETE", () => {
		test.serial(
			"should fail when tried deleting nonexist category",
			async () => {
				const res = await app.request("/api/category", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
					body: JSON.stringify({ id: "notExistIdd" }),
				});
				expect(res.status).toBe(403);
			},
		);

		test.serial(
			"should fail when tried deleting default category",
			async () => {
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
			},
		);

		test.serial("should success", async () => {
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
	});

	describe("PATCH", () => {
		test.serial("should fail with incorrect payload", async () => {
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
		test.serial("should success", async () => {
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
	});
});
