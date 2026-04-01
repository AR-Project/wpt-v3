import { type ProductDbInsert } from "../schema/product.schema";
type CleanOption = {
    userId?: string | null;
    productId?: string | null;
};
export declare const productTbHelper: {
    add: (payload: ProductDbInsert) => Promise<void>;
    findByUserId: (userId: string) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        userIdParent: string;
        userIdCreator: string;
        modifiedAt: Date;
        imageId: string | null;
        sortOrder: number | null;
        categoryId: string;
        displayQtyDivider: number | null;
        displayUnitName: string | null;
    }[]>;
    findById: (itemId: string) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        userIdParent: string;
        userIdCreator: string;
        modifiedAt: Date;
        imageId: string | null;
        sortOrder: number | null;
        categoryId: string;
        displayQtyDivider: number | null;
        displayUnitName: string | null;
    }[]>;
    findAll: () => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        userIdParent: string;
        userIdCreator: string;
        modifiedAt: Date;
        imageId: string | null;
        sortOrder: number | null;
        categoryId: string;
        displayQtyDivider: number | null;
        displayUnitName: string | null;
    }[]>;
    clean: (option?: CleanOption) => Promise<void>;
    nuke: () => Promise<void>;
};
export {};
//# sourceMappingURL=product.tableHelper.d.ts.map