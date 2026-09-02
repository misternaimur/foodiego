"use client";

import {
  ArrowUpRight,
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
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

/* ============================================================
   TYPES
============================================================ */

type BackendStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

type BackendDelivery = {
  id: string;
  orderId: string;

  restaurant: string;
  customer: string;

  pickup: string;
  delivery: string;

  distance: string;
  time: string;

  payout: number;

  status:
    | "Accepted"
    | "In Progress"
    | "Completed";

  rawStatus: BackendStatus;

  acceptedAt?: string | null;
  pickedUpAt?: string | null;
  deliveredAt?: string | null;

  totalAmount?: number;

  customerPhone?: string;

  restaurantAddress?: string;
};

type RiderProfile = {
  name: string;
  email: string;
  rating: string;
};

/* ============================================================
   RIDER PROFILE
============================================================ */

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

  const possibleKeys = [
    "user",
    "rider",
    "userInfo",
    "currentUser",
    "loggedInUser",
  ];

  for (const key of possibleKeys) {
    try {
      const stored =
        localStorage.getItem(key);

      if (!stored) continue;

      const parsed = JSON.parse(stored);

      if (
        parsed &&
        typeof parsed === "object"
      ) {
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

/* ============================================================
   MAIN PAGE
============================================================ */

export default function RiderDeliveriesPage() {
  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [deliveries, setDeliveries] =
    useState<BackendDelivery[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  const [riderProfile, setRiderProfile] =
    useState<RiderProfile>({
      name: "Rider",
      email: "",
      rating: "4.9",
    });

  /* ==========================================================
     LOAD PROFILE
  ========================================================== */

  useEffect(() => {
    setRiderProfile(
      getStoredRiderProfile()
    );
  }, []);

  /* ==========================================================
     FETCH ONLY RIDER DELIVERIES
  ========================================================== */

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError("");

      const riderId =
        localStorage.getItem(
          "riderId"
        );

      if (!riderId) {
        throw new Error(
          "Rider ID not found. Please login again."
        );
      }

      /*
        IMPORTANT:

        We are NOT fetching /api/orders.

        We are fetching only orders already
        assigned to this rider.
      */

      const response =
        await fetch(
          `${API_URL}/api/riders/${riderId}/deliveries`
        );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch rider deliveries"
        );
      }

      const result =
        await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to load deliveries"
        );
      }

      setDeliveries(
        result.data || []
      );
    } catch (err) {
      console.error(
        "Fetch deliveries error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Could not load deliveries"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  /* ==========================================================
     START DELIVERY
  ========================================================== */

  const startDelivery = async (
    orderId: string
  ) => {
    try {
      const riderId =
        localStorage.getItem(
          "riderId"
        );

      if (!riderId) {
        alert(
          "Rider ID not found. Please login again."
        );
        return;
      }

      setActionLoading(orderId);

      const response =
        await fetch(
          `${API_URL}/api/riders/${riderId}/orders/${orderId}/start`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
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

      await fetchDeliveries();
    } catch (err) {
      console.error(
        "Start delivery error:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Failed to start delivery"
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* ==========================================================
     COMPLETE DELIVERY
  ========================================================== */

  const completeDelivery = async (
    orderId: string
  ) => {
    try {
      const riderId =
        localStorage.getItem(
          "riderId"
        );

      if (!riderId) {
        alert(
          "Rider ID not found. Please login again."
        );
        return;
      }

      setActionLoading(orderId);

      const response =
        await fetch(
          `${API_URL}/api/riders/${riderId}/orders/${orderId}/complete`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
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

      await fetchDeliveries();
    } catch (err) {
      console.error(
        "Complete delivery error:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Failed to complete delivery"
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* ==========================================================
     STATS
  ========================================================== */

  const activeCount =
    deliveries.filter(
      (delivery) =>
        delivery.status ===
        "In Progress"
    ).length;

  const acceptedCount =
    deliveries.filter(
      (delivery) =>
        delivery.status ===
        "Accepted"
    ).length;

  const completedCount =
    deliveries.filter(
      (delivery) =>
        delivery.status ===
        "Completed"
    ).length;

  const deliveryEarnings =
    deliveries
      .filter(
        (delivery) =>
          delivery.status ===
          "Completed"
      )
      .reduce(
        (total, delivery) =>
          total +
          Number(
            delivery.payout || 0
          ),
        0
      );

  /* ==========================================================
     ACTIVE DELIVERY
  ========================================================== */

  const activeDelivery =
    deliveries.find(
      (delivery) =>
        delivery.status ===
        "In Progress"
    ) || null;

  const acceptedDelivery =
    deliveries.find(
      (delivery) =>
        delivery.status ===
        "Accepted"
    ) || null;

  /* ==========================================================
     SEARCH
  ========================================================== */

  const filteredDeliveries =
    useMemo(() => {
      const searchText =
        search
          .toLowerCase()
          .trim();

      if (!searchText) {
        return deliveries;
      }

      return deliveries.filter(
        (delivery) =>
          delivery.orderId
            .toLowerCase()
            .includes(searchText) ||
          delivery.restaurant
            .toLowerCase()
            .includes(searchText) ||
          delivery.customer
            .toLowerCase()
            .includes(searchText)
      );
    }, [
      deliveries,
      search,
    ]);

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">

      <div className="flex min-h-screen">

        {/* ====================================================
            SIDEBAR
        ==================================================== */}

        <aside
          className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-slate-200 bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:z-30 lg:block lg:h-screen lg:translate-x-0 ${
            mobileMenu
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >

          <div className="relative flex h-full flex-col">

            <button
              type="button"
              onClick={() =>
                setMobileMenu(false)
              }
              className="absolute right-4 top-5 rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>

            {/* PROFILE */}

            <div className="border-b border-slate-100 px-5 py-6">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <User className="h-6 w-6 text-green-500" />
                </div>

                <div className="min-w-0">

                  <p className="truncate font-semibold text-slate-800">
                    {riderProfile.name}
                  </p>

                  <div className="mt-0.5">
                    <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">
                      Rider
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">

                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />

                    <span>
                      {riderProfile.rating} Rating
                    </span>

                  </div>

                </div>

              </div>

              {riderProfile.email && (
                <p className="mt-2 truncate pl-14 text-[10px] text-slate-400">
                  {riderProfile.email}
                </p>
              )}

            </div>

            {/* NAVIGATION */}

            <nav className="flex-1 px-4 py-5">

              <a
                href="/rider"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-green-50 hover:text-green-600"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </a>

              <a
                href="/rider/orders"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-green-50 hover:text-green-600"
              >
                <Package className="h-4 w-4" />
                Orders
              </a>

              <a
                href="/rider/deliveries"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="mb-1 flex items-center gap-3 rounded-lg bg-green-500 px-4 py-3 text-sm font-medium text-white shadow-sm"
              >
                <Bike className="h-4 w-4" />
                Deliveries
              </a>

              <a
                href="/rider/earnings"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-green-50 hover:text-green-600"
              >
                <DollarSign className="h-4 w-4" />
                Earnings
              </a>

              <a
                href="/rider/shift-history"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-green-50 hover:text-green-600"
              >
                <History className="h-4 w-4" />
                Shift History
              </a>

              <a
                href="/rider/settings"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-green-50 hover:text-green-600"
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

        {/* ====================================================
            MOBILE OVERLAY
        ==================================================== */}

        {mobileMenu && (
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() =>
              setMobileMenu(false)
            }
          />
        )}

        {/* ====================================================
            MAIN
        ==================================================== */}

        <main className="min-w-0 flex-1">

          {/* MOBILE HEADER */}

          <div className="border-b border-slate-200 bg-white px-5 py-3 lg:hidden">

            <button
              type="button"
              onClick={() =>
                setMobileMenu(true)
              }
              className="rounded-lg p-2 hover:bg-slate-100"
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </button>

          </div>

          <div className="space-y-7 p-5 md:p-8 lg:p-10">

            {/* HEADER */}

            <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

              <div>

                <p className="mb-2 text-4xl font-bold text-green-500">
                  Rider Dashboard
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Deliveries
                </h1>

                <p className="mt-2 max-w-xl text-sm text-slate-500">
                  Track your accepted deliveries and review your completed delivery history.
                </p>

              </div>

              <div className="flex w-fit items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5">

                <span className="h-2 w-2 rounded-full bg-green-500" />

                <span className="text-sm font-medium text-green-700">
                  You're available
                </span>

              </div>

            </section>

            {/* STATS */}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <DeliveryStat
                icon={
                  <Bike className="h-5 w-5" />
                }
                title="Active Delivery"
                value={String(
                  activeCount
                )}
                description="Currently on the way"
                highlight
              />

              <DeliveryStat
                icon={
                  <Clock3 className="h-5 w-5" />
                }
                title="Accepted"
                value={String(
                  acceptedCount
                )}
                description="Ready to start"
              />

              <DeliveryStat
                icon={
                  <CheckCircle2 className="h-5 w-5" />
                }
                title="Completed"
                value={String(
                  completedCount
                )}
                description="Completed deliveries"
              />

              <DeliveryStat
                icon={
                  <DollarSign className="h-5 w-5" />
                }
                title="Delivery Earnings"
                value={`৳${deliveryEarnings}`}
                description="From completed deliveries"
              />

            </section>

            {/* ERROR */}

            {error && (
              <section className="rounded-xl border border-red-200 bg-red-50 p-5">

                <p className="font-semibold text-red-700">
                  Unable to load deliveries
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={
                    fetchDeliveries
                  }
                  className="mt-3 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600"
                >
                  Try Again
                </button>

              </section>
            )}

            {/* ACTIVE DELIVERY */}

            {!loading &&
              (activeDelivery ||
                acceptedDelivery) && (
                <ActiveDeliveryCard
                  delivery={
                    activeDelivery ||
                    acceptedDelivery!
                  }
                  actionLoading={
                    actionLoading
                  }
                  onStart={
                    startDelivery
                  }
                  onComplete={
                    completeDelivery
                  }
                />
              )}

            {/* LOADING */}

            {loading ? (
              <section className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm">

                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-green-500" />

                <p className="mt-4 text-sm text-slate-500">
                  Loading deliveries...
                </p>

              </section>
            ) : (

              /* DELIVERY HISTORY */

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-100 p-5 md:p-6">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <h2 className="text-lg font-bold text-slate-900">
                        Delivery History
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        View your accepted and completed delivery activity.
                      </p>

                    </div>

                    <div className="relative w-full sm:w-64">

                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        value={search}
                        onChange={(e) =>
                          setSearch(
                            e.target.value
                          )
                        }
                        type="text"
                        placeholder="Search deliveries..."
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-green-300 focus:bg-white focus:ring-2 focus:ring-green-100"
                      />

                    </div>

                  </div>

                </div>

                {filteredDeliveries.length ===
                0 ? (

                  <div className="px-6 py-16 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">

                      <Package className="h-6 w-6 text-slate-400" />

                    </div>

                    <h3 className="mt-4 font-semibold text-slate-800">
                      No deliveries found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Accept an order from the Orders page first.
                    </p>

                  </div>

                ) : (

                  <div className="divide-y divide-slate-100">

                    {filteredDeliveries.map(
                      (delivery) => (

                        <DeliveryRow
                          key={
                            delivery.id
                          }
                          delivery={
                            delivery
                          }
                          actionLoading={
                            actionLoading
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

            )}

          </div>
        </main>
      </div>
    </div>
  );
}

/* =============================================================
   STAT
============================================================= */

function DeliveryStat({
  icon,
  title,
  value,
  description,
  highlight = false,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        highlight
          ? "border-green-200 ring-1 ring-green-100"
          : "border-slate-200"
      }`}
    >

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-500">
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
   ACTIVE DELIVERY CARD
============================================================= */

function ActiveDeliveryCard({
  delivery,
  actionLoading,
  onStart,
  onComplete,
}: {
  delivery: BackendDelivery;
  actionLoading: string | null;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
}) {
  const isLoading =
    actionLoading ===
    delivery.id;

  const isProgress =
    delivery.status ===
    "In Progress";

  return (
    <section className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <div className="flex items-center gap-2">

            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

            <p className="text-sm font-semibold text-green-600">
              {isProgress
                ? "Active Delivery"
                : "Accepted Delivery"}
            </p>

          </div>

          <h2 className="mt-2 text-xl font-bold text-slate-900">
            {delivery.restaurant} →{" "}
            {delivery.customer}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Order #
            {delivery.id
              .slice(-6)
              .toUpperCase()}
          </p>

        </div>

        <div className="text-left sm:text-right">

          <p className="text-xs text-slate-400">
            Payout
          </p>

          <p className="text-2xl font-bold text-slate-900">
            ৳{delivery.payout}
          </p>

        </div>

      </div>

      {/* ROUTE */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        <div className="rounded-xl bg-slate-50 p-5">

          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Pickup
          </p>

          <div className="mt-3 flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">

              <MapPin className="h-4 w-4 text-green-600" />

            </div>

            <div>

              <p className="font-semibold text-slate-800">
                {delivery.pickup}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Restaurant pickup
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
                {delivery.customer}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {delivery.delivery}
              </p>

            </div>

          </div>
        </div>

      </div>

      {/* INFO */}

      <div className="mt-5 flex flex-wrap gap-3">

        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2.5">

          <MapPin className="h-4 w-4 text-slate-400" />

          <span className="text-sm text-slate-600">
            {delivery.distance}
          </span>

        </div>

        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2.5">

          <Timer className="h-4 w-4 text-slate-400" />

          <span className="text-sm text-slate-600">
            {delivery.time}
          </span>

        </div>

        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2.5">

          <Bike className="h-4 w-4 text-green-500" />

          <span className="text-sm font-medium text-green-600">
            {isProgress
              ? "On the way"
              : "Ready to start"}
          </span>

        </div>

      </div>

      {/* PROGRESS */}

      <div className="mt-6">

        <div className="mb-3 flex items-center justify-between">

          <p className="text-sm font-semibold text-slate-700">
            Delivery Progress
          </p>

          <p className="text-xs font-medium text-green-500">
            {isProgress
              ? "75%"
              : "50%"}
          </p>

        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">

          <div
            className={`h-full rounded-full bg-green-500 ${
              isProgress
                ? "w-3/4"
                : "w-1/2"
            }`}
          />

        </div>

        <div className="mt-3 flex justify-between text-xs text-slate-400">

          <span>Accepted</span>

          <span>Picked Up</span>

          <span
            className={
              isProgress
                ? "font-semibold text-green-500"
                : ""
            }
          >
            On the Way
          </span>

          <span>Delivered</span>

        </div>

      </div>

      {/* ACTION */}

      <div className="mt-6 flex flex-wrap gap-3">

        {isProgress ? (

          <button
            type="button"
            disabled={isLoading}
            onClick={() =>
              onComplete(
                delivery.id
              )
            }
            className="flex items-center gap-2 rounded-lg bg-green-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {isLoading
              ? "Completing..."
              : "Complete Delivery"}

            {!isLoading && (
              <CheckCircle2 className="h-4 w-4" />
            )}

          </button>

        ) : (

          <button
            type="button"
            disabled={isLoading}
            onClick={() =>
              onStart(
                delivery.id
              )
            }
            className="flex items-center gap-2 rounded-lg bg-green-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {isLoading
              ? "Starting..."
              : "Start Delivery"}

            {!isLoading && (
              <ArrowUpRight className="h-4 w-4" />
            )}

          </button>

        )}

        {delivery.customerPhone && (
          <a
            href={`tel:${delivery.customerPhone}`}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >

            <Phone className="h-4 w-4" />

            Contact Customer

          </a>
        )}

      </div>

    </section>
  );
}

/* =============================================================
   DELIVERY ROW
============================================================= */

function DeliveryRow({
  delivery,
  actionLoading,
  onStart,
  onComplete,
}: {
  delivery: BackendDelivery;
  actionLoading: string | null;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
}) {
  const isProgress =
    delivery.status ===
    "In Progress";

  const isAccepted =
    delivery.status ===
    "Accepted";

  const isCompleted =
    delivery.status ===
    "Completed";

  const isLoading =
    actionLoading ===
    delivery.id;

  return (
    <div className="p-5 transition hover:bg-slate-50 md:p-6">

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">

        {/* INFO */}

        <div className="flex min-w-0 flex-1 items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50">

            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Bike className="h-5 w-5 text-green-500" />
            )}

          </div>

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h3 className="font-bold text-slate-900">
                {delivery.restaurant}
              </h3>

              <DeliveryStatusBadge
                status={
                  delivery.status
                }
              />

            </div>

            <p className="mt-1 text-sm text-slate-500">
              Order #
              {delivery.id
                .slice(-6)
                .toUpperCase()}
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

        {/* ROUTE */}

        <div className="hidden min-w-[230px] lg:block">

          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Delivery Route
          </p>

          <div className="mt-2 space-y-1.5">

            <div className="flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-green-500" />

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

        {/* PAYOUT */}

        <div className="flex items-center justify-between gap-5 xl:block xl:min-w-[100px]">

          <div>

            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Payout
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900">
              ৳{delivery.payout}
            </p>

          </div>

          <p className="text-xs text-slate-400 xl:mt-2">
            {delivery.distance}
          </p>

        </div>

        {/* ACTION */}

        <div className="flex items-center gap-2 xl:min-w-[160px] xl:justify-end">

          {isProgress && (

            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                onComplete(
                  delivery.id
                )
              }
              className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600 disabled:opacity-60"
            >

              {isLoading
                ? "Completing..."
                : "Complete"}

              {!isLoading && (
                <CheckCircle2 className="h-4 w-4" />
              )}

            </button>

          )}

          {isAccepted && (

            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                onStart(
                  delivery.id
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

function DeliveryStatusBadge({
  status,
}: {
  status:
    | "Accepted"
    | "In Progress"
    | "Completed";
}) {
  const styles: Record<
    typeof status,
    string
  > = {
    "In Progress":
      "bg-green-50 text-green-700 border-green-200",

    Accepted:
      "bg-blue-50 text-blue-700 border-blue-200",

    Completed:
      "bg-green-50 text-green-700 border-green-200",
  };

  const icons: Record<
    typeof status,
    ReactNode
  > = {
    "In Progress": (
      <Clock3 className="h-3 w-3" />
    ),

    Accepted: (
      <Bike className="h-3 w-3" />
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