"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

const RealMap = dynamic(() => import('./RealMap'), { ssr: false });

type Zone = {
  name: string;
  demand: string;
  surge: string;
  color: string;
};

type Props = { onNavigate?: (page: string) => void };

export default function MapView({ onNavigate }: Props) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const zones: Zone[] = [
    { name: 'Downtown', demand: 'High', surge: '+$3.00', color: 'bg-red-100 text-red-700' },
    { name: 'Uptown', demand: 'Very Busy', surge: '+$3.00', color: 'bg-red-100 text-red-700' },
    { name: 'University Campus', demand: 'Busy', surge: '+$1.50', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Suburbs', demand: 'Low', surge: '+$0.00', color: 'bg-green-100 text-green-700' },
  ];

  return (
    <div className="space-y-6">
      <RealMap className="h-64 lg:h-96" />

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