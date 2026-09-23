"use client";

import {
  Bell,
  Bike,
  CheckCircle2,
  DollarSign,
  History,
  Home,
  LogOut,
  Package,
  Settings as SettingsIcon,
  ShieldCheck,
  User,
  X,
  MapPin,
  Lock,
  Menu,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import ProfilePhotoUploader from "@/components/shared/ProfilePhotoUploader";

// ============================================================
// UPDATE (rider-dashboard real-data fix): this page used to be entirely
// static — "Afrin", "afrin@example.com", a fixed "4.9 Rating", and a
// "Save Changes" button with no handler. Profile Information now loads
// and saves through /api/v1/rider/profile (GET/PATCH), which reads and
// writes the real Rider document. Notification/sound-alert toggles have
// no backing schema anywhere in this codebase (there's no per-rider
// notification-preferences model), so they remain local-only UI state —
// that's called out below rather than silently pretending they persist.
// ============================================================

interface RiderProfile {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
  isAvailable: boolean;
  photoUrl: string;
}

export default function RiderSettingsPage() {
  const { user, logoutUser } = useApp();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Same sign-out as the rest of the rider sidebar (see RiderShell.tsx) —
  // this page keeps its own sidebar copy, whose Logout had no handler.
  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    setMobileMenu(false);
    try {
      await logoutUser();
    } finally {
      setLoggingOut(false);
    }
  };

  const [profile, setProfile] = useState<RiderProfile | null>(null);
  const [form, setForm] = useState({ fullName: "", phone: "", address: "", city: "", vehicleNumber: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [locationAccess, setLocationAccess] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/v1/rider/profile");
      if (!res.ok) return;
      const data = (await res.json()) as RiderProfile;
      setProfile(data);
      setForm({
        fullName: data.fullName || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        vehicleNumber: data.vehicleNumber || "",
      });
    })();
  }, []);

  // Saves a freshly uploaded photo straight away (no separate "Save" click),
  // the same way the vendor profile saves its logo/cover.
  async function savePhoto(url: string) {
    const res = await fetch("/api/v1/rider/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoUrl: url }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error || "Couldn't save your photo.");
    }
    setProfile((p) => (p ? { ...p, photoUrl: url } : p));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/v1/rider/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setProfile((p) => (p ? { ...p, ...form } : p));
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="flex min-h-screen">

        {/* =====================================================
            SIDEBAR
        ===================================================== */}

        <aside
          className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-slate-200 bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:z-30 lg:block lg:h-screen lg:translate-x-0 ${
            mobileMenu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="relative flex h-full flex-col">

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileMenu(false)}
              className="absolute right-4 top-5 z-10 rounded-lg p-2 hover:bg-slate-100 lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>

            {/* =================================================
                RIDER PROFILE
            ================================================= */}

            <div className="border-b border-slate-100 px-5 py-6">
              <div className="flex items-center gap-3">

                {/* Avatar */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-100">
                  {profile?.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- user-uploaded URL from any image host
                    <img src={profile.photoUrl} alt={profile.fullName} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-6 w-6 text-green-500" />
                  )}
                </div>

                {/* Profile Info */}
                <div className="min-w-0">

                  <p className="font-semibold text-slate-800">
                    {profile?.fullName || user?.name || "Rider"}
                  </p>

                  <p className="mt-0.5 text-xs font-medium text-green-500">
                    Rider
                  </p>

                </div>
              </div>
            </div>

            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav className="flex-1 px-4 py-5">

              {/* Dashboard */}
              <a
                href="/rider"
                onClick={() => setMobileMenu(false)}
                className="mb-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-green-100 hover:text-green-500"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </a>

              {/* Orders */}
              <a
                href="/rider/orders"
                onClick={() => setMobileMenu(false)}
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-green-100 hover:text-green-500"
              >
                <Package className="h-4 w-4" />
                Orders
              </a>

              {/* Deliveries */}
              <a
                href="/rider/deliveries"
                onClick={() => setMobileMenu(false)}
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-green-100 hover:text-green-500"
              >
                <Bike className="h-4 w-4" />
                Deliveries
              </a>

              {/* Earnings */}
              <a
                href="/rider/earnings"
                onClick={() => setMobileMenu(false)}
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-green-100 hover:text-green-500"
              >
                <DollarSign className="h-4 w-4" />
                Earnings
              </a>

              {/* Shift History */}
              <a
                href="/rider/shift-history"
                onClick={() => setMobileMenu(false)}
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-green-100 hover:text-green-500"
              >
                <History className="h-4 w-4" />
                Shift History
              </a>

              {/* Settings - ACTIVE */}
              <a
                href="/rider/settings"
                onClick={() => setMobileMenu(false)}
                className="mb-1 flex items-center gap-3 rounded-lg bg-green-500 px-4 py-3 text-sm font-medium text-white shadow-sm"
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </a>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-wait disabled:opacity-60"
              >
                <LogOut className="h-4 w-4" />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>

            </nav>
          </div>
        </aside>

        {/* =====================================================
            MOBILE OVERLAY
        ===================================================== */}

        {mobileMenu && (
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setMobileMenu(false)}
          />
        )}

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <main className="min-w-0 flex-1">

          {/* Mobile Menu Button */}
          <div className="px-5 pt-5 lg:hidden">
            <button
              onClick={() => setMobileMenu(true)}
              className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm hover:bg-slate-50"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </button>
          </div>

          <div className="space-y-7 p-5 md:p-8 lg:p-10">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <section>

              <h1 className="text-4xl font-bold tracking-tight text-green-500">
                Rider Dashboard
              </h1>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Settings
              </h2>

              <p className="mt-2 max-w-xl text-sm text-slate-500">
                Manage your profile, notifications, privacy and delivery
                preferences.
              </p>

            </section>

            {/* =================================================
                PROFILE INFORMATION
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-500">
                    <User className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Profile Information
                    </h2>

                    <p className="text-sm text-slate-500">
                      Update your rider account information.
                    </p>
                  </div>

                </div>

              </div>

              <div className="border-b border-slate-100 px-6 py-5">
                <ProfilePhotoUploader
                  imageUrl={profile?.photoUrl}
                  name={profile?.fullName || user?.name || "Rider"}
                  onUploaded={savePhoto}
                />
              </div>

              <div className="grid gap-6 p-6 md:grid-cols-2">

                {/* Full Name */}
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">
                    Full Name
                  </p>
                  <input
                    value={form.fullName}
                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                {/* Email (read-only, tied to auth account) */}
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">
                    Email Address
                  </p>

                  <p className="text-sm font-medium text-slate-800">
                    {profile?.email || "—"}
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">
                    Phone Number
                  </p>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                {/* Account Type */}
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">
                    Account Type
                  </p>

                  <div className="flex items-center gap-2">

                    <Bike className="h-4 w-4 text-green-500" />

                    <span className="text-sm font-semibold text-slate-800">
                      Rider
                    </span>

                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${profile?.isAvailable ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"}`}>
                      {profile?.isAvailable ? "Online" : "Offline"}
                    </span>

                  </div>
                </div>

                {/* Address */}
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">
                    Address
                  </p>
                  <input
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                {/* City */}
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">
                    City
                  </p>
                  <input
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                {/* Vehicle Number */}
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">
                    Vehicle Number
                  </p>
                  <input
                    value={form.vehicleNumber}
                    onChange={(e) => setForm((f) => ({ ...f, vehicleNumber: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-green-300 focus:ring-2 focus:ring-green-100"
                  />
                </div>

              </div>

              {/* Save */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 p-5">

                {saved && <span className="text-sm font-medium text-green-600">Saved</span>}

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600 disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>

              </div>

            </section>

            {/* =================================================
                DELIVERY PREFERENCES
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-500">
                    <Bike className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Delivery Preferences
                    </h2>

                    <p className="text-sm text-slate-500">
                      Control your delivery and location preferences.
                    </p>
                  </div>

                </div>

              </div>

              <div className="divide-y divide-slate-100">

                <SettingRow
                  icon={<MapPin className="h-5 w-5" />}
                  title="Location Access"
                  description="Allow Foodiego to use your location for delivery tracking."
                  enabled={locationAccess}
                  onToggle={() =>
                    setLocationAccess(!locationAccess)
                  }
                />

                <SettingRow
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  title="New Order Alerts"
                  description="Receive notifications when new delivery orders are available."
                  enabled={orderAlerts}
                  onToggle={() =>
                    setOrderAlerts(!orderAlerts)
                  }
                />

              </div>

            </section>

            {/* =================================================
                NOTIFICATIONS
                NOTE: no per-rider notification-preferences schema exists
                in this codebase yet, so these toggles are local UI state
                only (not persisted server-side).
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-500">
                    <Bell className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Notifications
                    </h2>

                    <p className="text-sm text-slate-500">
                      Choose how you want to receive alerts.
                    </p>
                  </div>

                </div>

              </div>

              <div className="divide-y divide-slate-100">

                <SettingRow
                  icon={<Bell className="h-5 w-5" />}
                  title="Push Notifications"
                  description="Receive important updates and delivery notifications."
                  enabled={notifications}
                  onToggle={() =>
                    setNotifications(!notifications)
                  }
                />

                <SettingRow
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  title="Order Notifications"
                  description="Get notified about accepted, picked up and completed orders."
                  enabled={orderAlerts}
                  onToggle={() =>
                    setOrderAlerts(!orderAlerts)
                  }
                />

                <SettingRow
                  icon={<Bell className="h-5 w-5" />}
                  title="Sound Alerts"
                  description="Play a sound when a new delivery request arrives."
                  enabled={soundAlerts}
                  onToggle={() =>
                    setSoundAlerts(!soundAlerts)
                  }
                />

              </div>

            </section>

            {/* =================================================
                SECURITY
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-500">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Security
                    </h2>

                    <p className="text-sm text-slate-500">
                      Keep your rider account secure.
                    </p>
                  </div>

                </div>

              </div>

              <div className="p-6">

                <a
                  href="mailto:support@foodiego.com"
                  className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:bg-slate-50"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                    <Lock className="h-5 w-5 text-slate-600" />
                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-semibold text-slate-800">
                      Change Password
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Account is managed via Firebase Authentication — contact
                      support to reset your password.
                    </p>

                  </div>

                </a>

              </div>

            </section>

            {/* =================================================
                ACCOUNT STATUS
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <span className={`h-2.5 w-2.5 rounded-full ${profile?.isAvailable ? "bg-green-500" : "bg-slate-400"}`} />

                    <h3 className="font-bold text-slate-900">
                      {profile?.isAvailable ? "Rider Account Online" : "Rider Account Offline"}
                    </h3>

                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {profile?.isAvailable
                      ? "You are currently online and available for deliveries."
                      : "You are currently offline. Toggle online from the dashboard to receive delivery requests."}
                  </p>

                </div>

              </div>

            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

/* =============================================================
   SETTING ROW
============================================================= */

function SettingRow({
  icon,
  title,
  description,
  enabled,
  onToggle,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-4 p-5 md:p-6">

      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
        {icon}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">

        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>

      </div>

      {/* Toggle */}
      <button
        type="button"
        onClick={onToggle}
        aria-label={`Toggle ${title}`}
        className={`relative flex h-8 w-[52px] shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
          enabled ? "bg-emerald-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`ml-[3px] flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 ${
            enabled ? "ml-auto" : "ml-0"
          }`}
        >
          {enabled && (
            <svg
              className="h-3.5 w-3.5 text-emerald-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </span>
      </button>

    </div>
  );
}
