"use client";

/** Client-side fetch helpers for the customer account dashboard (/client/*). */

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    ...init,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }
  return data as T;
}

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
}

export const profileApi = {
  get: () => request<ProfileData>("/api/v1/client/profile"),
  update: (data: { name: string; phone: string }) =>
    request<{ success: boolean; profile: ProfileData }>("/api/v1/client/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

export const favoritesApi = {
  list: () => request<{ favorites: string[] }>("/api/v1/client/favorites"),
  toggle: (foodId: string) =>
    request<{ favorites: string[] }>("/api/v1/client/favorites", {
      method: "POST",
      body: JSON.stringify({ foodId }),
    }),
};

export interface AddressInput {
  label: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
}

export interface Address extends AddressInput {
  _id: string;
  isDefault: boolean;
}

export const addressesApi = {
  list: () => request<{ addresses: Address[] }>("/api/v1/client/addresses"),
  create: (input: AddressInput) =>
    request<{ addresses: Address[] }>("/api/v1/client/addresses", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: AddressInput) =>
    request<{ addresses: Address[] }>(`/api/v1/client/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    request<{ addresses: Address[] }>(`/api/v1/client/addresses/${id}`, { method: "DELETE" }),
  setDefault: (id: string) =>
    request<{ addresses: Address[] }>(`/api/v1/client/addresses/${id}`, { method: "PATCH" }),
};

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  restaurantId?: { _id: string; restaurantName: string; logoUrl?: string } | string;
  restaurantName?: string;
  riderId?: { _id: string; fullName: string; phone?: string } | string;
  items: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  deliveryAddress: string;
  paymentMethod: "cash" | "card" | "online";
  paymentStatus: "pending" | "paid" | "failed";
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  createdAt: string;
}

export interface PlaceOrderInput {
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  deliveryAddress: string;
  city: string;
  paymentMethod: "cod" | "online";
}

export const ordersApi = {
  list: () => request<{ orders: Order[] }>("/api/v1/client/orders"),
  place: (input: PlaceOrderInput) =>
    request<{ order: Order }>("/api/v1/client/orders", {
      method: "POST",
      body: JSON.stringify(input),
    }),
};

export function orderRestaurantName(order: Order): string {
  if (order.restaurantName) return order.restaurantName;
  if (order.restaurantId && typeof order.restaurantId === "object") {
    return order.restaurantId.restaurantName;
  }
  return "Restaurant";
}

export type DisplayOrderStatus = "Delivered" | "On the way" | "Preparing" | "Cancelled";

export function toDisplayStatus(status: Order["status"]): DisplayOrderStatus {
  if (status === "delivered") return "Delivered";
  if (status === "cancelled") return "Cancelled";
  if (status === "out_for_delivery") return "On the way";
  return "Preparing";
}
