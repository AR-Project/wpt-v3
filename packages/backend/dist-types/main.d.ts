export declare const app: import("hono/hono-base").HonoBase<{}, (import("hono/types").BlankSchema | import("hono/types").MergeSchemaPath<{
    "/*": {
        $get: {
            input: {};
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
        };
        $post: {
            input: {};
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
        };
    };
}, "/api/auth"> | import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: {
                id: string;
                name: string;
            }[];
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    name: string;
                };
            };
            output: {
                id: string;
                name: string;
            };
            outputFormat: "json";
            status: 201;
        };
    };
} & {
    "/": {
        $delete: {
            input: {
                json: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $patch: {
            input: {
                json: {
                    id: string;
                    name: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/api/vendor"> | import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: {
                id: string;
                name: string;
                sortOrder: number | null;
            }[];
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    name: string;
                    productId?: string | undefined;
                };
            };
            output: {
                id: string;
                name: string;
            };
            outputFormat: "json";
            status: 201;
        };
    };
} & {
    "/": {
        $delete: {
            input: {
                json: {
                    id: string;
                };
            };
            output: {};
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $patch: {
            input: {
                json: {
                    id: string;
                    name: string;
                };
            };
            output: {};
            outputFormat: "json";
            status: 200;
        };
    };
}, "/api/category"> | import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: {
                latestPrice: number;
                id: string;
                name: string;
                sortOrder: number | null;
            }[];
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    name: string;
                    categoryId?: string | undefined;
                    displayQtyDivider?: number | undefined;
                    displayUnitName?: string | undefined;
                };
            };
            output: {
                id: string;
                name: string;
                categoryId: string;
            };
            outputFormat: "json";
            status: 201;
        };
    };
} & {
    "/": {
        $delete: {
            input: {
                json: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $patch: {
            input: {
                json: {
                    id: string;
                    name?: string | undefined;
                    categoryId?: string | undefined;
                    sortOrder?: number | undefined;
                    displayQtyDivider?: number | undefined;
                    displayUnitName?: string | undefined;
                    imageId?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/sort-order": {
        $patch: {
            input: {
                json: {
                    itemIdsNewOrder: string[];
                    categoryId: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/api/product"> | import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} | import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: {
                id: string;
                name: string;
                email: string;
                emailVerified: boolean;
                image: string | null;
                createdAt: string;
                updatedAt: string;
                banned: boolean | null;
                role: "admin" | "manager" | "staff" | "guest";
                banReason: string | null;
                banExpires: string | null;
                parentId: string | null;
                defaultCategoryId: string | null;
                sessions: {
                    id: string;
                    createdAt: string;
                    updatedAt: string;
                    expiresAt: string;
                    token: string;
                    ipAddress: string | null;
                    userAgent: string | null;
                    userId: string;
                    impersonatedBy: string | null;
                }[];
            }[];
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    email: string;
                    password: string;
                    name: string;
                };
            };
            output: {
                message: string;
                user: {
                    role?: string | undefined | undefined;
                    banned: boolean | null;
                    banReason?: (string | null) | undefined | undefined;
                    banExpires?: string | null | undefined;
                    id: string;
                    createdAt: string;
                    updatedAt: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    image?: string | null | undefined;
                };
            };
            outputFormat: "json";
            status: 201;
        };
    };
} & {
    "/:childId/sessions": {
        $delete: {
            input: {
                param: {
                    childId: string;
                };
            };
            output: null;
            outputFormat: "body";
            status: 204;
        };
    };
} & {
    "/:childId/set-password": {
        $patch: {
            input: {
                json: {
                    newPassword: string;
                };
            } & {
                param: {
                    childId: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/:childId": {
        $patch: {
            input: {
                json: {
                    name?: string | undefined;
                    email?: string | undefined;
                    image?: string | undefined;
                    defaultCategoryId?: string | undefined;
                };
            } & {
                param: {
                    childId: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/:childId/ban": {
        $post: {
            input: {
                param: {
                    childId: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/:childId/unban": {
        $post: {
            input: {
                param: {
                    childId: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}, "/children">, "/api/profile"> | import("hono/types").MergeSchemaPath<{
    "/": {
        $post: {
            input: {
                form: {
                    image: File;
                };
            };
            output: {
                id: string;
                url: string;
            };
            outputFormat: "json";
            status: 201;
        };
    };
} & {
    "/": {
        $delete: {
            input: {
                json: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/": {
        $get: {
            input: {};
            output: {
                id: string;
                createdAt: string;
                userIdParent: string;
                userIdCreator: string;
                url: string;
                originalFileName: string;
            }[];
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/:imageId": {
        $get: {
            input: {
                param: {
                    imageId: string;
                };
            };
            output: {
                id: string;
                createdAt: string;
                userIdParent: string;
                userIdCreator: string;
                url: string;
                originalFileName: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}, "/api/image"> | import("hono/types").MergeSchemaPath<(({
    "/": {
        $post: {
            input: {
                json: {
                    vendorId: string;
                    totalCost: number;
                    orderedAt: unknown;
                    purchaseItems: {
                        productId: string;
                        quantity: number;
                        costPrice: number;
                    }[];
                    imageId?: string | undefined;
                };
            };
            output: {
                message: string;
                data: string;
            };
            outputFormat: "json";
            status: 201;
        };
    };
} | import("hono/types").MergeSchemaPath<{
    "/:purchaseItemId": {
        $patch: {
            input: {
                param: {
                    purchaseOrderId: string;
                };
            } & {
                json: {
                    quantity: number;
                    costPrice: number;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}, "/:purchaseOrderId/pi">) & {
    "/:purchaseOrderId": {
        $patch: {
            input: {
                json: {
                    vendorId?: string | undefined;
                    orderedAt?: unknown;
                    imageId?: string | undefined;
                };
            } & {
                param: {
                    purchaseOrderId: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}) & {
    "/:purchaseOrderId/sort-order": {
        $patch: {
            input: {
                json: {
                    newIdOrder: string[];
                };
            } & {
                param: {
                    purchaseOrderId: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}, "/api/purchase-order"> | import("hono/types").MergeSchemaPath<(({
    "/": {
        $post: {
            input: {
                json: {
                    vendorId: string;
                    totalCost: number;
                    orderedAt: unknown;
                    purchasePlanItems: {
                        productId: string;
                        quantity: number;
                        costPrice: number;
                    }[];
                };
            };
            output: {
                message: string;
                data: string;
            };
            outputFormat: "json";
            status: 201;
        };
    };
} | import("hono/types").MergeSchemaPath<{
    "/:purchasePlanItemId": {
        $patch: {
            input: {
                param: {
                    purchasePlanId: string;
                    purchasePlanItemId: string;
                };
            } & {
                json: {
                    quantity: number;
                    costPrice: number;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}, "/:purchasePlanId/ppi">) & {
    "/:purchasePlanId": {
        $patch: {
            input: {
                json: {
                    vendorId?: string | undefined;
                    orderedAt?: unknown;
                    imageId?: string | undefined;
                };
            } & {
                param: {
                    purchasePlanId: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}) & {
    "/:purchasePlanId/sort-order": {
        $patch: {
            input: {
                json: {
                    newIdOrder: string[];
                };
            } & {
                param: {
                    purchasePlanId: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}, "/api/purchase-plan"> | import("hono/types").MergeSchemaPath<{
    "/nuke/all": {
        $post: {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/nuke/transactional": {
        $post: {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}, "/api/_debug">) & {
    "/api/hello": {
        $get: {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}, "/api", "/api/hello">;
export type AppType = typeof app;
declare const _default: {
    port: number;
    fetch: (request: Request, Env?: unknown, executionCtx?: import("hono").ExecutionContext) => Response | Promise<Response>;
};
export default _default;
//# sourceMappingURL=main.d.ts.map