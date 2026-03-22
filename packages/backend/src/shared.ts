import type { AuthUserType, ProtectedType } from "./lib/auth";
import type { app } from "./main";

export type AppType = typeof app;

// Authentication
export type AuthType = ProtectedType;
export type AuthTypeUser = AuthUserType;

// Category schema
export * from "@module/category/category.schema";
export * as imageSchema from "@module/image/image.schema";
export * as productSchema from "@module/product/product.schema";
export * as profileSchema from "@module/profile/profile.schema";
export * as purchaseOrderSchema from "@module/purchase-order/purchase-order.schema";
export * as purchaseItemSchema from "@module/purchase-order/purchase-item/purchase-item.schema";
export * as purchasePlanSchema from "@module/purchase-plan/purchase-plan.schema";
export * as purchasePlanItemSchema from "@module/purchase-plan/purchase-plan-item/purchase-plan-item.schema";
export * as vendorSchema from "@module/vendor/vendor.schema";
