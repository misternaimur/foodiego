"use client";

export interface ChatMessage {
  _id: string;
  orderId: string;
  channel: "customer_rider" | "restaurant_rider";
  senderId: string;
  senderRole: "customer" | "rider" | "restaurant";
  message: string;
  createdAt: string;
}

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

// UPDATE (restaurant-rider chat fix): both helpers now take an optional
// `channel` ("customer_rider" | "restaurant_rider", default
// "customer_rider") so the same client API serves the restaurant<->rider
// chat panel, not just the customer<->rider one.
export const chatApi = {
  list: (orderId: string, since?: string, channel: ChatMessage["channel"] = "customer_rider") => {
    const params = new URLSearchParams({ channel });
    if (since) params.set("since", since);
    return request<{ messages: ChatMessage[]; selfRole: "customer" | "rider" | "restaurant" }>(
      `/api/v1/chat/${orderId}?${params.toString()}`
    );
  },
  send: (orderId: string, message: string, channel: ChatMessage["channel"] = "customer_rider") =>
    request<{ message: ChatMessage }>(`/api/v1/chat/${orderId}?channel=${channel}`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};
