import { type PurchasePlanDbInsert } from "../schema/purchasePlan.schema";
type CleanOption = {
    userId?: string | null;
    purchasePlanId?: string | null;
};
type FindOptions = {
    withItems?: true;
};
export declare function add(payload: PurchasePlanDbInsert): Promise<{
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
    orderedAt: Date;
    purchasePlanItem: {
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
    }[];
}[]>;
export declare function findById(purchasePlanId: string, option?: FindOptions): Promise<{
    id: string;
    createdAt: Date;
    userIdParent: string;
    userIdCreator: string;
    modifiedAt: Date;
    vendorId: string;
    totalCost: number;
    orderedAt: Date;
    purchasePlanItem: {
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
//# sourceMappingURL=purchasePlan.tableHelper.d.ts.map