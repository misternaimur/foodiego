"use client";

import { useState } from 'react';

type Props = { onNavigate: (page: any) => void };

export default function RiderStatusUpdate({ onNavigate }: Props) {
  const [status, setStatus] = useState('On the Way');

  const statuses = ['Accepted', 'Arrived', 'Picked Up', 'On the Way', 'Delivered'];

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Delivery Status Update</h1>
        <p className="text-gray-500 mb-6">Update the current delivery status</p>

        <div className="space-y-3 mb-6">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors ${
                status === s ? 'border-[#FF5C28] bg-orange-50 text-[#FF5C28] font-medium' : 'border-slate-200 text-gray-700 hover:border-orange-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <button onClick={() => onNavigate('live-tracking')} className="w-full bg-[#FF5C28] text-white py-2.5 rounded-xl font-medium hover:bg-[#B33C00]">
          Save & Continue
        </button>
      </div>
    </div>
  );
}