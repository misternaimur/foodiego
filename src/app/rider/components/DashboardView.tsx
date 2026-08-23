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
        <div className="relative w-full h-64 bg-slate-100 rounded-xl overflow-hidden">
          <svg viewBox="0 0 800 400" className="w-full h-full">
            <rect width="800" height="400" fill="#E5E7EB" />
            <rect x="50" y="50" width="200" height="120" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="300" y="80" width="180" height="100" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="120" y="220" width="220" height="110" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="420" y="200" width="200" height="130" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="600" y="90" width="160" height="90" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="560" y="260" width="200" height="110" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="40" y="360" width="720" height="18" rx="4" fill="#94A3B8" opacity="0.6" />
            <rect x="380" y="40" width="18" height="340" rx="4" fill="#94A3B8" opacity="0.6" />
            <circle cx="200" cy="110" r="14" fill="#FF5C28" opacity="0.9" />
            <circle cx="420" cy="280" r="14" fill="#B33C00" opacity="0.9" />
            <circle cx="640" cy="140" r="14" fill="#FF5C28" opacity="0.9" />
            <circle cx="180" cy="280" r="10" fill="#16A34A" />
            <text x="200" y="114" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">P</text>
            <text x="420" y="284" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">D</text>
            <text x="640" y="144" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">R</text>
            <text x="180" y="284" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">You</text>
          </svg>
          <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-gray-700 border border-slate-200">📍 Demand Map - High demand in Downtown</div>
          <div className="absolute top-3 right-3 flex gap-2">
            <button className="p-2 bg-white/90 border border-slate-200 rounded-lg text-xs">📍</button>
            <button className="p-2 bg-white/90 border border-slate-200 rounded-lg text-xs">☰</button>
          </div>
          <div className="absolute bottom-3 left-3 flex gap-2 text-[10px] text-gray-600">
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FF5C28]"></span>Hotspot</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#B33C00]"></span>Pickup</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-600"></span>You</span>
          </div>
        </div>
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