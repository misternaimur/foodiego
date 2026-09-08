"use client";

import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Wallet, 
  TrendingUp, 
  Filter, 
  Download, 
  CreditCard, 
  Building2, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface Transaction {
  id: string;
  transactionId: string;
  orderId: string;
  customer: string;
  vendor: string;
  amount: string;
  paymentMethod: string;
  paymentDetail: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  date: string;
}

const initialTransactions: Transaction[] = [
  {
    id: "1",
    transactionId: "TXN-908234",
    orderId: "ORD-5541",
    customer: "Acme Corp",
    vendor: "Stripe Inc.",
    amount: "$1,250.00",
    paymentMethod: "Card",
    paymentDetail: "**** 4242",
    status: "SUCCESS",
    date: "Oct 24, 14:30"
  },
  {
    id: "2",
    transactionId: "TXN-908235",
    orderId: "ORD-5542",
    customer: "Global Tech",
    vendor: "PayPal",
    amount: "$85.50",
    paymentMethod: "Bank Transfer",
    paymentDetail: "Bank Transfer",
    status: "SUCCESS",
    date: "Oct 24, 15:05"
  },
  {
    id: "3",
    transactionId: "TXN-908236",
    orderId: "ORD-5543",
    customer: "Beta LLC",
    vendor: "Stripe Inc.",
    amount: "$4,500.00",
    paymentMethod: "Card",
    paymentDetail: "**** 5555",
    status: "FAILED",
    date: "Oct 24, 16:12"
  },
  {
    id: "4",
    transactionId: "TXN-908237",
    orderId: "ORD-5544",
    customer: "Delta Corp",
    vendor: "Square",
    amount: "$320.00",
    paymentMethod: "Card",
    paymentDetail: "**** 1234",
    status: "PENDING",
    date: "Oct 24, 17:45"
  },
  {
    id: "5",
    transactionId: "TXN-908238",
    orderId: "ORD-5545",
    customer: "Epsilon Inc",
    vendor: "Stripe Inc.",
    amount: "$99.99",
    paymentMethod: "Card",
    paymentDetail: "**** 9876",
    status: "SUCCESS",
    date: "Oct 24, 18:20"
  }
];

export default function TransactionMonitoringPage() {
  // Structured states ready to be replaced with backend API fetching (e.g. SWR, React Query, or useEffect)
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  return (
    <main className="flex-1 bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        
        {/* Header Section */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Transaction Monitoring
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of recent payments and financial activity.
          </p>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Transactions */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Total Transactions
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                <FileText size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-950">124,592</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600 gap-0.5">
                  <TrendingUp size={12} />
                  +12%
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Successful Payments */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Successful Payments
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-950">118,204</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600 gap-0.5">
                  <TrendingUp size={12} />
                  +8%
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Failed Payments */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Failed Payments
              </span>
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertCircle size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-950">6,388</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="inline-flex items-center text-xs font-semibold text-rose-600 gap-0.5">
                  <TrendingUp size={12} className="rotate-180" />
                  -2%
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Total Payment Amount */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Total Payment Amount
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                <Wallet size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-950">$4.2M</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600 gap-0.5">
                  <TrendingUp size={12} />
                  +15%
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Recent Transactions Section Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          
          {/* Card Header & Controls */}
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-base font-bold text-gray-900">Recent Transactions</h2>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                <Filter size={14} className="text-gray-500" />
                <span>Filter</span>
              </button>
              <button 
                onClick={() => alert("Exporting transaction records...")}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                <Download size={14} className="text-gray-500" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Transaction ID</th>
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Vendor</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Payment Method</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{tx.transactionId}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{tx.orderId}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{tx.customer}</td>
                    <td className="px-6 py-4 text-gray-600">{tx.vendor}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{tx.amount}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        {tx.paymentMethod === 'Card' ? (
                          <CreditCard size={14} className="text-gray-400 shrink-0" />
                        ) : (
                          <Building2 size={14} className="text-gray-400 shrink-0" />
                        )}
                        <span>{tx.paymentDetail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {tx.status === 'SUCCESS' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 tracking-wider">
                          SUCCESS
                        </span>
                      )}
                      {tx.status === 'FAILED' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 tracking-wider">
                          FAILED
                        </span>
                      )}
                      {tx.status === 'PENDING' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-gray-100 text-gray-600 tracking-wider">
                          PENDING
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              Showing 1 to 5 of 124,592 entries
            </span>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                className="px-3.5 py-1.5 bg-white hover:bg-gray-50 text-gray-400 border border-gray-200 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-3.5 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}