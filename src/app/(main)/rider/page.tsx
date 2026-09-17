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

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Rider Workspace 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here&apos;s your delivery overview for today.
        </p>
      </div>

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
                    <p className="text-xs font-medium text-green-500">
                      On The Way
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
                    className="rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
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

                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                    <MapPin className="h-6 w-6 text-green-500" />
                  </div>

                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Downtown area is currently experiencing high demand.
                  Expect increased order volume.
                </p>

                <button
                  type="button"
                  className="mt-3 flex items-center gap-1 text-sm font-semibold text-green-500"
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

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-500">
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