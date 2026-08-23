"use client";

import { useState } from 'react';

type Props = { onNavigate: (page: any) => void };

export default function RiderLogin({ onNavigate }: Props) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  const handleSendOtp = () => {
    if (phone.length >= 10) setStep('otp');
  };

  const handleVerify = () => {
    if (otp.length >= 4) onNavigate('profile-setup');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Rider Login</h1>
        <p className="text-sm text-gray-500 mb-6">Welcome back to Foodiego Rider</p>

        {step === 'phone' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              onClick={handleSendOtp}
              className="w-full bg-[#FF5C28] text-white py-2.5 rounded-xl font-medium hover:bg-[#B33C00] transition-colors"
            >
              Send OTP
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1234"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              onClick={handleVerify}
              className="w-full bg-[#FF5C28] text-white py-2.5 rounded-xl font-medium hover:bg-[#B33C00] transition-colors"
            >
              Verify & Continue
            </button>
            <button onClick={() => setStep('phone')} className="w-full text-sm text-gray-600 hover:text-gray-900">
              Change phone number
            </button>
          </div>
        )}
      </div>
    </div>
  );
}