import type { NonNullableUser } from "@/lib/auth";
import type * as vendorSchema from "@/module/vendor/vendor.schema";
export declare function getAll(user: NonNullableUser): Promise<{
    id: string;
    name: string;
}[]>;
export declare function create(payload: vendorSchema.CreatePayload, user: NonNullableUser): Promise<{
    id: string;
    name: string;
}[]>;
export declare function remove(payload: {
    id: string;
}, user: NonNullableUser): Promise<void>;
export declare function update(payload: {
    id: string;
    name: string;
}, user: NonNullableUser): Promise<void>;
//# sourceMappingURL=vendor.repository.d.ts.map