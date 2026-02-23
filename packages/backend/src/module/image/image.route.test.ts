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

import * as imageTbHelper from "@db/_testHelper/image.tableHelper";
import { resolveFromRoot } from "@/lib/utils/file";

import { resolve } from "node:path";

describe("image route", () => {
	let currentUserId: string = "";
	let cookie: string = "";

	beforeAll(async () => {
		const testUser = {
			email: "image@test.com",
			password: "Password123!",
			name: "image-test",
		};

		const userData = await signUpSignInHelper(testUser, app);
		cookie = userData.cookie;
		currentUserId = userData.id;
	});

	afterEach(async () => {});

	afterAll(async () => {
		await imageTbHelper.clean({ userId: currentUserId });
		await authTableHelper.clean({ userId: currentUserId });
	});

	describe("POST", () => {
		test.serial("should persist image file and database record ", async () => {
			const testFilePath = resolve(
				import.meta.dir,
				"./test-assets/test-image.jpg",
			);
			const fileToUpload = Bun.file(testFilePath);

			// Check if the file actually exists before running the test
			if (!(await fileToUpload.exists())) {
				throw new Error(
					`Test file not found at ${testFilePath}. Please add a real image there!`,
				);
			}

			const realImage = new File(
				[await fileToUpload.arrayBuffer()],
				"test-image.jpg",
				{ type: "image/jpeg" },
			);

			const formData = new FormData();
			formData.append("image", realImage);

			const categoryRes = await app.request("/api/image", {
				method: "POST",
				headers: { Cookie: cookie },
				body: formData,
			});

			const resJson = (await categoryRes.json()) as {
				id: string;
				url: string; // example: "/api/image/file/00/01/22/image.jpg"
			};

			const pathOnServer = resJson.url.split("/").slice(4);
			const imageRecords = await imageTbHelper.findById(resJson.id);
			const fileOnServer = Bun.file(
				resolveFromRoot("runtime-assets", ...pathOnServer),
			);

			// assert
			expect(categoryRes.status).toBe(201);
			expect(resJson.id).toBeDefined();
			expect(resJson.url).toBeDefined();
			expect(await fileOnServer.exists()).toBe(true);
			expect(imageRecords.length).toBe(1);

			// Scoped Clean up
			await Promise.all([
				fileOnServer.delete(),
				imageTbHelper.clean({ imageId: resJson.id }),
			]);
		});
	});

	describe.skip("DELETE", () => {
		test.serial("should success", async () => {
			const res = await app.request("/api/image", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify({ id: "vendor_delete123" }),
			});

			// TODO
		});
	});
});

async function imageUploaderHelper(cookie: string, appInstance: typeof app) {
	const testFilePath = resolve(import.meta.dir, "./test-assets/test-image.jpg");
	const fileToUpload = Bun.file(testFilePath);

	// Check if the file actually exists before running the test
	if (!(await fileToUpload.exists())) {
		throw new Error(
			`Test file not found at ${testFilePath}. Please add a real image there!`,
		);
	}

	const realImage = new File(
		[await fileToUpload.arrayBuffer()],
		"test-image.jpg",
		{ type: "image/jpeg" },
	);

	const formData = new FormData();
	formData.append("image", realImage);

	const categoryRes = await appInstance.request("/api/image", {
		method: "POST",
		headers: { Cookie: cookie },
		body: formData,
	});

	const resJson = (await categoryRes.json()) as {
		id: string;
		url: string; // example: "/api/image/file/00/01/22/image.jpg"
	};

	return resJson;
}
