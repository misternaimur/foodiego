"use client";

import {
  Bike,
  CheckCircle2,
  Clock3,
  DollarSign,
  History,
  Home,
  LogOut,
  MapPin,
  Menu,
  Package,
  Phone,
  Search,
  Settings,
  Star,
  Timer,
  User,
  X,
  ArrowUpRight,
} from "lucide-react";

import { useState } from "react";

type DeliveryStatus = "In Progress" | "Accepted" | "Completed";

type Delivery = {
  id: string;
  restaurant: string;
  customer: string;
  pickup: string;
  delivery: string;
  distance: string;
  time: string;
  payout: string;
  status: DeliveryStatus;
};

const deliveries: Delivery[] = [
  {
    id: "ORD-9921",
    restaurant: "Burger Joint",
    customer: "Sarah M.",
    pickup: "Burger Joint",
    delivery: "89 Lake Street",
    distance: "5.1 km",
    time: "28 min",
    payout: "$12.50",
    status: "In Progress",
  },
  {
    id: "ORD-9922",
    restaurant: "Tokyo Noodles",
    customer: "Emma K.",
    pickup: "Tokyo Noodles",
    delivery: "78 Park Road",
    distance: "2.7 km",
    time: "15 min",
    payout: "$7.75",
    status: "Accepted",
  },
  {
    id: "ORD-9920",
    restaurant: "Taco House",
    customer: "David L.",
    pickup: "Taco House",
    delivery: "21 Hill Road",
    distance: "3.9 km",
    time: "20 min",
    payout: "$9.50",
    status: "Completed",
  },
  {
    id: "ORD-9919",
    restaurant: "Fresh Bowl",
    customer: "Olivia S.",
    pickup: "Fresh Bowl",
    delivery: "55 Green Avenue",
    distance: "4.1 km",
    time: "22 min",
    payout: "$9.00",
    status: "Completed",
  },
  {
    id: "ORD-9918",
    restaurant: "Pizza Palace",
    customer: "James R.",
    pickup: "Pizza Palace",
    delivery: "16 Green Road",
    distance: "3.5 km",
    time: "19 min",
    payout: "$8.75",
    status: "Completed",
  },
];

export default function RiderDeliveriesPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");

  const filteredDeliveries = deliveries.filter((delivery) => {
    const searchText = search.toLowerCase();

    return (
      delivery.id.toLowerCase().includes(searchText) ||
      delivery.restaurant.toLowerCase().includes(searchText) ||
      delivery.customer.toLowerCase().includes(searchText)
    );
  });

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

            {/* Profile */}
            <div className="border-b border-slate-100 px-5 py-6">
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100">
                  <User className="h-6 w-6 text-orange-500" />
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    Afrin
                  </p>

                  <div className="mt-0.5 flex items-center gap-1">
                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-600">
                      Rider
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
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

              {/* Deliveries - ACTIVE */}
              <a
                href="/dashboard/rider/deliveries"
                onClick={() => setMobileMenu(false)}
                className="mb-1 flex items-center gap-3 rounded-lg bg-[#f97316] px-4 py-3 text-sm font-medium text-white shadow-sm"
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
              <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-500">
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

          {/* Mobile Menu Button */}
          <div className="border-b border-slate-200 bg-white px-5 py-3 lg:hidden">
            <button
              onClick={() => setMobileMenu(true)}
              className="rounded-lg p-2 hover:bg-slate-100"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* =====================================================
              CONTENT
          ===================================================== */}

          <div className="space-y-7 p-5 md:p-8 lg:p-10">

            {/* Page Header */}
            <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

              <div>
                <p className="mb-2 text-4xl font-bold text-orange-500">
                  Rider Dashboard
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Deliveries
                </h1>

                <p className="mt-2 max-w-xl text-sm text-slate-500">
                  Track your active deliveries and review your completed
                  delivery history.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5">
                <span className="h-2 w-2 rounded-full bg-green-500" />

                <span className="text-sm font-medium text-green-700">
                  You're available
                </span>
              </div>

            </section>

            {/* =====================================================
                STATS
            ===================================================== */}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <DeliveryStat
                icon={<Bike className="h-5 w-5" />}
                title="Active Delivery"
                value="1"
                description="Currently on the way"
                highlight
              />

              <DeliveryStat
                icon={<Clock3 className="h-5 w-5" />}
                title="Accepted"
                value="1"
                description="Ready to start"
              />

              <DeliveryStat
                icon={<CheckCircle2 className="h-5 w-5" />}
                title="Completed"
                value="3"
                description="Today's completed"
              />

              <DeliveryStat
                icon={<DollarSign className="h-5 w-5" />}
                title="Delivery Earnings"
                value="$47.75"
                description="From today's deliveries"
              />

            </section>

            {/* =====================================================
                ACTIVE DELIVERY
            ===================================================== */}

            <section className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">

              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />

                    <p className="text-sm font-semibold text-orange-600">
                      Active Delivery
                    </p>
                  </div>

                  <h2 className="mt-2 text-xl font-bold text-slate-900">
                    Burger Joint → Sarah M.
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Order #ORD-9921
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-400">
                    Payout
                  </p>

                  <p className="text-2xl font-bold text-slate-900">
                    $12.50
                  </p>
                </div>

              </div>

              {/* Route */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div className="rounded-xl bg-slate-50 p-5">

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Pickup
                  </p>

                  <div className="mt-3 flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <MapPin className="h-4 w-4 text-orange-500" />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        Burger Joint
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Downtown Burger Joint
                      </p>
                    </div>
                  </div>

                </div>

                <div className="rounded-xl bg-slate-50 p-5">

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Delivery
                  </p>

                  <div className="mt-3 flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
                      <MapPin className="h-4 w-4 text-green-600" />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        Sarah M.
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        89 Lake Street
                      </p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Delivery info */}
              <div className="mt-5 flex flex-wrap gap-3">

                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2.5">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600">
                    5.1 km
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2.5">
                  <Timer className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600">
                    28 min
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-orange-50 px-4 py-2.5">
                  <Bike className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-orange-600">
                    On the way
                  </span>
                </div>

              </div>

              {/* Progress */}
              <div className="mt-6">

                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">
                    Delivery Progress
                  </p>

                  <p className="text-xs font-medium text-orange-500">
                    75%
                  </p>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-3/4 rounded-full bg-orange-500" />
                </div>

                <div className="mt-3 flex justify-between text-xs text-slate-400">
                  <span>Accepted</span>
                  <span>Picked Up</span>
                  <span className="font-semibold text-orange-500">
                    On the Way
                  </span>
                  <span>Delivered</span>
                </div>

              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">

                <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
                  View Delivery
                  <ArrowUpRight className="h-4 w-4" />
                </button>

                <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                  <Phone className="h-4 w-4" />
                  Contact Customer
                </button>

              </div>

            </section>

            {/* =====================================================
                DELIVERY HISTORY
            ===================================================== */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* Header */}
              <div className="border-b border-slate-100 p-5 md:p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Delivery History
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      View your recent delivery activity.
                    </p>
                  </div>

                  {/* Search */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      type="text"
                      placeholder="Search deliveries..."
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                </div>

              </div>

              {/* List */}
              {filteredDeliveries.length === 0 ? (
                <div className="px-6 py-16 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                    <Package className="h-6 w-6 text-slate-400" />
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-800">
                    No deliveries found
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Try searching with another order or customer name.
                  </p>

                </div>
              ) : (
                <div className="divide-y divide-slate-100">

                  {filteredDeliveries.map((delivery) => (
                    <DeliveryRow
                      key={delivery.id}
                      delivery={delivery}
                    />
                  ))}

                </div>
              )}

            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

/* =============================================================
   DELIVERY STAT
============================================================= */

function DeliveryStat({
  icon,
  title,
  value,
  description,
  highlight = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        highlight
          ? "border-orange-200 ring-1 ring-orange-100"
          : "border-slate-200"
      }`}
    >
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
   DELIVERY ROW
============================================================= */

function DeliveryRow({
  delivery,
}: {
  delivery: Delivery;
}) {
  const isProgress = delivery.status === "In Progress";
  const isAccepted = delivery.status === "Accepted";
  const isCompleted = delivery.status === "Completed";

  return (
    <div className="p-5 transition hover:bg-slate-50 md:p-6">

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">

        {/* Delivery Info */}
        <div className="flex min-w-0 flex-1 items-start gap-4">

          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              isCompleted
                ? "bg-green-50"
                : "bg-orange-50"
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Bike className="h-5 w-5 text-orange-500" />
            )}
          </div>

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h3 className="font-bold text-slate-900">
                {delivery.restaurant}
              </h3>

              <DeliveryStatusBadge status={delivery.status} />

            </div>

            <p className="mt-1 text-sm text-slate-500">
              Order #{delivery.id.replace("ORD-", "")}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">

              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {delivery.customer}
              </span>

              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {delivery.distance}
              </span>

              <span className="flex items-center gap-1.5">
                <Timer className="h-3.5 w-3.5" />
                {delivery.time}
              </span>

            </div>

          </div>
        </div>

        {/* Route */}
        <div className="hidden min-w-[230px] lg:block">

          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Delivery Route
          </p>

          <div className="mt-2 space-y-1.5">

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500" />

              <p className="truncate text-xs text-slate-600">
                {delivery.pickup}
              </p>
            </div>

            <div className="ml-[3px] h-3 border-l border-dashed border-slate-300" />

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />

              <p className="truncate text-xs text-slate-600">
                {delivery.delivery}
              </p>
            </div>

          </div>
        </div>

        {/* Payout */}
        <div className="flex items-center justify-between gap-5 xl:block xl:min-w-[100px]">

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Payout
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900">
              {delivery.payout}
            </p>
          </div>

          <p className="text-xs text-slate-400 xl:mt-2">
            {delivery.distance}
          </p>

        </div>

        {/* Action */}
        <div className="flex items-center gap-2 xl:min-w-[150px] xl:justify-end">

          {isProgress && (
            <button className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600">
              View Delivery
              <ArrowUpRight className="h-4 w-4" />
            </button>
          )}

          {isAccepted && (
            <button className="flex items-center justify-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-600 transition hover:bg-orange-100">
              Start Delivery
              <ArrowUpRight className="h-4 w-4" />
            </button>
          )}

          {isCompleted && (
            <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
              View Details
              <ArrowUpRight className="h-4 w-4" />
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

/* =============================================================
   DELIVERY STATUS BADGE
============================================================= */

function DeliveryStatusBadge({
  status,
}: {
  status: DeliveryStatus;
}) {
  const styles = {
    "In Progress":
      "bg-orange-50 text-orange-700 border-orange-200",

    Accepted:
      "bg-blue-50 text-blue-700 border-blue-200",

    Completed:
      "bg-green-50 text-green-700 border-green-200",
  };

  const icons = {
    "In Progress": <Clock3 className="h-3 w-3" />,
    Accepted: <Bike className="h-3 w-3" />,
    Completed: <CheckCircle2 className="h-3 w-3" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold ${styles[status]}`}
    >
      {icons[status]}
      {status}
    </span>
  );
}