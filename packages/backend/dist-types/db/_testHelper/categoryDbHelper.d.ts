import { type CreateCategoryDbPayload } from "../schema/category.schema";
type CleanOption = {
    userId?: string | null;
    categoryId?: string | null;
};
export declare const categoryTbHelper: {
    add: (payload: CreateCategoryDbPayload) => Promise<{
        id: string;
        name: string;
    }[]>;
    find: (userId: string) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        userIdParent: string;
        userIdCreator: string;
        modifiedAt: Date;
        sortOrder: number | null;
    }[]>;
    findById: (categoryId: string) => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        userIdParent: string;
        userIdCreator: string;
        modifiedAt: Date;
        sortOrder: number | null;
    }[]>;
    getAll: () => Promise<{
        id: string;
        name: string;
        createdAt: Date;
        userIdParent: string;
        userIdCreator: string;
        modifiedAt: Date;
        sortOrder: number | null;
    }[]>;
    clean: (option?: CleanOption) => Promise<void>;
    nuke: () => Promise<void>;
};
export {};
//# sourceMappingURL=categoryDbHelper.d.ts.map