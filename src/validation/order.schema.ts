// src/validation/order.schema.ts
import { z } from "zod";

export const orderItemSchema = z.object({
  menuItemId: z.string().min(1, "Menu item ID is required"),
  name: z.string().min(1, "Item name is required"),
  price: z.number().positive("Price must be a positive number"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
  image: z.string().url().optional(),
});

export const createOrderSchema = z.object({
  restaurantId: z.string().min(1, "Restaurant ID is required"),
  items: z.array(orderItemSchema).min(1, "Order must contain at least one item"),
  deliveryAddress: z.object({
    street: z.string().min(3, "Street address is required"),
    city: z.string().min(2, "City name is required"),
    coordinates: z.tuple([z.number(), z.number()]).optional(),
  }),
  paymentMethod: z.enum(["cod", "online"], {
    message: "Payment method must be either 'cod' or 'online'",
  }),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "accepted",
    "preparing",
    "ready_for_delivery",
    "picked_up",
    "delivered",
    "cancelled",
  ]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;