import { type VendorDbInsert } from "../schema/vendor.schema";
type CleanOption = {
    userId?: string | null;
    vendorId?: string | null;
};
export declare function add(payload: VendorDbInsert): Promise<{
    id: string;
    name: string;
}[]>;
export declare function findByUserId(userId: string): Promise<{
    id: string;
    name: string;
    createdAt: Date;
    userIdParent: string;
    userIdCreator: string;
    modifiedAt: Date;
}[]>;
export declare function findById(vendorId: string): Promise<{
    id: string;
    name: string;
    createdAt: Date;
    userIdParent: string;
    userIdCreator: string;
    modifiedAt: Date;
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
//# sourceMappingURL=vendor.tableHelper.d.ts.map