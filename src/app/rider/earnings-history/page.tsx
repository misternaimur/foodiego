"use client";

import { useState } from 'react';

type Props = { onNavigate: (page: any) => void };

export default function RiderEarningsHistory({ onNavigate }: Props) {
  const [history] = useState([
    { date: '2026-08-23', orders: 12, earnings: 145.5 },
    { date: '2026-08-22', orders: 10, earnings: 120.0 },
    { date: '2026-08-21', orders: 14, earnings: 168.0 },
    { date: '2026-08-20', orders: 8, earnings: 96.0 },
  ]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Earnings History</h1>
        <p className="text-gray-500 mt-1">Review your past earnings</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="space-y-3">
          {history.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">{item.date}</p>
                <p className="text-sm text-gray-500">{item.orders} orders</p>
              </div>
              <span className="font-semibold text-gray-900">${item.earnings.toFixed(2)}</span>
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