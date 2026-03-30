import type { EnsureNonNullable } from "./types-helper";
export declare const auth: import("better-auth").Auth<{
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    plugins: [{
        id: "admin";
        init(): {
            options: {
                databaseHooks: {
                    user: {
                        create: {
                            before(user: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image?: string | null | undefined;
                            } & Record<string, unknown>): Promise<{
                                data: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    image?: string | null | undefined;
                                    role: string;
                                };
                            }>;
                        };
                    };
                    session: {
                        create: {
                            before(session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            } & Record<string, unknown>, ctx: import("better-auth").GenericEndpointContext | null): Promise<void>;
                        };
                    };
                };
            };
        };
        hooks: {
            after: {
                matcher(context: import("better-auth").HookEndpointContext): boolean;
                handler: (inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<import("better-auth/plugins").SessionWithImpersonatedBy[] | undefined>;
            }[];
        };
        endpoints: {
            setRole: import("better-auth").StrictEndpoint<"/admin/set-role", {
                method: "POST";
                body: import("zod").ZodObject<{
                    userId: import("zod").ZodCoercedString<unknown>;
                    role: import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>]>;
                }, import("better-auth").$strip>;
                requireHeaders: true;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    $Infer: {
                        body: {
                            userId: string;
                            role: "admin" | "staff" | ("admin" | "staff")[];
                        };
                    };
                };
            }, {
                user: import("better-auth/plugins").UserWithRole;
            }>;
            getUser: import("better-auth").StrictEndpoint<"/admin/get-user", {
                method: "GET";
                query: import("zod").ZodObject<{
                    id: import("zod").ZodString;
                }, import("better-auth").$strip>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, import("better-auth/plugins").UserWithRole>;
            createUser: import("better-auth").StrictEndpoint<"/admin/create-user", {
                method: "POST";
                body: import("zod").ZodObject<{
                    email: import("zod").ZodString;
                    password: import("zod").ZodOptional<import("zod").ZodString>;
                    name: import("zod").ZodString;
                    role: import("zod").ZodOptional<import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>]>>;
                    data: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
                }, import("better-auth").$strip>;
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    $Infer: {
                        body: {
                            email: string;
                            password?: string | undefined;
                            name: string;
                            role?: "admin" | "staff" | ("admin" | "staff")[] | undefined;
                            data?: Record<string, any> | undefined;
                        };
                    };
                };
            }, {
                user: import("better-auth/plugins").UserWithRole;
            }>;
            adminUpdateUser: import("better-auth").StrictEndpoint<"/admin/update-user", {
                method: "POST";
                body: import("zod").ZodObject<{
                    userId: import("zod").ZodCoercedString<unknown>;
                    data: import("zod").ZodRecord<import("zod").ZodAny, import("zod").ZodAny>;
                }, import("better-auth").$strip>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, import("better-auth/plugins").UserWithRole>;
            listUsers: import("better-auth").StrictEndpoint<"/admin/list-users", {
                method: "GET";
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                query: import("zod").ZodObject<{
                    searchValue: import("zod").ZodOptional<import("zod").ZodString>;
                    searchField: import("zod").ZodOptional<import("zod").ZodEnum<{
                        name: "name";
                        email: "email";
                    }>>;
                    searchOperator: import("zod").ZodOptional<import("zod").ZodEnum<{
                        contains: "contains";
                        starts_with: "starts_with";
                        ends_with: "ends_with";
                    }>>;
                    limit: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>>;
                    offset: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>>;
                    sortBy: import("zod").ZodOptional<import("zod").ZodString>;
                    sortDirection: import("zod").ZodOptional<import("zod").ZodEnum<{
                        asc: "asc";
                        desc: "desc";
                    }>>;
                    filterField: import("zod").ZodOptional<import("zod").ZodString>;
                    filterValue: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>, import("zod").ZodBoolean]>>;
                    filterOperator: import("zod").ZodOptional<import("zod").ZodEnum<{
                        eq: "eq";
                        ne: "ne";
                        lt: "lt";
                        lte: "lte";
                        gt: "gt";
                        gte: "gte";
                        contains: "contains";
                    }>>;
                }, import("better-auth").$strip>;
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                users: {
                                                    type: string;
                                                    items: {
                                                        $ref: string;
                                                    };
                                                };
                                                total: {
                                                    type: string;
                                                };
                                                limit: {
                                                    type: string;
                                                };
                                                offset: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                users: import("better-auth/plugins").UserWithRole[];
                total: number;
                limit: number | undefined;
                offset: number | undefined;
            } | {
                users: never[];
                total: number;
            }>;
            listUserSessions: import("better-auth").StrictEndpoint<"/admin/list-user-sessions", {
                method: "POST";
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                body: import("zod").ZodObject<{
                    userId: import("zod").ZodCoercedString<unknown>;
                }, import("better-auth").$strip>;
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                sessions: {
                                                    type: string;
                                                    items: {
                                                        $ref: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                sessions: import("better-auth/plugins").SessionWithImpersonatedBy[];
            }>;
            unbanUser: import("better-auth").StrictEndpoint<"/admin/unban-user", {
                method: "POST";
                body: import("zod").ZodObject<{
                    userId: import("zod").ZodCoercedString<unknown>;
                }, import("better-auth").$strip>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                user: import("better-auth/plugins").UserWithRole;
            }>;
            banUser: import("better-auth").StrictEndpoint<"/admin/ban-user", {
                method: "POST";
                body: import("zod").ZodObject<{
                    userId: import("zod").ZodCoercedString<unknown>;
                    banReason: import("zod").ZodOptional<import("zod").ZodString>;
                    banExpiresIn: import("zod").ZodOptional<import("zod").ZodNumber>;
                }, import("better-auth").$strip>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                user: import("better-auth/plugins").UserWithRole;
            }>;
            impersonateUser: import("better-auth").StrictEndpoint<"/admin/impersonate-user", {
                method: "POST";
                body: import("zod").ZodObject<{
                    userId: import("zod").ZodCoercedString<unknown>;
                }, import("better-auth").$strip>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                session: {
                                                    $ref: string;
                                                };
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                session: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    expiresAt: Date;
                    token: string;
                    ipAddress?: string | null | undefined;
                    userAgent?: string | null | undefined;
                };
                user: import("better-auth/plugins").UserWithRole;
            }>;
            stopImpersonating: import("better-auth").StrictEndpoint<"/admin/stop-impersonating", {
                method: "POST";
                requireHeaders: true;
            }, {
                session: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    expiresAt: Date;
                    token: string;
                    ipAddress?: string | null | undefined;
                    userAgent?: string | null | undefined;
                } & Record<string, any>;
                user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    image?: string | null | undefined;
                } & Record<string, any>;
            }>;
            revokeUserSession: import("better-auth").StrictEndpoint<"/admin/revoke-user-session", {
                method: "POST";
                body: import("zod").ZodObject<{
                    sessionToken: import("zod").ZodString;
                }, import("better-auth").$strip>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                success: boolean;
            }>;
            revokeUserSessions: import("better-auth").StrictEndpoint<"/admin/revoke-user-sessions", {
                method: "POST";
                body: import("zod").ZodObject<{
                    userId: import("zod").ZodCoercedString<unknown>;
                }, import("better-auth").$strip>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                success: boolean;
            }>;
            removeUser: import("better-auth").StrictEndpoint<"/admin/remove-user", {
                method: "POST";
                body: import("zod").ZodObject<{
                    userId: import("zod").ZodCoercedString<unknown>;
                }, import("better-auth").$strip>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                success: boolean;
            }>;
            setUserPassword: import("better-auth").StrictEndpoint<"/admin/set-user-password", {
                method: "POST";
                body: import("zod").ZodObject<{
                    newPassword: import("zod").ZodString;
                    userId: import("zod").ZodCoercedString<unknown>;
                }, import("better-auth").$strip>;
                use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    session: {
                        user: import("better-auth/plugins").UserWithRole;
                        session: import("better-auth").Session;
                    };
                }>)[];
                metadata: {
                    openapi: {
                        operationId: string;
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                status: boolean;
            }>;
            userHasPermission: import("better-auth").StrictEndpoint<"/admin/has-permission", {
                method: "POST";
                body: import("zod").ZodIntersection<import("zod").ZodObject<{
                    userId: import("zod").ZodOptional<import("zod").ZodCoercedString<unknown>>;
                    role: import("zod").ZodOptional<import("zod").ZodString>;
                }, import("better-auth").$strip>, import("zod").ZodUnion<readonly [import("zod").ZodObject<{
                    permission: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>>;
                    permissions: import("zod").ZodUndefined;
                }, import("better-auth").$strip>, import("zod").ZodObject<{
                    permission: import("zod").ZodUndefined;
                    permissions: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>>;
                }, import("better-auth").$strip>]>>;
                metadata: {
                    openapi: {
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            permission: {
                                                type: string;
                                                description: string;
                                                deprecated: boolean;
                                            };
                                            permissions: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                error: {
                                                    type: string;
                                                };
                                                success: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                    $Infer: {
                        body: ({
                            permission: {
                                readonly product?: ("create" | "read" | "update" | "delete")[] | undefined;
                                readonly vendor?: ("create" | "read" | "update" | "delete")[] | undefined;
                                readonly category?: ("create" | "read" | "update" | "delete")[] | undefined;
                                readonly purchaseOrder?: ("create" | "read" | "update" | "delete")[] | undefined;
                                readonly purchaseItem?: ("create" | "read" | "update" | "delete")[] | undefined;
                                readonly image?: ("create" | "read" | "update" | "delete")[] | undefined;
                                readonly user?: ("get" | "create" | "update" | "delete" | "list" | "set-role" | "ban" | "impersonate" | "set-password")[] | undefined;
                                readonly session?: ("delete" | "list" | "revoke")[] | undefined;
                            };
                            permissions?: never | undefined;
                        } | {
                            permissions: {
                                readonly product?: ("create" | "read" | "update" | "delete")[] | undefined;
                                readonly vendor?: ("create" | "read" | "update" | "delete")[] | undefined;
                                readonly category?: ("create" | "read" | "update" | "delete")[] | undefined;
                                readonly purchaseOrder?: ("create" | "read" | "update" | "delete")[] | undefined;
                                readonly purchaseItem?: ("create" | "read" | "update" | "delete")[] | undefined;
                                readonly image?: ("create" | "read" | "update" | "delete")[] | undefined;
                                readonly user?: ("get" | "create" | "update" | "delete" | "list" | "set-role" | "ban" | "impersonate" | "set-password")[] | undefined;
                                readonly session?: ("delete" | "list" | "revoke")[] | undefined;
                            };
                            permission?: never | undefined;
                        }) & {
                            userId?: string | undefined;
                            role?: "admin" | "staff" | undefined;
                        };
                    };
                };
            }, {
                error: null;
                success: boolean;
            }>;
        };
        $ERROR_CODES: {
            readonly FAILED_TO_CREATE_USER: "Failed to create user";
            readonly USER_ALREADY_EXISTS: "User already exists.";
            readonly USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "User already exists. Use another email.";
            readonly YOU_CANNOT_BAN_YOURSELF: "You cannot ban yourself";
            readonly YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: "You are not allowed to change users role";
            readonly YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: "You are not allowed to create users";
            readonly YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: "You are not allowed to list users";
            readonly YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: "You are not allowed to list users sessions";
            readonly YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: "You are not allowed to ban users";
            readonly YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: "You are not allowed to impersonate users";
            readonly YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: "You are not allowed to revoke users sessions";
            readonly YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: "You are not allowed to delete users";
            readonly YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: "You are not allowed to set users password";
            readonly BANNED_USER: "You have been banned from this application";
            readonly YOU_ARE_NOT_ALLOWED_TO_GET_USER: "You are not allowed to get user";
            readonly NO_DATA_TO_UPDATE: "No data to update";
            readonly YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: "You are not allowed to update users";
            readonly YOU_CANNOT_REMOVE_YOURSELF: "You cannot remove yourself";
            readonly YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE: "You are not allowed to set a non-existent role value";
            readonly YOU_CANNOT_IMPERSONATE_ADMINS: "You cannot impersonate admins";
            readonly INVALID_ROLE_TYPE: "Invalid role type";
        };
        schema: {
            user: {
                fields: {
                    role: {
                        type: "string";
                        required: false;
                        input: false;
                    };
                    banned: {
                        type: "boolean";
                        defaultValue: false;
                        required: false;
                        input: false;
                    };
                    banReason: {
                        type: "string";
                        required: false;
                        input: false;
                    };
                    banExpires: {
                        type: "date";
                        required: false;
                        input: false;
                    };
                };
            };
            session: {
                fields: {
                    impersonatedBy: {
                        type: "string";
                        required: false;
                    };
                };
            };
        };
        options: NoInfer<{
            defaultRole: string;
            ac: {
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
            roles: {
                admin: {
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
                staff: {
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
            };
        }>;
    }];
    trustedOrigins: string[];
    user: {
        additionalFields: {
            defaultCategoryId: {
                type: "string";
                required: false;
                input: false;
            };
            parentId: {
                type: "string";
                required: false;
                input: false;
            };
        };
    };
    emailAndPassword: {
        enabled: true;
        sendResetPassword: ({ user, url, token }: {
            user: import("better-auth").User;
            url: string;
            token: string;
        }) => Promise<void>;
        autoSignIn: false;
    };
    logger: {
        disabled: boolean;
    };
    databaseHooks: {
        user: {
            create: {
                after: (userFromAuth: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    image?: string | null | undefined;
                } & Record<string, unknown>) => Promise<void>;
            };
        };
    };
}>;
/** Utils for assigning parentId. Making sure that `parentId` will never be null*/
export declare function sanitizeUser(user: AuthUser): {
    role: string;
    defaultCategoryId: string;
    parentId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
    banned: boolean | null | undefined;
    banReason?: string | null | undefined;
    banExpires?: Date | null | undefined;
};
export type AuthUser = typeof auth.$Infer.Session.user;
export type NonNullableUser = EnsureNonNullable<AuthUser, "parentId" | "defaultCategoryId">;
export type PublicType = {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
};
export type ProtectedType = {
    user: NonNullableUser;
    session: typeof auth.$Infer.Session.session;
};
export type AuthUserType = NonNullableUser;
//# sourceMappingURL=auth.d.ts.map