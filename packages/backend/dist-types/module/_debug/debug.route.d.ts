export declare const debugRoute: import("hono/hono-base").HonoBase<import("hono/types").BlankEnv, {
    "/nuke/all": {
        $post: {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/nuke/transactional": {
        $post: {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}, "/", "/nuke/transactional">;
//# sourceMappingURL=debug.route.d.ts.map