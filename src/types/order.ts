// src/types/order.ts

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready_for_delivery"
  | "picked_up"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "online";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  clientId: string;
  vendorId: string;
  riderId?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  deliveryAddress: {
    street: string;
    city: string;
    coordinates?: [number, number];
  };
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
}

