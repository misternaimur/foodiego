"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  Download,
  Send,
  Search,
  Filter,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import WithdrawModal from "@/components/vendor/WithdrawModal";
import { useVendorSocket } from "@/hooks/useVendorSocket";
import { usePaymentsOverview, useWithdraw } from "@/hooks/usePayments";

const NumberCard = ({
  label,
  value,
  icon,
  iconBg,
  subtitle,
  delay,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  iconBg: string;
  subtitle?: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20, rotateX: -15 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{ duration: 0.5, delay: delay || 0 }}
    className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-xl"
  >
    <div className="absolute -inset-0.5 bg-gradient-to-br from-gray-200/50 via-transparent to-transparent opacity-50" />
    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-24 h-24 bg-gradient-to-br from-gray-100/40 to-transparent rounded-full" />

    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg} shadow-lg`}>
          {icon}
        </div>
      </div>

      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <motion.p
        className="text-2xl font-black text-gray-900 mb-2"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, delay: (delay || 0) + 0.2 }}
      >
        {value}
      </motion.p>
      {subtitle && <div>{subtitle}</div>}
    </div>
  </motion.div>
);

const AnimatedCounter = ({
  value,
  prefix,
  suffix,
  duration = 2,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  const startAnimation = () => {
    if (hasAnimated) return;
    setHasAnimated(true);
    const startTime = performance.now();
    const startValue = 0;
    const endValue = value;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(startValue + (endValue - startValue) * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onAnimationStart={startAnimation}
      className="font-black text-gray-900"
    >
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </motion.span>
  );
};

export default function PaymentsDashboard() {
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data, isLoading, isError } = usePaymentsOverview();
  const { mutate: withdrawFunds } = useWithdraw();
  const { isConnected } = useVendorSocket();

  const overview = data;
  const transactions = [];

  if (overview) {
    transactions.push(...overview.transactions);
    if (transactions.length === 0) {
      transactions.push({
        id: "placeholder",
        orderId: "",
        customerName: "",
        date: "",
        grossAmount: 0,
        commission: 0,
        netEarnings: 0,
        status: "Paid",
      });
    }
  }

  const filteredTransactions = transactions.filter((t) => {
    if (!searchQuery) return true;
    return (
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortOrder === "desc") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle size={12} />
            Paid
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <Clock size={12} />
            Pending
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
            <AlertCircle size={12} />
            Failed
          </span>
        );
      default:
        return <span className="text-xs text-gray-500">{status}</span>;
    }
  };

  const handleWithdraw = (amount: number, method: string, account: string) => {
    withdrawFunds({ amount, method, account });
    setWithdrawModalOpen(false);
  };

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center"
      >
        <AlertCircle size={32} className="mx-auto mb-3 text-rose-400" />
        <p className="text-sm text-rose-700">
          Unable to load payment data. Please try again later.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments &amp; Earnings</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Track your revenue, manage withdrawals, and view financial statements.
          </p>
        </div>
        <div className="mt-3 flex items-center gap-3 sm:mt-0">
          <span
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold ${
              isConnected
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-gray-100 text-gray-500 border border-gray-200"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
              }`}
            />
            {isConnected ? "Live Updates" : "Offline"}
          </span>
          <motion.button
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => {
              const csv = [
                "Transaction ID,Order ID,Customer,Date,Gross Amount,Commission,Net Earnings,Status",
                ...(overview?.transactions || []).map(
                  (t) =>
                    `"${t.id}","${t.orderId}","${t.customerName}","${t.date}","৳${t.grossAmount.toLocaleString()}","-৳${t.commission.toLocaleString()}","৳${t.netEarnings.toLocaleString()}","${t.status}"`
                ),
              ].join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "payments-statement.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download size={14} />
            Download Statement
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setWithdrawModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600 transition-colors"
          >
            <Wallet size={14} />
            Withdraw Funds
          </motion.button>
        </div>
      </div>

      {/* ================= METRIC CARDS ================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[140px] rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </>
        ) : (
          <>
            <NumberCard
              delay={0}
              label="Total Earnings"
              value={
                <AnimatedCounter
                  value={overview?.totalEarnings || 245000}
                  prefix="৳"
                  duration={2}
                />
              }
              icon={<TrendingUp size={24} className="text-emerald-600" />}
              iconBg="bg-emerald-100"
              subtitle={
                <motion.div
                  className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <TrendingUp size={12} />
                  +{overview?.monthlyGrowth || 12.5}% from last month
                </motion.div>
              }
            />

            <NumberCard
              delay={0.1}
              label="Available Balance"
              value={
                <AnimatedCounter
                  value={overview?.availableBalance || 45200}
                  prefix="৳"
                  duration={1.5}
                />
              }
              icon={<Wallet size={24} className="text-emerald-600" />}
              iconBg="bg-emerald-100"
              subtitle={
                <span className="text-xs text-emerald-600">Ready for withdrawal</span>
              }
            />

            <NumberCard
              delay={0.2}
              label="Pending Balance"
              value={
                <AnimatedCounter
                  value={overview?.pendingBalance || 12000}
                  prefix="৳"
                  duration={1.5}
                />
              }
              icon={<Clock size={24} className="text-amber-600" />}
              iconBg="bg-amber-100"
              subtitle={
                <span className="text-xs text-amber-600">Clearing in 1-3 days</span>
              }
            />

            <NumberCard
              delay={0.3}
              label="Platform Commission"
              value={`${overview?.platformCommission || 15}%`}
              icon={<Send size={24} className="text-blue-600" />}
              iconBg="bg-blue-100"
              subtitle={
                <span className="text-xs text-blue-600">Standard Rate applied</span>
              }
            />
          </>
        )}
      </div>

      {/* ================= MIDDLE SPLIT VIEW ================= */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.65fr_0.35fr]">
        {/* Earnings Overview Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: -10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative h-[360px] rounded-3xl border border-gray-200 bg-white p-6 shadow-xl"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-50 blur-xl" />

          <div className="relative mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Earnings Overview</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="text-gray-600">Gross</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-gray-800" />
                <span className="text-gray-600">Net</span>
              </div>
            </div>
          </div>

          <div className="relative h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview?.earningsTrend || []} margin={{ top: 5, right: 0, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `৳${v}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="rounded-xl border border-gray-200 bg-white/80 p-3 shadow-xl backdrop-blur-xl"
                      >
                        <p className="text-xs font-semibold text-gray-900">{label}</p>
                        <div className="mt-1 space-y-1 text-xs">
                          <p className="flex items-center justify-between gap-4">
                            <span className="text-gray-500">Gross</span>
                            <span className="font-semibold text-gray-900">৳{payload[0]?.value?.toLocaleString()}</span>
                          </p>
                          <p className="flex items-center justify-between gap-4">
                            <span className="text-gray-500">Net</span>
                            <span className="font-semibold text-gray-900">৳{payload[1]?.value?.toLocaleString()}</span>
                          </p>
                        </div>
                      </motion.div>
                    );
                  }}
                />
                <Bar dataKey="gross" radius={[4, 4, 0, 0]} fill="#10b981" />
                <Bar dataKey="net" radius={[4, 4, 0, 0]} fill="#1e293b" />
              </BarChart>
            </ResponsiveContainer>

            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white via-white to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* AI Insights Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: -10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative rounded-3xl border border-blue-200 bg-blue-50/50 p-6 shadow-xl"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-400/20 via-transparent to-transparent opacity-50 blur-xl" />

          <div className="relative">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 border border-blue-200">
                <Sparkles size={22} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">AI Revenue Insights</h3>
                <p className="text-xs text-blue-700/70">Generated from your last 30 days of data</p>
              </div>
            </div>

            <div className="space-y-4">
              {(overview?.aiInsights || []).map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="rounded-xl bg-white/50 border border-blue-100 p-4"
                >
                  <p className="text-sm leading-relaxed text-blue-800">
                    {insight}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ================= PAYMENT HISTORY TABLE ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotateX: -10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-br from-gray-200/30 via-transparent to-transparent opacity-30" />

        <div className="relative p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Payment History</h3>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ID..."
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 pl-10 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Filter size={12} />
                Filter
              </motion.button>
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Sort: {sortOrder === "desc" ? "Newest" : "Oldest"}
                  <ChevronDown size={12} />
                </motion.button>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-36 rounded-xl border border-gray-200 bg-white shadow-xl"
                  >
                    <button
                      onClick={() => { setSortOrder("desc"); setDropdownOpen(false); }}
                      className="block w-full px-3 py-2 text-left text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Newest First
                    </button>
                    <button
                      onClick={() => { setSortOrder("asc"); setDropdownOpen(false); }}
                      className="block w-full px-3 py-2 text-left text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Oldest First
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 font-semibold text-gray-500 uppercase tracking-wider">TRANSACTION ID</th>
                  <th className="pb-3 font-semibold text-gray-500 uppercase tracking-wider">ORDER ID</th>
                  <th className="pb-3 font-semibold text-gray-500 uppercase tracking-wider">DATE</th>
                  <th className="pb-3 font-semibold text-gray-500 uppercase tracking-wider text-right">GROSS AMOUNT</th>
                  <th className="pb-3 font-semibold text-gray-500 uppercase tracking-wider text-right">COMMISSION (15%)</th>
                  <th className="pb-3 font-semibold text-gray-500 uppercase tracking-wider text-right">NET EARNINGS (৳)</th>
                  <th className="pb-3 font-semibold text-gray-500 uppercase tracking-wider">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((txn, index) => (
                  <motion.tr
                    key={txn.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-gray-100 last:border-0 group"
                  >
                    <td className="py-3 font-mono font-medium text-gray-900">{txn.id}</td>
                    <td className="py-3 text-gray-600">{txn.orderId}</td>
                    <td className="py-3 text-gray-500">{txn.date}</td>
                    <td className="py-3 text-right font-medium text-gray-900">৳{txn.grossAmount.toLocaleString()}</td>
                    <td className="py-3 text-right text-red-500">-৳{txn.commission.toLocaleString()}</td>
                    <td className="py-3 text-right font-semibold text-emerald-600">৳{txn.netEarnings.toLocaleString()}</td>
                    <td className="py-3">{getStatusBadge(txn.status)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* ================= WITHDRAW MODAL ================= */}
      {overview && (
        <WithdrawModal
          open={withdrawModalOpen}
          onClose={() => setWithdrawModalOpen(false)}
          availableBalance={overview.availableBalance}
          onWithdraw={handleWithdraw}
          isWithdrawing={false}
        />
      )}
    </motion.div>
  );
}
