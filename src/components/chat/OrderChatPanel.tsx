"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send, MessageCircle, LoaderCircle } from "lucide-react";
import { chatApi, type ChatMessage } from "@/lib/chatApi";

const POLL_INTERVAL_MS = 4000;

export default function OrderChatPanel({
  orderId,
  peerLabel,
  channel = "customer_rider",
}: {
  orderId: string;
  /** Who the current viewer is chatting with, e.g. "your rider" or "the customer". */
  peerLabel: string;
  /** UPDATE (restaurant-rider chat fix): lets this same panel back the restaurant<->rider chat too. */
  channel?: ChatMessage["channel"];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selfRole, setSelfRole] = useState<"customer" | "rider" | "restaurant" | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastTimestamp = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const poll = useCallback(async () => {
    try {
      const data = await chatApi.list(orderId, lastTimestamp.current || undefined, channel);
      setSelfRole(data.selfRole);
      if (data.messages.length > 0) {
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m._id));
          const fresh = data.messages.filter((m) => !existingIds.has(m._id));
          return fresh.length > 0 ? [...prev, ...fresh] : prev;
        });
        lastTimestamp.current = data.messages[data.messages.length - 1].createdAt;
      }
    } catch {
      // Next poll retries; no need to surface transient network errors.
    } finally {
      setLoading(false);
    }
  }, [orderId, channel]);

  useEffect(() => {
    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [poll]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    setError(null);
    setInput("");
    try {
      const { message } = await chatApi.send(orderId, text, channel);
      setMessages((prev) => (prev.some((m) => m._id === message._id) ? prev : [...prev, message]));
      lastTimestamp.current = message.createdAt;
    } catch {
      setError("Message failed to send. Please try again.");
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <MessageCircle size={16} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Chat with {peerLabel}</p>
          <p className="text-[11px] text-slate-400">About this delivery</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto px-4 py-3" style={{ minHeight: 220, maxHeight: 320 }}>
        {loading ? (
          <div className="flex h-full items-center justify-center text-slate-300">
            <LoaderCircle size={20} className="animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <p className="py-8 text-center text-xs text-slate-400">
            No messages yet — say hello about the delivery.
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.senderRole === selfRole;
            return (
              <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs ${
                    mine ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.message}</p>
                  <p className={`mt-1 text-[10px] ${mine ? "text-emerald-100" : "text-slate-400"}`}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {error && <p className="px-4 pb-1 text-[11px] font-medium text-rose-600">{error}</p>}

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-slate-100 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message about delivery time..."
          maxLength={2000}
          className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:opacity-50"
          aria-label="Send message"
        >
          {sending ? <LoaderCircle size={15} className="animate-spin" /> : <Send size={15} />}
        </button>
      </form>
    </div>
  );
}
