export declare const statement: {
    readonly product: readonly ["create", "read", "update", "delete"];
    readonly vendor: readonly ["create", "read", "update", "delete"];
    readonly category: readonly ["create", "read", "update", "delete"];
    readonly purchaseOrder: readonly ["create", "read", "update", "delete"];
    readonly purchaseItem: readonly ["create", "read", "update", "delete"];
    readonly image: readonly ["create", "read", "update", "delete"];
    readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
    readonly session: readonly ["list", "revoke", "delete"];
};
export declare const ac: {
    newRole<K extends "vendor" | "user" | "image" | "purchaseOrder" | "purchaseItem" | "product" | "category" | "session">(statements: import("better-auth/plugins").Subset<K, {
        readonly product: readonly ["create", "read", "update", "delete"];
        readonly vendor: readonly ["create", "read", "update", "delete"];
        readonly category: readonly ["create", "read", "update", "delete"];
        readonly purchaseOrder: readonly ["create", "read", "update", "delete"];
        readonly purchaseItem: readonly ["create", "read", "update", "delete"];
        readonly image: readonly ["create", "read", "update", "delete"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    }>): {
        authorize<K_1 extends K>(request: K_1 extends infer T extends K_2 ? { [key in T]?: import("better-auth/plugins").Subset<K, {
            readonly product: readonly ["create", "read", "update", "delete"];
            readonly vendor: readonly ["create", "read", "update", "delete"];
            readonly category: readonly ["create", "read", "update", "delete"];
            readonly purchaseOrder: readonly ["create", "read", "update", "delete"];
            readonly purchaseItem: readonly ["create", "read", "update", "delete"];
            readonly image: readonly ["create", "read", "update", "delete"];
            readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
            readonly session: readonly ["list", "revoke", "delete"];
        }>[key] | {
            actions: import("better-auth/plugins").Subset<K, {
                readonly product: readonly ["create", "read", "update", "delete"];
                readonly vendor: readonly ["create", "read", "update", "delete"];
                readonly category: readonly ["create", "read", "update", "delete"];
                readonly purchaseOrder: readonly ["create", "read", "update", "delete"];
                readonly purchaseItem: readonly ["create", "read", "update", "delete"];
                readonly image: readonly ["create", "read", "update", "delete"];
                readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
                readonly session: readonly ["list", "revoke", "delete"];
            }>[key];
            connector: "OR" | "AND";
        } | undefined; } : never, connector?: "OR" | "AND"): import("better-auth/plugins").AuthorizeResponse;
        statements: import("better-auth/plugins").Subset<K, {
            readonly product: readonly ["create", "read", "update", "delete"];
            readonly vendor: readonly ["create", "read", "update", "delete"];
            readonly category: readonly ["create", "read", "update", "delete"];
            readonly purchaseOrder: readonly ["create", "read", "update", "delete"];
            readonly purchaseItem: readonly ["create", "read", "update", "delete"];
            readonly image: readonly ["create", "read", "update", "delete"];
            readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
            readonly session: readonly ["list", "revoke", "delete"];
        }>;
    };
    statements: {
        readonly product: readonly ["create", "read", "update", "delete"];
        readonly vendor: readonly ["create", "read", "update", "delete"];
        readonly category: readonly ["create", "read", "update", "delete"];
        readonly purchaseOrder: readonly ["create", "read", "update", "delete"];
        readonly purchaseItem: readonly ["create", "read", "update", "delete"];
        readonly image: readonly ["create", "read", "update", "delete"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    };
};
export declare const admin: {
    authorize<K_1 extends "vendor" | "user" | "image" | "purchaseOrder" | "purchaseItem" | "product" | "category" | "session">(request: K_1 extends infer T extends K ? { [key in T]?: import("better-auth/plugins").Subset<"vendor" | "user" | "image" | "purchaseOrder" | "purchaseItem" | "product" | "category" | "session", {
        readonly product: readonly ["create", "read", "update", "delete"];
        readonly vendor: readonly ["create", "read", "update", "delete"];
        readonly category: readonly ["create", "read", "update", "delete"];
        readonly purchaseOrder: readonly ["create", "read", "update", "delete"];
        readonly purchaseItem: readonly ["create", "read", "update", "delete"];
        readonly image: readonly ["create", "read", "update", "delete"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    }>[key] | {
        actions: import("better-auth/plugins").Subset<"vendor" | "user" | "image" | "purchaseOrder" | "purchaseItem" | "product" | "category" | "session", {
            readonly product: readonly ["create", "read", "update", "delete"];
            readonly vendor: readonly ["create", "read", "update", "delete"];
            readonly category: readonly ["create", "read", "update", "delete"];
            readonly purchaseOrder: readonly ["create", "read", "update", "delete"];
            readonly purchaseItem: readonly ["create", "read", "update", "delete"];
            readonly image: readonly ["create", "read", "update", "delete"];
            readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
            readonly session: readonly ["list", "revoke", "delete"];
        }>[key];
        connector: "OR" | "AND";
    } | undefined; } : never, connector?: "OR" | "AND"): import("better-auth/plugins").AuthorizeResponse;
    statements: import("better-auth/plugins").Subset<"vendor" | "user" | "image" | "purchaseOrder" | "purchaseItem" | "product" | "category" | "session", {
        readonly product: readonly ["create", "read", "update", "delete"];
        readonly vendor: readonly ["create", "read", "update", "delete"];
        readonly category: readonly ["create", "read", "update", "delete"];
        readonly purchaseOrder: readonly ["create", "read", "update", "delete"];
        readonly purchaseItem: readonly ["create", "read", "update", "delete"];
        readonly image: readonly ["create", "read", "update", "delete"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    }>;
};
export declare const staff: {
    authorize<K_1 extends "vendor" | "image" | "purchaseOrder" | "purchaseItem" | "product" | "category">(request: K_1 extends infer T extends K ? { [key in T]?: import("better-auth/plugins").Subset<"vendor" | "image" | "purchaseOrder" | "purchaseItem" | "product" | "category", {
        readonly product: readonly ["create", "read", "update", "delete"];
        readonly vendor: readonly ["create", "read", "update", "delete"];
        readonly category: readonly ["create", "read", "update", "delete"];
        readonly purchaseOrder: readonly ["create", "read", "update", "delete"];
        readonly purchaseItem: readonly ["create", "read", "update", "delete"];
        readonly image: readonly ["create", "read", "update", "delete"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    }>[key] | {
        actions: import("better-auth/plugins").Subset<"vendor" | "image" | "purchaseOrder" | "purchaseItem" | "product" | "category", {
            readonly product: readonly ["create", "read", "update", "delete"];
            readonly vendor: readonly ["create", "read", "update", "delete"];
            readonly category: readonly ["create", "read", "update", "delete"];
            readonly purchaseOrder: readonly ["create", "read", "update", "delete"];
            readonly purchaseItem: readonly ["create", "read", "update", "delete"];
            readonly image: readonly ["create", "read", "update", "delete"];
            readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
            readonly session: readonly ["list", "revoke", "delete"];
        }>[key];
        connector: "OR" | "AND";
    } | undefined; } : never, connector?: "OR" | "AND"): import("better-auth/plugins").AuthorizeResponse;
    statements: import("better-auth/plugins").Subset<"vendor" | "image" | "purchaseOrder" | "purchaseItem" | "product" | "category", {
        readonly product: readonly ["create", "read", "update", "delete"];
        readonly vendor: readonly ["create", "read", "update", "delete"];
        readonly category: readonly ["create", "read", "update", "delete"];
        readonly purchaseOrder: readonly ["create", "read", "update", "delete"];
        readonly purchaseItem: readonly ["create", "read", "update", "delete"];
        readonly image: readonly ["create", "read", "update", "delete"];
        readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"];
        readonly session: readonly ["list", "revoke", "delete"];
    }>;
};
//# sourceMappingURL=permission.d.ts.map