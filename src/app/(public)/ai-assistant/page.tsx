"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Sparkles,
  User,
  Bot,
  Loader2,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  isLoading?: boolean;
}

export default function AiAssistantPage() {
  const idCounter = useRef(2);
  const nextId = () => (idCounter.current++).toString();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "Hi there! 👋 I'm your Virtual Assistant. Ask me about menu recommendations, delivery tracking, pricing, or anything food-related!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: nextId(),
      role: "user",
      text: input.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "model", text: "", isLoading: true },
    ]);

    try {
      const chatHistory = messages.map((m) => ({
        sender: m.role === "user" ? "user" : "assistant",
        text: m.text,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text, chatHistory }),
      });

      setMessages((prev) => prev.filter((m) => m.text !== ""));

      if (res.ok) {
        const data = await res.json();
        const replyMsg: ChatMessage = {
          id: nextId(),
          role: "model",
          text: data.reply,
        };
        setMessages((prev) => [...prev, replyMsg]);
      } else {
        const errData = await res.json();
        const errMsg: ChatMessage = {
          id: nextId(),
          role: "model",
          text: errData.error || "Something went wrong. Please try again.",
        };
        setMessages((prev) => [...prev, errMsg]);
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.text !== ""));
      const errMsg: ChatMessage = {
        id: nextId(),
        role: "model",
        text: "Failed to connect. Please check your connection and try again.",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#FAF7EE]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50">
          <Sparkles className="text-emerald-600" size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900">I'm Your Virtual Assistant</h1>
          <p className="text-xs text-slate-500">Ask about food, delivery, and more</p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${
                    msg.role === "user"
                      ? "bg-emerald-100"
                      : "bg-amber-100"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User size={14} className="text-emerald-700" />
                  ) : (
                    <Bot size={14} className="text-amber-700" />
                  )}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-emerald-700 text-white rounded-br-sm"
                      : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-xs"
                  }`}
                >
                  {msg.isLoading ? (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Loader2 className="animate-spin" size={14} />
                      <span className="text-xs">Typing...</span>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick scroll buttons */}
      {messages.length > 10 && (
        <div className="fixed bottom-28 right-6 flex flex-col gap-2 z-10">
          <button
            type="button"
            onClick={scrollToBottom}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowDown size={14} className="text-slate-500" />
          </button>
          <button
            type="button"
            onClick={scrollToTop}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowUp size={14} className="text-slate-500" />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-slate-200 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
            />
          </div>
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 text-white px-5 py-3 text-sm font-bold transition-all cursor-pointer"
          >
            <Send size={14} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
