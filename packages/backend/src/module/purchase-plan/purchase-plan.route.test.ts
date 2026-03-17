import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { app } from "@/main";
import { authTableHelper } from "@/db/_testHelper/authDbHelper";
import { signUpSignInHelper } from "../auth/auth.routes.test.helper";
import { productTbHelper } from "@/db/_testHelper/product.tableHelper";
import { categoryTbHelper } from "@/db/_testHelper/categoryDbHelper";
import type {
	CreatePurchasePlanPayload,
	PatchPayload,
	PatchSortOrderPayload,
} from "./purchase-plan.schema";
import * as purchaseItemTbHelper from "@db/_testHelper/purchasePlanItem.tableHelper";
import * as purchasePlanTbHelper from "@db/_testHelper/purchasePlan.tableHelper";
import * as vendorTbHelper from "@db/_testHelper/vendor.tableHelper";

describe("purchase-plan route", () => {
	let currentUserId: string | null = "";
	let cookie: string = "";
	let defaultCategoryId: string = "";
	const productIds = [
		"p_purchase_plan_1",
		"p_purchase_plan_2",
		"p_purchase_plan_3",
	];

	beforeAll(async () => {
		const testUser = {
			email: "purchase-plan@test.com",
			password: "Password123!",
			name: "purchase-plan-test-user",
		};

		const userData = await signUpSignInHelper(testUser, app);
		cookie = userData.cookie;
		currentUserId = userData.id;
		defaultCategoryId = userData.defaultCategoryId;

		await Promise.all([
			...productIds.map((id, index) =>
				productTbHelper.add({
					id,
					name: `pp-product-${index + 1}`,
					userIdParent: currentUserId!,
					userIdCreator: currentUserId!,
					categoryId: defaultCategoryId,
					sortOrder: index,
				}),
			),

			vendorTbHelper.add({
				id: "vendor_pp_test",
				name: "vendor_pp_test",
				userIdParent: currentUserId!,
				userIdCreator: currentUserId!,
			}),
		]);
	});

	afterAll(async () => {
		await purchaseItemTbHelper.clean({ userId: currentUserId });
		await purchasePlanTbHelper.clean({ userId: currentUserId });
		await vendorTbHelper.clean({ userId: currentUserId });

		await productTbHelper.clean({ userId: currentUserId });
		await categoryTbHelper.clean({ userId: currentUserId });
		await authTableHelper.clean({ userId: currentUserId });
	});

	const mockPurchaseOrder: CreatePurchasePlanPayload = {
		vendorId: "vendor_pp_test",
		totalCost: 70000,
		orderedAt: new Date(2026, 0, 1, 10, 10),
		purchasePlanItems: [
			{
				productId: "p_purchase_plan_1",
				quantity: 4,
				costPrice: 5000,
			},
			{
				productId: "p_purchase_plan_2",
				quantity: 2,
				costPrice: 15000,
			},
			{
				productId: "p_purchase_plan_3",
				quantity: 2,
				costPrice: 10000,
			},
		],
	};

	describe("POST endpoint", () => {
		test.serial("should success", async () => {
			// prepare
			const payload: CreatePurchasePlanPayload = {
				vendorId: "vendor_pp_test",
				totalCost: 50000,
				orderedAt: new Date(2026, 0, 1, 10, 10),
				purchasePlanItems: [
					{
						productId: "p_purchase_plan_1",
						quantity: 4,
						costPrice: 5000,
					},
					{
						productId: "p_purchase_plan_2",
						quantity: 2,
						costPrice: 15000,
					},
				],
			};

			// action
			const res = await app.request("/api/purchase-plan", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify(payload),
			});
			const json = (await res.json()) as { message: string; data: string };
			const createdPO = await purchasePlanTbHelper.findById(json.data, {
				withItems: true,
			});

			// scoped clean up
			await purchasePlanTbHelper.clean({ purchasePlanId: json.data });

			// assert
			expect(res.status).toBe(201);
			expect(createdPO.length).toBe(1);
			expect(createdPO[0]?.purchasePlanItem.length).toBe(2);
		});
		test.serial("should fail when vendor is invalid", async () => {
			// prepare
			const payload: CreatePurchasePlanPayload = {
				vendorId: "vendor_invalid",
				totalCost: 50000,
				orderedAt: new Date(2026, 0, 1, 10, 10),
				purchasePlanItems: [
					{
						productId: "p_purchase_plan_1",
						quantity: 4,
						costPrice: 5000,
					},
					{
						productId: "p_purchase_plan_2",
						quantity: 2,
						costPrice: 15000,
					},
				],
			};

			// action
			const res = await app.request("/api/purchase-plan", {
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
			const payload: CreatePurchasePlanPayload = {
				vendorId: "vendor_pp_test",
				totalCost: 50000,
				orderedAt: new Date(2026, 0, 1, 10, 10),
				purchasePlanItems: [
					{
						productId: "p_purchase_plan_1_invalid",
						quantity: 4,
						costPrice: 5000,
					},
					{
						productId: "p_purchase_plan_2",
						quantity: 2,
						costPrice: 15000,
					},
				],
			};

			// action
			const res = await app.request("/api/purchase-plan", {
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

			const res = await app.request("/api/purchase-plan", {
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
			const createdPO = await purchasePlanTbHelper.findById(
				createdResJson.data,
				{ withItems: true },
			);

			const patchPayload: PatchPayload = {
				vendorId: "vendor_po_patch",
			};

			const patchRes = await app.request(
				`/api/purchase-plan/${createdResJson.data}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
					body: JSON.stringify(patchPayload),
				},
			);

			const patchedPo = await purchasePlanTbHelper.findById(
				createdResJson.data,
				{ withItems: true },
			);

			// scoped clean up
			await purchasePlanTbHelper.clean({
				purchasePlanId: createdResJson.data,
			});
			await vendorTbHelper.clean({ vendorId: "vendor_po_patch" });

			// assert
			expect(res.status).toBe(201);
			expect(patchRes.status).toBe(200);
			expect(createdPO[0]?.vendorId).toBe("vendor_pp_test");
			expect(patchedPo[0]?.vendorId).toBe("vendor_po_patch");
		});
	});

	describe("purchase-order PATCH sort-order", () => {
		test.serial("should success update sort-order", async () => {
			// Write PO to database
			const createPORes = await app.request("/api/purchase-plan", {
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
			const [createdPO] = await purchasePlanTbHelper.findById(
				createdResJson.data,
				{ withItems: true },
			);

			if (!createdPO) throw new Error("sort-order test po creation fail");
			if (createdPO.purchasePlanItem.length < 3)
				throw new Error("wrong length");

			const oldIdOrder = createdPO.purchasePlanItem.map(
				(pi) => pi.id,
			) as StringTuple;

			const [pi_1, pi_b, pi_c] = oldIdOrder;

			// MOCK new sort-order
			const sortOrderPayload: PatchSortOrderPayload = {
				newIdOrder: [pi_c, pi_1, pi_b],
			};

			// ACTION
			const res = await app.request(
				`/api/purchase-plan/${createdResJson.data}/sort-order`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
					body: JSON.stringify(sortOrderPayload),
				},
			);

			const [patchedPo] = await purchasePlanTbHelper.findById(
				createdResJson.data,
				{ withItems: true },
			);

			// scoped clean up
			await purchasePlanTbHelper.clean({
				purchasePlanId: createdResJson.data,
			});

			// assert
			expect(createPORes.status).toBe(201);
			expect(res.status).toBe(200);
			expect(patchedPo?.purchasePlanItem[0]?.productId).toBe(
				"p_purchase_plan_3",
			);
			expect(patchedPo?.purchasePlanItem[1]?.productId).toBe(
				"p_purchase_plan_1",
			);
			expect(patchedPo?.purchasePlanItem[2]?.productId).toBe(
				"p_purchase_plan_2",
			);
		});
	});
});

type StringTuple = [string, string, string];
