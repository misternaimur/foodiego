import Link from "next/link";
import Image from "next/image";
import {
  Bike,
  MapPin,
  Mail,
  Phone,
  IdCard,
  Star,
  Inbox,
  Search,
  Download,
  TrendingUp,
  AlertCircle,
  Ban,
  FileText,
  User,
} from "lucide-react";
import { dbConnect } from "@/lib/dbConnect";
import { verifyRole } from "@/lib/dal";
import { Rider, type RiderStatus } from "@/models/Rider";
import { OrderBooking } from "@/models/OrderBooking";
import RiderModerationActions from "@/components/admin/RiderModerationActions";
import InviteLinkButton from "@/components/admin/InviteLinkButton";
import RiderFleetMap from "@/components/admin/RiderFleetMap";

export const dynamic = "force-dynamic";

type Filter = RiderStatus | "all";
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

// UPDATE (admin-pagination fix): this page used to fetch every matching
// rider in one unpaginated query and show "of {totalCount} entries" where
// totalCount was the WHOLE rider collection, not the active filter's
// count — misleading once a status filter or search narrowed the table.
// Real pagination + a filter-aware total are added the same way as the
// vendors page (src/app/(main)/admin/(user)/vendors/page.tsx).
const PAGE_SIZE = 20;

export default async function AdminRidersPage({
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
      { fullName: { $regex: searchQuery, $options: "i" } },
      { email: { $regex: searchQuery, $options: "i" } },
      { phone: { $regex: searchQuery, $options: "i" } },
      { city: { $regex: searchQuery, $options: "i" } },
    ];
  }

  const [riders, pendingCount, approvedCount, suspendedCount, allCount, filteredCount, deliveriesByRider] =
    await Promise.all([
      Rider.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .lean(),
      Rider.countDocuments({ status: "pending" }),
      Rider.countDocuments({ status: "approved" }),
      Rider.countDocuments({ status: "suspended" }),
      Rider.estimatedDocumentCount(),
      Rider.countDocuments(query),
      OrderBooking.aggregate([
        { $match: { riderId: { $ne: null } } },
        {
          $group: {
            _id: "$riderId",
            deliveries: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] } },
          },
        },
      ]),
    ]);

  const deliveriesById = new Map(
    deliveriesByRider.map((d: { _id: unknown; deliveries: number; completed: number }) => [
      String(d._id),
      d,
    ])
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
              Riders
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage the delivery fleet, monitor status, and review applications.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/api/admin/export/riders${filter !== "all" ? `?status=${filter}` : ""}${searchQuery ? `${filter !== "all" ? "&" : "?"}q=${encodeURIComponent(searchQuery)}` : ""}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold shadow-2xs transition-all"
            >
              <Download size={15} className="text-gray-500" />
              <span>Export List</span>
            </a>
            <InviteLinkButton label="Invite Rider" path="/auth/register/rider" className="bg-[#065f46] hover:bg-[#044e38]" />
          </div>
        </div>

        {/* Top Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">TOTAL ACTIVE</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Bike size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-gray-900">{approvedCount.toLocaleString()}</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp size={13} />
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">PENDING APPROVAL</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <FileText size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-gray-900">{pendingCount}</span>
              <span className="text-xs font-medium text-gray-400">Requires review</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">SUSPENDED</span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Ban size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-gray-900">{suspendedCount}</span>
              <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                <AlertCircle size={13} /> Action needed
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">TOTAL RIDERS</span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#065f46] flex items-center justify-center">
                <User size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-gray-900">{allCount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Live Fleet Map */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">Live Fleet Map</h2>
            <p className="text-xs text-gray-400">Updates every 20 seconds</p>
          </div>
          <RiderFleetMap />
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
                    href={f === "all" ? "/admin/riders" : `/admin/riders?status=${f}${searchQuery ? `&q=${searchQuery}` : ""}`}
                    className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 capitalize ${
                      isActive ? "bg-gray-100 text-gray-900 font-bold" : "hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <span>{f === "approved" ? "Active" : f}</span>
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
              <div className="relative w-full sm:w-64">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search size={15} />
                </span>
                <input
                  type="text"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Search riders..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#065f46] transition-all"
                />
              </div>
            </form>
          </div>

          {riders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Inbox className="text-gray-300" size={42} />
              <p className="mt-3 text-sm font-semibold text-gray-700">
                No {filter === "all" ? "" : filter} riders found
              </p>
              <p className="text-xs text-gray-400">Try adjusting your search or filter parameters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase bg-gray-50/50">
                    <th className="py-3.5 px-6">Rider</th>
                    <th className="py-3.5 px-6">Contact</th>
                    <th className="py-3.5 px-6">Vehicle</th>
                    <th className="py-3.5 px-6">Deliveries</th>
                    <th className="py-3.5 px-6">Rating</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {riders.map((r) => {
                    const id = String(r._id);
                    const rawStatus = (r.status as string) || "pending";
                    const displayStatus = rawStatus === "approved" ? "active" : rawStatus;
                    const stats = deliveriesById.get(id);

                    return (
                      <tr key={id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-gray-200/70">
                              {r.photoUrl ? (
                                <Image src={r.photoUrl} alt={r.fullName} fill className="object-cover" />
                              ) : (
                                <User size={18} />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-gray-900 truncate">{r.fullName}</p>
                              <p className="flex items-center gap-1 text-[11px] text-gray-400 truncate">
                                <MapPin size={11} /> {r.city}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <p className="flex items-center gap-1.5 font-semibold text-gray-800">
                            <Phone size={11} className="text-gray-400" /> {r.phone}
                          </p>
                          <p className="flex items-center gap-1.5 text-[11px] text-gray-400">
                            <Mail size={11} /> {r.email}
                          </p>
                        </td>

                        <td className="py-4 px-6">
                          <p className="capitalize text-gray-700">{r.vehicleType}</p>
                          <p className="flex items-center gap-1 text-[11px] text-gray-400">
                            <IdCard size={11} /> {r.licenseNumber}
                          </p>
                        </td>

                        <td className="py-4 px-6 font-medium text-gray-700">
                          {stats ? `${stats.completed}/${stats.deliveries}` : "—"}
                        </td>

                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 font-semibold text-gray-800">
                            <Star size={12} className="fill-amber-400 text-amber-400" /> {r.rating?.toFixed?.(1) ?? "0.0"}
                          </span>
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
                          <RiderModerationActions riderId={id} status={rawStatus as RiderStatus} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
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
        </div>
      </div>
    </main>
  );
}
