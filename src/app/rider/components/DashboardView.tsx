"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

const RealMap = dynamic(() => import('./RealMap'), { ssr: false });

type Props = { onNavigate?: (page: string) => void };

export default function DashboardView({ onNavigate }: Props) {
  const [isOnline, setIsOnline] = useState(true);

  const kpis = [
    { label: "Today's Earnings", value: '$142.50', badge: '📈 +12%', badgeColor: 'text-green-600 bg-green-50' },
    { label: 'Completed Deliveries', value: '24 / 30', badge: '18 pending', badgeColor: 'text-gray-600 bg-gray-100' },
    { label: 'Current Rating', value: '4.98', badge: '⭐', badgeColor: 'text-yellow-600 bg-yellow-50' },
    { label: 'Distance Covered', value: '42.5 km', badge: '📍 route', badgeColor: 'text-blue-600 bg-blue-50' },
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const values = [60, 80, 50, 100, 70, 90, 65];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-medium mb-2 ${kpi.badgeColor}`}>{kpi.badge}</span>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-sm text-gray-500">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Content */}
        <div className="lg:col-span-8 space-y-6">
          <RealMap className="h-64 lg:h-96" />

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
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Order Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-[#B33C00] text-white px-4 py-3 flex items-center justify-between">
              <span className="text-xs font-semibold">⚡ ACTIVE ORDER</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">12 min ETA</span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-semibold text-gray-900">Burger Joint</p>
                  <p className="text-xs text-gray-500">Order #8492</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">$12.50</p>
                  <span className="text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">Guaranteed</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <div className="w-0.5 h-8 border-l-2 border-dashed border-slate-300" />
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                </div>
                <div className="space-y-4 text-sm flex-1">
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

              <button className="w-full mt-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-black">
                Navigate to Pickup
              </button>
            </div>
          </div>

          {/* Recommended Zones */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
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
        </div>
      </div>
    </div>
  );
}