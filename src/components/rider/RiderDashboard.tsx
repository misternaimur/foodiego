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

import { useEffect, useState } from "react";

type RiderDashboardProps = {
  rider?: any;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ============================================================
   RIDER PROFILE
   সব page-এ এই একইভাবে profile দেখানো হবে
============================================================ */

function getRiderName(rider: any) {
  return (
    rider?.name ||
    rider?.fullName ||
    rider?.riderName ||
    "Rider"
  );
}

function getRiderRating(rider: any) {
  const rating =
    rider?.rating ??
    rider?.averageRating ??
    rider?.ratings ??
    4.9;

  return Number(rating) > 0 ? Number(rating).toFixed(1) : "4.9";
}

/* ============================================================
   DASHBOARD
============================================================ */

export default function RiderDashboard({
  rider,
}: RiderDashboardProps) {
  const [dashboard, setDashboard] = useState<any>(null);

  const [isOnline, setIsOnline] = useState(
    Boolean(rider?.isAvailable)
  );

  const [mobileMenu, setMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  /* ==========================================================
     LOAD DASHBOARD
  ========================================================== */

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        let riderId =
          localStorage.getItem("riderId");

        /*
         * যদি rider prop থেকে ID পাওয়া যায়,
         * তাহলে localStorage-এ save করে রাখি।
         */
        if (!riderId && rider?._id) {
          riderId = rider._id;
          localStorage.setItem(
            "riderId",
            rider._id
          );
        }

        if (!riderId) {
          console.error("Rider ID not found");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/riders/${riderId}/dashboard`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch dashboard"
          );
        }

        const result = await response.json();

        if (result.success) {
          setDashboard(result.data);

          setIsOnline(
            Boolean(
              result.data?.rider?.isAvailable
            )
          );

          /*
           * Rider profile localStorage-এ রাখছি,
           * যাতে অন্য rider page-ও একই profile ব্যবহার করতে পারে।
           */
          if (result.data?.rider) {
            localStorage.setItem(
              "riderProfile",
              JSON.stringify(result.data.rider)
            );
          }
        }
      } catch (error) {
        console.error(
          "Failed to load rider dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [rider?._id]);

  /* ==========================================================
     AVAILABILITY
  ========================================================== */

  const handleAvailabilityChange = async () => {
    const newStatus = !isOnline;

    try {
      setUpdatingStatus(true);

      const riderId =
        localStorage.getItem("riderId") ||
        rider?._id;

      if (!riderId) {
        alert(
          "Rider ID not found. Please login again."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/api/riders/${riderId}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isAvailable: newStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to update availability"
        );
      }

      setIsOnline(
        result.data.isAvailable
      );

      setDashboard((previous: any) => ({
        ...previous,
        rider: {
          ...previous?.rider,
          isAvailable:
            result.data.isAvailable,
        },
      }));

      /*
       * Updated profile save
       */
      const oldProfile =
        JSON.parse(
          localStorage.getItem(
            "riderProfile"
          ) || "{}"
        );

      localStorage.setItem(
        "riderProfile",
        JSON.stringify({
          ...oldProfile,
          isAvailable:
            result.data.isAvailable,
        })
      );
    } catch (error) {
      console.error(
        "Availability update failed:",
        error
      );

      alert(
        "Failed to update online status"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-green-500" />

          <p className="mt-3 text-sm text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  /* ==========================================================
     DATA
  ========================================================== */

  const riderData =
    dashboard?.rider ||
    rider ||
    {};

  const riderName =
    getRiderName(riderData);

  const riderRating =
    getRiderRating(riderData);

  const stats =
    dashboard?.stats || {
      todayDeliveries: 0,
      todayEarnings: 0,
      activeDelivery: 0,
      deliverySuccess: 0,
    };

  const performance =
    dashboard?.performance || {
      completed: 0,
      averageTime: null,
      distance: null,
      rating: riderRating,
    };

  const activeDelivery =
    dashboard?.activeDelivery;

  const recentActivity =
    dashboard?.recentActivity || [];

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
              className="absolute right-4 top-5 z-10 rounded-lg p-2 transition hover:bg-slate-100 lg:hidden"
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
                    {riderName}
                  </p>

                  <p className="text-xs font-medium text-green-500">
                    Rider
                  </p>

                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">

                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />

                    <span>
                      {riderRating} Rating
                    </span>

                  </div>

                </div>

              </div>
            </div>

            {/* NAV */}

            <nav className="flex-1 px-4 py-5">

              <a
                href="/rider"
                className="mb-2 flex items-center gap-3 rounded-lg bg-green-500 px-4 py-3 text-sm font-medium text-white"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </a>

              <a
                href="/rider/orders"
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-green-50 hover:text-green-500"
              >
                <Package className="h-4 w-4" />
                Orders
              </a>

              <a
                href="/rider/deliveries"
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-green-50 hover:text-green-500"
              >
                <Bike className="h-4 w-4" />
                Deliveries
              </a>

              <a
                href="/rider/earnings"
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-green-50 hover:text-green-500"
              >
                <DollarSign className="h-4 w-4" />
                Earnings
              </a>

              <a
                href="/rider/shift-history"
                className="mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-green-50 hover:text-green-500"
              >
                <History className="h-4 w-4" />
                Shift History
              </a>

              <a
                href="/rider/settings"
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

        {/* OVERLAY */}

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

          {/* MOBILE MENU */}

          <div className="px-5 pt-5 lg:hidden">
            <button
              type="button"
              onClick={() =>
                setMobileMenu(true)
              }
              className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm"
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </button>
          </div>

          {/* MOBILE HEADING */}

          <div className="px-5 pt-5 lg:hidden">

            <h2 className="text-2xl font-bold">
              Good morning,{" "}
              {riderName}!
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Here&apos;s your delivery overview
              for today.
            </p>

          </div>

          <div className="space-y-6 p-5 md:p-8 lg:p-10">

            {/* ONLINE */}

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-4">

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isOnline
                        ? "bg-green-100"
                        : "bg-slate-100"
                    }`}
                  >
                    <Bike
                      className={`h-5 w-5 ${
                        isOnline
                          ? "text-green-600"
                          : "text-slate-500"
                      }`}
                    />
                  </div>

                  <div>

                    <h3 className="font-semibold">
                      {isOnline
                        ? "You're online"
                        : "You're offline"}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {isOnline
                        ? "Available for deliveries"
                        : "You are not receiving delivery requests"}
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  disabled={updatingStatus}
                  onClick={
                    handleAvailabilityChange
                  }
                  className={`relative h-7 w-12 rounded-full transition ${
                    isOnline
                      ? "bg-green-500"
                      : "bg-slate-300"
                  } ${
                    updatingStatus
                      ? "cursor-not-allowed opacity-60"
                      : ""
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      isOnline
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>

              </div>
            </section>

            {/* STATS */}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <StatCard
                icon={<Package className="h-4 w-4" />}
                title="Today's Deliveries"
                value={String(
                  stats.todayDeliveries
                )}
                text="Completed today"
              />

              <StatCard
                icon={<DollarSign className="h-4 w-4" />}
                title="Today's Earnings"
                value={`৳${Number(
                  stats.todayEarnings || 0
                ).toFixed(0)}`}
                text="Rider payout"
              />

              <StatCard
                icon={<Bike className="h-4 w-4" />}
                title="Active Delivery"
                value={String(
                  stats.activeDelivery
                )}
                text="In progress"
              />

              <StatCard
                icon={
                  <CheckCircle2 className="h-4 w-4" />
                }
                title="Delivery Success"
                value={`${stats.deliverySuccess}%`}
                text="Completion rate"
              />

            </section>

            {/* ACTIVE DELIVERY */}

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                {activeDelivery ? (
                  <>

                    <div className="mb-5 flex items-center justify-between">

                      <div>

                        <p className="text-xs font-medium text-green-500">
                          {activeDelivery.status ===
                          "out_for_delivery"
                            ? "On The Way"
                            : activeDelivery.status}
                        </p>

                        <h3 className="mt-1 text-lg font-bold">
                          Delivery in progress
                        </h3>

                        <p className="text-sm text-slate-500">
                          Order #
                          {String(
                            activeDelivery._id
                          ).slice(-6)}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="text-xs text-slate-500">
                          Order Total
                        </p>

                        <p className="text-xl font-bold">
                          ৳
                          {Number(
                            activeDelivery.totalAmount ||
                              0
                          ).toFixed(0)}
                        </p>

                      </div>

                    </div>

                    <div className="space-y-5">

                      <DeliveryStep
                        active
                        title="Accepted"
                      />

                      <DeliveryStep
                        active={[
                          "preparing",
                          "out_for_delivery",
                        ].includes(
                          activeDelivery.status
                        )}
                        title="Picked Up"
                      />

                      <DeliveryStep
                        active={
                          activeDelivery.status ===
                          "out_for_delivery"
                        }
                        current={
                          activeDelivery.status ===
                          "out_for_delivery"
                        }
                        title="On the Way"
                      />

                      <DeliveryStep
                        title="Delivered"
                      />

                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">

                      <button
                        type="button"
                        className="rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-600"
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

                  </>
                ) : (
                  <div className="flex min-h-[300px] items-center justify-center text-center">

                    <div>

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                        <Bike className="h-7 w-7 text-slate-400" />
                      </div>

                      <h3 className="mt-4 font-bold">
                        No active delivery
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        You currently have no
                        delivery in progress.
                      </p>

                    </div>

                  </div>
                )}

              </div>

              {/* HIGH DEMAND */}

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                <h3 className="mb-4 font-bold">
                  🔥 High Demand Zone
                </h3>

                <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-lg bg-sky-100">

                  <div className="absolute inset-0 opacity-40">
                    <div className="h-full w-full bg-[radial-gradient(circle_at_30%_40%,#60a5fa_0,transparent_25%),radial-gradient(circle_at_70%_55%,#fb923c_0,transparent_25%)]" />
                  </div>

                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                    <MapPin className="h-6 w-6 text-green-500" />
                  </div>

                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Downtown area is currently
                  experiencing high demand.
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

            {/* BOTTOM */}

            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

              {/* PERFORMANCE */}

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
                    value={String(
                      performance.completed
                    )}
                  />

                  <MiniStat
                    label="Avg. Time"
                    value={
                      performance.averageTime
                        ? `${performance.averageTime}m`
                        : "—"
                    }
                  />

                  <MiniStat
                    label="Distance"
                    value={
                      performance.distance
                        ? `${performance.distance} km`
                        : "—"
                    }
                  />

                  <MiniStat
                    label="Rating"
                    value={String(
                      performance.rating ||
                        riderRating
                    )}
                  />

                </div>

              </div>

              {/* RECENT ACTIVITY */}

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                <h3 className="mb-5 font-bold">
                  Recent Activity
                </h3>

                <div className="space-y-4">

                  {recentActivity.length > 0 ? (
                    recentActivity.map(
                      (activity: any) => (
                        <Activity
                          key={activity.id}
                          icon={
                            activity.status ===
                            "delivered" ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <Package className="h-4 w-4" />
                            )
                          }
                          title={
                            activity.status ===
                            "delivered"
                              ? "Order completed"
                              : "Delivery activity"
                          }
                          text={`Order #${String(
                            activity.orderId
                          ).slice(-6)}`}
                          time={new Date(
                            activity.createdAt
                          ).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        />
                      )
                    )
                  ) : (
                    <p className="text-sm text-slate-500">
                      No activity today.
                    </p>
                  )}

                </div>

              </div>

            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

/* ============================================================
   COMPONENTS
============================================================ */

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