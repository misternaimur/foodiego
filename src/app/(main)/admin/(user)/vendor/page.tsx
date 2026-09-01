import Link from "next/link";
import Image from "next/image";
import {
  Store,
  MapPin,
  Mail,
  Phone,
  Clock,
  UtensilsCrossed,
  Calendar,
  User,
  Inbox,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { dbConnect } from "@/lib/dbConnect";
import { verifyRole } from "@/lib/dal";
import { Restaurant, type RestaurantStatus } from "@/models/Restaurant";
import VendorModerationActions from "@/components/admin/VendorModerationActions";

export const dynamic = "force-dynamic";

type Filter = RestaurantStatus | "all";
const FILTERS: Filter[] = ["pending", "approved", "rejected", "all"];

const STATUS_BADGE: Record<RestaurantStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
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
  const filter: Filter = isFilter(sp.status) ? sp.status : "pending";
  const searchQuery = typeof sp.q === "string" ? sp.q : "";

  await dbConnect();

  const query: Record<string, unknown> = filter === "all" ? {} : { status: filter };

  if (searchQuery) {
    query.$or = [
      { restaurantName: { $regex: searchQuery, $options: "i" } },
      { ownerName: { $regex: searchQuery, $options: "i" } },
      { email: { $regex: searchQuery, $options: "i" } },
      { cuisineType: { $regex: searchQuery, $options: "i" } },
    ];
  }

  const [restaurants, pendingCount, approvedCount, rejectedCount, totalCount] =
    await Promise.all([
      Restaurant.find(query).sort({ createdAt: -1 }).lean(),
      Restaurant.countDocuments({ status: "pending" }),
      Restaurant.countDocuments({ status: "approved" }),
      Restaurant.countDocuments({ status: "rejected" }),
      Restaurant.estimatedDocumentCount(),
    ]);

  const counts: Record<Filter, number> = {
    pending: pendingCount,
    approved: approvedCount,
    rejected: rejectedCount,
    all: totalCount,
  };

  return (
    <main className="flex-1 bg-gray-50/60 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6">
          <Link
            href="/admin"
            className="text-xs font-semibold text-emerald-600 hover:underline"
          >
            &larr; Admin
          </Link>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Restaurant Applications
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review partner applications and approve or reject them. Approved
            restaurants gain access to the merchant dashboard.
          </p>
        </div>

        {/* Main Card Container styled like the reference */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs">
          
          {/* Tabs & Search Filter Bar */}
          <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Filter tabs */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs font-semibold text-gray-500">
              {FILTERS.map((f) => {
                const isActive = filter === f;
                return (
                  <Link
                    key={f}
                    href={f === "pending" ? "/admin/vendors" : `/admin/vendors?status=${f}${searchQuery ? `&q=${searchQuery}` : ""}`}
                    className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 capitalize ${
                      isActive 
                        ? "bg-gray-100 text-gray-900 font-bold" 
                        : "hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <span>{f}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                      isActive ? "bg-gray-200/80 text-gray-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {counts[f]}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Search Bar Form */}
            <form method="GET" className="flex items-center gap-3">
              {filter !== "pending" && <input type="hidden" name="status" value={filter} />}
              <div className="relative w-full sm:w-64">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search size={15} />
                </span>
                <input 
                  type="text"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Search applications..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0d9488] transition-all"
                />
              </div>
              <button type="submit" className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold transition-all">
                <SlidersHorizontal size={14} className="text-gray-500" />
                <span>Filter</span>
              </button>
            </form>

          </div>

          {restaurants.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center">
              <Inbox className="text-gray-300" size={40} />
              <p className="mt-3 text-sm font-semibold text-gray-700">
                No {filter === "all" ? "" : filter} applications found
              </p>
              <p className="text-xs text-gray-400">
                New restaurant applications will appear here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {restaurants.map((r) => {
                const id = String(r._id);
                const status = r.status as RestaurantStatus;
                return (
                  <li
                    key={id}
                    className="p-5 hover:bg-gray-50/60 transition-colors"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-4">
                        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-gray-200/70">
                          {r.logoUrl ? (
                            <Image
                              src={r.logoUrl}
                              alt={r.restaurantName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Store size={22} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-base font-bold text-gray-900">
                              {r.restaurantName}
                            </h2>
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold capitalize ${STATUS_BADGE[status]}`}
                            >
                              {status}
                            </span>
                          </div>
                          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                            <User size={12} /> {r.ownerName}
                          </p>
                          {r.description && (
                            <p className="mt-2 max-w-xl text-sm text-gray-600">
                              {r.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <VendorModerationActions restaurantId={id} status={status} />
                    </div>

                    <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 border-t border-gray-100 pt-4 text-xs sm:grid-cols-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={13} className="shrink-0 text-gray-400" />
                        <span className="truncate">{r.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={13} className="shrink-0 text-gray-400" />
                        <span>{r.phone || "—"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={13} className="shrink-0 text-gray-400" />
                        <span className="truncate">{r.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <UtensilsCrossed size={13} className="shrink-0 text-gray-400" />
                        <span>{r.cuisineType || "—"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={13} className="shrink-0 text-gray-400" />
                        <span>
                          {r.openingTime || "—"} – {r.closingTime || "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={13} className="shrink-0 text-gray-400" />
                        <span>
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </span>
                      </div>
                    </dl>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Footer Pagination Section */}
          <div className="p-4 px-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div>
              Showing <span className="font-semibold text-gray-800">1</span> to <span className="font-semibold text-gray-800">{restaurants.length}</span> of <span className="font-semibold text-gray-800">{counts[filter]}</span> applications
            </div>

            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40" disabled>
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
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}