"use client";

import {
  Bell,
  Bike,
  CheckCircle2,
  Lock,
  MapPin,
  ShieldCheck,
  User,
} from "lucide-react";

import { useState } from "react";

export default function RiderSettingsPage() {
  const [locationAccess, setLocationAccess] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);

  return (
    <div className="space-y-7">

      {/* Page Header */}
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Settings
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-500">
          Manage your profile, notifications, privacy and delivery preferences.
        </p>
      </section>

      {/* Profile Information */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-500">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Profile Information</h2>
              <p className="text-sm text-slate-500">Update your rider account information.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium text-slate-500">Full Name</p>
            <p className="text-sm font-medium text-slate-800">Afrin</p>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-slate-500">Email Address</p>
            <p className="text-sm font-medium text-slate-800">afrin@example.com</p>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-slate-500">Phone Number</p>
            <p className="text-sm font-medium text-slate-800">+880 1XXXXXXXXX</p>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-slate-500">Account Type</p>
            <div className="flex items-center gap-2">
              <Bike className="h-4 w-4 text-green-500" />
              <span className="text-sm font-semibold text-slate-800">Rider</span>
              <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-600">Active</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 p-5">
          <button
            type="button"
            className="rounded-lg bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600"
          >
            Save Changes
          </button>
        </div>
      </section>

      {/* Delivery Preferences */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-500">
              <Bike className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Delivery Preferences</h2>
              <p className="text-sm text-slate-500">Control your delivery and location preferences.</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <SettingRow
            icon={<MapPin className="h-5 w-5" />}
            title="Location Access"
            description="Allow Foodiego to use your location for delivery tracking."
            enabled={locationAccess}
            onToggle={() => setLocationAccess(!locationAccess)}
          />
          <SettingRow
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="New Order Alerts"
            description="Receive notifications when new delivery orders are available."
            enabled={orderAlerts}
            onToggle={() => setOrderAlerts(!orderAlerts)}
          />
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-500">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Notifications</h2>
              <p className="text-sm text-slate-500">Choose how you want to receive alerts.</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <SettingRow
            icon={<Bell className="h-5 w-5" />}
            title="Push Notifications"
            description="Receive important updates and delivery notifications."
            enabled={notifications}
            onToggle={() => setNotifications(!notifications)}
          />
          <SettingRow
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="Order Notifications"
            description="Get notified about accepted, picked up and completed orders."
            enabled={orderAlerts}
            onToggle={() => setOrderAlerts(!orderAlerts)}
          />
          <SettingRow
            icon={<Bell className="h-5 w-5" />}
            title="Sound Alerts"
            description="Play a sound when a new delivery request arrives."
            enabled={soundAlerts}
            onToggle={() => setSoundAlerts(!soundAlerts)}
          />
        </div>
      </section>

      {/* Security */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-500">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Security</h2>
              <p className="text-sm text-slate-500">Keep your rider account secure.</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <button
            type="button"
            className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:bg-slate-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <Lock className="h-5 w-5 text-slate-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">Change Password</p>
              <p className="mt-1 text-xs text-slate-500">Update your account password regularly.</p>
            </div>
            <span className="text-sm font-semibold text-green-500">Change</span>
          </button>
        </div>
      </section>

      {/* Account Status */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <h3 className="font-bold text-slate-900">Rider Account Active</h3>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Your account is currently active and available for deliveries.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2.5">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Active</span>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ============================================================= */

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
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>
      <button
        type="button"
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
