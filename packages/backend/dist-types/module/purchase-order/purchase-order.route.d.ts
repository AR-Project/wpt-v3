import type { ProtectedType } from "@lib/auth";
export declare const purchaseOrderRoute: import("hono/hono-base").HonoBase<{
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
}, "/", "/:purchaseOrderId/sort-order">;
//# sourceMappingURL=purchase-order.route.d.ts.map