"use client";

import { useState } from 'react';

type Props = { onNavigate: (page: any) => void };

export default function RiderPickupNavigation({ onNavigate }: Props) {
  const [arrived, setArrived] = useState(false);

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pickup Navigation</h1>
        <p className="text-gray-500 mb-6">Navigate to restaurant pickup location</p>

        <div className="w-full h-64 bg-slate-100 rounded-xl flex items-center justify-center text-gray-400 text-sm mb-4">Map Preview - 123 Main St</div>

        <div className="p-4 bg-slate-50 rounded-xl mb-4">
          <p className="font-medium text-gray-900">Burger Joint</p>
          <p className="text-sm text-gray-500">123 Main St</p>
          <p className="text-sm text-gray-500">Distance: 1.2 km</p>
          <p className="text-sm text-gray-500">ETA: 8 min</p>
        </div>

        <button
          onClick={() => setArrived(true)}
          className="w-full bg-[#FF5C28] text-white py-2.5 rounded-xl font-medium hover:bg-[#B33C00] mb-3"
        >
          I Have Arrived
        </button>

        <button onClick={() => onNavigate('pickup-confirmation')} className="w-full border border-slate-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50">
          Confirm Pickup
        </button>
      </div>
    </div>
  );
}