import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { app } from "@/main";
import { categoryTbHelper } from "@/db/_testHelper/categoryDbHelper";
import { authTableHelper } from "@/db/_testHelper/authDbHelper";
import { signUpSignInHelper } from "@module/auth/auth.routes.test.helper";

describe("profile route", () => {
	let currentUserId: string | null = "";
	let currentUserCookie: string = "";

	beforeAll(async () => {
		const testUser = {
			email: "profile@test.com",
			password: "Password123!",
			name: "test-user-on-profile-route",
		};

		const data = await signUpSignInHelper(testUser, app);
		currentUserId = data.id;
		currentUserCookie = data.cookie;
		console.log("current User Id  ", currentUserId);
	});

	afterAll(async () => {
		await categoryTbHelper.clean({ userId: currentUserId });
		await authTableHelper.clean({ userId: currentUserId });
		await authTableHelper.cleanByParentId(currentUserId!);
	});

	describe("GET profile", () => {
		test.serial("should 401 without cookie", async () => {
			const profileRes = await app.request("/api/profile");
			expect(profileRes.status).toBe(401);
		});

		test.serial("should success", async () => {
			const profileRes = await app.request("/api/profile", {
				headers: {
					Cookie: currentUserCookie,
				},
			});

			const resJson = (await profileRes.json()) as { message: string };
			expect(profileRes.status).toBe(200);
			expect(resJson.message).toBeDefined();
			expect(resJson.message).toBe("Hello test-user-on-profile-route");
		});
	});
});
