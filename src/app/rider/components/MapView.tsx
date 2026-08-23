"use client";

import { useState } from 'react';

type Props = { onNavigate?: (page: string) => void };

export default function MapView({ onNavigate }: Props) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const zones = [
    { name: 'Downtown', demand: 'High', surge: '+$3.00', color: 'bg-red-100 text-red-700' },
    { name: 'Uptown', demand: 'Very Busy', surge: '+$3.00', color: 'bg-red-100 text-red-700' },
    { name: 'University Campus', demand: 'Busy', surge: '+$1.50', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Suburbs', demand: 'Low', surge: '+$0.00', color: 'bg-green-100 text-green-700' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Live Rider Map</h2>
            <p className="text-xs text-gray-500">View active deliveries and demand hotspots</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 border border-slate-200 rounded-lg text-xs">📍</button>
            <button className="p-2 border border-slate-200 rounded-lg text-xs">☰</button>
          </div>
        </div>
        <div className="relative w-full h-[500px] bg-slate-100 rounded-xl overflow-hidden">
          <svg viewBox="0 0 800 500" className="w-full h-full">
            <rect width="800" height="500" fill="#E5E7EB" />
            <rect x="50" y="50" width="200" height="120" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="300" y="80" width="180" height="100" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="120" y="220" width="220" height="110" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="420" y="200" width="200" height="130" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="600" y="90" width="160" height="90" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="560" y="260" width="200" height="110" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="40" y="420" width="720" height="18" rx="4" fill="#94A3B8" opacity="0.6" />
            <rect x="380" y="40" width="18" height="420" rx="4" fill="#94A3B8" opacity="0.6" />
            <circle cx="200" cy="110" r="14" fill="#FF5C28" opacity="0.9" />
            <circle cx="420" cy="280" r="14" fill="#B33C00" opacity="0.9" />
            <circle cx="640" cy="140" r="14" fill="#FF5C28" opacity="0.9" />
            <circle cx="180" cy="280" r="10" fill="#16A34A" />
            <text x="200" y="114" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">P</text>
            <text x="420" y="284" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">D</text>
            <text x="640" y="144" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">R</text>
            <text x="180" y="284" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">You</text>
          </svg>
          <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-gray-700 border border-slate-200">📍 Live Map</div>
          <div className="absolute bottom-3 left-3 flex gap-2 text-[10px] text-gray-600">
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FF5C28]"></span>Hotspot</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#B33C00]"></span>Pickup</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-600"></span>You</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Zones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {zones.map((zone) => (
            <button
              key={zone.name}
              onClick={() => setSelectedZone(zone.name)}
              className={`p-4 rounded-xl border-2 text-left transition-colors ${
                selectedZone === zone.name ? 'border-[#FF5C28] bg-orange-50' : 'border-slate-100 hover:border-orange-200'
              }`}
            >
              <p className="font-medium text-gray-900">{zone.name}</p>
              <p className="text-xs text-gray-500">{zone.demand}</p>
              <span className="text-sm font-medium text-[#FF5C28]">{zone.surge}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}