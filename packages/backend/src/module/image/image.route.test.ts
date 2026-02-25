import {
	afterAll,
	afterEach,
	beforeAll,
	describe,
	expect,
	test,
} from "bun:test";
import { resolve } from "node:path";

import { app } from "@/main";
import type { ImageDBRecord } from "@/db/schema";
import { authTableHelper } from "@/db/_testHelper/authDbHelper";
import * as imageTbHelper from "@db/_testHelper/image.tableHelper";
import { resolveFromRoot } from "@/lib/utils/file";

import { signUpSignInHelper } from "../auth/auth.routes.test.helper";
import { IMAGE_SERVER_PATH_PREFIX } from "./image.route";

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
				resolveFromRoot(IMAGE_SERVER_PATH_PREFIX, ...pathOnServer),
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

		test.serial("should fail when image is not a jpeg file ", async () => {
			const testFilePath = resolve(
				import.meta.dir,
				"./test-assets/invalid-file.jpg",
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
				"invalid.jpg",
				{ type: "image/jpeg" },
			);

			const formData = new FormData();
			formData.append("image", realImage);

			const categoryRes = await app.request("/api/image", {
				method: "POST",
				headers: { Cookie: cookie },
				body: formData,
			});

			expect(categoryRes.status).toBe(400);
		});
	});

	describe.serial("GET", () => {
		let currentImageId: string = "";
		let currentImageUrl: string = "";

		beforeAll(async () => {
			const imageMetadata = await imageUploaderHelper(cookie, app);
			currentImageId = imageMetadata.id;
			currentImageUrl = imageMetadata.url;
		});

		afterAll(async () => {
			const pathOnServer = currentImageUrl.split("/").slice(4);
			const fileOnServer = Bun.file(
				resolveFromRoot(IMAGE_SERVER_PATH_PREFIX, ...pathOnServer),
			);
			await Promise.all([
				fileOnServer.delete(),
				imageTbHelper.clean({ imageId: currentImageId }),
			]);
		});

		test.concurrent("should success getting file with direct Image URL", async () => {
			// action
			const res = await app.request(currentImageUrl, {
				method: "GET",
			});

			expect(res.status).toBe(200);

			const contentType = res.headers.get("Content-Type");
			expect(contentType).toBe("image/jpeg");

			// 4. Verify the body is a valid Blob/Image
			const blob = await res.blob();
			expect(blob.size).toBeGreaterThan(0);
			expect(blob.type).toBe("image/jpeg");
		});
		test.concurrent("should success geting user images metadata", async () => {
			const res = await app.request("/api/image", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
			});
			const resJson = (await res.json()) as ImageDBRecord[];
			expect(res.status).toBe(200);
			expect(resJson.length).toBe(1);
			expect(resJson[0]?.id).toBe(currentImageId);
			expect(resJson[0]?.url).toBe(currentImageUrl);
		});

		test.concurrent("should success geting image metadata", async () => {
			const res = await app.request(`/api/image/${currentImageId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
			});
			const resJson = (await res.json()) as ImageDBRecord;
			expect(res.status).toBe(200);
			expect(resJson.id).toBe(currentImageId);
			expect(resJson.url).toBe(currentImageUrl);
		});

		test.concurrent("should fail with invalid id", async () => {
			const res = await app.request(`/api/image/im_invalidId`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
			});
			const resJson = (await res.json()) as { message: string };
			expect(res.status).toBe(404);
			expect(resJson.message).toBe("image not found");
		});
	});

	describe("DELETE", () => {
		test.serial("should success", async () => {
			const imageMetadata = await imageUploaderHelper(cookie, app);

			const res = await app.request("/api/image", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify({ id: imageMetadata.id }),
			});

			expect(res.status).toBe(200);
		});
	});
});

export async function imageUploaderHelper(
	cookie: string,
	appInstance: typeof app,
) {
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
