import { type ProtectedType } from "@lib/auth";
export declare const profileChildrenRoute: import("hono/hono-base").HonoBase<{
    Variables: ProtectedType;
}, {
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
}, "/", "/:childId/unban">;
//# sourceMappingURL=children.route.d.ts.map