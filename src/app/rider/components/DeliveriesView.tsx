"use client";

import { useState } from 'react';

type Props = { onNavigate?: (page: string) => void };

export default function DeliveriesView({ onNavigate }: Props) {
  const [activeFilter, setActiveFilter] = useState('Active (2)');
  const [requests] = useState([
    { id: 'FD-8512', restaurant: 'Kacchi House', distance: '2.4 km', earnings: '৳145', time: '00:18' },
    { id: 'FD-8513', restaurant: 'Pizza Hub', distance: '1.8 km', earnings: '৳120', time: '00:25' },
    { id: 'FD-8514', restaurant: 'Burger Joint', distance: '3.1 km', earnings: '৳160', time: '00:30' },
  ]);

  const metrics = [
    { label: 'Active Deliveries', value: '3', icon: 'bike' },
    { label: 'Pending Requests', value: '5', icon: 'bell' },
    { label: 'Completed Today', value: '24', icon: 'check' },
    { label: "Today's Earnings", value: '৳1,850', icon: 'wallet', dark: true },
  ];

  const steps = ['Accepted', 'Arrived', 'Picked Up', 'On Way', 'Delivered'];
  const currentStep = 4;

  const handleAccept = () => {
    alert('Delivery accepted. Navigate to pickup.');
  };

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${metric.dark ? 'bg-[#B33C00] text-white' : 'bg-orange-100 text-[#FF5C28]'}`}>
                <div className="w-5 h-5 rounded bg-white/30" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            <p className="text-sm text-gray-500">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* New Request */}
      <div className="bg-white rounded-2xl border-2 border-amber-400 shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Order</p>
            <p className="font-semibold text-gray-900">#FD-8512</p>
            <p className="text-sm text-gray-600 mt-1">Restaurant: Kacchi House</p>
            <p className="text-sm text-gray-500">📍 2.4 km total distance</p>
            <p className="text-sm text-gray-500">Est. Earnings ৳145</p>
          </div>
          <span className="px-3 py-1 bg-[#FF5C28] text-white text-xs font-medium rounded-full">00:18</span>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 py-2.5 rounded-xl border border-slate-200 text-gray-700 font-medium hover:bg-gray-50">Decline</button>
          <button onClick={handleAccept} className="flex-1 py-2.5 rounded-xl bg-[#FF5C28] text-white font-medium hover:bg-[#B33C00]">Accept Delivery</button>
        </div>
      </div>

      {/* Active Deliveries */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-gray-900">Active Deliveries</p>
            <p className="text-sm text-gray-500">#FD-8492 • Burger Joint</p>
            <p className="text-xs text-gray-500 mt-1">Status: On the Way</p>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">⏱️ ETA: 12 min</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center gap-2">
              <div className={`w-4 h-4 rounded-full border-2 ${index <= currentStep ? 'bg-[#FF5C28] border-[#FF5C28]' : 'border-gray-300 bg-white'}`} />
              <span className="text-[10px] text-gray-600 text-center">{step}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button className="flex-1 py-2.5 rounded-xl border border-slate-200 flex items-center justify-center gap-2 hover:bg-gray-50">📞</button>
          <button className="flex-1 py-2.5 rounded-xl border border-slate-200 flex items-center justify-center gap-2 hover:bg-gray-50">🗺️</button>
          <button onClick={() => alert('Marked as delivered')} className="flex-1 py-2.5 rounded-xl bg-[#B33C00] text-white font-medium hover:bg-black">Mark as Delivered</button>
        </div>
      </div>
    </div>
  );
}