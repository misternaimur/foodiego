"use client";

import {
  ArrowUpRight,
  Bike,
  CheckCircle2,
  ChevronDown,
  Clock3,
  DollarSign,
  Filter,
  History,
  Home,
  LogOut,
  MapPin,
  Menu,
  Package,
  Search,
  Settings,
  Star,
  Timer,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type BackendStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

type OrderStatus =
  | "Available"
  | "Accepted"
  | "In Progress"
  | "Completed";

type BackendOrder = {
  _id: string;

  restaurantId?: {
    _id: string;
    restaurantName?: string;
    name?: string;
  };

  customerId?: {
    _id: string;
    name?: string;
    email?: string;
  };

  riderId?: {
    _id: string;
    name?: string;
    email?: string;
  };

  items?: {
    name: string;
    price: number;
    quantity: number;
  }[];

  totalAmount: number;
  deliveryAddress: string;
  status: BackendStatus;

  riderEarning?: number;
  deliveryDistance?: number;

  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;

  createdAt: string;
};

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
  backendStatus: BackendStatus;
};

type RiderProfile = {
  name: string;
  email: string;
  rating: string;
};

/* =============================================================
   API
============================================================= */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

/* =============================================================
   STATUS CONVERTER
============================================================= */

function convertStatus(
  status: BackendStatus
): OrderStatus {
  if (status === "delivered") {
    return "Completed";
  }

  if (status === "out_for_delivery") {
    return "In Progress";
  }

  if (
    status === "confirmed" ||
    status === "preparing"
  ) {
    return "Accepted";
  }

  return "Available";
}

/* =============================================================
   ORDER CONVERTER
============================================================= */

function convertOrder(
  order: BackendOrder
): Order {
  const distance = Number(
    order.deliveryDistance || 0
  );

  const earning =
    Number(order.riderEarning || 0) > 0
      ? Number(order.riderEarning)
      : Math.max(
          50,
          Math.round(
            Number(order.totalAmount || 0) * 0.1
          )
        );

  return {
    id: order._id,

    restaurant:
      order.restaurantId?.restaurantName ||
      order.restaurantId?.name ||
      "Restaurant",

    customer:
      order.customerId?.name ||
      order.customerId?.email ||
      "Customer",

    pickup:
      order.restaurantId?.restaurantName ||
      order.restaurantId?.name ||
      "Restaurant",

    delivery:
      order.deliveryAddress || "Delivery Address",

    distance:
      distance > 0
        ? `${distance.toFixed(1)} km`
        : "—",

    time: "—",

    payout: `৳${earning}`,

    status: convertStatus(order.status),

    backendStatus: order.status,
  };
}

/* =============================================================
   TABS
============================================================= */

const tabs: Array<
  "All" | OrderStatus
> = [
  "All",
  "Available",
  "Accepted",
  "In Progress",
  "Completed",
];

/* =============================================================
   GET RIDER PROFILE FROM LOCAL STORAGE
============================================================= */

function getStoredRiderProfile(): RiderProfile {
  if (typeof window === "undefined") {
    return {
      name: "Rider",
      email: "",
      rating: "4.9",
    };
  }

  let name = "";
  let email = "";
  let rating = "4.9";

  /* ---------------------------------------------------------
     Direct localStorage values
  --------------------------------------------------------- */

  name =
    localStorage.getItem("riderName") ||
    localStorage.getItem("userName") ||
    localStorage.getItem("name") ||
    "";

  email =
    localStorage.getItem("riderEmail") ||
    localStorage.getItem("userEmail") ||
    localStorage.getItem("email") ||
    "";

  /* ---------------------------------------------------------
     Try JSON stored user/rider objects
  --------------------------------------------------------- */

  const possibleKeys = [
    "user",
    "rider",
    "userInfo",
    "currentUser",
    "loggedInUser",
  ];

  for (const key of possibleKeys) {
    try {
      const stored = localStorage.getItem(key);

      if (!stored) continue;

      const parsed = JSON.parse(stored);

      if (parsed && typeof parsed === "object") {
        name =
          parsed.name ||
          parsed.fullName ||
          parsed.username ||
          parsed.displayName ||
          name;

        email =
          parsed.email ||
          parsed.userEmail ||
          email;

        rating =
          parsed.rating ||
          parsed.riderRating ||
          rating;
      }
    } catch {
      // Ignore invalid JSON
    }
  }

  return {
    name: name || "Rider",
    email,
    rating: String(rating || "4.9"),
  };
}

/* =============================================================
   MAIN PAGE
============================================================= */

export default function RiderOrdersPage() {
  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState<"All" | OrderStatus>("All");

  const [search, setSearch] =
    useState("");

  const [showFilter, setShowFilter] =
    useState(false);

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  /* ===========================================================
     RIDER PROFILE
  =========================================================== */

  const [riderProfile, setRiderProfile] =
    useState<RiderProfile>({
      name: "Rider",
      email: "",
      rating: "4.9",
    });

  /* ===========================================================
     LOAD PROFILE
  =========================================================== */

  useEffect(() => {
    const profile =
      getStoredRiderProfile();

    setRiderProfile(profile);
  }, []);

  /* ===========================================================
     FETCH ORDERS
  =========================================================== */

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const riderId =
        localStorage.getItem("riderId");

      const response = await fetch(
        `${API_URL}/api/orders`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch orders"
        );
      }

      const result =
        await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to load orders"
        );
      }

      const backendOrders:
        BackendOrder[] =
        result.data || [];

      /* -------------------------------------------------------
         Available orders:
         riderId নেই

         Rider-এর own orders:
         riderId === current rider
      ------------------------------------------------------- */

      const riderOrders =
        backendOrders.filter(
          (order) => {
            const assignedRider =
              order.riderId?._id;

            const isAvailable =
              !assignedRider &&
              [
                "pending",
                "confirmed",
                "preparing",
              ].includes(order.status);

            const isMyOrder =
              Boolean(
                riderId &&
                  assignedRider === riderId
              );

            return (
              isAvailable ||
              isMyOrder
            );
          }
        );

      setOrders(
        riderOrders.map(
          convertOrder
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        "Could not load orders. Please check your backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ===========================================================
     ACCEPT ORDER
  =========================================================== */

  const acceptOrder = async (
    orderId: string
  ) => {
    try {
      const riderId =
        localStorage.getItem("riderId");

      if (!riderId) {
        alert(
          "Rider ID not found. Please login again."
        );
        return;
      }

      setActionLoading(orderId);

      const response = await fetch(
        `${API_URL}/api/orders/${orderId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            riderId,
            status: "confirmed",
            acceptedAt:
              new Date().toISOString(),
          }),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Could not accept order"
        );
      }

      await fetchOrders();
    } catch (err) {
      console.error(err);

      alert(
        "Failed to accept order."
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* ===========================================================
     START DELIVERY
  =========================================================== */

  const startDelivery = async (
    orderId: string
  ) => {
    try {
      setActionLoading(orderId);

      const response = await fetch(
        `${API_URL}/api/orders/${orderId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status:
              "out_for_delivery",

            pickedUpAt:
              new Date().toISOString(),
          }),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Could not start delivery"
        );
      }

      await fetchOrders();
    } catch (err) {
      console.error(err);

      alert(
        "Failed to start delivery."
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* ===========================================================
     COMPLETE DELIVERY
  =========================================================== */

  const completeDelivery = async (
    orderId: string
  ) => {
    try {
      setActionLoading(orderId);

      const response = await fetch(
        `${API_URL}/api/orders/${orderId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status: "delivered",

            deliveredAt:
              new Date().toISOString(),
          }),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Could not complete delivery"
        );
      }

      await fetchOrders();
    } catch (err) {
      console.error(err);

      alert(
        "Failed to complete delivery."
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* ===========================================================
     FILTER
  =========================================================== */

  const filteredOrders =
    useMemo(() => {
      return orders.filter(
        (order) => {
          const matchesTab =
            activeTab === "All" ||
            order.status ===
              activeTab;

          const searchText =
            search
              .toLowerCase()
              .trim();

          const matchesSearch =
            order.id
              .toLowerCase()
              .includes(
                searchText
              ) ||
            order.restaurant
              .toLowerCase()
              .includes(
                searchText
              ) ||
            order.customer
              .toLowerCase()
              .includes(
                searchText
              );

          return (
            matchesTab &&
            matchesSearch
          );
        }
      );
    }, [
      orders,
      activeTab,
      search,
    ]);

  /* ===========================================================
     STATS
  =========================================================== */

  const availableCount =
    orders.filter(
      (order) =>
        order.status ===
        "Available"
    ).length;

  const inProgressCount =
    orders.filter(
      (order) =>
        order.status ===
          "Accepted" ||
        order.status ===
          "In Progress"
    ).length;

  const completedOrders =
    orders.filter(
      (order) =>
        order.status ===
        "Completed"
    );

  const todayEarnings =
    completedOrders.reduce(
      (total, order) =>
        total +
        Number(
          order.payout.replace(
            "৳",
            ""
          )
        ),
      0
    );

  /* ===========================================================
     UI
  =========================================================== */

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="flex min-h-screen">

        {/* =====================================================
            SIDEBAR
        ===================================================== */}

        <aside
          className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-slate-200 bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:z-30 lg:block lg:h-screen lg:translate-x-0 ${
            mobileMenu
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          <div className="relative flex h-full flex-col">

            {/* Close */}
            <button
              type="button"
              onClick={() =>
                setMobileMenu(false)
              }
              className="absolute right-4 top-5 z-10 rounded-lg p-2 transition hover:bg-slate-100 lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>

            {/* =================================================
                RIDER PROFILE
            ================================================= */}

            <div className="border-b border-slate-100 px-5 py-6">
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <User className="h-6 w-6 text-green-500" />
                </div>

                <div className="min-w-0">

                  <p className="truncate font-semibold text-slate-800">
                    {riderProfile.name}
                  </p>

                  <p className="text-xs font-medium text-green-500">
                    Rider
                  </p>

                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />

                    <span>
                      {riderProfile.rating} Rating
                    </span>
                  </div>

                </div>
              </div>

              {/* Email থাকলে দেখাবে */}
              {riderProfile.email && (
                <p className="mt-2 truncate pl-14 text-[10px] text-slate-400">
                  {riderProfile.email}
                </p>
              )}
            </div>

            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav className="flex-1 px-4 py-5">

              <a
                href="/rider"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="mb-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-green-50 hover:text-green-500"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </a>

              <a
                href="/rider/orders"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="mb-1 flex items-center gap-3 rounded-lg bg-green-500 px-4 py-3 text-sm font-medium text-white shadow-sm"
              >
                <Package className="h-4 w-4" />
                Orders
              </a>

              <a
                href="/rider/deliveries"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-green-50 hover:text-green-500"
              >
                <Bike className="h-4 w-4" />
                Deliveries
              </a>

              <a
                href="/rider/earnings"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-green-50 hover:text-green-500"
              >
                <DollarSign className="h-4 w-4" />
                Earnings
              </a>

              <a
                href="/rider/shift-history"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-green-50 hover:text-green-500"
              >
                <History className="h-4 w-4" />
                Shift History
              </a>

              <a
                href="/rider/settings"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-green-50 hover:text-green-500"
              >
                <Settings className="h-4 w-4" />
                Settings
              </a>

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

        {/* =====================================================
            MOBILE OVERLAY
        ===================================================== */}

        {mobileMenu && (
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() =>
              setMobileMenu(false)
            }
          />
        )}

        {/* =====================================================
            MAIN
        ===================================================== */}

        <main className="min-w-0 flex-1">

          {/* Mobile Menu */}
          <div className="px-5 pt-5 lg:hidden">
            <button
              type="button"
              onClick={() =>
                setMobileMenu(true)
              }
              className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm transition hover:bg-slate-50"
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </button>
          </div>

          <div className="space-y-7 p-5 md:p-8 lg:p-10">

            {/* =================================================
                HEADER
            ================================================= */}

            <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

              <div>

                <p className="mb-2 text-4xl font-bold text-green-500">
                  Rider Dashboard
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Orders
                </h1>

                <p className="mt-2 max-w-xl text-sm text-slate-500">
                  Find available delivery requests and manage your active orders in one place.
                </p>

              </div>

              <div className="flex w-fit items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5">

                <span className="h-2 w-2 rounded-full bg-green-500" />

                <span className="text-sm font-medium text-green-700">
                  You&apos;re available
                </span>

              </div>

            </section>

            {/* =================================================
                STATS
            ================================================= */}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <OrderStat
                icon={
                  <Package className="h-5 w-5" />
                }
                title="Total Orders"
                value={String(
                  orders.length
                )}
                description="Your orders"
              />

              <OrderStat
                icon={
                  <Bike className="h-5 w-5" />
                }
                title="Available"
                value={String(
                  availableCount
                )}
                description="Waiting for riders"
                highlight
              />

              <OrderStat
                icon={
                  <Clock3 className="h-5 w-5" />
                }
                title="In Progress"
                value={String(
                  inProgressCount
                )}
                description="Active deliveries"
              />

              <OrderStat
                icon={
                  <DollarSign className="h-5 w-5" />
                }
                title="Today's Earnings"
                value={`৳${todayEarnings}`}
                description="From completed deliveries"
              />

            </section>

            {/* =================================================
                ORDERS PANEL
            ================================================= */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* Header */}

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
                        type="text"
                        value={search}
                        onChange={(e) =>
                          setSearch(
                            e.target.value
                          )
                        }
                        placeholder="Search orders..."
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-green-300 focus:bg-white focus:ring-2 focus:ring-green-100"
                      />

                    </div>

                    {/* Filter */}

                    <button
                      type="button"
                      onClick={() =>
                        setShowFilter(
                          !showFilter
                        )
                      }
                      className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    >

                      <Filter className="h-4 w-4" />

                      Filter

                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          showFilter
                            ? "rotate-180"
                            : ""
                        }`}
                      />

                    </button>

                  </div>
                </div>

                {/* Filter Dropdown */}

                {showFilter && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Filter by status
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {tabs.map(
                        (tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => {
                              setActiveTab(
                                tab
                              );
                              setShowFilter(
                                false
                              );
                            }}
                            className={`rounded-md px-3 py-2 text-xs font-medium transition ${
                              activeTab ===
                              tab
                                ? "bg-green-500 text-white"
                                : "bg-white text-slate-600 hover:bg-green-50 hover:text-green-600"
                            }`}
                          >
                            {tab}
                          </button>
                        )
                      )}

                    </div>
                  </div>
                )}

                {/* Tabs */}

                <div className="mt-6 flex gap-6 overflow-x-auto border-b border-slate-100">

                  {tabs.map(
                    (tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() =>
                          setActiveTab(
                            tab
                          )
                        }
                        className={`relative whitespace-nowrap pb-3 text-sm font-medium transition ${
                          activeTab ===
                          tab
                            ? "text-green-500"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >

                        {tab}

                        {activeTab ===
                          tab && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-green-500" />
                        )}

                      </button>
                    )
                  )}

                </div>

              </div>

              {/* =================================================
                  LOADING / ERROR / ORDERS
              ================================================= */}

              {loading ? (
                <div className="px-6 py-16 text-center">

                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-green-500" />

                  <p className="mt-4 text-sm text-slate-500">
                    Loading orders...
                  </p>

                </div>
              ) : error ? (
                <div className="px-6 py-16 text-center">

                  <Package className="mx-auto h-10 w-10 text-red-400" />

                  <h3 className="mt-4 font-semibold text-slate-800">
                    Unable to load orders
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={
                      fetchOrders
                    }
                    className="mt-4 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Try Again
                  </button>

                </div>
              ) : filteredOrders.length ===
                0 ? (
                <div className="px-6 py-16 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">

                    <Package className="h-6 w-6 text-slate-400" />

                  </div>

                  <h3 className="mt-4 font-semibold text-slate-800">
                    No orders found
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    There are no orders matching your filter.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setActiveTab(
                        "All"
                      );
                    }}
                    className="mt-4 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
                  >
                    Clear Filters
                  </button>

                </div>
              ) : (
                <div className="divide-y divide-slate-100">

                  {filteredOrders.map(
                    (order) => (
                      <OrderRow
                        key={order.id}
                        order={order}
                        actionLoading={
                          actionLoading
                        }
                        onAccept={
                          acceptOrder
                        }
                        onStart={
                          startDelivery
                        }
                        onComplete={
                          completeDelivery
                        }
                      />
                    )
                  )}

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
      className={`rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        highlight
          ? "border-green-200 ring-1 ring-green-100"
          : "border-slate-200"
      }`}
    >

      <div className="flex items-start justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-500">
          {icon}
        </div>

        {highlight && (
          <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-600">
            Available
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
  actionLoading,
  onAccept,
  onStart,
  onComplete,
}: {
  order: Order;
  actionLoading: string | null;
  onAccept: (id: string) => void;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
}) {
  const isAvailable =
    order.status === "Available";

  const isAccepted =
    order.status === "Accepted";

  const isProgress =
    order.status === "In Progress";

  const isCompleted =
    order.status === "Completed";

  const isLoading =
    actionLoading === order.id;

  return (
    <div className="p-5 transition hover:bg-slate-50 md:p-6">

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">

        {/* RESTAURANT */}

        <div className="flex min-w-0 flex-1 items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50">
            <Package className="h-5 w-5 text-green-500" />
          </div>

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h3 className="font-bold text-slate-900">
                {order.restaurant}
              </h3>

              <StatusBadge
                status={
                  order.status
                }
              />

            </div>

            <p className="mt-1 text-sm text-slate-500">
              Order #
              {order.id
                .slice(-6)
                .toUpperCase()}
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

        {/* DELIVERY ROUTE */}

        <div className="hidden min-w-[230px] lg:block">

          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Delivery Route
          </p>

          <div className="mt-2 space-y-1.5">

            <div className="flex items-center gap-2">

              <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" />

              <p className="truncate text-xs text-slate-600">
                {order.pickup}
              </p>

            </div>

            <div className="ml-[3px] h-3 border-l border-dashed border-slate-300" />

            <div className="flex items-center gap-2">

              <span className="h-2 w-2 shrink-0 rounded-full bg-slate-400" />

              <p className="truncate text-xs text-slate-600">
                {order.delivery}
              </p>

            </div>

          </div>
        </div>

        {/* PAYOUT */}

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

        {/* ACTIONS */}

        <div className="flex items-center gap-2 xl:min-w-[170px] xl:justify-end">

          {/* Available */}

          {isAvailable && (
            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                onAccept(
                  order.id
                )
              }
              className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {isLoading
                ? "Accepting..."
                : "Accept Order"}

              {!isLoading && (
                <ArrowUpRight className="h-4 w-4" />
              )}

            </button>
          )}

          {/* Accepted */}

          {isAccepted && (
            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                onStart(
                  order.id
                )
              }
              className="flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-600 transition hover:bg-green-100 disabled:opacity-60"
            >

              {isLoading
                ? "Starting..."
                : "Start Delivery"}

              {!isLoading && (
                <ArrowUpRight className="h-4 w-4" />
              )}

            </button>
          )}

          {/* In Progress */}

          {isProgress && (
            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                onComplete(
                  order.id
                )
              }
              className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600 disabled:opacity-60"
            >

              {isLoading
                ? "Completing..."
                : "Complete Delivery"}

              {!isLoading && (
                <CheckCircle2 className="h-4 w-4" />
              )}

            </button>
          )}

          {/* Completed */}

          {isCompleted && (
            <span className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600">

              <CheckCircle2 className="h-4 w-4 text-green-500" />

              Completed

            </span>
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
  const styles: Record<
    OrderStatus,
    string
  > = {
    Available:
      "bg-green-50 text-green-700 border-green-200",

    Accepted:
      "bg-blue-50 text-blue-700 border-blue-200",

    "In Progress":
      "bg-green-50 text-green-700 border-green-200",

    Completed:
      "bg-slate-100 text-slate-600 border-slate-200",
  };

  const icons: Record<
    OrderStatus,
    React.ReactNode
  > = {
    Available: (
      <Bike className="h-3 w-3" />
    ),

    Accepted: (
      <CheckCircle2 className="h-3 w-3" />
    ),

    "In Progress": (
      <Clock3 className="h-3 w-3" />
    ),

    Completed: (
      <CheckCircle2 className="h-3 w-3" />
    ),
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