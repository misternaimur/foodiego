"use client";

import { useState } from 'react';

type Props = { onNavigate: (page: any) => void };

export default function RiderDeliveryDetails({ onNavigate }: Props) {
  const [accepted, setAccepted] = useState(false);

  if (accepted) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Delivery Accepted</h1>
          <p className="text-gray-500 mb-6">Order #FD-8492 • Burger Joint</p>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">🍔</div>
              <div>
                <p className="font-medium text-gray-900">Burger Joint</p>
                <p className="text-sm text-gray-500">Pickup: 123 Main St</p>
                <p className="text-sm text-gray-500">Dropoff: 456 Elm St, Apt 4B</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-gray-600">Payout: <span className="font-semibold text-gray-900">$12.50 Guaranteed</span></p>
              <p className="text-sm text-gray-600">Distance: <span className="font-semibold text-gray-900">3.2 km</span></p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => onNavigate('pickup-navigation')} className="flex-1 bg-[#FF5C28] text-white py-2.5 rounded-xl font-medium hover:bg-[#B33C00]">
              Navigate to Pickup
            </button>
            <button onClick={() => onNavigate('requests')} className="flex-1 border border-slate-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50">
              Back to Requests
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Delivery Details</h1>
        <p className="text-gray-500 mb-6">Review the order before accepting</p>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">🍔</div>
            <div>
              <p className="font-medium text-gray-900">Burger Joint</p>
              <p className="text-sm text-gray-500">Pickup: 123 Main St</p>
              <p className="text-sm text-gray-500">Dropoff: 456 Elm St, Apt 4B</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-2">
            <p className="text-sm text-gray-600">Order ID: <span className="font-semibold text-gray-900">#FD-8492</span></p>
            <p className="text-sm text-gray-600">Payout: <span className="font-semibold text-gray-900">$12.50 Guaranteed</span></p>
            <p className="text-sm text-gray-600">Distance: <span className="font-semibold text-gray-900">3.2 km</span></p>
            <p className="text-sm text-gray-600">Items: <span className="font-semibold text-gray-900">2 items</span></p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={() => onNavigate('requests')} className="flex-1 border border-slate-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50">Decline</button>
          <button onClick={() => setAccepted(true)} className="flex-1 bg-[#FF5C28] text-white py-2.5 rounded-xl font-medium hover:bg-[#B33C00]">Accept Delivery</button>
        </div>
      </div>
    </div>
  );
}