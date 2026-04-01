import { type PurchasePlanItemDbInsert } from "../schema/purchasePlanItem.schema";
type CleanOption = {
    userId?: string | null;
    purchasePlanItemId?: string | null;
};
export declare function add(payload: PurchasePlanItemDbInsert): Promise<{
    id: string;
}[]>;
export declare function findByUserId(userId: string): Promise<{
    id: string;
    createdAt: Date;
    userIdParent: string;
    userIdCreator: string;
    modifiedAt: Date;
    sortOrder: number | null;
    productId: string;
    costPrice: number;
    quantity: number;
    purchasePlanId: string;
}[]>;
export declare function findById(purchasePlanItemId: string): Promise<{
    id: string;
    createdAt: Date;
    userIdParent: string;
    userIdCreator: string;
    modifiedAt: Date;
    sortOrder: number | null;
    productId: string;
    costPrice: number;
    quantity: number;
    purchasePlanId: string;
}[]>;
export declare function getAll(): Promise<{
    id: string;
    name: string;
    createdAt: Date;
    userIdParent: string;
    userIdCreator: string;
    modifiedAt: Date;
}[]>;
export declare function clean(option?: CleanOption): Promise<void>;
export declare function nuke(): Promise<void>;
export {};
//# sourceMappingURL=purchasePlanItem.tableHelper.d.ts.map