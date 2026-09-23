"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send, MessageCircle, LoaderCircle, Lock, WifiOff } from "lucide-react";
import { chatApi, ChatRequestError, type ChatMessage, type ChatRole } from "@/lib/chatApi";

const POLL_INTERVAL_MS = 4000;

const ROLE_LABEL: Record<ChatRole, string> = {
  customer: "Customer",
  rider: "Rider",
  restaurant: "Restaurant",
};

interface OrderChatPanelProps {
  orderId: string;
  /** Fallback name for the other side until the first load returns their real name, e.g. "your rider". */
  peerLabel: string;
  channel?: ChatMessage["channel"];
}

/**
 * One order-chat thread (customer<->rider or restaurant<->rider). Keyed by
 * order + channel so switching either starts a clean thread instead of
 * mixing messages from the previous one.
 */
export default function OrderChatPanel(props: OrderChatPanelProps) {
  const channel = props.channel ?? "customer_rider";
  return <ChatThreadPanel key={`${props.orderId}:${channel}`} {...props} channel={channel} />;
}

function ChatThreadPanel({ orderId, peerLabel, channel }: Required<OrderChatPanelProps>) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selfRole, setSelfRole] = useState<ChatRole | null>(null);
  const [peer, setPeer] = useState<{ name: string; role: ChatRole } | null>(null);
  const [canSend, setCanSend] = useState(true);
  const [loading, setLoading] = useState(true);
  // A 4xx from the server (not a participant, no rider yet, ...): shown in place of the thread.
  const [accessError, setAccessError] = useState<string | null>(null);
  // Network/5xx trouble while polling: messages stay visible, a small banner explains.
  const [offline, setOffline] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const lastTimestamp = useRef<string | null>(null);
  const pollInFlight = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const mergeMessages = useCallback((incoming: ChatMessage[]) => {
    if (incoming.length === 0) return;
    setMessages((prev) => {
      const existingIds = new Set(prev.map((m) => m._id));
      const fresh = incoming.filter((m) => !existingIds.has(m._id));
      return fresh.length > 0 ? [...prev, ...fresh] : prev;
    });
    const newest = incoming[incoming.length - 1].createdAt;
    if (!lastTimestamp.current || newest > lastTimestamp.current) {
      lastTimestamp.current = newest;
    }
  }, []);

  const poll = useCallback(async () => {
    if (pollInFlight.current) return;
    pollInFlight.current = true;
    try {
      const data = await chatApi.list(orderId, lastTimestamp.current || undefined, channel);
      setSelfRole(data.selfRole);
      setPeer(data.peer);
      setCanSend(data.canSend);
      setAccessError(null);
      setOffline(false);
      mergeMessages(data.messages);
    } catch (error) {
      if (error instanceof ChatRequestError && error.status >= 400 && error.status < 500) {
        setAccessError(error.message);
      } else {
        setOffline(true);
      }
    } finally {
      pollInFlight.current = false;
      setLoading(false);
    }
  }, [orderId, channel, mergeMessages]);

  // Poll while the tab is visible; catch up immediately when it becomes visible again.
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "visible") poll();
    };
    Promise.resolve().then(poll);
    const interval = setInterval(tick, POLL_INTERVAL_MS);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [poll]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending || !canSend) return;

    setSending(true);
    setSendError(null);
    setInput("");
    try {
      const { message } = await chatApi.send(orderId, text, channel);
      mergeMessages([message]);
    } catch (error) {
      setSendError(error instanceof ChatRequestError ? error.message : "Message failed to send. Please try again.");
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  const title = peer ? peer.name : peerLabel;
  const subtitle = peer ? `${ROLE_LABEL[peer.role]} · about this delivery` : "About this delivery";
  const inputDisabled = !!accessError || !canSend || loading;

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <MessageCircle size={16} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">Chat with {title}</p>
          <p className="text-[11px] text-slate-400">{subtitle}</p>
        </div>
        {offline && !accessError && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
            <WifiOff size={11} /> Reconnecting…
          </span>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-2 overflow-y-auto px-4 py-3"
        style={{ minHeight: 220, maxHeight: 320 }}
        aria-live="polite"
      >
        {loading ? (
          <div className="flex h-full items-center justify-center py-8 text-slate-300">
            <LoaderCircle size={20} className="animate-spin" />
          </div>
        ) : accessError ? (
          <p className="py-8 text-center text-xs text-slate-500">{accessError}</p>
        ) : messages.length === 0 ? (
          <p className="py-8 text-center text-xs text-slate-400">No messages yet — say hello about the delivery.</p>
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
                    {mine ? "You" : ROLE_LABEL[m.senderRole]} ·{" "}
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {sendError && <p className="px-4 pb-1 text-[11px] font-medium text-rose-600">{sendError}</p>}

      {!loading && !accessError && !canSend ? (
        <div className="flex items-center justify-center gap-1.5 border-t border-slate-100 p-3 text-[11px] font-medium text-slate-400">
          <Lock size={12} /> This order is finished, so the chat is closed.
        </div>
      ) : (
        <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-slate-100 p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message about the delivery..."
            maxLength={2000}
            disabled={inputDisabled}
            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={sending || !input.trim() || inputDisabled}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:opacity-50"
            aria-label="Send message"
          >
            {sending ? <LoaderCircle size={15} className="animate-spin" /> : <Send size={15} />}
          </button>
        </form>
      )}
    </div>
  );
}
