"use client";

import { useState } from 'react';

export default function DashboardScreen() {
  const [isOnline] = useState(true);

  const kpis = [
    { label: "Today's Earnings", value: '$142.50', badge: '📈 +12%', badgeColor: 'text-green-600 bg-green-50' },
    { label: 'Completed Deliveries', value: '24 / 30', badge: '18 pending', badgeColor: 'text-gray-600 bg-gray-100' },
    { label: 'Current Rating', value: '4.98', badge: '⭐', badgeColor: 'text-yellow-600 bg-yellow-50' },
    { label: 'Distance Covered', value: '42.5 km', badge: '📍 route', badgeColor: 'text-blue-600 bg-blue-50' },
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const values = [60, 80, 50, 100, 70, 90, 65];

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
              <p className="font-semibold text-gray-900 text-sm">Alex Rider</p>
              <p className="text-xs text-gray-500">Pro Tier • 4.98 ★</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-medium rounded-full">
                Online 4h 20m
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {[
            { name: 'Dashboard', active: true },
            { name: 'Deliveries', active: false },
            { name: 'Map', active: false },
            { name: 'Earnings', active: false },
            { name: 'Shift History', active: false },
          ].map((item) => (
            <button
              key={item.name}
              className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 text-sm transition-colors ${
                item.active ? 'bg-[#FF5C28] text-white font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="w-5 h-5 rounded bg-white/20" />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4">
          <button className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
            <span>⚙️</span> Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, Alex</h1>
            <p className="text-gray-500 mt-1">Here's your operational overview for today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 bg-blue-50 text-blue-600 rounded-full">🔔</button>
            <button className="p-2 bg-blue-50 text-blue-600 rounded-full">🔍</button>
            <button className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium">🔴 Go Offline</button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-medium mb-2 ${kpi.badgeColor}`}>{kpi.badge}</span>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              <p className="text-sm text-gray-500">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-gray-700">📍 Demand Map - High demand in Downtown</div>
            <div className="flex gap-2">
              <button className="p-2 border border-slate-200 rounded-lg text-xs">📍</button>
              <button className="p-2 border border-slate-200 rounded-lg text-xs">☰</button>
            </div>
          </div>
          <div className="w-full h-64 bg-slate-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">Map / Heatmap Preview</div>
        </div>

        {/* Earnings Trend */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">Earnings Trend</h2>
              <p className="text-xs text-gray-500">AI-optimized insights based on your zone</p>
            </div>
            <select className="text-xs border border-slate-200 rounded-lg px-2 py-1">
              <option>This Week</option>
            </select>
          </div>
          <div className="flex items-end justify-between gap-2 h-48">
            {days.map((day, index) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative w-full flex justify-center">
                  {values[index] === 100 && (
                    <span className="absolute -top-6 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded">$142</span>
                  )}
                  <div
                    className={`w-full rounded-t-lg ${values[index] === 100 ? 'bg-[#FF5C28]' : 'bg-orange-100'}`}
                    style={{ height: `${values[index]}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Right Panel */}
      <aside className="w-[320px] bg-white border-l border-slate-100 p-5 overflow-auto">
        {/* Active Order */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
          <div className="bg-[#B33C00] text-white px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-semibold">⚡ ACTIVE ORDER</span>
            <span className="text-xs">12 min ETA</span>
          </div>
          <div className="p-4">
            <p className="text-sm font-semibold text-gray-900">Burger Joint</p>
            <p className="text-xs text-gray-500">Payout: $12.50 Guaranteed</p>
            <p className="text-xs text-gray-500 mt-1">Order #8492</p>

            <div className="mt-4 space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <div className="w-0.5 h-8 bg-slate-200" />
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">Pickup</p>
                    <p className="text-xs text-gray-500">123 Main St</p>
                    <p className="text-xs text-gray-400">0.5 km</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Dropoff</p>
                    <p className="text-xs text-gray-500">456 Elm St, Apt 4B</p>
                    <p className="text-xs text-gray-400">3.2 km</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-black">
              Navigate to Pickup
            </button>
          </div>
        </div>

        {/* Recommended Zones */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Recommended Zones</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">🔥</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Uptown District</p>
                  <p className="text-xs text-gray-500">Very Busy • +$3.00 Surge</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">›</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-lg flex items-center justify-center">📈</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">University Campus</p>
                  <p className="text-xs text-gray-500">Busy • +$1.50 Surge</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">›</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}