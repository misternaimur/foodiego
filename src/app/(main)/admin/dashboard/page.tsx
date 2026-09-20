import Link from "next/link";
import {
  ShoppingCart,
  Wallet,
  Store,
  Users,
  UserCheck,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Bike,
} from "lucide-react";
import { dbConnect } from "@/lib/dbConnect";
import { verifyRole } from "@/lib/dal";
import { Restaurant } from "@/models/Restaurant";
import { Rider } from "@/models/Rider";
import { User } from "@/models/User";
import { OrderBooking, type OrderBookingStatus } from "@/models/OrderBooking";

export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<string, string> = {
  delivered: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  cancelled: "bg-rose-50 text-rose-700 border border-rose-100",
};

function dayLabel(date: Date) {
  return date.toLocaleDateString(undefined, { weekday: "short" });
}

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

export default async function AdminDashboardPage() {
  await verifyRole("admin");
  await dbConnect();

  const weekAgo = daysAgo(7);

  const [
    totalOrders,
    totalRevenueAgg,
    totalVendors,
    pendingVendors,
    pendingRiders,
    totalCustomers,
    recentOrders,
    weeklySales,
  ] = await Promise.all([
    OrderBooking.countDocuments({}),
    OrderBooking.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    Restaurant.countDocuments({ status: "approved" }),
    Restaurant.countDocuments({ status: "pending" }),
    Rider.countDocuments({ status: "pending" }),
    User.countDocuments({ role: "customer" }),
    OrderBooking.find({})
      .populate("customerId", "name")
      .populate("restaurantId", "restaurantName")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    OrderBooking.aggregate([
      { $match: { createdAt: { $gte: weekAgo }, status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const totalRevenue = totalRevenueAgg[0]?.total ?? 0;

  const salesByDay = new Map(weeklySales.map((d: { _id: string; amount: number }) => [d._id, d.amount]));
  const salesOverview = Array.from({ length: 7 }).map((_, i) => {
    const date = daysAgo(6 - i);
    const key = date.toISOString().slice(0, 10);
    return { day: dayLabel(date), amount: salesByDay.get(key) || 0 };
  });
  const maxSale = Math.max(1, ...salesOverview.map((s) => s.amount));

  const metrics = [
    { title: "TOTAL ORDERS", value: totalOrders.toLocaleString(), icon: <ShoppingCart size={20} /> },
    { title: "TOTAL REVENUE", value: `$${totalRevenue.toLocaleString()}`, icon: <Wallet size={20} /> },
    { title: "TOTAL VENDORS", value: totalVendors.toLocaleString(), icon: <Store size={20} /> },
    { title: "TOTAL CUSTOMERS", value: totalCustomers.toLocaleString(), icon: <Users size={20} /> },
  ];

  const activities = [
    ...(pendingVendors > 0
      ? [{ id: "v", type: "vendor" as const, title: `${pendingVendors} vendor application${pendingVendors === 1 ? "" : "s"} awaiting review.` }]
      : []),
    ...(pendingRiders > 0
      ? [{ id: "r", type: "vendor" as const, title: `${pendingRiders} rider application${pendingRiders === 1 ? "" : "s"} awaiting review.` }]
      : []),
    ...recentOrders.slice(0, 3).map((o) => ({
      id: String(o._id),
      type: (o.status === "cancelled" ? "payment" : "system") as "payment" | "system",
      title:
        o.status === "cancelled"
          ? `Order #${String(o._id).slice(-6).toUpperCase()} was cancelled.`
          : `Order #${String(o._id).slice(-6).toUpperCase()} placed — $${o.totalAmount.toLocaleString()}.`,
    })),
  ].slice(0, 4);

  const getActivityIcon = (type: "vendor" | "payment" | "system") => {
    switch (type) {
      case "vendor":
        return <UserCheck className="text-emerald-600 bg-emerald-50 p-2 rounded-xl" size={36} />;
      case "payment":
        return <AlertTriangle className="text-amber-600 bg-amber-50 p-2 rounded-xl" size={36} />;
      case "system":
        return <CheckCircle2 className="text-emerald-600 bg-emerald-50 p-2 rounded-xl" size={36} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">Monitor key metrics and recent activities across the platform.</p>
          </div>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="p-2.5 rounded-xl bg-slate-50 text-slate-700 w-fit">{metric.icon}</div>
              <div className="mt-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{metric.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{metric.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* SALES CHART & RECENT ACTIVITY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm lg:col-span-2 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Sales Overview (Last 7 Days)</h3>
            </div>

            <div className="h-48 flex items-end justify-between gap-4 pt-6 px-2 border-b border-slate-100">
              {salesOverview.map((item, idx) => {
                const heightPct = Math.max(6, Math.round((item.amount / maxSale) * 100));
                const isToday = idx === salesOverview.length - 1;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full max-w-[48px] rounded-t-lg transition-all duration-300 ${
                        isToday ? "bg-emerald-700 shadow-lg shadow-emerald-700/20" : "bg-slate-100 group-hover:bg-slate-200"
                      }`}
                    />
                    <span className={`text-xs font-medium ${isToday ? "text-emerald-700 font-bold" : "text-slate-400"}`}>
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
            </div>

            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-sm text-slate-400">Nothing to report right now.</p>
              ) : (
                activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="shrink-0">{getActivityIcon(act.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 leading-snug">{act.title}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RECENT ORDERS TABLE */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs font-semibold text-emerald-700 hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-6">Order ID</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Vendor</th>
                  <th className="py-3 px-6">Amount</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 px-6 text-center text-slate-400">
                      No orders placed yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => {
                    const customer = order.customerId as unknown as { name?: string } | null;
                    const restaurant = order.restaurantId as unknown as { restaurantName?: string } | null;
                    const status: OrderBookingStatus = order.status;
                    return (
                      <tr key={String(order._id)} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 font-semibold text-emerald-700">
                          #{String(order._id).slice(-6).toUpperCase()}
                        </td>
                        <td className="py-4 px-6 text-slate-900">{customer?.name || "Guest"}</td>
                        <td className="py-4 px-6">{restaurant?.restaurantName || order.restaurantName || "—"}</td>
                        <td className="py-4 px-6 font-semibold text-slate-900">${order.totalAmount.toLocaleString()}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${
                              STATUS_BADGE[status] || "bg-sky-50 text-sky-700 border border-sky-100"
                            }`}
                          >
                            {status.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link href="/admin/vendors" className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700"><Store size={18} /></div>
            <div>
              <p className="text-sm font-bold text-slate-900">{pendingVendors} pending vendors</p>
              <p className="text-xs text-slate-500">Review applications</p>
            </div>
          </Link>
          <Link href="/admin/riders" className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700"><Bike size={18} /></div>
            <div>
              <p className="text-sm font-bold text-slate-900">{pendingRiders} pending riders</p>
              <p className="text-xs text-slate-500">Review applications</p>
            </div>
          </Link>
          <Link href="/admin/orders" className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700"><FileText size={18} /></div>
            <div>
              <p className="text-sm font-bold text-slate-900">Manage orders</p>
              <p className="text-xs text-slate-500">{totalOrders} total</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
