"use client";

import { useState } from 'react';

type Props = { onNavigate: (page: any) => void };

export default function RiderLogout({ onNavigate }: Props) {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => onNavigate('login'), 1200);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Logout</h1>
        <p className="text-sm text-gray-500 mb-6">Are you sure you want to logout?</p>

        {loggingOut ? (
          <p className="text-sm text-gray-600">Logging out...</p>
        ) : (
          <div className="space-y-3">
            <button onClick={handleLogout} className="w-full bg-[#FF5C28] text-white py-2.5 rounded-xl font-medium hover:bg-[#B33C00]">
              Yes, Logout
            </button>
            <button onClick={() => onNavigate('availability')} className="w-full border border-slate-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}