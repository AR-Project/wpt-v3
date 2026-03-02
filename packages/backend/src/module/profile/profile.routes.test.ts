import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { app } from "@/main";
import { categoryTbHelper } from "@/db/_testHelper/categoryDbHelper";
import { authTableHelper } from "@/db/_testHelper/authDbHelper";

import type { AuthUser } from "@/lib/auth";
import {
	signInHelper,
	signUpSignInHelper,
} from "../auth/auth.routes.test.helper";

type CreateChildUserRes = {
	message: string;
	user: AuthUser;
};

describe("profile route", () => {
	let currentUserId: string | null = "";
	let currentUserCookie: string = "";

	beforeAll(async () => {
		const testUser = {
			email: "profile@test.com",
			password: "Password123!",
			name: "test-user-on-profile-route",
		};

		// For all test suite, use one user to do multiple request, reduce time needed for user creation
		const data = await signUpSignInHelper(testUser, app);
		currentUserId = data.id;
		currentUserCookie = data.cookie;
		console.log("current User Id  ", currentUserId);
	});

	afterAll(async () => {
		await categoryTbHelper.clean({ userId: currentUserId });
		await authTableHelper.clean({ userId: currentUserId });
	});

	describe("GET", () => {
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

	describe("POST create child", () => {
		test.serial("should fail with invalid payload", async () => {
			const res = await app.request(`/api/profile/children`, {
				headers: {
					Cookie: currentUserCookie,
				},
				method: "post",
			});

			expect(res.status).toBe(400);
		});

		test.serial("should success", async () => {
			const payload = {
				email: "child-user-create@test.com",
				password: "password123!",
				name: "child-user",
			};

			const createUserRes = await app.request(`/api/profile/children`, {
				headers: {
					"Content-Type": "application/json",
					Cookie: currentUserCookie,
				},
				body: JSON.stringify(payload),
				method: "POST",
			});
			const json = (await createUserRes.json()) as CreateChildUserRes;

			await authTableHelper.clean({ userId: json.user.id });

			expect(createUserRes.status).toBe(201);
		});

		test.serial("should success signin", async () => {
			const payload = {
				email: "child-user-login@test.com",
				password: "password123!",
				name: "child-user",
			};

			const res = await app.request(`/api/profile/children`, {
				headers: {
					"Content-Type": "application/json",
					Cookie: currentUserCookie,
				},
				body: JSON.stringify(payload),
				method: "POST",
			});
			const json = (await res.json()) as CreateChildUserRes;

			const { cookie: signInCookie } = await signInHelper(
				{ email: payload.email, password: payload.password },
				app,
			);

			await authTableHelper.clean({ userId: json.user.id });

			expect(res.status).toBe(201);
			expect(signInCookie).toBeDefined();
		});
	});
});
