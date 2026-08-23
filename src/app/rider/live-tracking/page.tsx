"use client";

import { useState } from 'react';

type Props = { onNavigate: (page: any) => void };

export default function RiderLiveTracking({ onNavigate }: Props) {
  const [location, setLocation] = useState({ lat: 23.8103, lng: 90.4125 });

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Live Location Sharing</h1>
        <p className="text-gray-500 mb-6">Share your live location with customer</p>

        <div className="w-full h-64 bg-slate-100 rounded-xl flex items-center justify-center text-gray-400 text-sm mb-4">Map Preview - Live Tracking</div>

        <div className="p-4 bg-slate-50 rounded-xl mb-4">
          <p className="font-medium text-gray-900">Current Location</p>
          <p className="text-sm text-gray-500">Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</p>
          <p className="text-sm text-gray-500">Speed: 24 km/h</p>
        </div>

        <div className="flex gap-3">
          <button onClick={() => onNavigate('status-update')} className="flex-1 bg-[#FF5C28] text-white py-2.5 rounded-xl font-medium hover:bg-[#B33C00]">
            Update Status
          </button>
          <button onClick={() => onNavigate('mark-delivered')} className="flex-1 border border-slate-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50">
            Mark Delivered
          </button>
        </div>
      </div>
    </div>
  );
}