import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { app } from "@/main";
import { authTableHelper } from "@/db/_testHelper/authDbHelper";
import { signUpSignInHelper } from "../auth/auth.routes.test.helper";
import { itemTbHelper } from "@/db/_testHelper/itemDbHelper";
import { categoryTbHelper } from "@/db/_testHelper/categoryDbHelper";
import type { CreateCategoryDbPayload } from "@/db/schema/category.schema";

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
		await itemTbHelper.clean({ userId: currentUserId });

		await categoryTbHelper.clean({ userId: currentUserId });
		await authTableHelper.clean({ userId: currentUserId });
	});

	test.serial(
		"GET should fail when accessing category signed out",
		async () => {
			const res = await app.request("/api/item");
			expect(res.status).toBe(401);
		},
	);

	test.serial("GET should return items", async () => {
		const itemIdToGet = "item_getEndpoint123";

		await itemTbHelper.add({
			id: itemIdToGet,
			name: "test-item-GET",
			userIdParent: currentUserId!,
			userIdCreator: currentUserId!,
			categoryId: defaultCategoryId,
		});

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
		await itemTbHelper.clean({ itemId: itemIdToGet });
	});

	test.serial(
		"POST should return persist item with default category",
		async () => {
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
			await itemTbHelper.clean({ itemId: resJson.id });
		},
	);

	test.serial("POST should fail when category is not exist", async () => {
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

	test.serial("POST should success with different category", async () => {
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

		await itemTbHelper.clean({ itemId: resJson.id });
		await categoryTbHelper.clean({ categoryId: mockCategory.id });
	});

	test.serial(
		"DELETE should fail when tried deleting nonexist category",
		async () => {
			const res = await app.request("/api/item", {
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

	test.serial("DELETE should fail when not a creator", async () => {
		const newUser = await signUpSignInHelper(
			{
				email: "second-user@test.com",
				name: "second-user-delete-item",
				password: "password123!",
			},
			app,
		);

		await itemTbHelper.add({
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
		await itemTbHelper.clean({ itemId: "item_123" });
		await categoryTbHelper.clean({ categoryId: newUser.defaultCategoryId });
		await authTableHelper.clean({ userId: newUser.id });
	});

	test.serial("DELETE should success", async () => {
		const itemIdToBeDeleted = "item_delete123";

		await itemTbHelper.add({
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

		const itemToDelete = await itemTbHelper.findById(itemIdToBeDeleted);
		console.log(itemIdToBeDeleted);

		expect(itemToDelete.length).toBe(0);
	});

	test.serial("PATCH should success", async () => {
		await categoryTbHelper.add({
			id: "cat_for-item-patch123",
			name: "category for item patch",
			userIdCreator: currentUserId!,
			userIdParent: currentUserId!,
		});

		const itemIdTobeUpdate = "item_patch123";

		await itemTbHelper.add({
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

		const updatedItem = await itemTbHelper.findById(itemIdTobeUpdate);
		expect(updatedItem[0]?.name).toBe("new-name-user-item");
		expect(updatedItem[0]?.categoryId).toBe("cat_for-item-patch123");

		await itemTbHelper.clean({ itemId: itemIdTobeUpdate });
		await categoryTbHelper.clean({ categoryId: "cat_for-item-patch123" });
	});

	test.serial("PATCH should fail when no data is provided", async () => {
		const itemIdTobeUpdate = "item_patch-fail-123";

		await itemTbHelper.add({
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
		await itemTbHelper.clean({ itemId: itemIdTobeUpdate });
	});
});
