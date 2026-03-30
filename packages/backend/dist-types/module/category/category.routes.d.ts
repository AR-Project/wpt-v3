import type { ProtectedType } from "@lib/auth";
export declare const categoryRoute: import("hono/hono-base").HonoBase<{
    Variables: ProtectedType;
} & {
    Variables: ProtectedType;
}, {
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
}, "/", "/">;
//# sourceMappingURL=category.routes.d.ts.map