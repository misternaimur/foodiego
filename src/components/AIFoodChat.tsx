"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  User,
  SendHorizontal,
  RotateCcw,
  MessageSquareHeart,
  Zap,
  Star,
  Sparkles,
  Utensils,
  Truck,
  CreditCard,
  Heart,
  Clock,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ChatMessage {
  id: number;
  sender: "bot" | "user";
  content: string;
  time: string;
  isError?: boolean;
  isLoading?: boolean;
  hasPopular?: boolean;
}

interface StarterPrompt {
  label: string;
  prompt: string;
  icon: LucideIcon;
}

const POPULAR_DISHES = [
  { dish: "Margherita Classic Pizza", rating: "4.9/5", desc: "Light, fresh and perfect for sharing" },
  { dish: "Spicy Chipotle Beef Burger", rating: "4.8/5", desc: "A bold burger with cheddar and smoky heat" },
  { dish: "Butter Paneer Masala", rating: "4.7/5", desc: "A comforting vegetarian favorite" },
];

const POPULAR_KEYWORDS = ["popular", "top", "recommend", "best", "rated", "trending", "famous"];

const STARTER_PROMPTS: StarterPrompt[] = [
  {
    label: "Find a craving",
    prompt: "Recommend something delicious for my mood",
    icon: Sparkles,
  },
  {
    label: "Eat lighter",
    prompt: "Show me a healthy dinner option",
    icon: Heart,
  },
  {
    label: "Track an order",
    prompt: "Where is my latest order?",
    icon: Truck,
  },
  {
    label: "Use a promo",
    prompt: "How do I apply a promo code?",
    icon: CreditCard,
  },
];

const MESSAGE_VARIANTS = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function createWelcomeMessage(): ChatMessage {
  return {
    id: 1,
    sender: "bot",
    content:
      "I am your FoodieGo AI concierge. Tell me what you are craving, ask about an order, or let me help you find a smarter way to eat.",
    time: formatTime(new Date()),
  };
}

export default function AIFoodChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([createWelcomeMessage()]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<"connecting" | "online" | "limited">("connecting");
  const idCounter = useRef(2);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "hello", chatHistory: [] }),
        });
        const data: { source?: string } = await res.json();
        setApiStatus(data.source && data.source !== "local" ? "online" : "limited");
      } catch {
        setApiStatus("limited");
      }
    };

    checkApiStatus();
  }, []);

  const handleSend = useCallback(
    async (text?: string) => {
      const query = text ?? input;
      if (!query.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: idCounter.current++,
        sender: "user",
        content: query,
        time: formatTime(new Date()),
      };
      const loadingMsg: ChatMessage = {
        id: idCounter.current++,
        sender: "bot",
        content: "",
        time: formatTime(new Date()),
        isLoading: true,
      };

      setMessages((prev) => [...prev, userMsg, loadingMsg]);
      setInput("");
      setIsLoading(true);

      try {
        const chatHistory = messages
          .filter((message) => !message.isLoading)
          .map((message) => ({
            sender: message.sender === "user" ? "user" : "assistant",
            text: message.content,
          }));

        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: query, chatHistory }),
        });
        const data: { reply?: string; error?: string; source?: string } = await res.json();

        if (data.source && data.source !== "local") {
          setApiStatus("online");
        } else {
          setApiStatus("limited");
        }

        setMessages((prev) => {
          const withoutLoading = prev.filter((message) => message.id !== loadingMsg.id);
          if (data.error) {
            return [
              ...withoutLoading,
              {
                id: idCounter.current++,
                sender: "bot",
                content: data.error,
                time: formatTime(new Date()),
                isError: true,
              } satisfies ChatMessage,
            ];
          }

          if (!data.reply) {
            return [
              ...withoutLoading,
              {
                id: idCounter.current++,
                sender: "bot",
                content: "I could not reach the assistant right now. Please try again in a moment.",
                time: formatTime(new Date()),
                isError: true,
              } satisfies ChatMessage,
            ];
          }

          const hasPopular = POPULAR_KEYWORDS.some((keyword) => data.reply!.toLowerCase().includes(keyword));
          return [
            ...withoutLoading,
            {
              id: idCounter.current++,
              sender: "bot",
              content: data.reply,
              time: formatTime(new Date()),
              hasPopular,
            } satisfies ChatMessage,
          ];
        });
      } catch {
        setApiStatus("limited");
        setMessages((prev) => {
          const withoutLoading = prev.filter((message) => message.id !== loadingMsg.id);
          return [
            ...withoutLoading,
            {
              id: idCounter.current++,
              sender: "bot",
              content: "The assistant could not respond right now. Please try again.",
              time: formatTime(new Date()),
              isError: true,
            } satisfies ChatMessage,
          ];
        });
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages]
  );

  const handleReset = () => {
    setInput("");
    setIsLoading(false);
    setMessages([createWelcomeMessage()]);
    idCounter.current = 2;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSend();
  };

  return (
    <div className="flex h-full min-h-[620px] flex-col overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white/90 shadow-[0_24px_80px_rgba(21,70,45,0.14)] backdrop-blur-2xl">
      <header className="relative overflow-hidden border-b border-emerald-900/10 bg-gradient-to-br from-[#124734] via-[#15462D] to-[#1d6b48] px-5 py-5 text-white sm:px-6">
        <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-amber-400/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-40 w-40 rounded-full bg-purple-500/20 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 border border-white/20 shadow-lg shadow-emerald-950/20"
          >
            <Bot className="h-6 w-6 text-amber-300" />
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Foodiego intelligence</p>
              <span className="hidden h-1 w-1 rounded-full bg-emerald-300 sm:block" />
              <span className="hidden text-[10px] font-semibold text-emerald-100/80 sm:block">Concierge</span>
            </div>
            <h1 className="mt-1 truncate text-xl font-black tracking-tight sm:text-2xl">Your AI food assistant</h1>
            <div className="mt-1.5 flex items-center gap-2 text-[11px] font-medium text-emerald-100/80">
              <span className={`h-1.5 w-1.5 rounded-full ${apiStatus === "online" ? "bg-emerald-300" : "bg-amber-300"} animate-pulse`} />
              {apiStatus === "online" ? "AI powered and ready" : "Preparing your assistant"}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleReset}
            type="button"
            aria-label="Start a new conversation"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-emerald-50 transition-colors hover:bg-white/20"
          >
            <RotateCcw className="h-4 w-4" />
          </motion.button>
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto bg-[#FAF7EE]/90 px-4 py-5 sm:px-6 sm:py-6" aria-live="polite">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              variants={MESSAGE_VARIANTS}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={{ duration: 0.28, ease: "easeOut" }}
              className={`flex items-end gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "bot" && (
                <div className={`mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${message.isError ? "border-red-200 bg-red-50 text-red-500" : "border-emerald-100 bg-white text-[#15462D]"} shadow-sm`}>
                  {message.isError ? <Zap className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
              )}

              <div className={`max-w-[86%] sm:max-w-[82%] ${message.sender === "user" ? "order-first" : ""}`}>
                <div
                  className={`rounded-[1.25rem] px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    message.sender === "user"
                      ? "rounded-br-md bg-[#15462D] text-white"
                      : message.isError
                        ? "rounded-bl-md border border-red-100 bg-red-50 text-red-700"
                        : "rounded-bl-md border border-emerald-900/5 bg-white text-slate-700"
                  }`}
                >
                  {message.isLoading ? (
                    <div className="flex items-center gap-1.5 py-1 text-[#15462D]/50" aria-label="Assistant is typing">
                      <motion.span animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 1, repeat: Infinity }} className="h-1.5 w-1.5 rounded-full bg-[#15462D]" />
                      <motion.span animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 1, repeat: Infinity, delay: 0.18 }} className="h-1.5 w-1.5 rounded-full bg-[#15462D]" />
                      <motion.span animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 1, repeat: Infinity, delay: 0.36 }} className="h-1.5 w-1.5 rounded-full bg-[#15462D]" />
                    </div>
                  ) : (
                    <>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <time className="mt-2 block text-[10px] font-medium opacity-50">{message.time}</time>
                    </>
                  )}
                </div>

                {message.hasPopular && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.25 }}
                    className="mt-3 space-y-2"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#15462D]/50">Popular right now</p>
                    {POPULAR_DISHES.map((item) => (
                      <div key={item.dish} className="flex items-center gap-3 rounded-2xl border border-emerald-900/5 bg-white p-3 shadow-sm">
                        <MessageSquareHeart className="h-4 w-4 shrink-0 text-emerald-700" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-emerald-950">{item.dish}</p>
                          <p className="mt-0.5 truncate text-[10px] text-slate-500">{item.desc}</p>
                        </div>
                        <span className="flex shrink-0 items-center gap-1 text-[11px] font-black text-amber-600">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                          {item.rating}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {message.sender === "user" && (
                <div className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-900/5 bg-emerald-50 text-[#15462D] shadow-sm">
                  <User className="h-4 w-4" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      <footer className="border-t border-emerald-900/10 bg-white/95 px-4 py-4 sm:px-6">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {STARTER_PROMPTS.map(({ label, prompt, icon: Icon }) => (
            <motion.button
              key={prompt}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              type="button"
              className="group flex shrink-0 items-center gap-2 rounded-full border border-emerald-900/10 bg-emerald-50 px-3.5 py-2 text-left transition-colors hover:border-[#15462D]/30 hover:bg-[#15462D] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon className="h-3.5 w-3.5 text-amber-600 group-hover:text-amber-300" />
              <span className="text-[11px] font-bold whitespace-nowrap">{label}</span>
            </motion.button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about food, orders, delivery or payments..."
              disabled={isLoading}
              aria-label="Message Foodiego AI"
              className="h-12 w-full rounded-full border border-emerald-900/10 bg-[#FAF7EE] pl-5 pr-14 text-sm text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#15462D]/30 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:opacity-50"
            />
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            disabled={!input.trim() || isLoading}
            type="submit"
            aria-label="Send message"
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-lg transition-colors ${input.trim() && !isLoading ? "bg-[#15462D] hover:bg-[#1d6b48]" : "bg-slate-300"}`}
          >
            <SendHorizontal className="h-4 w-4" />
          </motion.button>
        </form>
        <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-medium text-slate-400">
          <ShieldCheck className="h-3 w-3" />
          Helpful answers for every step from craving to doorstep
        </div>
      </footer>
    </div>
  );
}
