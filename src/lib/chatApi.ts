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

export type ChatRole = ChatMessage["senderRole"];

export interface ChatThread {
  messages: ChatMessage[];
  selfRole: ChatRole;
  peer: { name: string; role: ChatRole };
  canSend: boolean;
}

/** Carries the HTTP status so the chat panel can tell "no access" apart from a flaky network. */
export class ChatRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ChatRequestError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    cache: "no-store",
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    ...init,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ChatRequestError(data?.error || "Request failed", res.status);
  }
  return data as T;
}

export const chatApi = {
  list: (orderId: string, since?: string, channel: ChatMessage["channel"] = "customer_rider") => {
    const params = new URLSearchParams({ channel });
    if (since) params.set("since", since);
    return request<ChatThread>(`/api/v1/chat/${orderId}?${params.toString()}`);
  },
  send: (orderId: string, message: string, channel: ChatMessage["channel"] = "customer_rider") =>
    request<{ message: ChatMessage }>(`/api/v1/chat/${orderId}?channel=${channel}`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};
