import { type CreateCategoryDbPayload } from "../schema/category.schema";
type CleanOption = {
    userId?: string | null;
};
export declare const authTableHelper: {
    add: (payload: CreateCategoryDbPayload) => Promise<{
        id: string;
    }[]>;
    find: (email: string) => Promise<{
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        banned: boolean | null;
        role: "admin" | "manager" | "staff" | "guest";
        banReason: string | null;
        banExpires: Date | null;
        parentId: string | null;
        defaultCategoryId: string | null;
    }[]>;
    findById: (id: string) => Promise<{
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        banned: boolean | null;
        role: "admin" | "manager" | "staff" | "guest";
        banReason: string | null;
        banExpires: Date | null;
        parentId: string | null;
        defaultCategoryId: string | null;
    }[]>;
    findAll: () => Promise<{
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        banned: boolean | null;
        role: "admin" | "manager" | "staff" | "guest";
        banReason: string | null;
        banExpires: Date | null;
        parentId: string | null;
        defaultCategoryId: string | null;
    }[]>;
    clean: (option?: CleanOption) => Promise<void>;
    cleanByParentId: (parentId: string) => Promise<void>;
    nuke: () => Promise<void>;
};
export {};
//# sourceMappingURL=authDbHelper.d.ts.map