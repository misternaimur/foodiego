"use client";

import {
  Bike,
  CheckCircle2,
  ChevronRight,
  Clock3,
  DollarSign,
  History,
  Home,
  LogOut,
  MapPin,
  Menu,
  Package,
  Phone,
  Settings,
  Star,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

export default function RiderDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="flex min-h-screen">

        {/* ================= SIDEBAR ================= */}
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

            {/* ================= RIDER PROFILE ================= */}
            <div className="border-b border-slate-100 px-5 py-6">
              <div className="flex items-center gap-3">

                {/* Avatar */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100">
                  <User className="h-6 w-6 text-orange-500" />
                </div>

                {/* Profile Info */}
                <div>
                  <p className="font-semibold text-slate-800">
                    Afrin
                  </p>

                  <p className="text-xs font-medium text-orange-500">
                    Rider
                  </p>

                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                    <span>4.9 Rating</span>
                  </div>
                </div>

              </div>
            </div>

            {/* ================= NAVIGATION ================= */}
            <nav className="flex-1 px-4 py-5">

              {/* Home - ACTIVE */}
              <a
                href="/dashboard/rider"
                onClick={() => setMobileMenu(false)}
                className="mb-2 flex items-center gap-3 rounded-lg bg-[#f97316] px-4 py-3 text-sm font-medium text-white"
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

              {/* Settings */}
              <a
                href="/dashboard/rider/settings"
                onClick={() => setMobileMenu(false)}
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <Settings className="h-4 w-4" />
                Settings
              </a>

              {/* Logout */}
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-500"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>

            </nav>
          </div>
        </aside>

        {/* ================= MOBILE OVERLAY ================= */}
        {mobileMenu && (
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setMobileMenu(false)}
          />
        )}

        {/* ================= MAIN ================= */}
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

          {/* Mobile Heading */}
          <div className="px-5 pt-5 lg:hidden">
            <h2 className="text-2xl font-bold">
              Good morning, Afrin!
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Here&apos;s your delivery overview for today.
            </p>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="space-y-6 p-5 md:p-8 lg:p-10">

            {/* ================= ONLINE STATUS ================= */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isOnline ? "bg-green-100" : "bg-slate-100"
                    }`}
                  >
                    <Bike
                      className={`h-5 w-5 ${
                        isOnline ? "text-green-600" : "text-slate-500"
                      }`}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {isOnline ? "You're online" : "You're offline"}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {isOnline
                        ? "Available for deliveries"
                        : "You are not receiving delivery requests"}
                    </p>
                  </div>
                </div>

                {/* Toggle */}
                <button
                  type="button"
                  onClick={() => setIsOnline(!isOnline)}
                  className={`relative h-7 w-12 rounded-full transition ${
                    isOnline ? "bg-green-500" : "bg-slate-300"
                  }`}
                  aria-label="Toggle online status"
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      isOnline ? "left-6" : "left-1"
                    }`}
                  />
                </button>

              </div>
            </section>

            {/* ================= STATS ================= */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <StatCard
                icon={<Package className="h-4 w-4" />}
                title="Today's Deliveries"
                value="12"
                text="+3 from yesterday"
              />

              <StatCard
                icon={<DollarSign className="h-4 w-4" />}
                title="Today's Earnings"
                value="$142.50"
                text="Today's earnings"
              />

              <StatCard
                icon={<Bike className="h-4 w-4" />}
                title="Active Delivery"
                value="1"
                text="In progress"
              />

              <StatCard
                icon={<CheckCircle2 className="h-4 w-4" />}
                title="Delivery Success"
                value="98%"
                text="Completion rate"
              />

            </section>

            {/* ================= ACTIVE DELIVERY + DEMAND ================= */}
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">

              {/* Active Delivery */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-[#f97316]">
                      On the way
                    </p>

                    <h3 className="mt-1 text-lg font-bold">
                      Burger Joint → Sarah M.
                    </h3>

                    <p className="text-sm text-slate-500">
                      Order #ORD-9921
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500">
                      Payout
                    </p>

                    <p className="text-xl font-bold text-slate-900">
                      $12.50
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-5">

                  <DeliveryStep
                    active
                    title="Accepted"
                  />

                  <DeliveryStep
                    active
                    title="Picked Up"
                  />

                  <DeliveryStep
                    active
                    current
                    title="On the Way"
                  />

                  <DeliveryStep
                    title="Delivered"
                  />

                </div>

                {/* Buttons */}
                <div className="mt-6 flex flex-wrap gap-3">

                  <button
                    type="button"
                    className="rounded-lg bg-[#f97316] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    View Delivery
                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Phone className="h-4 w-4" />
                    Contact
                  </button>

                </div>
              </div>

              {/* High Demand */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold">
                    🔥 High Demand Zone
                  </h3>
                </div>

                <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-lg bg-sky-100">

                  <div className="absolute inset-0 opacity-40">
                    <div className="h-full w-full bg-[radial-gradient(circle_at_30%_40%,#60a5fa_0,transparent_25%),radial-gradient(circle_at_70%_55%,#fb923c_0,transparent_25%)]" />
                  </div>

                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20">
                    <MapPin className="h-6 w-6 text-orange-600" />
                  </div>

                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Downtown area is currently experiencing high demand.
                  Expect increased order volume.
                </p>

                <button
                  type="button"
                  className="mt-3 flex items-center gap-1 text-sm font-semibold text-[#f97316]"
                >
                  View Heatmap
                  <ChevronRight className="h-4 w-4" />
                </button>

              </div>
            </section>

            {/* ================= BOTTOM ================= */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

              {/* Performance */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-5 flex items-center justify-between">

                  <div>
                    <h3 className="font-bold">
                      Today&apos;s Performance
                    </h3>

                    <p className="text-sm text-slate-500">
                      Your delivery performance
                    </p>
                  </div>

                  <TrendingUp className="h-5 w-5 text-green-500" />

                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

                  <MiniStat
                    label="Completed"
                    value="12"
                  />

                  <MiniStat
                    label="Avg. Time"
                    value="28m"
                  />

                  <MiniStat
                    label="Distance"
                    value="38.5 km"
                  />

                  <MiniStat
                    label="Rating"
                    value="4.9"
                  />

                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                <h3 className="mb-5 font-bold">
                  Recent Activity
                </h3>

                <div className="space-y-4">

                  <Activity
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    title="Order completed"
                    text="Order #ORD-9918 was delivered"
                    time="10:42 AM"
                  />

                  <Activity
                    icon={<Package className="h-4 w-4" />}
                    title="New delivery accepted"
                    text="Burger Joint → Sarah M."
                    time="10:34 AM"
                  />

                  <Activity
                    icon={<Clock3 className="h-4 w-4" />}
                    title="Shift started"
                    text="Your shift started"
                    time="10:00 AM"
                  />

                </div>
              </div>

            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  icon,
  title,
  value,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="mb-3 flex items-center gap-2 text-slate-500">
        {icon}

        <span className="text-xs font-medium">
          {title}
        </span>
      </div>

      <p className="text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {text}
      </p>

    </div>
  );
}

/* ================= DELIVERY STEP ================= */

function DeliveryStep({
  title,
  active = false,
  current = false,
}: {
  title: string;
  active?: boolean;
  current?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">

      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
          current
            ? "border-orange-500 bg-orange-500"
            : active
            ? "border-green-500 bg-green-500"
            : "border-slate-300 bg-white"
        }`}
      >
        {active && (
          <CheckCircle2 className="h-4 w-4 text-white" />
        )}
      </div>

      <span
        className={`text-sm ${
          current
            ? "font-semibold text-orange-600"
            : active
            ? "font-medium text-slate-700"
            : "text-slate-400"
        }`}
      >
        {title}
      </span>

    </div>
  );
}

/* ================= MINI STAT ================= */

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

/* ================= ACTIVITY ================= */

function Activity({
  icon,
  title,
  text,
  time,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500">
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="truncate text-xs text-slate-500">
          {text}
        </p>

      </div>

      <span className="whitespace-nowrap text-xs text-slate-400">
        {time}
      </span>

    </div>
  );
}