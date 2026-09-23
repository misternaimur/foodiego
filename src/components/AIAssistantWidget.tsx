"use client";

import { usePathname } from "next/navigation";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  RefreshCw,
  Utensils,
  Truck,
  CreditCard,
  Heart,
  Star,
  ChevronRight,
  Clock,
  MapPin,
  History,
  Ghost,
  Minus,
} from "lucide-react";
import { motion } from "motion/react";

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
  isError?: boolean;
  actions?: ChatAction[];
  timestamp: Date;
}

interface ChatAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface AIAssistantWidgetProps {
  onNavigate?: (path: string) => void;
}

interface SuggestionGroup {
  title: string;
  icon: React.ReactNode;
  items: string[];
}

const QUICK_ACTIONS: SuggestionGroup[] = [
  {
    title: "🍔 Food",
    icon: <Utensils size={12} />,
    items: ["Recommend a top burger", "Healthy choices", "Best rated restaurants", "Vegetarian options"],
  },
  {
    title: "📦 Orders",
    icon: <Truck size={12} />,
    items: ["Where is my order?", "Track my delivery", "Cancel an order", "Reorder past order"],
  },
  {
    title: "💳 Payment",
    icon: <CreditCard size={12} />,
    items: ["Payment methods", "Apply a promo code", "Refund policy", "Split payment"],
  },
];

const CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  food: ["What's popular today?", "Show me Italian restaurants", "Low calorie meals", "Best desserts"],
  order: ["Track my order", "Order history", "Cancel order", "Reorder"],
  delivery: ["Delivery time estimate", "Delivery areas", "Contact rider", "Delivery issues"],
  payment: ["Apply promo code", "Refund status", "Payment methods", "Wallet balance"],
};

const ACTION_PILLS = [
  { label: "Recommend Food", icon: Utensils, message: "Recommend a top burger" },
  { label: "Healthy Choices", icon: Heart, message: "Healthy choices" },
  { label: "Track Delivery", icon: Truck, message: "Where is my order?" },
];

function formatTime(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function parseMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];
  let keyCounter = 0;
  let lastWasBr = false;

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`list-${keyCounter++}`} className="ml-4 space-y-1">
          {listItems}
        </ul>
      );
      inList = false;
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const key = `line-${keyCounter++}`;

    if (line.startsWith("- ") || line.startsWith("* ")) {
      inList = true;
      listItems.push(
        <li key={key} className="flex items-start gap-1.5">
          <span className="text-[#124734] mt-0.5">•</span>
          <span dangerouslySetInnerHTML={{ __html: formatInline(line.substring(2)) }} />
        </li>
      );
      lastWasBr = false;
    } else {
      flushList();
      if (line.trim() === "") {
        elements.push(<br key={key} />);
        lastWasBr = true;
      } else {
        elements.push(
          <p
            key={key}
            className={lastWasBr ? "mt-0" : "mt-1.5"}
            dangerouslySetInnerHTML={{ __html: formatInline(line) }}
          />
        );
        lastWasBr = false;
      }
    }
  }
  flushList();
  return elements;
}

function formatInline(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong class='font-semibold text-gray-900'>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em class='italic'>$1</em>");
}

export default function AIAssistantWidget({ onNavigate }: AIAssistantWidgetProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "fallback">("checking");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Hi! I'm your Virtual Assistant 🍽️\n\nAsk me about food recommendations, your orders, delivery, or payments!",
      timestamp: new Date(),
    },
  ]);
  const idCounter = useRef(2);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [unread, setUnread] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    const updateConstraints = () => {
      setDragConstraints({
        left: -window.innerWidth + 180,
        right: 0,
        top: -window.innerHeight + 80,
        bottom: 0,
      });
    };
    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "hello", chatHistory: [] }),
        });
        const data: { reply?: string; error?: string; source?: string } = await res.json();
        if (data.source && data.source !== "local") {
          setApiStatus("connected");
        } else {
          setApiStatus("fallback");
        }
      } catch {
        setApiStatus("fallback");
      }
    };
    checkApiStatus();
  }, []);

  useEffect(() => {
    const updateConstraints = () => {
      setDragConstraints({
        left: -window.innerWidth + 180,
        right: 0,
        top: -window.innerHeight + 80,
        bottom: 0,
      });
    };
    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !panelRef.current.previousElementSibling?.contains(e.target as Node)
      ) {
        // Don't close when clicking inside panel or on FAB
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const detectCategory = useCallback((text: string): string | null => {
    const lower = text.toLowerCase();
    if (/(burger|pizza|sushi|pasta|salad|dessert|food|eat|meal|recipe|recommend)/i.test(lower)) return "food";
    if (/(order|track|cancel|reorder|history|purchase|shipping)/i.test(lower)) return "order";
    if (/(deliver|rider|arrive|arrival|transport|shipping)/i.test(lower)) return "delivery";
    if (/(pay|card|promo|discount|refund|wallet|price|money)/i.test(lower)) return "payment";
    return null;
  }, []);

  const handleSend = useCallback(
    async (textToSend?: string) => {
      const query = textToSend ?? input;
      if (!query.trim() || loading) return;

      const userMsg: Message = {
        id: idCounter.current++,
        sender: "user",
        text: query,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      if (!textToSend) setInput("");
      setLoading(true);
      setUnread(false);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: query,
            chatHistory: messages.map((m) => ({
              sender: m.sender,
              text: m.text,
            })),
          }),
        });

        const data: { reply?: string; error?: string; source?: string } = await res.json();

        if (data.reply) {
          if (data.source && data.source !== "local") {
            setApiStatus("connected");
          } else {
            setApiStatus("fallback");
          }
          const category = detectCategory(query);
          const actions: ChatAction[] = [];

          if (category === "food") {
            actions.push({ label: "Browse Restaurants", icon: <Utensils size={13} />, onClick: () => onNavigate?.("/restaurants") });
          } else if (category === "order") {
            actions.push({ label: "Track Order", icon: <Truck size={13} />, onClick: () => onNavigate?.("/client/track") });
          } else if (category === "payment") {
            actions.push({ label: "Payment Methods", icon: <CreditCard size={13} />, onClick: () => onNavigate?.("/client/profile") });
          }

          const aiMsg: Message = {
            id: idCounter.current++,
            sender: "ai",
            text: data.reply,
            timestamp: new Date(),
            actions: actions.length > 0 ? actions : undefined,
          };
          setMessages((prev) => [...prev, aiMsg]);
        }

        if (data.error) {
          setApiStatus("fallback");
          const errMsg: Message = {
            id: idCounter.current++,
            sender: "ai",
            text: data.error,
            isError: true,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errMsg]);
        } else if (!data.reply) {
          setApiStatus("fallback");
          const errMsg: Message = {
            id: idCounter.current++,
            sender: "ai",
            text: "The assistant couldn't respond right now. Please try again.",
            isError: true,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errMsg]);
        }
      } catch (err) {
        setApiStatus("fallback");
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        const errMsg: Message = {
          id: idCounter.current++,
          sender: "ai",
          text: `Error: ${errorMsg}`,
          isError: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setLoading(false);
      }
    },
    [input, messages, loading, detectCategory, onNavigate]
  );

  const handleSuggestionClick = useCallback(
    (text: string) => {
      setIsOpen(true);
      handleSend(text);
    },
    [handleSend]
  );

  const handleActionClick = useCallback(
    (action: ChatAction) => {
      action.onClick();
      handleSend(`I'd like to: ${action.label}`);
    },
    [handleSend]
  );

  const retryLast = useCallback(() => {
    setMessages((prev) => {
      const withoutErrors = prev.filter((m) => !m.isError);
      return withoutErrors;
    });
  }, []);

  const activeSuggestions = useMemo(() => {
    if (messages.length <= 2) return QUICK_ACTIONS;
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === "user");
    if (!lastUserMsg) return QUICK_ACTIONS;
    const category = detectCategory(lastUserMsg.text);
    if (category && CATEGORY_SUGGESTIONS[category]) {
      return [
        { title: "Related", icon: <Sparkles size={12} />, items: CATEGORY_SUGGESTIONS[category] },
        ...QUICK_ACTIONS.slice(0, 1),
      ];
    }
    return QUICK_ACTIONS;
  }, [messages, detectCategory]);

  const hasUnread = unread;

  if (pathname === "/ai-assistant") return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <motion.button
          type="button"
          drag
          dragConstraints={dragConstraints}
          dragElastic={0.1}
          dragMomentum
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onClick={() => {
            if (isDragging) return;
            setIsOpen(true);
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          whileDrag={{ scale: 1.15, cursor: "grabbing" }}
          aria-label="Open AI Assistant"
          className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-[50%] bg-[#124734] text-white flex items-center justify-center shadow-xl border border-emerald-700/40 cursor-grab active:cursor-grabbing touch-none select-none transition-shadow duration-300 hover:shadow-2xl hover:shadow-[#124734]/30 ${
            hasUnread ? "animate-pulse" : ""
          }`}
        >
          {hasUnread && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F6A429] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#F6A429]"></span>
            </span>
          )}
          <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-[#F49D37] fill-[#F49D37]/20" />
        </motion.button>
      )}

      {isOpen && (
        <div
          ref={panelRef}
          className="w-[380px] sm:w-[420px] h-[560px] max-h-[80vh] bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-[slideUp_300ms_ease-out_forwards] origin-bottom-right border border-[#E8E2D5]/60"
          style={{
            animation: "slideUp 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(16px) scale(0.96); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes dotBounce {
              0%, 60%, 100% { transform: translateY(0); }
              30% { transform: translateY(-4px); }
            }
            .dot-1 { animation: dotBounce 1.4s ease-in-out infinite 0ms; }
            .dot-2 { animation: dotBounce 1.4s ease-in-out infinite 160ms; }
            .dot-3 { animation: dotBounce 1.4s ease-in-out infinite 320ms; }
          `}</style>

          {/* Top Utility Bar */}
          <div className="bg-[#124734] text-white px-4 pt-4 flex items-center justify-end gap-2 shrink-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
              aria-label="History"
            >
              <History size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
              aria-label="Ghost mode"
            >
              <Ghost size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
              aria-label="Minimize"
            >
              <Minus size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={16} />
            </motion.button>
          </div>

          {/* Greeting */}
          <div className="bg-[#124734] text-white px-4 pb-4 shrink-0">
            <h3 className="text-lg font-bold leading-tight">
              How can I help you today?
            </h3>
          </div>

          {/* Action Pills */}
          <div className="bg-[#FAF7EE] p-3 flex gap-2 overflow-x-auto border-b border-[#E8E2D5]/60 shrink-0">
            {ACTION_PILLS.map((pill) => {
              const Icon = pill.icon;
              return (
              <button
                key={pill.label}
                onClick={() => handleSend(pill.message)}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#124734] bg-white border border-[#E8E2D5] px-3 py-1.5 rounded-full hover:border-[#124734] hover:bg-[#124734] hover:text-white transition-all duration-200 cursor-pointer shrink-0"
              >
                <Icon size={12} />
                {pill.label}
              </button>
              );
            })}
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF7EE]/50 min-h-0">
            {messages.map((msg, idx) => {
              const prevMsg = idx > 0 ? messages[idx - 1] : null;
              const showDate = !prevMsg || new Date(prevMsg.timestamp).toDateString() !== new Date(msg.timestamp).toDateString();
              return (
                <React.Fragment key={msg.id}>
                  {showDate && (
                    <div className="flex items-center gap-3 my-2">
                      <div className="flex-1 h-px bg-[#E8E2D5]" />
                      <span className="text-[10px] text-[#9CA3AF] font-medium">
                        {formatTime(msg.timestamp)}
                      </span>
                      <div className="flex-1 h-px bg-[#E8E2D5]" />
                    </div>
                  )}
                  <div
                    className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    style={{
                      animation: "slideUp 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {msg.sender === "ai" && (
                      <div className="w-7 h-7 rounded-xl bg-[#D1FAE5] text-[#124734] flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div className="max-w-[82%]">
                      <div
                        className={`p-3.5 rounded-[18px] text-xs leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-[#124734] text-white rounded-br-none"
                            : msg.isError
                              ? "bg-red-50 border border-red-100 text-red-700 rounded-bl-none"
                              : "bg-white border border-[#E8E2D5]/80 text-[#1F2937] rounded-bl-none shadow-[0_2px_4px_rgba(0,0,0,0.04)]"
                        }`}
                      >
                        {msg.sender === "ai" ? (
                          <div className="prose prose-sm max-w-none [&>p]:mt-1.5 [&>p]:mb-0 [&>ul]:mt-1.5 [&>ul]:mb-1.5 [&>ul>li>p]:mt-0 [&>ul>li>p]:mb-0 [&>strong]:font-semibold [&>strong]:text-[#124734]">
                            {parseMarkdown(msg.text)}
                          </div>
                        ) : (
                          <span className="whitespace-pre-wrap">{msg.text}</span>
                        )}
                      </div>
                      {msg.sender === "ai" && !msg.isError && msg.actions && msg.actions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {msg.actions.map((action, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => handleActionClick(action)}
                              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#124734] bg-white border border-[#E8E2D5] px-3 py-1.5 rounded-full hover:border-[#124734] hover:bg-[#124734] hover:text-white transition-all duration-200 cursor-pointer"
                            >
                              {action.icon}
                              {action.label}
                              <ChevronRight size={11} />
                              </button>
                          ))}
                        </div>
                      )}
                      {msg.sender === "user" && (
                        <div className="w-7 h-7 rounded-xl bg-[#ECE7D9] text-[#6B7280] flex items-center justify-center flex-shrink-0 mt-1 ml-auto">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2.5 items-center text-[#9CA3AF] text-xs">
                <div className="w-7 h-7 rounded-xl bg-[#D1FAE5] text-[#124734] flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-[#E8E2D5] px-4 py-3 rounded-[18px] rounded-bl-none flex items-center gap-1 shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
                  <span className="w-1.5 h-1.5 bg-[#124734] rounded-full dot-1" />
                  <span className="w-1.5 h-1.5 bg-[#124734] rounded-full dot-2" />
                  <span className="w-1.5 h-1.5 bg-[#124734] rounded-full dot-3" />
                </div>
              </div>
            )}

            {/* End of messages indicator */}
            {!loading && messages.length > 0 && messages[messages.length - 1].sender === "ai" && (
              <div className="flex justify-center mt-1">
                <button
                  onClick={() => {
                    const lastMsg = messages[messages.length - 1];
                    if (lastMsg && lastMsg.sender === "ai") {
                      const suggestions = QUICK_ACTIONS.flatMap((g) => g.items);
                      const random = suggestions[Math.floor(Math.random() * suggestions.length)];
                      handleSuggestionClick(random);
                    }
                  }}
                  className="text-[10px] text-[#9CA3AF] hover:text-[#124734] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Sparkles size={10} />
                  Ask a follow-up
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Error banner */}
          {messages.some((m) => m.isError) && (
            <div className="px-3 py-2 bg-red-50/80 border-t border-red-100 flex items-center justify-between shrink-0">
              <span className="text-[10px] text-red-600 font-medium">Something went wrong</span>
              <button
                onClick={retryLast}
                className="flex items-center gap-1 text-[10px] text-red-600 hover:text-red-800 font-semibold transition-colors cursor-pointer"
              >
                <RefreshCw size={10} />
                Clear errors
              </button>
            </div>
          )}

          {/* Quick actions footer */}
          <div className="px-3 py-2 bg-white border-t border-[#E8E2D5]/60 flex items-center gap-1 shrink-0 overflow-x-auto">
            <button
              onClick={() => handleSuggestionClick("What's popular today?")}
              className="flex items-center gap-1.5 text-[11px] bg-[#FAF7EE] text-[#124734] px-2.5 py-1.5 rounded-full whitespace-nowrap hover:bg-[#ECE7D9] transition-colors cursor-pointer shrink-0"
            >
              <Star size={10} className="text-[#F6A429]" />
              Trending
            </button>
            <button
              onClick={() => handleSuggestionClick("Show me nearby restaurants")}
              className="flex items-center gap-1.5 text-[11px] bg-[#FAF7EE] text-[#124734] px-2.5 py-1.5 rounded-full whitespace-nowrap hover:bg-[#ECE7D9] transition-colors cursor-pointer shrink-0"
            >
              <MapPin size={10} />
              Nearby
            </button>
            <button
              onClick={() => handleSuggestionClick("Best rated restaurants")}
              className="flex items-center gap-1.5 text-[11px] bg-[#FAF7EE] text-[#124734] px-2.5 py-1.5 rounded-full whitespace-nowrap hover:bg-[#ECE7D9] transition-colors cursor-pointer shrink-0"
            >
              <Clock size={10} />
              Fast delivery
            </button>
            <button
              onClick={() => handleSuggestionClick("My favorites")}
              className="flex items-center gap-1.5 text-[11px] bg-[#FAF7EE] text-[#124734] px-2.5 py-1.5 rounded-full whitespace-nowrap hover:bg-[#ECE7D9] transition-colors cursor-pointer shrink-0"
            >
              <Heart size={10} />
              Favorites
            </button>
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-[#E8E2D5]/60 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about dishes, orders, delivery..."
              disabled={loading}
              className="flex-1 bg-[#FAF7EE] text-[#1F2937] text-xs rounded-full pl-4 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#124734]/20 focus:bg-white transition-all border border-transparent focus:border-[#124734]/20 disabled:opacity-50 placeholder-[#9CA3AF]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-[#124734] hover:bg-[#1a5c3a] disabled:opacity-40 disabled:hover:bg-[#124734] text-white p-2.5 rounded-full transition-colors duration-200 active:scale-95 cursor-pointer shrink-0"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
