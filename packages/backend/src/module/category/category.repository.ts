import type { Tx } from "@/db";
import { category, type CreateCategoryDbPayload } from "@/db/schema/category.schema";

export async function createCategoryTx(
  tx: Tx,
  payload: CreateCategoryDbPayload
) {
  return await tx
    .insert(category)
    .values(payload)
    .returning({ id: category.id, name: category.name });
}

export async function readCategoryByIdTx(categoryId: string, tx: Tx) {
  return await tx.query.category.findFirst({
    where: (category, { eq }) => eq(category.id, categoryId),
  });
}