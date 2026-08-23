"use client";

import {
  Bell,
  Bike,
  CheckCircle2,
  ChevronDown,
  Clock3,
  DollarSign,
  Filter,
  History,
  Home,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  Star,
  User,
  X,
  MapPin,
  ArrowUpRight,
  Timer,
} from "lucide-react";

import { useState } from "react";

type OrderStatus = "Available" | "Accepted" | "In Progress" | "Completed";

type Order = {
  id: string;
  restaurant: string;
  customer: string;
  pickup: string;
  delivery: string;
  distance: string;
  time: string;
  payout: string;
  status: OrderStatus;
};

const orders: Order[] = [
  {
    id: "ORD-9924",
    restaurant: "Burger Joint",
    customer: "Sarah M.",
    pickup: "Downtown Burger Joint",
    delivery: "123 Main Street",
    distance: "3.2 km",
    time: "18 min",
    payout: "$8.50",
    status: "Available",
  },
  {
    id: "ORD-9923",
    restaurant: "Luigi's Pizza",
    customer: "Michael R.",
    pickup: "Luigi's Pizza",
    delivery: "45 Oak Avenue",
    distance: "4.8 km",
    time: "24 min",
    payout: "$10.25",
    status: "Available",
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
];

export default function RiderOrdersPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<"All" | OrderStatus>("All");
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      activeTab === "All" || order.status === activeTab;

    const searchText = search.toLowerCase();

    const matchesSearch =
      order.id.toLowerCase().includes(searchText) ||
      order.restaurant.toLowerCase().includes(searchText) ||
      order.customer.toLowerCase().includes(searchText);

    return matchesTab && matchesSearch;
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

            {/* Logo */}
            <div className="relative border-b border-slate-100 px-6 py-6">
              <h1 className="text-2xl font-bold tracking-tight text-[#f97316]">
                Foodiego
              </h1>

              <button
                onClick={() => setMobileMenu(false)}
                className="absolute right-4 top-5 rounded-lg p-2 hover:bg-slate-100 lg:hidden"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            {/* Rider Profile */}
            <div className="px-5 py-5">
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100">
                  <User className="h-6 w-6 text-orange-500" />
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    Afrin
                  </p>

                  <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                    <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                    <span>4.9 Rating</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4">

              {/* Dashboard */}
              <a
                href="/dashboard/rider"
                onClick={() => setMobileMenu(false)}
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </a>

              {/* Orders - ACTIVE */}
              <a
                href="/dashboard/rider/orders"
                onClick={() => setMobileMenu(false)}
                className="mb-1 flex items-center gap-3 rounded-lg bg-[#f97316] px-4 py-3 text-sm font-medium text-white shadow-sm"
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

          {/* =====================================================
              TOP NAVBAR
          ===================================================== */}

          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">

            <div className="flex h-[72px] items-center gap-4 px-5 md:px-8 lg:px-10">

              {/* Mobile menu */}
              <button
                onClick={() => setMobileMenu(true)}
                className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Desktop breadcrumb */}
              <div className="hidden items-center gap-2 lg:flex">
                <span className="text-sm text-slate-400">
                  Rider Dashboard
                </span>

                <span className="text-slate-300">
                  /
                </span>

                <span className="text-sm font-medium text-slate-700">
                  Orders
                </span>
              </div>

              {/* Customer navbar */}
              <nav className="hidden items-center gap-6 xl:flex">
                <a
                  href="/"
                  className="text-sm text-slate-600 hover:text-orange-500"
                >
                  Home
                </a>

                <a
                  href="/restaurants"
                  className="text-sm text-slate-600 hover:text-orange-500"
                >
                  Restaurants
                </a>

                <a
                  href="/offers"
                  className="text-sm text-slate-600 hover:text-orange-500"
                >
                  Offers
                </a>

                <a
                  href="/orders"
                  className="text-sm font-medium text-orange-500"
                >
                  Orders
                </a>

                <a
                  href="/favorites"
                  className="text-sm text-slate-600 hover:text-orange-500"
                >
                  Favorites
                </a>
              </nav>

              {/* Search */}
              <div className="relative ml-auto hidden w-full max-w-sm md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search food or restaurants..."
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Right */}
              <div className="ml-auto flex items-center gap-3 md:ml-0">

                <button className="relative rounded-full p-2 hover:bg-slate-100">
                  <Bell className="h-5 w-5 text-slate-600" />

                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-500" />
                </button>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100">
                  <User className="h-5 w-5 text-orange-500" />
                </div>

                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-800">
                    Afrin
                  </p>

                  <p className="text-[11px] text-slate-400">
                    Rider
                  </p>
                </div>

              </div>

            </div>

          </header>

          {/* =====================================================
              PAGE CONTENT
          ===================================================== */}

          <div className="space-y-7 p-5 md:p-8 lg:p-10">

            {/* Page Header */}
            <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

              <div>
                <p className="mb-2 text-sm font-medium text-orange-500">
                  Rider Dashboard
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Orders
                </h1>

                <p className="mt-2 max-w-xl text-sm text-slate-500">
                  Find available delivery requests and manage your active
                  orders in one place.
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

              <OrderStat
                icon={<Package className="h-5 w-5" />}
                title="Total Orders"
                value="24"
                description="Today's orders"
              />

              <OrderStat
                icon={<Bike className="h-5 w-5" />}
                title="Available"
                value="6"
                description="Waiting for riders"
                highlight
              />

              <OrderStat
                icon={<Clock3 className="h-5 w-5" />}
                title="In Progress"
                value="2"
                description="Active deliveries"
              />

              <OrderStat
                icon={<DollarSign className="h-5 w-5" />}
                title="Today's Earnings"
                value="$142.50"
                description="+12.5% from yesterday"
              />

            </section>

            {/* =====================================================
                ORDERS PANEL
            ===================================================== */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* Panel Header */}
              <div className="border-b border-slate-100 p-5 md:p-6">

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Delivery Orders
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Choose an order based on distance, time and earnings.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">

                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        placeholder="Search orders..."
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
                      />
                    </div>

                    {/* Filter */}
                    <button
                      onClick={() => setShowFilter(!showFilter)}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <Filter className="h-4 w-4" />
                      Filter
                      <ChevronDown className="h-4 w-4" />
                    </button>

                  </div>

                </div>

                {/* Filter dropdown */}
                {showFilter && (
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">

                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Filter by status
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {[
                        "All",
                        "Available",
                        "Accepted",
                        "In Progress",
                        "Completed",
                      ].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => {
                            setActiveTab(tab as "All" | OrderStatus);
                            setShowFilter(false);
                          }}
                          className={`rounded-md px-3 py-2 text-xs font-medium transition ${
                            activeTab === tab
                              ? "bg-orange-500 text-white"
                              : "bg-white text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}

                    </div>
                  </div>
                )}

                {/* Tabs */}
                <div className="mt-6 flex gap-6 overflow-x-auto border-b border-slate-100">

                  {[
                    "All",
                    "Available",
                    "Accepted",
                    "In Progress",
                    "Completed",
                  ].map((tab) => (
                    <button
                      key={tab}
                      onClick={() =>
                        setActiveTab(tab as "All" | OrderStatus)
                      }
                      className={`relative whitespace-nowrap pb-3 text-sm font-medium transition ${
                        activeTab === tab
                          ? "text-orange-500"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {tab}

                      {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-orange-500" />
                      )}
                    </button>
                  ))}

                </div>

              </div>

              {/* =====================================================
                  ORDER LIST
              ===================================================== */}

              <div>

                {filteredOrders.length === 0 ? (
                  <div className="px-6 py-16 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                      <Package className="h-6 w-6 text-slate-400" />
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-800">
                      No orders found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Try another search or status filter.
                    </p>

                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">

                    {filteredOrders.map((order) => (
                      <OrderRow
                        key={order.id}
                        order={order}
                      />
                    ))}

                  </div>
                )}

              </div>

            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

/* =============================================================
   ORDER STAT
============================================================= */

function OrderStat({
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
      <div className="flex items-start justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
          {icon}
        </div>

        {highlight && (
          <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-600">
            6 available
          </span>
        )}

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
   ORDER ROW
============================================================= */

function OrderRow({
  order,
}: {
  order: Order;
}) {
  const isAvailable = order.status === "Available";
  const isProgress = order.status === "In Progress";
  const isCompleted = order.status === "Completed";

  return (
    <div className="p-5 transition hover:bg-slate-50 md:p-6">

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">

        {/* Restaurant */}
        <div className="flex min-w-0 flex-1 items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50">
            <Package className="h-5 w-5 text-orange-500" />
          </div>

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h3 className="font-bold text-slate-900">
                {order.restaurant}
              </h3>

              <StatusBadge status={order.status} />

            </div>

            <p className="mt-1 text-sm text-slate-500">
              Order #{order.id.replace("ORD-", "")}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">

              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {order.customer}
              </span>

              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {order.distance}
              </span>

              <span className="flex items-center gap-1.5">
                <Timer className="h-3.5 w-3.5" />
                {order.time}
              </span>

            </div>

          </div>
        </div>

        {/* Route */}
        <div className="hidden min-w-[230px] lg:block">

          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Delivery route
          </p>

          <div className="mt-2 space-y-1.5">

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              <p className="truncate text-xs text-slate-600">
                {order.pickup}
              </p>
            </div>

            <div className="ml-[3px] h-3 border-l border-dashed border-slate-300" />

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <p className="truncate text-xs text-slate-600">
                {order.delivery}
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
              {order.payout}
            </p>
          </div>

          <div className="xl:mt-2">
            <p className="text-xs text-slate-400">
              {order.distance}
            </p>
          </div>

        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 xl:min-w-[150px] xl:justify-end">

          {isAvailable && (
            <button className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-[0.98]">
              Accept Order
              <ArrowUpRight className="h-4 w-4" />
            </button>
          )}

          {isProgress && (
            <button className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
              View Delivery
              <ArrowUpRight className="h-4 w-4" />
            </button>
          )}

          {order.status === "Accepted" && (
            <button className="flex items-center justify-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-600 hover:bg-orange-100">
              Start Delivery
              <ArrowUpRight className="h-4 w-4" />
            </button>
          )}

          {isCompleted && (
            <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
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
   STATUS BADGE
============================================================= */

function StatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  const styles = {
    Available:
      "bg-green-50 text-green-700 border-green-200",

    Accepted:
      "bg-blue-50 text-blue-700 border-blue-200",

    "In Progress":
      "bg-orange-50 text-orange-700 border-orange-200",

    Completed:
      "bg-slate-100 text-slate-600 border-slate-200",
  };

  const icons = {
    Available: <Bike className="h-3 w-3" />,
    Accepted: <CheckCircle2 className="h-3 w-3" />,
    "In Progress": <Clock3 className="h-3 w-3" />,
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