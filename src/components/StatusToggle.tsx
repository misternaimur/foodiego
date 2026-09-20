"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Ghost, Minus, X } from "lucide-react";

export default function StatusToggle() {
  const [isOnline, setIsOnline] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={containerRef}
      layout
      className={`rounded-[22px] p-5 shadow-lg border transition-colors duration-500 ${
        isOnline
          ? "bg-[#F0FDF4] border-[#124734]/10"
          : "bg-white border-[#ECE7D9]"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-[#0F172A] tracking-wide uppercase">
          Delivery Status
        </span>
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-lg hover:bg-[#ECE7D9]/60 transition-colors cursor-pointer"
            aria-label="History"
          >
            <History size={14} className="text-[#9CA3AF]" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-lg hover:bg-[#ECE7D9]/60 transition-colors cursor-pointer"
            aria-label="Ghost mode"
          >
            <Ghost size={14} className="text-[#9CA3AF]" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-lg hover:bg-[#ECE7D9]/60 transition-colors cursor-pointer"
            aria-label="Minimize"
          >
            <Minus size={14} className="text-[#9CA3AF]" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-lg hover:bg-[#ECE7D9]/60 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={14} className="text-[#9CA3AF]" />
          </motion.button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            layout
            className={`w-3 h-3 rounded-full ${
              isOnline ? "bg-[#124734]" : "bg-[#9CA3AF]"
            }`}
            animate={{
              scale: isOnline ? [1, 1.3, 1] : 1,
              opacity: isOnline ? [1, 0.6, 1] : 0.5,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <span
            className={`text-sm font-semibold ${
              isOnline ? "text-[#124734]" : "text-[#6B7280]"
            }`}
          >
            {isOnline ? "You're online" : "You're offline"}
          </span>
        </div>

        <div className="relative w-14 h-8">
          <motion.div
            layout
            className={`absolute inset-0 rounded-full transition-colors duration-300 ${
              isOnline ? "bg-[#124734]" : "bg-gray-200"
            }`}
          />
          <motion.div
            layout
            className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
            animate={{ x: isOnline ? 24 : 4 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </div>
      </div>

      <AnimatePresence>
        {isOnline && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-[#124734]/70 mt-3 pt-3 border-t border-[#124734]/10">
              You are available for deliveries. Riders can receive orders.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOnline(!isOnline)}
        className="mt-4 w-full py-2.5 rounded-full text-xs font-semibold transition-colors duration-300 cursor-pointer"
        style={{
          /* Read from globals.css so the button follows the active theme; an
             inline style cannot be overridden by a stylesheet. */
          backgroundColor: isOnline ? "var(--toggle-on-bg)" : "var(--toggle-off-bg)",
          color: isOnline ? "var(--toggle-on-fg)" : "var(--toggle-off-fg)",
        }}
      >
        {isOnline ? "Go Offline" : "Go Online"}
      </motion.button>
    </motion.div>
  );
}
