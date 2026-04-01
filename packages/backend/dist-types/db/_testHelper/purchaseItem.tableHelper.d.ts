import { type PurchaseItemDbInsert } from "../schema";
type CleanOption = {
    userId?: string | null;
    purchaseItemId?: string | null;
};
export declare function add(payload: PurchaseItemDbInsert): Promise<{
    id: string;
}[]>;
export declare function findByUserId(userId: string): Promise<{
    id: string;
    createdAt: Date;
    userIdParent: string;
    userIdCreator: string;
    modifiedAt: Date;
    purchaseOrderId: string;
    sortOrder: number | null;
    productId: string;
    costPrice: number;
    quantity: number;
}[]>;
export declare function findById(purchaseItemId: string): Promise<{
    id: string;
    createdAt: Date;
    userIdParent: string;
    userIdCreator: string;
    modifiedAt: Date;
    purchaseOrderId: string;
    sortOrder: number | null;
    productId: string;
    costPrice: number;
    quantity: number;
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
//# sourceMappingURL=purchaseItem.tableHelper.d.ts.map