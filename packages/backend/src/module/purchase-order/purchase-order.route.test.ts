import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { app } from "@/main";
import { authTableHelper } from "@/db/_testHelper/authDbHelper";
import { signUpSignInHelper } from "../auth/auth.routes.test.helper";
import { productTbHelper } from "@/db/_testHelper/product.tableHelper";
import { categoryTbHelper } from "@/db/_testHelper/categoryDbHelper";
import type {
	CreatePurchaseOrderPayload,
	PatchPayload,
	PatchSortOrderPayload,
} from "./purchase-order.schema";
import * as purchaseItemTbHelper from "@db/_testHelper/purchaseItem.tableHelper";
import * as purchaseOrderTbHelper from "@db/_testHelper/purchaseOrder.tableHelper";
import * as vendorTbHelper from "@db/_testHelper/vendor.tableHelper";

describe("purchase-order route", () => {
	let currentUserId: string | null = "";
	let cookie: string = "";
	let defaultCategoryId: string = "";
	const productIds = ["po_product_1", "po_product_2", "po_product_3"];

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

		await Promise.all([
			...productIds.map((id, index) =>
				productTbHelper.add({
					id,
					name: `po-product-${index + 1}`,
					userIdParent: currentUserId!,
					userIdCreator: currentUserId!,
					categoryId: defaultCategoryId,
					sortOrder: index,
				}),
			),

			vendorTbHelper.add({
				id: "vendor_po_test",
				name: "vendor_po_test",
				userIdParent: currentUserId!,
				userIdCreator: currentUserId!,
			}),
		]);
	});

	afterAll(async () => {
		await purchaseItemTbHelper.clean({ userId: currentUserId });
		await purchaseOrderTbHelper.clean({ userId: currentUserId });
		await vendorTbHelper.clean({ userId: currentUserId });

		await productTbHelper.clean({ userId: currentUserId });
		await categoryTbHelper.clean({ userId: currentUserId });
		await authTableHelper.clean({ userId: currentUserId });
	});

	const mockPurchaseOrder: CreatePurchaseOrderPayload = {
		vendorId: "vendor_po_test",
		totalCost: 70000,
		orderedAt: new Date(2026, 0, 1, 10, 10),
		purchaseItems: [
			{
				productId: "po_product_1",
				quantity: 4,
				costPrice: 5000,
			},
			{
				productId: "po_product_2",
				quantity: 2,
				costPrice: 15000,
			},
			{
				productId: "po_product_3",
				quantity: 2,
				costPrice: 10000,
			},
		],
	};

	describe("POST endpoint", () => {
		test.serial("should success", async () => {
			// prepare
			const payload: CreatePurchaseOrderPayload = {
				vendorId: "vendor_po_test",
				totalCost: 50000,
				orderedAt: new Date(2026, 0, 1, 10, 10),
				purchaseItems: [
					{
						productId: "po_product_1",
						quantity: 4,
						costPrice: 5000,
					},
					{
						productId: "po_product_2",
						quantity: 2,
						costPrice: 15000,
					},
				],
			};

			// action
			const res = await app.request("/api/purchase-order", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify(payload),
			});
			const json = (await res.json()) as { message: string; data: string };
			const createdPO = await purchaseOrderTbHelper.findById(json.data, {
				withItems: true,
			});

			// scoped clean up
			await purchaseOrderTbHelper.clean({ purchaseOrderId: json.data });

			// assert
			expect(res.status).toBe(201);
			expect(createdPO.length).toBe(1);
			expect(createdPO[0]?.purchaseItem.length).toBe(2);
		});
		test.serial("should fail when vendor is invalid", async () => {
			// prepare
			const payload: CreatePurchaseOrderPayload = {
				vendorId: "vendor_invalid",
				totalCost: 50000,
				orderedAt: new Date(2026, 0, 1, 10, 10),
				purchaseItems: [
					{
						productId: "po_product_1",
						quantity: 4,
						costPrice: 5000,
					},
					{
						productId: "po_product_2",
						quantity: 2,
						costPrice: 15000,
					},
				],
			};

			// action
			const res = await app.request("/api/purchase-order", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify(payload),
			});
			const json = (await res.json()) as { message: string };

			// assert
			expect(res.status).toBe(400);
			expect(json.message).toBe("vendor ID invalid");
		});

		test.serial("should fail when some product is invalid", async () => {
			// prepare
			const payload: CreatePurchaseOrderPayload = {
				vendorId: "vendor_po_test",
				totalCost: 50000,
				orderedAt: new Date(2026, 0, 1, 10, 10),
				purchaseItems: [
					{
						productId: "po_product_1_invalid",
						quantity: 4,
						costPrice: 5000,
					},
					{
						productId: "po_product_2",
						quantity: 2,
						costPrice: 15000,
					},
				],
			};

			// action
			const res = await app.request("/api/purchase-order", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify(payload),
			});
			const json = (await res.json()) as { message: string };

			// assert
			expect(res.status).toBe(400);
			expect(json.message).toBe("(some) product(s) ID invalid");
		});
	});

	describe("purchase-order PATCH ", () => {
		test.serial("should success updating information", async () => {
			// Mock Second vendor
			await vendorTbHelper.add({
				id: "vendor_po_patch",
				name: "vendor po patch",
				userIdCreator: currentUserId!,
				userIdParent: currentUserId!,
			});

			const res = await app.request("/api/purchase-order", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify(mockPurchaseOrder),
			});
			const createdResJson = (await res.json()) as {
				message: string;
				data: string;
			};
			const createdPO = await purchaseOrderTbHelper.findById(
				createdResJson.data,
				{ withItems: true },
			);

			const patchPayload: PatchPayload = {
				vendorId: "vendor_po_patch",
			};

			const patchRes = await app.request(
				`/api/purchase-order/${createdResJson.data}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
					body: JSON.stringify(patchPayload),
				},
			);

			const patchedPo = await purchaseOrderTbHelper.findById(
				createdResJson.data,
				{ withItems: true },
			);

			// scoped clean up
			await purchaseOrderTbHelper.clean({
				purchaseOrderId: createdResJson.data,
			});
			await vendorTbHelper.clean({ vendorId: "vendor_po_patch" });

			// assert
			expect(res.status).toBe(201);
			expect(patchRes.status).toBe(200);
			expect(createdPO[0]?.vendorId).toBe("vendor_po_test");
			expect(patchedPo[0]?.vendorId).toBe("vendor_po_patch");
		});
	});

	describe("purchase-order PATCH sort-order", () => {
		test.serial("should success update sort-order", async () => {
			// Write PO to database
			const createPORes = await app.request("/api/purchase-order", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify(mockPurchaseOrder),
			});
			const createdResJson = (await createPORes.json()) as {
				message: string;
				data: string;
			};
			const [createdPO] = await purchaseOrderTbHelper.findById(
				createdResJson.data,
				{ withItems: true },
			);

			if (!createdPO) throw new Error("sort-order test po creation fail");
			if (createdPO.purchaseItem.length < 3) throw new Error("wrong length");

			const oldIdOrder = createdPO.purchaseItem.map(
				(pi) => pi.id,
			) as StringTuple;

			const [pi_1, pi_b, pi_c] = oldIdOrder;

			// MOCK new sort-order
			const sortOrderPayload: PatchSortOrderPayload = {
				newIdOrder: [pi_c, pi_1, pi_b],
			};

			// ACTION
			const res = await app.request(
				`/api/purchase-order/${createdResJson.data}/sort-order`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
					body: JSON.stringify(sortOrderPayload),
				},
			);

			const [patchedPo] = await purchaseOrderTbHelper.findById(
				createdResJson.data,
				{ withItems: true },
			);

			// scoped clean up
			await purchaseOrderTbHelper.clean({
				purchaseOrderId: createdResJson.data,
			});

			// assert
			expect(createPORes.status).toBe(201);
			expect(res.status).toBe(200);
			expect(patchedPo?.purchaseItem[0]?.productId).toBe("po_product_3");
			expect(patchedPo?.purchaseItem[1]?.productId).toBe("po_product_1");
			expect(patchedPo?.purchaseItem[2]?.productId).toBe("po_product_2");
		});
	});
});

type StringTuple = [string, string, string];
