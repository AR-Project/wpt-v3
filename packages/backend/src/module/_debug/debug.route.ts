import { Hono } from "hono";

// Master
import { authTableHelper } from "@/db/_testHelper/authDbHelper";
import * as vendorTbHelper from "@db/_testHelper/vendor.tableHelper";
import { categoryTbHelper } from "@/db/_testHelper/categoryDbHelper";
import { productTbHelper } from "@/db/_testHelper/product.tableHelper";
import * as imageTbHelper from "@db/_testHelper/image.tableHelper";

// transactional
import * as purchaseItemTbHelper from "@db/_testHelper/purchaseItem.tableHelper";
import * as purchaseOrderTbHelper from "@db/_testHelper/purchaseOrder.tableHelper";
import * as purchasePlanItemTbHelper from "@db/_testHelper/purchasePlanItem.tableHelper";
import * as purchasePlanTbHelper from "@db/_testHelper/purchasePlan.tableHelper";

const route = new Hono()
	.post("/nuke/all", async (c) => {
		await imageTbHelper.nuke();

		await Promise.all([
			purchasePlanItemTbHelper.nuke(),
			purchasePlanTbHelper.nuke(),
			purchaseItemTbHelper.nuke(),
			purchaseOrderTbHelper.nuke(),
		]);

		await productTbHelper.nuke();

		await Promise.all([categoryTbHelper.nuke(), vendorTbHelper.nuke()]);

		await authTableHelper.nuke();

		return c.json({ message: "success" });
	})
	.post("/nuke/transactional", async (c) => {
		await Promise.all([
			purchasePlanItemTbHelper.nuke(),
			purchasePlanTbHelper.nuke(),
			purchaseItemTbHelper.nuke(),
			purchaseOrderTbHelper.nuke(),
		]);
		return c.json({ message: "success" });
	});

export const debugRoute =
	process.env.NODE_ENV === "production" ? new Hono() : route;
