import { type PublicType } from '@lib/auth';
export declare const authRoute: import("hono/hono-base").HonoBase<{
    Variables: PublicType;
}, {
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
}, "/", "/*">;
//# sourceMappingURL=auth.routes.d.ts.map