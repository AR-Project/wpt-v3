import z from "zod";
import type { AuthUserType, ProtectedType } from "./lib/auth";


// Authentication
export type AuthType = ProtectedType

export type AuthTypeUser = AuthUserType


// Category schema
export const createCategorySchema = z.object({
  name: z.string().min(3)
})
export type CreateCategoryPayload = z.infer<typeof createCategorySchema>

export const updateCategorySchema = z.object({
  id: z.string().min(10),
  name: z.string().min(3)
})
export type UpdateCategoryPayload = z.infer<typeof updateCategorySchema>
