import type { ProtectedType } from "@lib/auth";
export declare const vendorRoute: import("hono/hono-base").HonoBase<{
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
}, "/", "/">;
//# sourceMappingURL=vendor.routes.d.ts.map