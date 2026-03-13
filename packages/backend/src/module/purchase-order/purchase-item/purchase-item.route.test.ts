import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { app } from "@/main";
import { authTableHelper } from "@/db/_testHelper/authDbHelper";
import { signUpSignInHelper } from "../../auth/auth.routes.test.helper";
import { productTbHelper } from "@/db/_testHelper/product.tableHelper";
import { categoryTbHelper } from "@/db/_testHelper/categoryDbHelper";
import type { CreatePurchaseOrderPayload } from "../purchase-order.schema";
import * as purchaseItemTbHelper from "@db/_testHelper/purchaseItem.tableHelper";
import * as purchaseOrderTbHelper from "@db/_testHelper/purchaseOrder.tableHelper";
import * as vendorTbHelper from "@db/_testHelper/vendor.tableHelper";

import type * as piSchema from "@module/purchase-order/purchase-item/purchase-item.schema";
import type { z } from "zod";

describe("purchase-item route", () => {
	let currentUserId: string | null = "";
	let cookie: string = "";
	let defaultCategoryId: string = "";
	const productIds = ["po_product_1", "po_product_2"];

	beforeAll(async () => {
		const testUser = {
			email: "purchase-item@test.com",
			password: "Password123!",
			name: "test-user-purchase-item",
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
				id: "vendor_pi_test",
				name: "vendor_pi_test",
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
		vendorId: "vendor_pi_test",
		totalCost: 40000,
		orderedAt: new Date(2026, 0, 1, 10, 10),
		purchaseItems: [
			{
				productId: "po_product_1",
				quantity: 4,
				costPrice: 20000,
			},
			{
				productId: "po_product_2",
				quantity: 2,
				costPrice: 20000,
			},
		],
	};

	describe("PATCH", () => {
		test.serial("should success", async () => {
			const createPoRes = await app.request("/api/purchase-order", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Cookie: cookie,
				},
				body: JSON.stringify(mockPurchaseOrder),
			});
			const createdResJson = (await createPoRes.json()) as {
				message: string;
				data: string;
			};
			const createdPO = await purchaseOrderTbHelper.findById(
				createdResJson.data,
				{ withItems: true },
			);

			const updatePiPayload: z.infer<typeof piSchema.update> = {
				costPrice: 15000,
				quantity: 2,
			};

			const res = await app.request(
				`/api/purchase-order/${createdResJson.data}/pi/${createdPO[0]?.purchaseItem[0]?.id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
					body: JSON.stringify(updatePiPayload),
				},
			);

			const patchedPO = await purchaseOrderTbHelper.findById(
				createdResJson.data,
				{ withItems: true },
			);

			// scoped clean up
			await purchaseOrderTbHelper.clean({
				purchaseOrderId: createdResJson.data,
			});

			expect(res.status).toBe(200);
			expect(patchedPO[0]?.totalCost).toBe(35000);
			expect(patchedPO[0]?.purchaseItem[0]?.costPrice).toBe(15000);
			expect(patchedPO[0]?.purchaseItem[0]?.quantity).toBe(2);
		});
	});
});
