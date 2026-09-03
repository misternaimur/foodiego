import Link from "next/link";
import Image from "next/image";
import {
  Store,
  MapPin,
  Mail,
  Phone,
  Clock,
  Calendar,
  User,
  Inbox,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
  UserPlus,
  TrendingUp,
  AlertCircle,
  Ban,
  FileText,
} from "lucide-react";
import { dbConnect } from "@/lib/dbConnect";
import { verifyRole } from "@/lib/dal";
import { Restaurant, type RestaurantStatus } from "@/models/Restaurant";
import VendorModerationActions from "@/components/admin/VendorModerationActions";

export const dynamic = "force-dynamic";

type Filter = RestaurantStatus | "all" | "suspended";
const FILTERS: Filter[] = ["all", "pending", "approved", "suspended"];

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  suspended: "bg-rose-50 text-rose-700 border-rose-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function isFilter(value: string | string[] | undefined): value is Filter {
  return typeof value === "string" && (FILTERS as string[]).includes(value);
}

export default async function AdminVendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await verifyRole("admin");

  const sp = await searchParams;
  const filter: Filter = isFilter(sp.status) ? sp.status : "all";
  const searchQuery = typeof sp.q === "string" ? sp.q : "";

  await dbConnect();

  const query: Record<string, unknown> = {};
  if (filter === "pending") query.status = "pending";
  if (filter === "approved") query.status = "approved";
  if (filter === "suspended") query.status = "suspended";

  if (searchQuery) {
    query.$or = [
      { restaurantName: { $regex: searchQuery, $options: "i" } },
      { ownerName: { $regex: searchQuery, $options: "i" } },
      { email: { $regex: searchQuery, $options: "i" } },
      { cuisineType: { $regex: searchQuery, $options: "i" } },
    ];
  }

  const [restaurants, pendingCount, approvedCount, suspendedCount, totalCount] =
    await Promise.all([
      Restaurant.find(query).sort({ createdAt: -1 }).lean(),
      Restaurant.countDocuments({ status: "pending" } as never),
      Restaurant.countDocuments({ status: "approved" } as never),
      Restaurant.countDocuments({ status: "suspended" } as never),
      Restaurant.estimatedDocumentCount(),
    ]);

  const counts: Record<Filter, number> = {
    all: totalCount,
    pending: pendingCount,
    approved: approvedCount,
    suspended: suspendedCount,
    rejected: 0,
  };

  return (
    <main className="flex-1 bg-gray-50/60 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        
        {/* Top Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Vendors & Restaurants
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage partner relationships, monitor status, and review applications.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold shadow-2xs transition-all">
              <Download size={15} className="text-gray-500" />
              <span>Export List</span>
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0d9488] hover:bg-[#0b7c72] text-white rounded-xl text-xs font-semibold shadow-2xs transition-all">
              <UserPlus size={15} />
              <span>Invite Vendor</span>
            </button>
          </div>
        </div>

        {/* Top Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                TOTAL ACTIVE
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Store size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-gray-900">
                {approvedCount.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp size={13} /> +12%
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                PENDING APPROVAL
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <FileText size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-gray-900">
                {pendingCount}
              </span>
              <span className="text-xs font-medium text-gray-400">
                Requires review
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                SUSPENDED
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Ban size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-gray-900">
                {suspendedCount}
              </span>
              <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                <AlertCircle size={13} /> Action needed
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                WEEKLY VOLUME
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-gray-900">
                45.2K
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp size={13} /> +5.4%
              </span>
            </div>
          </div>

        </div>

        {/* Main Content Card Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          
          {/* Tabs & Search Filter Bar */}
          <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs font-semibold text-gray-500">
              {FILTERS.map((f) => {
                const isActive = filter === f;
                return (
                  <Link
                    key={f}
                    href={f === "all" ? "/admin/vendors" : `/admin/vendors?status=${f}${searchQuery ? `&q=${searchQuery}` : ""}`}
                    className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 capitalize ${
                      isActive 
                        ? "bg-gray-100 text-gray-900 font-bold" 
                        : "hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <span>{f === "approved" ? "Active" : f}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                      isActive ? "bg-gray-200/80 text-gray-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {f === "approved" ? counts["approved"] : counts[f]}
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
                  placeholder="Filter current view..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0d9488] transition-all"
                />
              </div>
              <button type="button" className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold transition-all">
                <SlidersHorizontal size={14} className="text-gray-500" />
                <span>Columns</span>
              </button>
            </form>

          </div>

          {restaurants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Inbox className="text-gray-300" size={42} />
              <p className="mt-3 text-sm font-semibold text-gray-700">
                No {filter === "all" ? "" : filter} vendors found
              </p>
              <p className="text-xs text-gray-400">
                Try adjusting your search or filter parameters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase bg-gray-50/50">
                    <th className="py-3.5 px-6">Restaurant</th>
                    <th className="py-3.5 px-6">Owner</th>
                    <th className="py-3.5 px-6">Location</th>
                    <th className="py-3.5 px-6">Orders (MTD)</th>
                    <th className="py-3.5 px-6">Revenue (MTD)</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {restaurants.map((r) => {
                    const id = String(r._id);
                    const rawStatus = (r.status as string) || "pending";
                    const displayStatus = rawStatus === "approved" ? "active" : rawStatus;

                    return (
                      <tr key={id} className="hover:bg-gray-50/60 transition-colors">
                        
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-gray-200/70">
                              {r.logoUrl ? (
                                <Image
                                  src={r.logoUrl as string}
                                  alt={r.restaurantName as string}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <Store size={18} />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-gray-900 truncate">
                                {r.restaurantName}
                              </p>
                              <p className="text-[11px] text-gray-400 truncate">
                                {r.cuisineType || "Restaurant & Cafe"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <p className="font-semibold text-gray-800">{r.ownerName}</p>
                          <p className="text-[11px] text-gray-400">{r.email}</p>
                        </td>

                        <td className="py-4 px-6">
                          <p className="text-gray-600">{r.address || "Downtown Metro"}</p>
                        </td>

                        <td className="py-4 px-6 font-medium text-gray-700">
                          {rawStatus === "approved" ? "1,402" : "—"}
                        </td>

                        <td className="py-4 px-6 font-semibold text-gray-900">
                          {rawStatus === "approved" ? "$24,500.00" : "—"}
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${
                              STATUS_BADGE[displayStatus] || STATUS_BADGE.pending
                            }`}
                          >
                            {displayStatus}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <VendorModerationActions restaurantId={id} status={rawStatus as RestaurantStatus} />
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer Pagination Section */}
          <div className="p-4 px-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div>
              Showing <span className="font-semibold text-gray-800">1</span> to <span className="font-semibold text-gray-800">{restaurants.length}</span> of <span className="font-semibold text-gray-800">1,297</span> entries
            </div>

            <div className="flex items-center gap-1">
              <button className="width-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40" disabled>
                <ChevronLeft size={14} />
              </button>
              <button className="w-8 h-8 rounded-xl bg-[#0d9488] text-white font-bold flex items-center justify-center shadow-2xs">
                1
              </button>
              <button className="w-8 h-8 rounded-xl border border-gray-200 hover:bg-gray-50 font-semibold text-gray-700 flex items-center justify-center">
                2
              </button>
              <button className="w-8 h-8 rounded-xl border border-gray-200 hover:bg-gray-50 font-semibold text-gray-700 flex items-center justify-center">
                3
              </button>
              <span className="px-1 text-gray-400">...</span>
              <button className="w-8 h-8 rounded-xl border border-gray-200 hover:bg-gray-50 font-semibold text-gray-700 flex items-center justify-center">
                130
              </button>
              <button className="w-8 h-8 rounded-xl border border-gray-200 hover:bg-gray-50 font-semibold text-gray-700 flex items-center justify-center">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}