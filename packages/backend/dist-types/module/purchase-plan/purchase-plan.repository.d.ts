import type { NonNullableUser } from "@/lib/auth";
import type * as piSchema from "./purchase-plan.schema";
export declare function create(payload: piSchema.CreatePurchasePlanPayload, user: NonNullableUser): Promise<string>;
export declare function update(payload: piSchema.PatchPayload, poIdToUpdate: string, user: NonNullableUser): Promise<void>;
export declare function updateSortOrder(poIdToUpdate: string, payload: {
    newIdOrder: string[];
}): Promise<void>;
//# sourceMappingURL=purchase-plan.repository.d.ts.map