import type { NonNullableUser } from "@/lib/auth";
import type * as poSchema from "./purchase-order.schema";
export declare function create(payload: poSchema.CreatePurchaseOrderPayload, user: NonNullableUser): Promise<string>;
export declare function update(payload: poSchema.PatchPayload, poIdToUpdate: string, user: NonNullableUser): Promise<void>;
export declare function updateSortOrder(poIdToUpdate: string, payload: {
    newIdOrder: string[];
}): Promise<void>;
//# sourceMappingURL=purchase-order.repository.d.ts.map