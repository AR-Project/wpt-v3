import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { app } from "@/main";
import { authTableHelper } from "@/db/_testHelper/authDbHelper";
import { signUpSignInHelper } from "../auth/auth.routes.test.helper";
import { productTbHelper } from "@/db/_testHelper/product.tableHelper";
import { categoryTbHelper } from "@/db/_testHelper/categoryDbHelper";
import type { CreateCategoryDbPayload } from "@/db/schema/category.schema";
import type { UpdateItemsSortOrderPayload } from "./product.schema";

type PostItemRes = {
	id: string;
	name: string;
	categoryId: string;
};

describe("item route", () => {
	let currentUserId: string | null = "";
	let cookie: string = "";
	let defaultCategoryId: string = "";

	beforeAll(async () => {
		const testUser = {
			email: "item@test.com",
			password: "Password123!",
			name: "test-user-item",
		};

		const userData = await signUpSignInHelper(testUser, app);
		cookie = userData.cookie;
		currentUserId = userData.id;
		defaultCategoryId = userData.defaultCategoryId;
	});

	afterAll(async () => {
		// just to make sure clean table after this file test
		await productTbHelper.clean({ userId: currentUserId });

		await categoryTbHelper.clean({ userId: currentUserId });
		await authTableHelper.clean({ userId: currentUserId });
	});

	describe("GET endpoint", async () => {
		const itemIdToGet = "item_getEndpoint123";

		beforeAll(async () => {
			await productTbHelper.add({
				id: itemIdToGet,
				name: "test-item-GET",
				userIdParent: currentUserId!,
				userIdCreator: currentUserId!,
				categoryId: defaultCategoryId,
			});
		});

		afterAll(async () => {
			await productTbHelper.clean({ itemId: itemIdToGet });
		});

		test.serial("should fail when accessing category signed out", async () => {
			const res = await app.request("/api/item");
			expect(res.status).toBe(401);
		});

		test.serial("should return items", async () => {
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
			expect(resJson.length).toBe(1);

			const [item] = resJson;

			expect(item?.name).toBe("test-item-GET");
			expect(item?.id).toBe(itemIdToGet);

			// cleanup
		});
	});

	describe("POST endpoint", () => {
		test.serial("should persist item under default category", async () => {
			const payload = {
				name: "post-item",
			};

			const categoryRes = await app.request("/api/item", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify(payload),
			});

			const resJson = (await categoryRes.json()) as PostItemRes;

			expect(categoryRes.status).toBe(201);

			expect(resJson.id).toBeDefined();
			expect(resJson.name).toBe("post-item");
			expect(resJson.categoryId).toBe(defaultCategoryId);

			// cleanup
			await productTbHelper.clean({ itemId: resJson.id });
		});

		test.serial("should fail when category is not exist", async () => {
			const payload = {
				name: "post-item",
				categoryId: "not-exist-category",
			};

			const categoryRes = await app.request("/api/item", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify(payload),
			});

			const resJson = (await categoryRes.json()) as { message: string };

			expect(categoryRes.status).toBe(403);
			expect(resJson.message).toBe("category not exist");
		});

		test.serial("should success with different category", async () => {
			const mockCategory: CreateCategoryDbPayload = {
				id: "cat_mock123",
				name: "post-different-category",
				userIdParent: currentUserId!,
				userIdCreator: currentUserId!,
			};

			await categoryTbHelper.add(mockCategory);

			const payload = {
				name: "post-item-with-different-category",
				categoryId: "cat_mock123",
			};

			const categoryRes = await app.request("/api/item", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify(payload),
			});

			const resJson = (await categoryRes.json()) as PostItemRes;

			expect(categoryRes.status).toBe(201);
			expect(resJson.categoryId).toBe("cat_mock123");
			expect(resJson.name).toBe("post-item-with-different-category");

			await productTbHelper.clean({ itemId: resJson.id });
			await categoryTbHelper.clean({ categoryId: mockCategory.id });
		});
	});

	describe("DELETE endpoint", () => {
		test.serial("should fail when item not exist", async () => {
			const res = await app.request("/api/item", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify({ id: "notExistIdd" }),
			});
			expect(res.status).toBe(403);
		});

		test.serial("should fail when not a creator", async () => {
			const newUser = await signUpSignInHelper(
				{
					email: "second-user@test.com",
					name: "second-user-delete-item",
					password: "password123!",
				},
				app,
			);

			await productTbHelper.add({
				categoryId: newUser.defaultCategoryId,
				id: "item_123",
				name: "new-user-item",
				userIdCreator: newUser.id,
				userIdParent: newUser.id,
			});

			const res = await app.request("/api/item", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify({ id: "item_123" }),
			});

			const json = (await res.json()) as { message: string };
			expect(res.status).toBe(403);
			expect(json.message).toBe("user not allowed");

			// cleaning up second user
			await productTbHelper.clean({ itemId: "item_123" });
			await categoryTbHelper.clean({ categoryId: newUser.defaultCategoryId });
			await authTableHelper.clean({ userId: newUser.id });
		});

		test.serial("should success", async () => {
			const itemIdToBeDeleted = "item_delete123";

			await productTbHelper.add({
				categoryId: defaultCategoryId,
				id: itemIdToBeDeleted,
				name: "new-user-item",
				userIdCreator: currentUserId!,
				userIdParent: currentUserId!,
			});

			const res = await app.request("/api/item", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify({ id: itemIdToBeDeleted }),
			});

			expect(res.status).toBe(200);

			const itemToDelete = await productTbHelper.findById(itemIdToBeDeleted);
			console.log(itemIdToBeDeleted);

			expect(itemToDelete.length).toBe(0);
		});
	});

	describe("PATCH endpoint", () => {
		test.serial("PATCH should success", async () => {
			await categoryTbHelper.add({
				id: "cat_for-item-patch123",
				name: "category for item patch",
				userIdCreator: currentUserId!,
				userIdParent: currentUserId!,
			});

			const itemIdTobeUpdate = "item_patch123";

			await productTbHelper.add({
				categoryId: defaultCategoryId,
				id: itemIdTobeUpdate,
				name: "user-item",
				userIdCreator: currentUserId!,
				userIdParent: currentUserId!,
			});

			const res = await app.request("/api/item", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify({
					id: itemIdTobeUpdate,
					name: "new-name-user-item",
					categoryId: "cat_for-item-patch123",
				}),
			});

			expect(res.status).toBe(200);

			const updatedItem = await productTbHelper.findById(itemIdTobeUpdate);
			expect(updatedItem[0]?.name).toBe("new-name-user-item");
			expect(updatedItem[0]?.categoryId).toBe("cat_for-item-patch123");

			await productTbHelper.clean({ itemId: itemIdTobeUpdate });
			await categoryTbHelper.clean({ categoryId: "cat_for-item-patch123" });
		});

		test.serial("PATCH should fail when no data is provided", async () => {
			const itemIdTobeUpdate = "item_patch-fail-123";

			await productTbHelper.add({
				categoryId: defaultCategoryId,
				id: itemIdTobeUpdate,
				name: "user-item",
				userIdCreator: currentUserId!,
				userIdParent: currentUserId!,
			});

			const res = await app.request("/api/item", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify({
					id: itemIdTobeUpdate,
				}),
			});
			expect(res.status).toBe(400);
			await productTbHelper.clean({ itemId: itemIdTobeUpdate });
		});
	});

	describe("PATCH sort-order endpoint", () => {
		test("should fail with invalid categoryID", async () => {
			const payload: UpdateItemsSortOrderPayload = {
				categoryId: "cat_invalid",
				itemIdsNewOrder: ["invalid"],
			};

			const res = await app.request("/api/item/sort-order", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify(payload),
			});
			expect(res.status).toBe(404);

			const json = (await res.json()) as { message: string };

			expect(json.message).toBe("category not found");
		});

		test("should success", async () => {
			await Promise.all([
				productTbHelper.add({
					categoryId: defaultCategoryId!,
					id: "item_order-000",
					name: "item #1",
					userIdCreator: currentUserId!,
					userIdParent: currentUserId!,
					sortOrder: 0,
				}),
				productTbHelper.add({
					categoryId: defaultCategoryId!,
					id: "item_order-001",
					name: "item #1",
					userIdCreator: currentUserId!,
					userIdParent: currentUserId!,
					sortOrder: 1,
				}),
				productTbHelper.add({
					categoryId: defaultCategoryId!,
					id: "item_order-002",
					name: "item #1",
					userIdCreator: currentUserId!,
					userIdParent: currentUserId!,
					sortOrder: 2,
				}),
			]);

			const payload: UpdateItemsSortOrderPayload = {
				categoryId: defaultCategoryId!,
				itemIdsNewOrder: ["item_order-001", "item_order-002", "item_order-000"],
			};

			const res = await app.request("/api/item/sort-order", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify(payload),
			});
			expect(res.status).toBe(200);

			const [[item001], [item000], [item002]] = await Promise.all([
				productTbHelper.findById("item_order-001"),
				productTbHelper.findById("item_order-000"),
				productTbHelper.findById("item_order-002"),
			]);

			expect(item001?.sortOrder).toBe(0);
			expect(item002?.sortOrder).toBe(1);
			expect(item000?.sortOrder).toBe(2);

			await Promise.all([
				productTbHelper.clean({ itemId: "item_order-000" }),
				productTbHelper.clean({ itemId: "item_order-001" }),
				productTbHelper.clean({ itemId: "item_order-002" }),
			]);
		});
	});
});
