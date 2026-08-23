"use client";

import { useState } from 'react';

type Props = { onNavigate: (page: any) => void };

export default function RiderStartDelivery({ onNavigate }: Props) {
  const [started, setStarted] = useState(false);

  if (started) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Delivery Started</h1>
          <p className="text-gray-500 mb-6">Head to the customer location</p>

          <div className="w-full h-64 bg-slate-100 rounded-xl flex items-center justify-center text-gray-400 text-sm mb-4">Map Preview - En Route</div>

          <div className="p-4 bg-slate-50 rounded-xl mb-4">
            <p className="font-medium text-gray-900">Dropoff Location</p>
            <p className="text-sm text-gray-500">456 Elm St, Apt 4B</p>
            <p className="text-sm text-gray-500">Distance: 2.0 km</p>
            <p className="text-sm text-gray-500">ETA: 12 min</p>
          </div>

          <button onClick={() => onNavigate('live-tracking')} className="w-full bg-[#FF5C28] text-white py-2.5 rounded-xl font-medium hover:bg-[#B33C00]">
            View Live Tracking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Start Delivery</h1>
        <p className="text-gray-500 mb-6">Begin the delivery trip to customer</p>

        <div className="p-4 bg-slate-50 rounded-xl mb-6">
          <p className="font-medium text-gray-900">Burger Joint → Customer</p>
          <p className="text-sm text-gray-500">Order #FD-8492</p>
          <p className="text-sm text-gray-500">Distance: 2.0 km</p>
          <p className="text-sm text-gray-500">Est. Time: 12 min</p>
        </div>

        <button onClick={() => setStarted(true)} className="w-full bg-[#FF5C28] text-white py-2.5 rounded-xl font-medium hover:bg-[#B33C00]">
          Start Delivery
        </button>
      </div>
    </div>
  );
}