import type { ProtectedType } from "@lib/auth";
export declare const productRoute: import("hono/hono-base").HonoBase<{
    Variables: ProtectedType;
} & {
    Variables: ProtectedType;
}, {
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
}, "/", "/sort-order">;
//# sourceMappingURL=product.routes.d.ts.map