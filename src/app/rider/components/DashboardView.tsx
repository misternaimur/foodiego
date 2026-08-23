"use client";

import { useState } from 'react';

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

      {/* Map */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
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
    </div>
  );
}