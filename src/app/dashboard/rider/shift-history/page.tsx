"use client";

import {
  Bike,
  CheckCircle2,
  Clock3,
  DollarSign,
  History,
  Home,
  LogOut,
  Menu,
  Package,
  Settings,
  Star,
  User,
  X,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

import { useState } from "react";

type Shift = {
  date: string;
  day: string;
  start: string;
  end: string;
  duration: string;
  deliveries: number;
  earnings: string;
  status: "Completed" | "In Progress";
};

const shifts: Shift[] = [
  {
    date: "Aug 23, 2026",
    day: "Sunday",
    start: "10:00 AM",
    end: "6:00 PM",
    duration: "8h 00m",
    deliveries: 12,
    earnings: "$142.50",
    status: "In Progress",
  },
  {
    date: "Aug 22, 2026",
    day: "Saturday",
    start: "9:30 AM",
    end: "5:45 PM",
    duration: "8h 15m",
    deliveries: 15,
    earnings: "$178.25",
    status: "Completed",
  },
  {
    date: "Aug 21, 2026",
    day: "Friday",
    start: "10:00 AM",
    end: "6:00 PM",
    duration: "8h 00m",
    deliveries: 14,
    earnings: "$164.75",
    status: "Completed",
  },
  {
    date: "Aug 20, 2026",
    day: "Thursday",
    start: "11:00 AM",
    end: "7:00 PM",
    duration: "8h 00m",
    deliveries: 16,
    earnings: "$185.50",
    status: "Completed",
  },
  {
    date: "Aug 19, 2026",
    day: "Wednesday",
    start: "10:30 AM",
    end: "6:30 PM",
    duration: "8h 00m",
    deliveries: 13,
    earnings: "$151.25",
    status: "Completed",
  },
  {
    date: "Aug 18, 2026",
    day: "Tuesday",
    start: "9:00 AM",
    end: "5:00 PM",
    duration: "8h 00m",
    deliveries: 11,
    earnings: "$132.50",
    status: "Completed",
  },
];

export default function RiderShiftHistoryPage() {
  const [mobileMenu, setMobileMenu] = useState(false);

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

            {/* Rider Profile */}

            <div className="relative border-b border-slate-100 px-5 py-6">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100">
                  <User className="h-6 w-6 text-orange-500" />
                </div>

                <div>

                  <p className="font-semibold text-slate-800">
                    Afrin
                  </p>

                  <p className="text-xs font-medium text-orange-500">
                    Rider
                  </p>

                  <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                    <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                    <span>4.9 Rating</span>
                  </div>

                </div>

              </div>

              {/* Mobile Close */}

              <button
                onClick={() => setMobileMenu(false)}
                className="absolute right-4 top-5 rounded-lg p-2 hover:bg-slate-100 lg:hidden"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>

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

              {/* Shift History - ACTIVE */}

              <a
                href="/dashboard/rider/shift-history"
                onClick={() => setMobileMenu(false)}
                className="mb-1 flex items-center gap-3 rounded-lg bg-[#f97316] px-4 py-3 text-sm font-medium text-white shadow-sm"
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
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-500"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>

            </nav>
          </div>
        </aside>

        {/* Mobile Overlay */}

        {mobileMenu && (
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setMobileMenu(false)}
          />
        )}

        {/* =====================================================
            MAIN
        ===================================================== */}

        <main className="min-w-0 flex-1">

          {/* =================================================
              PAGE CONTENT
              No separate navbar here
          ================================================= */}

          <div className="space-y-7 p-5 md:p-8 lg:p-10">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

              <div>

                {/* Rider Dashboard */}

                <p className="mb-2 text-4xl font-bold tracking-tight text-[#f97316]">
                  Rider Dashboard
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Shift History
                </h1>

                <p className="mt-2 max-w-xl text-sm text-slate-500">
                  Review your previous shifts, working hours, deliveries and earnings.
                </p>

              </div>

              {/* Available Status */}

              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5">

                <span className="h-2 w-2 rounded-full bg-green-500" />

                <span className="text-sm font-medium text-green-700">
                  You&apos;re available
                </span>

              </div>

            </section>

            {/* =================================================
                SUMMARY STATS
            ================================================= */}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <ShiftStat
                icon={<History className="h-5 w-5" />}
                title="Total Shifts"
                value="26"
                description="This month"
              />

              <ShiftStat
                icon={<Clock3 className="h-5 w-5" />}
                title="Total Hours"
                value="204h"
                description="Worked this month"
              />

              <ShiftStat
                icon={<Bike className="h-5 w-5" />}
                title="Deliveries"
                value="318"
                description="Completed deliveries"
              />

              <ShiftStat
                icon={<DollarSign className="h-5 w-5" />}
                title="Total Earnings"
                value="$3,642.50"
                description="+9.8% from last month"
              />

            </section>

            {/* =================================================
                CURRENT SHIFT
            ================================================= */}

            <section className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">

              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                    <Clock3 className="h-6 w-6 text-orange-500" />
                  </div>

                  <div>

                    <div className="flex flex-wrap items-center gap-2">

                      <h2 className="text-lg font-bold text-slate-900">
                        Today&apos;s Shift
                      </h2>

                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-600">
                        In Progress
                      </span>

                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      10:00 AM — 6:00 PM
                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-3 gap-5">

                  <div>
                    <p className="text-xs text-slate-400">
                      Duration
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      8h
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Deliveries
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      12
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Earnings
                    </p>

                    <p className="mt-1 font-bold text-green-600">
                      $142.50
                    </p>
                  </div>

                </div>

              </div>

            </section>

            {/* SHIFT HISTORY TABLE */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* Header */}

              <div className="flex flex-col gap-4 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between">

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Previous Shifts
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your recent shift activity and performance.
                  </p>

                </div>

                <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">

                  <CalendarDays className="h-4 w-4" />

                  This Month

                </button>

              </div>

              {/* Desktop Table */}

              <div className="hidden overflow-x-auto md:block">

                <table className="w-full">

                  <thead>

                    <tr className="border-b border-slate-100 bg-slate-50">

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Date
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Shift Time
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Duration
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Deliveries
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Earnings
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {shifts.map((shift) => (
                      <ShiftRow
                        key={shift.date}
                        shift={shift}
                      />
                    ))}

                  </tbody>

                </table>

              </div>

              {/* Mobile Cards */}

              <div className="divide-y divide-slate-100 md:hidden">

                {shifts.map((shift) => (
                  <MobileShiftCard
                    key={shift.date}
                    shift={shift}
                  />
                ))}

              </div>

            </section>

            {/* =================================================
                PERFORMANCE
            ================================================= */}

            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

              {/* Performance */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="font-bold text-slate-900">
                      Shift Performance
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Your average performance this month.
                    </p>

                  </div>

                  <TrendingUp className="h-5 w-5 text-green-500" />

                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">

                  <MiniStat
                    label="Avg. Shift"
                    value="7h 50m"
                  />

                  <MiniStat
                    label="Avg. Deliveries"
                    value="12.2"
                  />

                  <MiniStat
                    label="Avg. Earnings"
                    value="$140.10"
                  />

                  <MiniStat
                    label="Success Rate"
                    value="98%"
                  />

                </div>

              </div>

              {/* Weekly Summary */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <h2 className="font-bold text-slate-900">
                  Weekly Summary
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your current week performance.
                </p>

                <div className="mt-6 space-y-5">

                  <ProgressRow
                    label="Working Hours"
                    value="38h 20m"
                    progress="82%"
                  />

                  <ProgressRow
                    label="Deliveries"
                    value="81"
                    progress="76%"
                  />

                  <ProgressRow
                    label="Earnings"
                    value="$912.50"
                    progress="88%"
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

/* =============================================================
   SHIFT STAT
============================================================= */

function ShiftStat({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
        {icon}
      </div>

      <p className="mt-4 text-xs font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>

    </div>
  );
}

/* =============================================================
   SHIFT ROW
============================================================= */

function ShiftRow({
  shift,
}: {
  shift: Shift;
}) {
  return (
    <tr className="transition hover:bg-slate-50">

      <td className="px-6 py-5">

        <p className="text-sm font-semibold text-slate-800">
          {shift.date}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {shift.day}
        </p>

      </td>

      <td className="px-6 py-5">

        <p className="text-sm font-medium text-slate-700">
          {shift.start}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          to {shift.end}
        </p>

      </td>

      <td className="px-6 py-5">

        <div className="flex items-center gap-2 text-sm text-slate-600">

          <Clock3 className="h-4 w-4 text-slate-400" />

          {shift.duration}

        </div>

      </td>

      <td className="px-6 py-5">

        <div className="flex items-center gap-2">

          <Bike className="h-4 w-4 text-orange-500" />

          <span className="text-sm font-semibold text-slate-800">
            {shift.deliveries}
          </span>

        </div>

      </td>

      <td className="px-6 py-5">

        <p className="text-sm font-bold text-green-600">
          {shift.earnings}
        </p>

      </td>

      <td className="px-6 py-5">

        {shift.status === "Completed" ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">

            <CheckCircle2 className="h-3 w-3" />

            Completed

          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">

            <Clock3 className="h-3 w-3" />

            In Progress

          </span>
        )}

      </td>

    </tr>
  );
}

/* =============================================================
   MOBILE SHIFT CARD
============================================================= */

function MobileShiftCard({
  shift,
}: {
  shift: Shift;
}) {
  return (
    <div className="p-5">

      <div className="flex items-start justify-between gap-3">

        <div>

          <p className="font-semibold text-slate-800">
            {shift.date}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {shift.day}
          </p>

        </div>

        {shift.status === "Completed" ? (
          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
            Completed
          </span>
        ) : (
          <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
            In Progress
          </span>
        )}

      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">

        <div>

          <p className="text-xs text-slate-400">
            Shift Time
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            {shift.start} - {shift.end}
          </p>

        </div>

        <div>

          <p className="text-xs text-slate-400">
            Duration
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            {shift.duration}
          </p>

        </div>

        <div>

          <p className="text-xs text-slate-400">
            Deliveries
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {shift.deliveries}
          </p>

        </div>

        <div>

          <p className="text-xs text-slate-400">
            Earnings
          </p>

          <p className="mt-1 text-sm font-bold text-green-600">
            {shift.earnings}
          </p>

        </div>

      </div>

    </div>
  );
}

/* =============================================================
   MINI STAT
============================================================= */

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

/* =============================================================
   PROGRESS ROW
============================================================= */

function ProgressRow({
  label,
  value,
  progress,
}: {
  label: string;
  value: string;
  progress: string;
}) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="text-sm font-medium text-slate-600">
          {label}
        </span>

        <span className="text-sm font-semibold text-slate-800">
          {value}
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">

        <div
          className="h-full rounded-full bg-orange-400"
          style={{ width: progress }}
        />

      </div>

    </div>
  );
}