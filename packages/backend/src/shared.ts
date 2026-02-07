import z from "zod";
import type { AuthUserType, ProtectedType } from "./lib/auth";

export const createCategorySchema = z.object({
  name: z.string().min(3)
})

export type AuthType = ProtectedType

export type AuthTypeUser = AuthUserType