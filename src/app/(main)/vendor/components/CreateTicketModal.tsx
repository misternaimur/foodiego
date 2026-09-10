"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCreateTicket } from "@/hooks/useSupportTickets";
import type { CreateTicketInput, TicketCategory } from "@/hooks/useSupportTickets";

interface CreateTicketModalProps {
  open: boolean;
  onClose: () => void;
}

const categories: { value: TicketCategory; label: string; icon: string }[] = [
  { value: "Payment", label: "Payment", icon: "💳" },
  { value: "Order Issue", label: "Order Issue", icon: "📦" },
  { value: "Technical", label: "Technical", icon: "💻" },
  { value: "Account", label: "Account", icon: "👤" },
  { value: "General", label: "General", icon: "❓" },
];

export default function CreateTicketModal({ open, onClose }: CreateTicketModalProps) {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<TicketCategory>("Payment");
  const [message, setMessage] = useState("");

  const { mutate: createTicket, isPending: isCreating } = useCreateTicket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    const input: CreateTicketInput = {
      subject,
      category,
      message,
    };

    createTicket(input);
    onClose();
    setSubject("");
    setMessage("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="w-full max-w-xl rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
              <h2 className="text-xl font-bold text-gray-900">Create New Support Ticket</h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-gray-800 focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
                  placeholder="Briefly describe your issue..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${
                        category === cat.value
                          ? "border-[#10B981] bg-emerald-50 text-[#10B981]"
                          : "border-[#E5E7EB] bg-white text-gray-700 hover:bg-gray-50"
                      }}`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-gray-800 resize-none focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
                  placeholder="Please provide details about your issue..."
                  rows={5}
                  required
                />
              </div>
            </form>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-[#E5E7EB] bg-gray-50/60">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isCreating || !subject || !message}
                className="rounded-xl bg-[#10B981] px-4 py-2 text-sm font-semibold text-white hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCreating ? "Creating..." : "Create Ticket"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
