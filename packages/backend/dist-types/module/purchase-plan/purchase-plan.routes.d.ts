import type { ProtectedType } from "@lib/auth";
export declare const purchasePlanRoute: import("hono/hono-base").HonoBase<{
    Variables: ProtectedType;
} & {
    Variables: ProtectedType;
}, (({
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
}, "/", "/:purchasePlanId/sort-order">;
//# sourceMappingURL=purchase-plan.routes.d.ts.map