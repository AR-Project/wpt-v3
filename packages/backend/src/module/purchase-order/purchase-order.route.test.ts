import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { app } from "@/main";
import { authTableHelper } from "@/db/_testHelper/authDbHelper";
import { signUpSignInHelper } from "../auth/auth.routes.test.helper";
import { productTbHelper } from "@/db/_testHelper/product.tableHelper";
import { categoryTbHelper } from "@/db/_testHelper/categoryDbHelper";
import type { CreatePurchaseOrderPayload } from "./purchase-order.schema";
import * as purchaseItemTbHelper from "@db/_testHelper/purchaseItem.tableHelper";
import * as purchaseOrderTbHelper from "@db/_testHelper/purchaseOrder.tableHelper";
import * as vendorTbHelper from "@db/_testHelper/vendor.tableHelper";

describe("purchase-order route", () => {
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
		await purchaseItemTbHelper.clean({ userId: currentUserId });
		await purchaseOrderTbHelper.clean({ userId: currentUserId });
		await vendorTbHelper.clean({ userId: currentUserId });

		await productTbHelper.clean({ userId: currentUserId });
		await categoryTbHelper.clean({ userId: currentUserId });
		await authTableHelper.clean({ userId: currentUserId });
	});

	describe("POST endpoint", () => {
		test.serial("should success", async () => {
			// prepare
			const productIds = ["po_product_1", "po_product_2", "po_product_3"];
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
			await Promise.all([
				...productIds.map((id) => productTbHelper.clean({ productId: id })),
				vendorTbHelper.clean({ vendorId: "vendor_po_test" }),
			]);
			await purchaseOrderTbHelper.clean({ purchaseOrderId: json.data });

			// assert
			expect(res.status).toBe(201);
			expect(createdPO.length).toBe(1);
			expect(createdPO[0]?.purchaseItem.length).toBe(2);
		});
	});
});
