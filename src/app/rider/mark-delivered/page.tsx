"use client";

import { useState } from 'react';

type Props = { onNavigate: (page: any) => void };

export default function RiderMarkDelivered({ onNavigate }: Props) {
  const [proof, setProof] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setProof(URL.createObjectURL(file));
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mark as Delivered</h1>
        <p className="text-gray-500 mb-6">Confirm delivery completion</p>

        <div className="p-4 bg-slate-50 rounded-xl mb-4">
          <p className="font-medium text-gray-900">Order #FD-8492</p>
          <p className="text-sm text-gray-500">Customer: 456 Elm St, Apt 4B</p>
        </div>

        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center mb-4">
          <label className="cursor-pointer">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 text-[#FF5C28]">📷</div>
            <p className="text-sm text-gray-600">Upload delivery proof</p>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
          {proof && <img src={proof} alt="Proof" className="mt-3 mx-auto w-32 h-32 object-cover rounded-lg" />}
        </div>

        <button onClick={() => onNavigate('completion')} className="w-full bg-[#FF5C28] text-white py-2.5 rounded-xl font-medium hover:bg-[#B33C00]">
          Mark as Delivered
        </button>
      </div>
    </div>
  );
}