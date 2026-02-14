import type { AuthUserType, ProtectedType } from "./lib/auth";
import type { app } from "./main";

export type AppType = typeof app;

// Authentication
export type AuthType = ProtectedType;
export type AuthTypeUser = AuthUserType;

// Category schema
export * from "@module/category/category.schema";

// Item Schema
export * from "@module/item/item.schema";
