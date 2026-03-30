import { type ProtectedType, type PublicType } from "@/lib/auth";
/**
 * @deprecated
 */
export declare const authPublicMiddleware: import("hono").MiddlewareHandler<{
    Variables: PublicType;
}, string, {}, Response>;
export declare const authProtectedMiddleware: import("hono").MiddlewareHandler<{
    Variables: ProtectedType;
}, string, {}, Response>;
//# sourceMappingURL=auth.middleware.d.ts.map