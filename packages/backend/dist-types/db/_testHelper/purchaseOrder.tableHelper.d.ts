import { type PurchaseOrderDbInsert } from "../schema/purchaseOrder.schema";
type CleanOption = {
    userId?: string | null;
    purchaseOrderId?: string | null;
};
type FindOptions = {
    withItems?: true;
};
export declare function add(payload: PurchaseOrderDbInsert): Promise<{
    id: string;
}[]>;
export declare function findByUserId(userId: string, option?: FindOptions): Promise<{
    id: string;
    createdAt: Date;
    userIdParent: string;
    userIdCreator: string;
    modifiedAt: Date;
    vendorId: string;
    totalCost: number;
    imageId: string | null;
    orderedAt: Date;
    purchaseItem: {
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
    }[];
}[]>;
export declare function findById(purchaseOrderId: string, option?: FindOptions): Promise<{
    id: string;
    createdAt: Date;
    userIdParent: string;
    userIdCreator: string;
    modifiedAt: Date;
    vendorId: string;
    totalCost: number;
    imageId: string | null;
    orderedAt: Date;
    purchaseItem: {
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
    }[];
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
//# sourceMappingURL=purchaseOrder.tableHelper.d.ts.map