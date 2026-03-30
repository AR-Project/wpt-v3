import type { Tx } from "@/db";
import { type CreateCategoryDbPayload } from "@/db/schema/category.schema";
export declare function createCategoryTx(tx: Tx, payload: CreateCategoryDbPayload): Promise<{
    id: string;
    name: string;
}[]>;
export declare function readCategoryByIdTx(categoryId: string, tx: Tx): Promise<{
    id: string;
    name: string;
    createdAt: Date;
    userIdParent: string;
    userIdCreator: string;
    modifiedAt: Date;
    sortOrder: number | null;
} | undefined>;
//# sourceMappingURL=category.repository.d.ts.map