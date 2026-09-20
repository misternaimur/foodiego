import Link from "next/link";
import {
  Download,
  Search,
  Inbox,
  Mail,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import { dbConnect } from "@/lib/dbConnect";
import { verifyRole } from "@/lib/dal";
import { User } from "@/models/User";
import { OrderBooking } from "@/models/OrderBooking";
import CustomerModerationActions from "@/components/admin/CustomerModerationActions";

export const dynamic = "force-dynamic";

type Filter = "all" | "active" | "suspended";
const FILTERS: Filter[] = ["all", "active", "suspended"];

function isFilter(value: string | string[] | undefined): value is Filter {
  return typeof value === "string" && (FILTERS as string[]).includes(value);
}

// UPDATE (admin-pagination fix): same fix as the vendors/riders admin
// pages — real pagination + a filter-aware total instead of "of
// {totalCount} entries" always meaning the whole customer collection.
const PAGE_SIZE = 20;

export default async function AdminCustomersPage({
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

  const query: Record<string, unknown> = { role: "customer" };
  if (filter !== "all") query.accountStatus = filter;
  if (searchQuery) {
    query.$or = [
      { name: { $regex: searchQuery, $options: "i" } },
      { email: { $regex: searchQuery, $options: "i" } },
    ];
  }

  const [customers, activeCount, suspendedCount, allCount, filteredCount, ordersByCustomer] = await Promise.all([
    User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    User.countDocuments({ role: "customer", accountStatus: { $ne: "suspended" } }),
    User.countDocuments({ role: "customer", accountStatus: "suspended" }),
    User.countDocuments({ role: "customer" }),
    User.countDocuments(query),
    OrderBooking.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: "$customerId", orders: { $sum: 1 }, spent: { $sum: "$totalAmount" } } },
    ]),
  ]);

  const statsByCustomer = new Map(
    ordersByCustomer.map((o: { _id: unknown; orders: number; spent: number }) => [String(o._id), o])
  );

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

  const counts: Record<Filter, number> = {
    all: allCount,
    active: activeCount,
    suspended: suspendedCount,
  };

  return (
    <main className="flex-1 bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customers</h1>
            <p className="mt-1 text-sm text-gray-500">Manage and monitor customer accounts and activity.</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold shadow-2xs transition-all">
            <Download size={15} className="text-gray-500" />
            <span>Export</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Customers</span>
            <p className="mt-2 text-2xl font-bold text-gray-900">{allCount.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Active</span>
            <p className="mt-2 text-2xl font-bold text-emerald-600">{activeCount.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Suspended</span>
            <p className="mt-2 text-2xl font-bold text-rose-600">{suspendedCount.toLocaleString()}</p>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          {/* Filters Bar */}
          <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 sm:gap-2 text-xs font-semibold text-gray-500">
              {FILTERS.map((f) => {
                const isActive = filter === f;
                return (
                  <Link
                    key={f}
                    href={f === "all" ? "/admin/customers" : `/admin/customers?status=${f}${searchQuery ? `&q=${searchQuery}` : ""}`}
                    className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 capitalize ${
                      isActive ? "bg-gray-100 text-gray-900 font-bold" : "hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <span>{f}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                        isActive ? "bg-gray-200/80 text-gray-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {counts[f]}
                    </span>
                  </Link>
                );
              })}
            </div>

            <form method="GET" className="flex items-center gap-3">
              {filter !== "all" && <input type="hidden" name="status" value={filter} />}
              <div className="relative flex-1 min-w-[220px] max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Search size={15} />
                </span>
                <input
                  type="text"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Search customers by name or email..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#065f46] focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Inbox className="text-gray-300" size={42} />
              <p className="mt-3 text-sm font-semibold text-gray-700">No customers found</p>
              <p className="text-xs text-gray-400">Try adjusting your search or filter parameters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/60 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-3.5">Customer</th>
                    <th className="px-6 py-3.5">Email</th>
                    <th className="px-6 py-3.5">Total Orders</th>
                    <th className="px-6 py-3.5">Total Spent</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Joined</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {customers.map((c) => {
                    const id = String(c._id);
                    const stats = statsByCustomer.get(id);
                    const status = (c.accountStatus as string) || "active";
                    const initials = (c.name || "U").charAt(0).toUpperCase();

                    return (
                      <tr key={id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                              {initials}
                            </div>
                            <span className="font-semibold text-gray-900 text-xs">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <Mail size={12} className="text-gray-400" /> {c.email}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-gray-900">
                          <span className="flex items-center gap-1.5">
                            <ShoppingBag size={12} className="text-gray-400" /> {stats?.orders ?? 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-gray-900">
                          ${(stats?.spent ?? 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          {status === "active" ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-100">
                              Suspended
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-gray-400" />
                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <CustomerModerationActions
                            userId={id}
                            accountStatus={status === "suspended" ? "suspended" : "active"}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              Showing {firstRow} to {lastRow} of {filteredCount} entries
            </span>

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
        </div>
      </div>
    </main>
  );
}
