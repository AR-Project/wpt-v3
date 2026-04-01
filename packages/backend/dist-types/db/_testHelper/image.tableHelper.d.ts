import { type ImageDbInsert } from "../schema";
type CleanOption = {
    userId?: string | null;
    imageId?: string | null;
};
export declare function add(payload: ImageDbInsert): Promise<{
    id: string;
    url: string;
}[]>;
export declare function findByUserId(userId: string): Promise<{
    id: string;
    createdAt: Date;
    userIdParent: string;
    userIdCreator: string;
    url: string;
    originalFileName: string;
}[]>;
export declare function findById(imageId: string): Promise<{
    id: string;
    createdAt: Date;
    userIdParent: string;
    userIdCreator: string;
    url: string;
    originalFileName: string;
}[]>;
export declare function getAll(): Promise<{
    id: string;
    createdAt: Date;
    userIdParent: string;
    userIdCreator: string;
    url: string;
    originalFileName: string;
}[]>;
export declare function clean(option?: CleanOption): Promise<void>;
export declare function nuke(): Promise<void>;
export {};
//# sourceMappingURL=image.tableHelper.d.ts.map