// src/validation/menu.schema.ts
import { z } from "zod";

export const createMenuItemSchema = z.object({
  name: z.string().min(2, "Item name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.number().positive("Price must be greater than zero"),
  category: z.string().min(2, "Category is required"),
  image: z.string().url("Must be a valid image URL"),
  isAvailable: z.boolean().default(true),
  preparationTime: z.number().int().positive("Preparation time must be a positive number").optional(),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;