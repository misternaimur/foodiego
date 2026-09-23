"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Save, CheckCircle2, LoaderCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { profileApi } from "@/lib/clientApi";
import ProfilePhotoUploader from "@/components/shared/ProfilePhotoUploader";

export default function ClientProfilePage() {
  const { user } = useApp();
  const router = useRouter();
  const [fullName, setFullName] = useState(user?.name || "");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    profileApi
      .get()
      .then((data) => {
        setFullName(data.name);
        setPhone(data.phone || "");
        setAvatarUrl(data.avatarUrl || "");
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await profileApi.update({ name: fullName, phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Could not save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const savePhoto = async (url: string) => {
    await profileApi.updatePhoto(url);
    setAvatarUrl(url);
    // Re-render the server layout so the sidebar and navbar pick up the new photo.
    router.refresh();
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Update your personal information.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="mb-6 space-y-3">
          <div>
            <p className="text-sm font-bold text-gray-900">{fullName || "Your Name"}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <ProfilePhotoUploader
            imageUrl={avatarUrl || user?.avatarUrl}
            name={fullName || "You"}
            onUploaded={savePhoto}
          />
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
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#15462D] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0e3320] disabled:opacity-60"
            >
              {saving ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />}
              Save Changes
            </button>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <CheckCircle2 size={14} /> Saved!
              </span>
            )}
            {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}