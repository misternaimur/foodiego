"use client";

import { useState } from 'react';

type Props = { onNavigate: (page: any) => void };

export default function RiderAvailability({ onNavigate }: Props) {
  const [online, setOnline] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Rider Availability</h1>
        <p className="text-sm text-gray-500 mb-6">Toggle your availability to receive delivery requests</p>

        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${online ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
          <span className="text-4xl">{online ? '🟢' : '🔴'}</span>
        </div>

        <p className="text-lg font-semibold text-gray-900 mb-6">{online ? 'You are Online' : 'You are Offline'}</p>

        <button
          onClick={() => setOnline(!online)}
          className={`w-full py-3 rounded-xl font-medium transition-colors ${online ? 'bg-gray-900 text-white hover:bg-black' : 'bg-[#FF5C28] text-white hover:bg-[#B33C00]'}`}
        >
          {online ? 'Go Offline' : 'Go Online'}
        </button>

        {online && (
          <button onClick={() => onNavigate('requests')} className="w-full mt-3 py-3 rounded-xl border border-slate-200 text-gray-700 font-medium hover:bg-gray-50">
            View Available Requests
          </button>
        )}
      </div>
    </div>
  );
}