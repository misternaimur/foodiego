"use client";

import { useState } from 'react';

type Props = { onNavigate: (page: any) => void };

export default function RiderProfileSetup({ onNavigate }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [license, setLicense] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('availability');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Rider Profile Setup</h1>
          <p className="text-sm text-gray-500">Complete your profile to start delivering</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
          <select value={vehicle} onChange={(e) => setVehicle(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg" required>
            <option value="">Select vehicle</option>
            <option value="bike">Bike</option>
            <option value="scooter">Scooter</option>
            <option value="car">Car</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
          <input type="text" value={license} onChange={(e) => setLicense(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-orange-300">
            <div className="text-center">
              {photo ? <img src={photo} alt="Preview" className="w-20 h-20 object-cover rounded-lg mx-auto mb-2" /> : <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 text-[#FF5C28]">📷</div>}
              <span className="text-sm text-gray-600">{photo ? 'Change photo' : 'Upload photo'}</span>
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </div>
          </label>
        </div>

        <button type="submit" className="w-full bg-[#FF5C28] text-white py-2.5 rounded-xl font-medium hover:bg-[#B33C00] transition-colors">
          Save & Continue
        </button>
      </form>
    </div>
  );
}