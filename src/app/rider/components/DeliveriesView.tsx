"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

const RealMap = dynamic(() => import('./RealMap'), { ssr: false });

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Center Area */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div key={metric.label} className={`rounded-2xl border border-slate-100 shadow-sm p-5 ${metric.dark ? 'bg-[#B33C00] text-white' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${metric.dark ? 'bg-white/20 text-white' : 'bg-orange-100 text-[#FF5C28]'}`}>
                  {metric.icon === 'bike' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {metric.icon === 'bell' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  )}
                  {metric.icon === 'check' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {metric.icon === 'wallet' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                {metric.dark && (
                  <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <p className={`text-2xl font-bold ${metric.dark ? 'text-white' : 'text-gray-900'}`}>{metric.value}</p>
              <p className={`text-sm ${metric.dark ? 'text-white/80' : 'text-gray-500'}`}>{metric.label}</p>
            </div>
          ))}
        </div>

        <RealMap className="h-64 lg:h-96" />

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
          <div className="flex flex-col sm:flex-row gap-3">
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

          <div className="flex items-start gap-2 mb-6">
            {steps.map((step, index) => (
              <div key={step} className="flex-1 flex flex-col items-center gap-2">
                <div className={`w-4 h-4 rounded-full border-2 ${index <= currentStep ? 'bg-[#FF5C28] border-[#FF5C28]' : 'border-gray-300 bg-white'}`} />
                <span className="text-[10px] text-gray-600 text-center">{step}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 py-2.5 rounded-xl border border-slate-200 flex items-center justify-center gap-2 hover:bg-gray-50">📞</button>
            <button className="flex-1 py-2.5 rounded-xl border border-slate-200 flex items-center justify-center gap-2 hover:bg-gray-50">🗺️</button>
            <button onClick={() => alert('Marked as delivered')} className="flex-1 py-2.5 rounded-xl bg-[#B33C00] text-white font-medium hover:bg-black">Mark as Delivered</button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="col-span-12 lg:col-span-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">View Deliveries</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {['All (32)', 'Active (2)', 'Pending (4)', 'Completed (24)'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  activeFilter === filter ? 'bg-[#FF5C28] text-white border-[#FF5C28]' : 'border-slate-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search Order ID..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50">
              <span>⇔</span> Filter
            </button>
            <button className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50">
              <span>↑↓</span> Sort
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}