"use client";

import { useState } from 'react';

type Props = { onNavigate: (page: any) => void };

export default function RiderHeatmap({ onNavigate }: Props) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const zones = [
    { name: 'Downtown', demand: 'High', surge: '+$3.00', color: 'bg-red-100 text-red-700' },
    { name: 'Uptown', demand: 'Very Busy', surge: '+$3.00', color: 'bg-red-100 text-red-700' },
    { name: 'University Campus', demand: 'Busy', surge: '+$1.50', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Suburbs', demand: 'Low', surge: '+$0.00', color: 'bg-green-100 text-green-700' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rider Heatmap</h1>
        <p className="text-gray-500 mt-1">View high-demand zones and surge pricing</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="w-full h-64 bg-slate-100 rounded-xl flex items-center justify-center text-gray-400 text-sm mb-4">Heatmap Preview</div>
        <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-gray-700 inline-block">📍 High demand in Downtown</div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Zones</h2>
        <div className="space-y-3">
          {zones.map((zone) => (
            <button
              key={zone.name}
              onClick={() => setSelectedZone(zone.name)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                selectedZone === zone.name ? 'border-[#FF5C28] bg-orange-50' : 'border-slate-100 hover:border-orange-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{zone.name}</p>
                  <p className="text-xs text-gray-500">{zone.demand}</p>
                </div>
                <span className="text-sm font-medium text-[#FF5C28]">{zone.surge}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}