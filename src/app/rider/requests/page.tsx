"use client";

import { useState } from 'react';

type Props = { onNavigate: (page: any) => void };

export default function RiderRequests({ onNavigate }: Props) {
  const [requests] = useState([
    { id: 'FD-8512', restaurant: 'Kacchi House', distance: '2.4 km', earnings: '৳145', time: '00:18' },
    { id: 'FD-8513', restaurant: 'Pizza Hub', distance: '1.8 km', earnings: '৳120', time: '00:25' },
    { id: 'FD-8514', restaurant: 'Burger Joint', distance: '3.1 km', earnings: '৳160', time: '00:30' },
  ]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Available Delivery Requests</h1>
        <p className="text-gray-500 mt-1">You have {requests.length} new requests nearby</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-white rounded-2xl border-2 border-amber-400 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500">Order</p>
                <p className="font-semibold text-gray-900">#{req.id}</p>
                <p className="text-sm text-gray-600 mt-1">Restaurant: {req.restaurant}</p>
                <p className="text-sm text-gray-500">📍 {req.distance} total distance</p>
                <p className="text-sm text-gray-500">Est. Earnings ৳{req.earnings}</p>
              </div>
              <span className="px-3 py-1 bg-[#FF5C28] text-white text-xs font-medium rounded-full">{req.time}</span>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-2.5 rounded-xl border border-slate-200 text-gray-700 font-medium hover:bg-gray-50">Decline</button>
              <button onClick={() => onNavigate('delivery-details')} className="flex-1 py-2.5 rounded-xl bg-[#FF5C28] text-white font-medium hover:bg-[#B33C00]">Accept Delivery</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}