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
  Star,
  User,
  X,
  MapPin,
  Lock,
} from "lucide-react";

import { useState } from "react";

export default function RiderSettingsPage() {
  const [mobileMenu, setMobileMenu] = useState(false);

  const [locationAccess, setLocationAccess] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);

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
          <div className="flex h-full flex-col">

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileMenu(false)}
              className="absolute right-4 top-5 rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>

            {/* =================================================
                RIDER PROFILE
            ================================================= */}

            <div className="border-b border-slate-100 px-5 py-7">
              <div className="flex items-center gap-3">

                {/* Profile Icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100">
                  <User className="h-6 w-6 text-orange-500" />
                </div>

                {/* Profile Info */}
                <div className="min-w-0">

                  <p className="font-semibold text-slate-800">
                    Afrin
                  </p>

                  {/* Rider Role */}
                  <p className="mt-0.5 text-xs font-medium text-orange-500">
                    Rider
                  </p>

                  {/* Rating */}
                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                    <span>4.9 Rating</span>
                  </div>

                </div>

              </div>
            </div>

            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav className="flex-1 px-4 py-5">

              {/* Dashboard */}
              <a
                href="/dashboard/rider"
                onClick={() => setMobileMenu(false)}
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </a>

              {/* Orders */}
              <a
                href="/dashboard/rider/orders"
                onClick={() => setMobileMenu(false)}
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <Package className="h-4 w-4" />
                Orders
              </a>

              {/* Deliveries */}
              <a
                href="/dashboard/rider/deliveries"
                onClick={() => setMobileMenu(false)}
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <Bike className="h-4 w-4" />
                Deliveries
              </a>

              {/* Earnings */}
              <a
                href="/dashboard/rider/earnings"
                onClick={() => setMobileMenu(false)}
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <DollarSign className="h-4 w-4" />
                Earnings
              </a>

              {/* Shift History */}
              <a
                href="/dashboard/rider/shift-history"
                onClick={() => setMobileMenu(false)}
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <History className="h-4 w-4" />
                Shift History
              </a>

              {/* Settings - ACTIVE */}
              <a
                href="/dashboard/rider/settings"
                onClick={() => setMobileMenu(false)}
                className="mb-1 flex items-center gap-3 rounded-lg bg-[#f97316] px-4 py-3 text-sm font-medium text-white shadow-sm"
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </a>

              {/* Logout */}
              <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-500">
                <LogOut className="h-4 w-4" />
                Logout
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
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              ☰ Menu
            </button>
          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="space-y-7 p-5 md:p-8 lg:p-10">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <section>

            
              <h1 className="text-4xl font-bold tracking-tight text-[#f97316]">
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

              {/* Header */}
              <div className="border-b border-slate-100 p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
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

              {/* Profile Details */}
              <div className="grid gap-6 p-6 md:grid-cols-2">

                {/* Full Name */}
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">
                    Full Name
                  </p>

                  <p className="text-sm font-medium text-slate-800">
                    Afrin
                  </p>
                </div>

                {/* Email */}
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">
                    Email Address
                  </p>

                  <p className="text-sm font-medium text-slate-800">
                    afrin@example.com
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">
                    Phone Number
                  </p>

                  <p className="text-sm font-medium text-slate-800">
                    +880 1XXXXXXXXX
                  </p>
                </div>

                {/* Account Type */}
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">
                    Account Type
                  </p>

                  <div className="flex items-center gap-2">

                    <Bike className="h-4 w-4 text-orange-500" />

                    <span className="text-sm font-semibold text-slate-800">
                      Rider
                    </span>

                    <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-600">
                      Active
                    </span>

                  </div>
                </div>

              </div>

              {/* Save Button */}
              <div className="flex justify-end border-t border-slate-100 p-5">

                <button className="rounded-lg bg-[#f97316] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600">
                  Save Changes
                </button>

              </div>

            </section>

            {/* =================================================
                DELIVERY PREFERENCES
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
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
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
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

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
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

                <button className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:bg-slate-50">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                    <Lock className="h-5 w-5 text-slate-600" />
                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-semibold text-slate-800">
                      Change Password
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Update your account password regularly.
                    </p>

                  </div>

                  <span className="text-sm font-semibold text-orange-500">
                    Change
                  </span>

                </button>

              </div>

            </section>

            {/* =================================================
                ACCOUNT STATUS
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                    <h3 className="font-bold text-slate-900">
                      Rider Account Active
                    </h3>

                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Your account is currently active and available for
                    deliveries.
                  </p>

                </div>

                <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2.5">

                  <CheckCircle2 className="h-4 w-4 text-green-600" />

                  <span className="text-sm font-semibold text-green-700">
                    Active
                  </span>

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
        onClick={onToggle}
        aria-label={`Toggle ${title}`}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          enabled ? "bg-green-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>

    </div>
  );
}