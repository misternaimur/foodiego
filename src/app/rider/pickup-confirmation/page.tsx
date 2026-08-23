"use client";

import { useState } from 'react';

type Props = { onNavigate: (page: any) => void };

export default function RiderPickupConfirmation({ onNavigate }: Props) {
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pickup Confirmed</h1>
          <p className="text-gray-500 mb-6">Order #FD-8492 picked up successfully</p>

          <div className="p-4 bg-green-50 rounded-xl mb-6">
            <p className="text-sm text-green-700">✅ Pickup confirmed at 123 Main St</p>
            <p className="text-sm text-green-700 mt-1">Items collected: 2</p>
          </div>

          <button onClick={() => onNavigate('start-delivery')} className="w-full bg-[#FF5C28] text-white py-2.5 rounded-xl font-medium hover:bg-[#B33C00]">
            Start Delivery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pickup Confirmation</h1>
        <p className="text-gray-500 mb-6">Confirm you have picked up the order</p>

        <div className="p-4 bg-slate-50 rounded-xl mb-6">
          <p className="font-medium text-gray-900">Burger Joint</p>
          <p className="text-sm text-gray-500">123 Main St</p>
          <p className="text-sm text-gray-500">Order #FD-8492</p>
        </div>

        <button onClick={() => setConfirmed(true)} className="w-full bg-[#FF5C28] text-white py-2.5 rounded-xl font-medium hover:bg-[#B33C00] mb-3">
          Confirm Pickup
        </button>
        <button onClick={() => onNavigate('pickup-navigation')} className="w-full border border-slate-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50">
          Back to Navigation
        </button>
      </div>
    </div>
  );
}