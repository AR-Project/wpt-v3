import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { app } from "@/main";
import { categoryTbHelper } from "@/db/_testHelper/categoryDbHelper";
import { authTableHelper } from "@/db/_testHelper/authDbHelper";
import * as sessionTbHlpr from "@/db/_testHelper/session.tableHelper";

import type { AuthUser } from "@/lib/auth";

import {
	signInHelper,
	signUpSignInHelper,
} from "../auth/auth.routes.test.helper";
import * as profileTestHelper from "./profile.route.test.helper";
import type { SetPasswordPayload } from "./profile.schema";

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

	describe("POST child", () => {
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

	describe("DELETE child session", () => {
		test.serial("should fail with invalid child user id", async () => {
			const res = await app.request(
				`/api/profile/children/u_invalidId123/sessions`,
				{
					headers: {
						Cookie: currentUserCookie,
					},
					method: "delete",
				},
			);
			const json = (await res.json()) as { message: string };
			expect(res.status).toBe(404);
			expect(json.message).toBe("child user not found");
		});

		test.serial("should success", async () => {
			// Prepare
			const childUserPayload = {
				email: "child-user-delete-session@test.com",
				name: "child-user-session",
				password: "!password123",
			};

			const childUser = await profileTestHelper.createChildUser(
				childUserPayload,
				currentUserCookie,
				app,
			);

			await signInHelper(
				{ email: childUserPayload.email, password: childUserPayload.password },
				app,
			); // create session

			const sessionsPreAction = await sessionTbHlpr.findByUserId(
				childUser.user.id,
			);

			// action
			const res = await app.request(
				`/api/profile/children/${childUser.user.id}/sessions`,
				{
					headers: {
						Cookie: currentUserCookie,
					},
					method: "delete",
				},
			);
			await childUser.cleanUser(); // prevent any test error to abort clean up

			// assert
			const sessionsPostAction = await sessionTbHlpr.findByUserId(
				childUser.user.id,
			);

			expect(sessionsPreAction.length).toBeGreaterThan(0);
			expect(sessionsPostAction.length).toBe(0);
			expect(res.status).toBe(204);
		});
	});

	describe("PATCH child set-password", () => {
		test("should success", async () => {
			// Prepare
			const childUserPayload = {
				email: "child-user-set-password@test.com",
				name: "child-set-password",
				password: "!password123",
			};

			const childUser = await profileTestHelper.createChildUser(
				childUserPayload,
				currentUserCookie,
				app,
			);

			const payload: SetPasswordPayload = {
				newPassword: "itsNewPassword999",
			};

			const res = await app.request(
				`/api/profile/children/${childUser.user.id}/set-password`,
				{
					headers: {
						"Content-Type": "application/json",
						Cookie: currentUserCookie,
					},
					body: JSON.stringify(payload),
					method: "PATCH",
				},
			);

			const data = await signInHelper(
				{ email: childUserPayload.email, password: payload.newPassword },
				app,
			);

			await childUser.cleanUser();
			expect(res.status).toBe(200);
			expect(data.cookie).toBeDefined();
		});
	});
});
