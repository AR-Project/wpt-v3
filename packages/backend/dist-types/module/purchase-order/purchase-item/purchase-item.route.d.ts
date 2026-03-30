/**
 * Notes:
 * - patch purchase Item - (side effect: changing costPrice shoud recalculate purchase order total cost)
 */
import type { ProtectedType } from "@lib/auth";
type VariablesTypes = ProtectedType & {
    purchaseOrderId: string;
};
export declare const purchaseItemRoute: import("hono/hono-base").HonoBase<{
    Variables: VariablesTypes;
}, {
    "/:purchaseItemId": {
        $patch: {
            input: {
                param: {
                    purchaseOrderId: string;
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
}, "/", "/:purchaseItemId">;
export {};
//# sourceMappingURL=purchase-item.route.d.ts.map