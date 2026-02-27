import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
	...defaultStatements,
	product: ["create", "read", "update", "delete"],
	vendor: ["create", "read", "update", "delete"],
	category: ["create", "read", "update", "delete"],
	purchaseOrder: ["create", "read", "update", "delete"],
	purchaseItem: ["create", "read", "update", "delete"],
	image: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
	product: ["create", "read", "update", "delete"],
	vendor: ["create", "read", "update", "delete"],
	category: ["create", "read", "update", "delete"],
	purchaseOrder: ["create", "read", "update", "delete"],
	purchaseItem: ["create", "read", "update", "delete"],
	image: ["create", "read", "update", "delete"],
	...adminAc.statements,
});

export const staff = ac.newRole({
	product: ["create", "read", "update"],
	vendor: ["create", "read", "update"],
	category: ["create", "read", "update"],
	purchaseOrder: ["create", "read", "update"],
	purchaseItem: ["create", "read", "update"],
	image: ["create", "read", "update"],
});
