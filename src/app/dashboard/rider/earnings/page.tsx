"use client";

import {
  Bell,
  Bike,
  ChevronRight,
  DollarSign,
  History,
  Home,
  LogOut,
  Menu,
  Package,
  Settings,
  Star,
  TrendingUp,
  User,
  X,
  Wallet,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react";

import { useState } from "react";

export default function RiderEarningsPage() {
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
          <div className="flex h-full flex-col">

            {/* Rider Profile */}

            <div className="border-b border-slate-100 px-5 py-6">
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

              {/* Mobile close */}

              <button
                onClick={() => setMobileMenu(false)}
                className="absolute right-4 top-5 rounded-lg p-2 hover:bg-slate-100 lg:hidden"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>

            </div>

            {/* Navigation */}

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

              {/* Earnings ACTIVE */}

              <a
                href="/dashboard/rider/earnings"
                onClick={() => setMobileMenu(false)}
                className="mb-1 flex items-center gap-3 rounded-lg bg-[#f97316] px-4 py-3 text-sm font-medium text-white shadow-sm"
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

        {/* MAIN */}

        <main className="min-w-0 flex-1">

          

          {/* PAGE CONTENT */}

          <div className="space-y-7 p-5 md:p-8 lg:p-10">

            {/* PAGE HEADER */}

            <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

              <div>

                {/* 4XL + BOLD */}

                <p className="mb-2 text-4xl font-bold tracking-tight text-[#f97316]">
                  Rider Dashboard
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Earnings
                </h1>

                <p className="mt-2 max-w-xl text-sm text-slate-500">
                  Track your earnings, payouts and delivery income in one place.
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

            {/* ================= EARNING STATS ================= */}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <EarningStat
                icon={<DollarSign className="h-5 w-5" />}
                title="Today's Earnings"
                value="$142.50"
                description="+12.5% from yesterday"
              />

              <EarningStat
                icon={<Wallet className="h-5 w-5" />}
                title="This Week"
                value="$684.75"
                description="32 completed deliveries"
              />

              <EarningStat
                icon={<TrendingUp className="h-5 w-5" />}
                title="This Month"
                value="$2,840.50"
                description="+8.4% from last month"
              />

              <EarningStat
                icon={<Bike className="h-5 w-5" />}
                title="Per Delivery"
                value="$11.88"
                description="Average payout"
              />

            </section>

            {/* ================= OVERVIEW + PAYOUT ================= */}

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">

              {/* Earnings Overview */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-lg font-bold text-slate-900">
                      Earnings Overview
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Your earnings performance this week
                    </p>

                  </div>

                  <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
                    <CalendarDays className="h-4 w-4" />
                    This Week
                  </button>

                </div>

                {/* Simple Chart */}

                <div className="mt-8">

                  <div className="flex h-52 items-end justify-between gap-3 border-b border-slate-100 px-2">

                    <Bar height="35%" label="Mon" value="$82" />

                    <Bar height="55%" label="Tue" value="$125" />

                    <Bar height="45%" label="Wed" value="$98" />

                    <Bar height="70%" label="Thu" value="$154" />

                    <Bar height="60%" label="Fri" value="$132" />

                    <Bar height="85%" label="Sat" value="$178" />

                    <Bar height="65%" label="Sun" value="$142" />

                  </div>

                </div>

              </div>

              {/* Payout Summary */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-5 flex items-center justify-between">

                  <div>

                    <h2 className="font-bold text-slate-900">
                      Payout Summary
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Your latest payout
                    </p>

                  </div>

                  <Wallet className="h-5 w-5 text-orange-500" />

                </div>

                <div className="rounded-xl bg-orange-50 p-5">

                  <p className="text-sm text-slate-500">
                    Available Balance
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    $284.75
                  </p>

                  <button className="mt-4 flex items-center gap-1 text-sm font-semibold text-orange-600">
                    View payout details
                    <ChevronRight className="h-4 w-4" />
                  </button>

                </div>

                <div className="mt-5 space-y-4">

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-slate-500">
                      Last payout
                    </span>

                    <span className="text-sm font-semibold text-slate-800">
                      $412.50
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-slate-500">
                      Payout date
                    </span>

                    <span className="text-sm font-semibold text-slate-800">
                      Aug 20, 2026
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-slate-500">
                      Status
                    </span>

                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
                      Paid
                    </span>

                  </div>

                </div>

              </div>

            </section>

            {/* ================= RECENT EARNINGS ================= */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Recent Earnings
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your latest completed deliveries and payouts.
                  </p>

                </div>

                <button className="flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600">
                  View all
                  <ArrowUpRight className="h-4 w-4" />
                </button>

              </div>

              <div className="divide-y divide-slate-100">

                <EarningRow
                  restaurant="Burger Joint"
                  order="ORD-9921"
                  time="Today, 10:42 AM"
                  amount="$12.50"
                  distance="5.1 km"
                />

                <EarningRow
                  restaurant="Taco House"
                  order="ORD-9920"
                  time="Today, 9:58 AM"
                  amount="$9.50"
                  distance="3.9 km"
                />

                <EarningRow
                  restaurant="Fresh Bowl"
                  order="ORD-9919"
                  time="Today, 9:22 AM"
                  amount="$9.00"
                  distance="4.1 km"
                />

                <EarningRow
                  restaurant="Luigi's Pizza"
                  order="ORD-9917"
                  time="Yesterday, 8:45 PM"
                  amount="$14.25"
                  distance="6.2 km"
                />

              </div>

            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

/* =============================================================
   EARNING STAT
============================================================= */

function EarningStat({
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
   BAR
============================================================= */

function Bar({
  height,
  label,
  value,
}: {
  height: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-end gap-2">

      <span className="text-[10px] text-slate-400">
        {value}
      </span>

      <div
        className="w-full max-w-[42px] rounded-t-lg bg-orange-400 transition hover:bg-orange-500"
        style={{ height }}
      />

      <span className="text-xs text-slate-400">
        {label}
      </span>

    </div>
  );
}

/* =============================================================
   EARNING ROW
============================================================= */

function EarningRow({
  restaurant,
  order,
  time,
  amount,
  distance,
}: {
  restaurant: string;
  order: string;
  time: string;
  amount: string;
  distance: string;
}) {
  return (
    <div className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between md:p-6">

      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50">
          <Package className="h-5 w-5 text-orange-500" />
        </div>

        <div>

          <h3 className="font-semibold text-slate-900">
            {restaurant}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Order #{order} • {time}
          </p>

        </div>

      </div>

      <div className="flex items-center justify-between gap-8 sm:justify-end">

        <div className="text-right">

          <p className="text-xs text-slate-400">
            Distance
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            {distance}
          </p>

        </div>

        <div className="text-right">

          <p className="text-xs text-slate-400">
            Earnings
          </p>

          <p className="mt-1 text-lg font-bold text-green-600">
            +{amount}
          </p>

        </div>

      </div>

    </div>
  );
}