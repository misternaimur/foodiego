import Link from "next/link";
import { Inbox, Search, ShoppingBag } from "lucide-react";
import { dbConnect } from "@/lib/dbConnect";
import { verifyRole } from "@/lib/dal";
import { OrderBooking, ORDER_STATUSES, type OrderBookingStatus } from "@/models/OrderBooking";
import OrderStatusActions from "@/components/admin/OrderStatusActions";

export const dynamic = "force-dynamic";

type Filter = OrderBookingStatus | "all";
const FILTERS: Filter[] = ["all", ...ORDER_STATUSES];

const STATUS_BADGE: Record<OrderBookingStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-sky-50 text-sky-700 border-sky-200",
  preparing: "bg-indigo-50 text-indigo-700 border-indigo-200",
  out_for_delivery: "bg-violet-50 text-violet-700 border-violet-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

function isFilter(value: string | string[] | undefined): value is Filter {
  return typeof value === "string" && (FILTERS as string[]).includes(value);
}

// UPDATE (admin-pagination fix): this page used to fetch a flat `.limit(100)`
// of matching orders with no way to see anything past that cap, and no
// page indicator at all. Real pagination is added the same way as the
// vendors/riders/customers admin pages.
const PAGE_SIZE = 20;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await verifyRole("admin");

  const sp = await searchParams;
  const filter: Filter = isFilter(sp.status) ? sp.status : "all";
  const searchQuery = typeof sp.q === "string" ? sp.q : "";
  const page = Math.max(1, Number(sp.page) || 1);

  await dbConnect();

  const query: Record<string, unknown> = {};
  if (filter !== "all") query.status = filter;
  if (searchQuery) {
    query.$or = [
      { restaurantName: { $regex: searchQuery, $options: "i" } },
      { deliveryAddress: { $regex: searchQuery, $options: "i" } },
    ];
  }

  const [orders, counts, totalRevenue, filteredCount] = await Promise.all([
    OrderBooking.find(query)
      .populate("customerId", "name email")
      .populate("restaurantId", "restaurantName")
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Promise.all(ORDER_STATUSES.map((s) => OrderBooking.countDocuments({ status: s }))),
    OrderBooking.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    OrderBooking.countDocuments(query),
  ]);

  const countByStatus = Object.fromEntries(ORDER_STATUSES.map((s, i) => [s, counts[i]])) as Record<
    OrderBookingStatus,
    number
  >;
  const totalCount = Object.values(countByStatus).reduce((a, b) => a + b, 0);
  const revenue = totalRevenue[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  const firstRow = filteredCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastRow = Math.min(page * PAGE_SIZE, filteredCount);

  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (filter !== "all") params.set("status", filter);
    if (searchQuery) params.set("q", searchQuery);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `?${qs}` : "?";
  }

  return (
    <main className="flex-1 bg-gray-50/60 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            All orders placed across the platform. Update status as they move through the pipeline.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Total Orders</span>
            <p className="mt-2 text-2xl font-extrabold text-gray-900">{totalCount.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Total Revenue</span>
            <p className="mt-2 text-2xl font-extrabold text-gray-900">৳{revenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">In Progress</span>
            <p className="mt-2 text-2xl font-extrabold text-amber-600">
              {(countByStatus.pending + countByStatus.confirmed + countByStatus.preparing + countByStatus.out_for_delivery).toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Delivered</span>
            <p className="mt-2 text-2xl font-extrabold text-emerald-600">{countByStatus.delivered.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs font-semibold text-gray-500">
              {FILTERS.map((f) => {
                const isActive = filter === f;
                return (
                  <Link
                    key={f}
                    href={f === "all" ? "/admin/orders" : `/admin/orders?status=${f}${searchQuery ? `&q=${searchQuery}` : ""}`}
                    className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 capitalize ${
                      isActive ? "bg-gray-100 text-gray-900 font-bold" : "hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <span>{f.replace(/_/g, " ")}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                        isActive ? "bg-gray-200/80 text-gray-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {f === "all" ? totalCount : countByStatus[f]}
                    </span>
                  </Link>
                );
              })}
            </div>

            <form method="GET" className="flex items-center gap-3">
              {filter !== "all" && <input type="hidden" name="status" value={filter} />}
              <div className="relative w-full sm:w-64">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search size={15} />
                </span>
                <input
                  type="text"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Search orders..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0d9488] transition-all"
                />
              </div>
            </form>
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Inbox className="text-gray-300" size={42} />
              <p className="mt-3 text-sm font-semibold text-gray-700">No orders found</p>
              <p className="text-xs text-gray-400">Try adjusting your search or filter parameters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase bg-gray-50/50">
                    <th className="py-3.5 px-6">Order</th>
                    <th className="py-3.5 px-6">Customer</th>
                    <th className="py-3.5 px-6">Restaurant</th>
                    <th className="py-3.5 px-6">Amount</th>
                    <th className="py-3.5 px-6">Payment</th>
                    <th className="py-3.5 px-6">Placed</th>
                    <th className="py-3.5 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {orders.map((o) => {
                    const id = String(o._id);
                    const customer = o.customerId as unknown as { name?: string; email?: string } | null;
                    const restaurant = o.restaurantId as unknown as { restaurantName?: string } | null;

                    return (
                      <tr key={id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 font-bold text-gray-900">
                            <ShoppingBag size={14} className="text-gray-400" />#{id.slice(-6).toUpperCase()}
                          </div>
                          <p className="mt-0.5 truncate text-[11px] text-gray-400">
                            {o.items?.map((i) => i.name).join(", ")}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-semibold text-gray-800">{customer?.name || "Guest"}</p>
                          <p className="text-[11px] text-gray-400">{customer?.email}</p>
                        </td>
                        <td className="py-4 px-6 text-gray-700">
                          {restaurant?.restaurantName || o.restaurantName || "—"}
                        </td>
                        <td className="py-4 px-6 font-semibold text-gray-900">৳{o.totalAmount.toLocaleString()}</td>
                        <td className="py-4 px-6">
                          <span className="capitalize text-gray-600">{o.paymentMethod}</span>
                          <span
                            className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                              o.paymentStatus === "paid"
                                ? "bg-emerald-50 text-emerald-700"
                                : o.paymentStatus === "failed"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-500">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex flex-col items-end gap-1.5">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold capitalize ${STATUS_BADGE[o.status]}`}
                            >
                              {o.status.replace(/_/g, " ")}
                            </span>
                            <OrderStatusActions orderId={id} status={o.status} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {orders.length > 0 && (
            <div className="p-4 px-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
              <div>
                Showing <span className="font-semibold text-gray-800">{firstRow}</span> to{" "}
                <span className="font-semibold text-gray-800">{lastRow}</span> of{" "}
                <span className="font-semibold text-gray-800">{filteredCount}</span> entries
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <Link
                    href={pageHref(Math.max(1, page - 1))}
                    aria-disabled={page === 1}
                    className={`w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 ${page === 1 ? "pointer-events-none opacity-40" : ""}`}
                  >
                    ‹
                  </Link>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .map((p, i, arr) => (
                      <span key={p} className="flex items-center gap-1">
                        {i > 0 && arr[i - 1] !== p - 1 && <span className="px-1 text-gray-400">...</span>}
                        <Link
                          href={pageHref(p)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-semibold ${
                            p === page
                              ? "bg-emerald-600 text-white shadow-2xs"
                              : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {p}
                        </Link>
                      </span>
                    ))}
                  <Link
                    href={pageHref(Math.min(totalPages, page + 1))}
                    aria-disabled={page === totalPages}
                    className={`w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 ${page === totalPages ? "pointer-events-none opacity-40" : ""}`}
                  >
                    ›
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
