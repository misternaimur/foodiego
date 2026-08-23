"use client";

import { useState } from 'react';

type Props = { onNavigate: (page: any) => void };

export default function RiderWallet({ onNavigate }: Props) {
  const [balance] = useState(1250.0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
        <p className="text-gray-500 mt-1">Manage your earnings and withdrawals</p>
      </div>

      <div className="bg-[#B33C00] rounded-2xl shadow-sm p-6 text-white mb-6">
        <p className="text-sm opacity-80 mb-1">Available Balance</p>
        <p className="text-3xl font-bold mb-4">৳{balance.toFixed(2)}</p>
        <button className="w-full bg-white text-[#B33C00] py-2.5 rounded-xl font-medium hover:bg-gray-100">Withdraw</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {[
            { title: 'Order #FD-8492', amount: 12.5, type: 'credit' },
            { title: 'Withdrawal', amount: 500, type: 'debit' },
            { title: 'Order #FD-8480', amount: 15.0, type: 'credit' },
          ].map((tx, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">{tx.title}</p>
                <p className="text-xs text-gray-500">Today</p>
              </div>
              <span className={`font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => onNavigate('earnings')} className="w-full mt-6 border border-slate-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50">
        Back to Earnings
      </button>
    </div>
  );
}