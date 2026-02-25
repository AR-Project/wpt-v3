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
import {
	signUpHelper,
	signUpSignInHelper,
} from "../auth/auth.routes.test.helper";

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
		test.serial("should prevent access without user", async () => {
			const profileRes = await app.request("/api/vendor");
			expect(profileRes.status).toBe(401);
		});

		test.serial("should return vendor list", async () => {
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
		test.serial("should persist vendor ", async () => {
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

		test.serial("should reject incorrect payload ", async () => {
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

	describe("DELETE", () => {
		test.serial("should success", async () => {
			await vendorTbHelper.add({
				id: "vendor_delete123",
				name: "vendor_delete123",
				userIdParent: currentUserId,
				userIdCreator: currentUserId,
			});

			const res = await app.request("/api/vendor", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify({ id: "vendor_delete123" }),
			});

			expect(res.status).toBe(200);

			const vendor = await vendorTbHelper.findById("vendor_delete123");
			expect(vendor.length).toBe(0);

			await vendorTbHelper.clean({ vendorId: "vendor_delete123" });
		});

		test.serial("should reject nonexist category", async () => {
			const res = await app.request("/api/vendor", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify({ id: "notExistIdd" }),
			});
			expect(res.status).toBe(404);
		});

		test.serial("should reject other user's vendorId", async () => {
			const mockUser = await signUpHelper(
				{
					email: "delete-mock-user@test.com",
					name: "delete-mock-user",
					password: "password123!",
				},
				app,
			);

			await vendorTbHelper.add({
				id: "vendor_mock-user-delete",
				name: "vendor_mock-user-delete",
				userIdParent: mockUser.user.id,
				userIdCreator: mockUser.user.id,
			});

			const res = await app.request("/api/vendor", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify({ id: "vendor_mock-user-delete" }),
			});

			const json = (await res.json()) as { message: string };

			expect(res.status).toBe(403);
			expect(json.message).toBe("user not allowed");

			await vendorTbHelper.clean({ vendorId: "vendor_mock-user-delete" });
			await authTableHelper.clean({ userId: mockUser.user.id });
		});
	});

	describe("PATCH", () => {
		test.serial("should success and persist data", async () => {
			const createPayload = {
				name: "update-vendor",
			};

			const createRes = await app.request("/api/vendor", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify(createPayload),
			});

			const createResJson = (await createRes.json()) as {
				id: string;
				name: string;
			};

			const res = await app.request("/api/vendor", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify({
					id: createResJson.id,
					name: "update-vendor-new-name",
				}),
			});

			expect(res.status).toBe(200);
			const category = await vendorTbHelper.findById(createResJson.id);

			expect(category.length).toBe(1);
			expect(category[0]?.name).toBe("update-vendor-new-name");

			await vendorTbHelper.clean({ vendorId: createResJson.id });
		});

		test.serial("should fail with incorrect payload", async () => {
			const res = await app.request("/api/vendor", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify({ id: "not-exist-id" }),
			});

			expect(res.status).toBe(400);
		});
	});
});
