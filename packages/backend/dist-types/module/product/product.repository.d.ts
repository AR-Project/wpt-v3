import type { NonNullableUser } from "@/lib/auth";
import type { CreateItemPayload, DeleteItemPayload, UpdateItemPayload } from "./product.schema";
type GetPayload = {
    userIdParent: string;
};
export declare function getAllByUser({ userIdParent }: GetPayload): Promise<{
    latestPrice: number;
    id: string;
    name: string;
    sortOrder: number | null;
}[]>;
export declare function create(payload: CreateItemPayload, user: NonNullableUser): Promise<{
    id: string;
    name: string;
    categoryId: string;
}[]>;
export declare function update(payload: UpdateItemPayload, user: NonNullableUser): Promise<void>;
export declare function remove(payload: DeleteItemPayload, user: NonNullableUser): Promise<void>;
export declare function updateSortOrderMultiple(categoryIdToUpdate: string, user: NonNullableUser, itemIdsNewOrder: string[]): Promise<void>;
export {};
//# sourceMappingURL=product.repository.d.ts.map