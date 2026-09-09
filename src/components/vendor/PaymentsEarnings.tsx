'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Download,
  Wallet,
  TrendingUp,
  Clock,
  Receipt,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  ArrowUpRight,
  CreditCard,
  Building2,
  Smartphone,
} from 'lucide-react';

type PaymentStatus = 'Paid' | 'Pending' | 'Failed';

interface Transaction {
  id: string;
  orderId: string;
  date: string;
  gross: number;
  commission: number;
  net: number;
  status: PaymentStatus;
}

const earningsData = [
  { month: 'Jan', gross: 42000, net: 35700 },
  { month: 'Feb', gross: 38000, net: 32300 },
  { month: 'Mar', gross: 51000, net: 43350 },
  { month: 'Apr', gross: 47000, net: 39950 },
  { month: 'May', gross: 62000, net: 52700 },
  { month: 'Jun', gross: 78000, net: 66300 },
];

const transactions: Transaction[] = [
  { id: 'TXN-98234-A', orderId: '#ORD-5521', date: 'Oct 24, 2023', gross: 1200, commission: 180, net: 1020, status: 'Paid' },
  { id: 'TXN-98235-B', orderId: '#ORD-5522', date: 'Oct 24, 2023', gross: 850, commission: 127.5, net: 722.5, status: 'Pending' },
  { id: 'TXN-98236-C', orderId: '#ORD-5523', date: 'Oct 23, 2023', gross: 2400, commission: 360, net: 2040, status: 'Paid' },
  { id: 'TXN-98237-D', orderId: '#ORD-5524', date: 'Oct 23, 2023', gross: 950, commission: 142.5, net: 807.5, status: 'Failed' },
  { id: 'TXN-98238-E', orderId: '#ORD-5525', date: 'Oct 22, 2023', gross: 1800, commission: 270, net: 1530, status: 'Paid' },
];

const statusStyles: Record<PaymentStatus, string> = {
  Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Failed: 'bg-red-50 text-red-700 border-red-200',
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl p-3 shadow-xl">
      <p className="text-xs font-bold text-gray-900 mb-1">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-xs font-semibold" style={{ color: entry.color }}>
          {entry.name}: ৳{entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function PaymentsEarnings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<'bKash' | 'Bank Transfer' | 'Nagad'>('bKash');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) =>
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.orderId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredTransactions.length / 5);
  const startEntry = (currentPage - 1) * 5 + 1;
  const endEntry = Math.min(currentPage * 5, filteredTransactions.length);

  const handleWithdraw = () => {
    alert(`Withdrawal of ৳${withdrawAmount} via ${withdrawMethod} initiated.`);
    setIsWithdrawModalOpen(false);
    setWithdrawAmount('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Payments & Earnings</h1>
            <p className="mt-1 text-gray-500">Track your revenue, manage withdrawals, and view financial statements.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">
              <Download size={16} />
              Download Statement
            </button>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#00A36C] text-white hover:bg-[#008f5a] transition-all shadow-lg shadow-emerald-500/20"
            >
              <Wallet size={16} />
              Withdraw Funds
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Earnings',
              value: '৳245,000',
              delta: '+12.5%',
              deltaColor: 'text-emerald-600',
              icon: TrendingUp,
              gradient: 'from-emerald-500/20 to-teal-500/20',
              border: 'border-emerald-200/50',
            },
            {
              label: 'Available Balance',
              value: '৳45,200',
              delta: 'Ready for withdrawal',
              deltaColor: 'text-blue-600',
              icon: Wallet,
              gradient: 'from-blue-500/20 to-cyan-500/20',
              border: 'border-blue-200/50',
            },
            {
              label: 'Pending Balance',
              value: '৳12,000',
              delta: 'Clearing in 1-3 days',
              deltaColor: 'text-amber-600',
              icon: Clock,
              gradient: 'from-amber-500/20 to-orange-500/20',
              border: 'border-amber-200/50',
            },
            {
              label: 'Platform Commission',
              value: '15%',
              delta: 'Standard Rate applied',
              deltaColor: 'text-purple-600',
              icon: Receipt,
              gradient: 'from-purple-500/20 to-pink-500/20',
              border: 'border-purple-200/50',
            },
          ].map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4, rotateX: 2, rotateY: 2 }}
              className={`relative bg-white/70 backdrop-blur-xl border ${metric.border} rounded-2xl p-5 shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/60 transition-all duration-300 group overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${metric.gradient} border border-white/50`}>
                  <metric.icon size={20} className="text-gray-700" />
                </div>
                <span className={`text-xs font-bold ${metric.deltaColor} bg-gray-50 px-2 py-1 rounded-lg`}>
                  {metric.delta}
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{metric.label}</p>
              <p className="text-2xl font-extrabold text-gray-900 mt-1">{metric.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Middle Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Earnings Overview Chart */}
          <div className="lg:col-span-7 bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl p-5 shadow-lg shadow-gray-200/50">
            <h3 className="text-base font-bold text-gray-900 mb-4">Earnings Overview</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earningsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
                  <Bar dataKey="gross" name="Gross Earnings" fill="#00A36C" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="net" name="Net Earnings" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Revenue Insights */}
          <div className="lg:col-span-5 bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl p-5 shadow-lg shadow-gray-200/50">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-emerald-600" />
              AI Revenue Insights
            </h3>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUpRight size={16} className="text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Weekend Surge Prediction</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">Expect 22% increase in orders this weekend based on historical patterns.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-blue-600" />
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Top Earning Item</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">Spicy Beef Burger accounted for 18% of total revenue this month.</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-gray-900">Transaction Payment History</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A36C] focus:border-[#00A36C]"
                />
              </div>
              <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Filter
                <ChevronRight size={14} className="rotate-90" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500 uppercase text-xs tracking-wider">
                  <th className="px-5 py-3 font-semibold">Transaction ID</th>
                  <th className="px-5 py-3 font-semibold">Order ID</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold text-right">Gross Amount</th>
                  <th className="px-5 py-3 font-semibold text-right">Commission (15%)</th>
                  <th className="px-5 py-3 font-semibold text-right">Net Earnings (৳)</th>
                  <th className="px-5 py-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono font-semibold text-gray-900">{txn.id}</td>
                    <td className="px-5 py-4 text-gray-700">{txn.orderId}</td>
                    <td className="px-5 py-4 text-gray-500">{txn.date}</td>
                    <td className="px-5 py-4 text-right font-semibold text-gray-900">৳{txn.gross.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-semibold text-red-600">-৳{txn.commission.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-bold text-emerald-600">৳{txn.net.toLocaleString()}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${statusStyles[txn.status]}`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Showing {startEntry} to {endEntry} of {filteredTransactions.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === i + 1
                      ? 'bg-[#00A36C] text-white shadow-md shadow-emerald-500/20'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {isWithdrawModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsWithdrawModalOpen(false)} />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Instant Withdrawal</h3>
                <button onClick={() => setIsWithdrawModalOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['bKash', 'Bank Transfer', 'Nagad'] as const).map((method) => (
                      <button
                        key={method}
                        onClick={() => setWithdrawMethod(method)}
                        className={`py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                          withdrawMethod === method
                            ? 'border-[#00A36C] bg-emerald-50 text-[#00A36C]'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {method === 'bKash' && <Smartphone size={14} className="mx-auto mb-1" />}
                        {method === 'Bank Transfer' && <Building2 size={14} className="mx-auto mb-1" />}
                        {method === 'Nagad' && <CreditCard size={14} className="mx-auto mb-1" />}
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Withdrawal Amount (৳)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A36C] focus:border-[#00A36C]"
                  />
                </div>

                {withdrawAmount && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-xl bg-gray-50 space-y-2"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Withdrawal Amount</span>
                      <span className="font-semibold text-gray-900">৳{parseFloat(withdrawAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Processing Fee (1.5%)</span>
                      <span className="font-semibold text-red-600">-৳{(parseFloat(withdrawAmount) * 0.015).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between text-sm">
                      <span className="font-bold text-gray-900">You Will Receive</span>
                      <span className="font-bold text-emerald-600">৳{(parseFloat(withdrawAmount) * 0.985).toFixed(2)}</span>
                    </div>
                  </motion.div>
                )}

                <button
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
                  className="w-full py-3 rounded-xl bg-[#00A36C] text-white font-bold text-sm hover:bg-[#008f5a] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20"
                >
                  Confirm Instant Payout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
