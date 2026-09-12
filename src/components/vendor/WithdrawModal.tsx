"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, Banknote, Smartphone } from "lucide-react";

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
  availableBalance: number;
  onWithdraw: (amount: number, method: string, account: string) => void;
  isWithdrawing: boolean;
}

export default function WithdrawModal({
  open,
  onClose,
  availableBalance,
  onWithdraw,
  isWithdrawing,
}: WithdrawModalProps) {
  const methods = [
    { id: "bKash", label: "bKash", icon: Smartphone, fee: 0 },
    { id: "Nagad", label: "Nagad", icon: Smartphone, fee: 0 },
    { id: "bank", label: "Bank Transfer", icon: Banknote, fee: 5 },
  ];

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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md rounded-3xl border border-gray-200 bg-white/80 shadow-2xl"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 opacity-50 blur-xl" />

            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Withdraw Funds</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Available balance: <span className="font-bold text-gray-900">৳{availableBalance.toLocaleString()}</span>
              </p>

              <WithdrawForm
                availableBalance={availableBalance}
                methods={methods}
                onWithdraw={onWithdraw}
                isWithdrawing={isWithdrawing}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface WithdrawFormProps {
  availableBalance: number;
  methods: { id: string; label: string; icon: React.ElementType; fee: number }[];
  onWithdraw: (amount: number, method: string, account: string) => void;
  isWithdrawing: boolean;
}

function WithdrawForm({
  availableBalance,
  methods,
  onWithdraw,
  isWithdrawing,
}: WithdrawFormProps) {
  const [amount, setAmount] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState("bKash");
  const [account, setAccount] = useState("");

  const handleSubmit = () => {
    if (amount <= 0 || amount > availableBalance) return;
    onWithdraw(amount, selectedMethod, account);
  };

  const quickAmounts = [5000, 10000, 20000, 45000];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Amount (৳)</label>
        <input
          type="number"
          value={amount || ""}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="0.00"
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-lg font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
        />
      </div>

      <div className="flex gap-2">
        {quickAmounts.map((amt) => (
          <motion.button
            key={amt}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAmount(amt > availableBalance ? availableBalance : amt)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            ৳{amt.toLocaleString()}
          </motion.button>
        ))}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">Payment Method</label>
        <div className="space-y-2">
          {methods.map((m) => (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedMethod(m.id)}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                selectedMethod === m.id
                  ? "border-emerald-500 bg-emerald-50/50"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              <m.icon size={20} className={selectedMethod === m.id ? "text-emerald-600" : "text-gray-500"} />
              <span className="font-medium text-gray-800">{m.label}</span>
              {m.fee > 0 && <span className={`ml-auto text-xs text-gray-500`}>Fee: ৳{m.fee}</span>}
            </motion.button>
          ))}
        </div>
      </div>

      {selectedMethod === "bank" && (
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Account Number</label>
          <input
            type="text"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="1234567890123456"
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition-all"
          />
        </div>
      )}
      {selectedMethod !== "bank" && (
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {selectedMethod === "bKash" ? "bKash Wallet Number" : "Nagad Wallet Number"}
          </label>
          <input
            type="tel"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="01XXXXXXXXX"
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition-all"
          />
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={amount <= 0 || amount > availableBalance || isWithdrawing}
        className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-sm font-bold text-white hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
      >
        {isWithdrawing ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <>
            <Wallet size={16} />
            Withdraw ৳{amount.toLocaleString()}
          </>
        )}
      </motion.button>
    </div>
  );
}
