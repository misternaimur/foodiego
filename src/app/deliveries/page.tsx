"use client";

import { useState } from 'react';

export default function DeliveriesScreen() {
  const [activeFilter, setActiveFilter] = useState('active');

  const metrics = [
    { label: 'Active Deliveries', value: '3', icon: 'bike' },
    { label: 'Pending Requests', value: '5', icon: 'bell' },
    { label: 'Completed Today', value: '24', icon: 'check' },
    { label: "Today's Earnings", value: '৳1,850', icon: 'wallet', dark: true },
  ];

  const navItems = [
    { name: 'Dashboard', key: 'dashboard' },
    { name: 'Deliveries', key: 'deliveries', active: true },
    { name: 'Map', key: 'map' },
    { name: 'Earnings', key: 'earnings' },
    { name: 'Shift History', key: 'shift' },
  ];

  const steps = ['Accepted', 'Arrived', 'Picked Up', 'On Way', 'Delivered'];
  const currentStep = 4;

  return (
    <div className="flex min-h-screen bg-[#F8F9FD]">
      {/* Left Sidebar */}
      <aside className="w-[250px] bg-white border-r border-slate-100 flex flex-col">
        <div className="p-5">
          <h1 className="text-xl font-bold text-[#FF5C28]">Foodiego</h1>
        </div>

        <div className="px-4 mb-6">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">A</div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Foodiego Rider</p>
              <p className="text-xs text-amber-600 font-medium">Elite Tier</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 text-sm transition-colors ${
                item.active
                  ? 'bg-orange-50 text-[#FF5C28] font-medium border-r-2 border-[#FF5C28]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="w-5 h-5 rounded bg-gray-200" />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4">
          <button className="w-full bg-[#FF5C28] text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2">
            <span className="text-lg">⏻</span>
            Go Online
          </button>
        </div>
      </aside>

      {/* Main Center Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Deliveries</h1>
          <p className="text-gray-500 mt-1">Manage your active, upcoming, and completed deliveries.</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${metric.dark ? 'bg-[#B33C00] text-white' : 'bg-orange-100 text-[#FF5C28]'}`}>
                  <div className="w-5 h-5 rounded bg-white/30" />
                </div>
                {!metric.dark && <span className="text-xs font-medium text-gray-500">icon</span>}
              </div>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-sm text-gray-500">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* New Request Card */}
        <div className="bg-white rounded-2xl border-2 border-amber-400 shadow-sm p-6 mb-6">
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
            <button className="flex-1 py-2.5 rounded-xl bg-[#FF5C28] text-white font-medium hover:bg-[#B33C00]">Accept Delivery</button>
          </div>
        </div>

        {/* Active Deliveries Tracker */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-gray-900">Active Deliveries</p>
              <p className="text-sm text-gray-500">#FD-8492 • Burger Joint</p>
              <p className="text-xs text-gray-500 mt-1">Status: On the Way</p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">⏱️ ETA: 12 min</span>
          </div>

          {/* Progress */}
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
            <button className="flex-1 py-2.5 rounded-xl bg-[#B33C00] text-white font-medium hover:bg-black">Mark as Delivered</button>
          </div>
        </div>
      </main>

      {/* Right Filter Panel */}
      <aside className="w-[300px] bg-white border-l border-slate-100 p-5">
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
      </aside>
    </div>
  );
}