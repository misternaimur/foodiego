"use client";

import { useState } from 'react';

type Props = { onNavigate: (page: any) => void };

export default function RiderEarnings({ onNavigate }: Props) {
  const [today] = useState(142.5);
  const [week] = useState(980);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-500 mt-1">Track your delivery earnings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-2xl font-bold text-gray-900">${today.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">This Week</p>
          <p className="text-2xl font-bold text-gray-900">${week.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-gray-900">$45.00</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Earnings</h2>
        <div className="space-y-3">
          {[
            { order: '#FD-8492', amount: 12.5, time: '2h ago' },
            { order: '#FD-8480', amount: 15.0, time: '4h ago' },
            { order: '#FD-8465', amount: 9.5, time: '6h ago' },
          ].map((item) => (
            <div key={item.order} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">{item.order}</p>
                <p className="text-xs text-gray-500">{item.time}</p>
              </div>
              <span className="font-semibold text-gray-900">+${item.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={() => onNavigate('wallet')} className="flex-1 bg-[#FF5C28] text-white py-2.5 rounded-xl font-medium hover:bg-[#B33C00]">Wallet</button>
        <button onClick={() => onNavigate('earnings-history')} className="flex-1 border border-slate-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50">Earnings History</button>
      </div>
    </div>
  );
}