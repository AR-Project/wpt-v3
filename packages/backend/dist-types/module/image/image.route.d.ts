import type { ProtectedType } from "@lib/auth";
export declare const IMAGE_SERVER_PATH_PREFIX = "runtime-assets";
export declare const imageRoute: import("hono/hono-base").HonoBase<{
    Variables: ProtectedType;
} & {
    Variables: ProtectedType;
}, {
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
}, "/", "/:imageId">;
//# sourceMappingURL=image.route.d.ts.map