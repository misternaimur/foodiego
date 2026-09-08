"use client";

import { useState } from "react";
import { User, Mail, Phone, Save, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ClientProfilePage() {
  const { user } = useApp();
  const [fullName, setFullName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // NOTE: এখনো কোনো backend update endpoint নেই — এটি শুধু UI feedback দেখাচ্ছে।
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const initials = fullName ? fullName.charAt(0).toUpperCase() : "U";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Update your personal information.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-xl font-bold text-[#15462D]">
            {user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt={fullName} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{fullName || "Your Name"}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">Full Name</label>
            <div className="relative">
              <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3.5 text-sm focus:border-[#15462D] focus:outline-none focus:ring-2 focus:ring-[#15462D]/10"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">Email</label>
            <div className="relative">
              <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={user?.email || ""}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3.5 text-sm text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1XXXXXXXXX"
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3.5 text-sm focus:border-[#15462D] focus:outline-none focus:ring-2 focus:ring-[#15462D]/10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#15462D] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0e3320]"
            >
              <Save size={15} /> Save Changes
            </button>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <CheckCircle2 size={14} /> Saved!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}