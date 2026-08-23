"use client";

import { useState } from 'react';

type Props = { onNavigate: (page: any) => void };

export default function RiderCompletion({ onNavigate }: Props) {
  const [completed, setCompleted] = useState(false);

  if (completed) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-3xl">✓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Delivery Completed</h1>
          <p className="text-sm text-gray-500 mb-6">Great job! The order has been delivered.</p>

          <div className="p-4 bg-slate-50 rounded-xl mb-6">
            <p className="text-sm text-gray-600">Earnings: <span className="font-semibold text-gray-900">$12.50</span></p>
            <p className="text-sm text-gray-600">Order: <span className="font-semibold text-gray-900">#FD-8492</span></p>
          </div>

          <button onClick={() => onNavigate('earnings')} className="w-full bg-[#FF5C28] text-white py-2.5 rounded-xl font-medium hover:bg-[#B33C00]">
            View Earnings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Delivery Completion</h1>
        <p className="text-gray-500 mb-6">Complete final steps for this delivery</p>

        <div className="p-4 bg-slate-50 rounded-xl mb-6">
          <p className="font-medium text-gray-900">Order #FD-8492</p>
          <p className="text-sm text-gray-500">Customer: 456 Elm St, Apt 4B</p>
          <p className="text-sm text-gray-500">Payout: $12.50</p>
        </div>

        <button onClick={() => setCompleted(true)} className="w-full bg-[#FF5C28] text-white py-2.5 rounded-xl font-medium hover:bg-[#B33C00]">
          Complete Delivery
        </button>
      </div>
    </div>
  );
}