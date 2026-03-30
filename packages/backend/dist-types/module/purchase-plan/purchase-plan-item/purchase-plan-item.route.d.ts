import type { ProtectedType } from "@lib/auth";
type VariablesTypes = ProtectedType & {
    purchasePlanId: string;
};
export declare const purchasePlanItemRoute: import("hono/hono-base").HonoBase<{
    Variables: VariablesTypes;
}, {
    "/:purchasePlanItemId": {
        $patch: {
            input: {
                param: {
                    purchasePlanId: string;
                    purchasePlanItemId: string;
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
}, "/", "/:purchasePlanItemId">;
export {};
//# sourceMappingURL=purchase-plan-item.route.d.ts.map