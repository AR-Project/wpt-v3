import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { app } from "@/main";
import { authTableHelper } from "@/db/_testHelper/authDbHelper";
import { signUpSignInHelper } from "../../auth/auth.routes.test.helper";
import { productTbHelper } from "@/db/_testHelper/product.tableHelper";
import { categoryTbHelper } from "@/db/_testHelper/categoryDbHelper";
import type { CreatePurchasePlanPayload } from "../purchase-plan.schema";
import * as purchasePlanItemTbHelper from "@db/_testHelper/purchasePlanItem.tableHelper";
import * as purchasePlanTbHelper from "@db/_testHelper/purchasePlan.tableHelper";
import * as vendorTbHelper from "@db/_testHelper/vendor.tableHelper";

import type * as piSchema from "@module/purchase-order/purchase-item/purchase-item.schema";
import type { z } from "zod";

describe("purchase-plan-item route", () => {
	let currentUserId: string | null = "";
	let cookie: string = "";
	let defaultCategoryId: string = "";
	const productIds = ["ppi_product_1", "ppi_product_2"];

	beforeAll(async () => {
		const testUser = {
			email: "purchase-plan-item@test.com",
			password: "Password123!",
			name: "purchase-plan-item-user",
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
				id: "vendor_ppi_test",
				name: "vendor_ppi_test",
				userIdParent: currentUserId!,
				userIdCreator: currentUserId!,
			}),
		]);
	});

	afterAll(async () => {
		await purchasePlanItemTbHelper.clean({ userId: currentUserId });
		await purchasePlanTbHelper.clean({ userId: currentUserId });
		await vendorTbHelper.clean({ userId: currentUserId });

		await productTbHelper.clean({ userId: currentUserId });
		await categoryTbHelper.clean({ userId: currentUserId });
		await authTableHelper.clean({ userId: currentUserId });
	});

	const mockPurchaseOrder: CreatePurchasePlanPayload = {
		vendorId: "vendor_ppi_test",
		totalCost: 40000,
		orderedAt: new Date(2026, 0, 1, 10, 10),
		purchasePlanItems: [
			{
				productId: "ppi_product_1",
				quantity: 4,
				costPrice: 20000,
			},
			{
				productId: "ppi_product_2",
				quantity: 2,
				costPrice: 20000,
			},
		],
	};

	describe("PATCH", () => {
		test.serial("should success", async () => {
			const createPoRes = await app.request("/api/purchase-plan", {
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

			const [createdPO] = await purchasePlanTbHelper.findById(
				createdResJson.data,
				{ withItems: true },
			);

			if (!createdPO) throw new Error("Fail to create purchase Plan");

			const updatePiPayload: z.infer<typeof piSchema.update> = {
				costPrice: 15000,
				quantity: 2,
			};

			const res = await app.request(
				`/api/purchase-plan/${createdResJson.data}/ppi/${createdPO.purchasePlanItem[0]?.id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Cookie: cookie,
					},
					body: JSON.stringify(updatePiPayload),
				},
			);

			const patchedPO = await purchasePlanTbHelper.findById(
				createdResJson.data,
				{ withItems: true },
			);

			// scoped clean up
			await purchasePlanTbHelper.clean({
				purchasePlanId: createdResJson.data,
			});

			expect(res.status).toBe(200);
			expect(patchedPO[0]?.totalCost).toBe(35000);
			expect(patchedPO[0]?.purchasePlanItem[0]?.costPrice).toBe(15000);
			expect(patchedPO[0]?.purchasePlanItem[0]?.quantity).toBe(2);
		});
	});
});
