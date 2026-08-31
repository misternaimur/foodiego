import Link from "next/link";
import Image from "next/image";
import {
  User,
  MapPin,
  Mail,
  Phone,
  Bike,
  IdCard,
  Hash,
  Calendar,
  Inbox,
} from "lucide-react";
import { dbConnect } from "@/lib/dbConnect";
import { verifyRole } from "@/lib/dal";
import { Rider, type RiderStatus } from "@/models/Rider";
import RiderModerationActions from "@/components/admin/RiderModerationActions";

export const dynamic = "force-dynamic";

type Filter = RiderStatus | "all";
const FILTERS: Filter[] = ["pending", "approved", "rejected", "all"];

const STATUS_BADGE: Record<RiderStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

function isFilter(value: string | string[] | undefined): value is Filter {
  return typeof value === "string" && (FILTERS as string[]).includes(value);
}

export default async function AdminRidersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await verifyRole("admin");

  const sp = await searchParams;
  const filter: Filter = isFilter(sp.status) ? sp.status : "pending";

  await dbConnect();

  const [riders, pendingCount, approvedCount, rejectedCount, totalCount] = await Promise.all([
    Rider.find(filter === "all" ? {} : { status: filter })
      .sort({ createdAt: -1 })
      .lean(),
    Rider.countDocuments({ status: "pending" }),
    Rider.countDocuments({ status: "approved" }),
    Rider.countDocuments({ status: "rejected" }),
    Rider.estimatedDocumentCount(),
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
          <Link href="/admin" className="text-xs font-semibold text-emerald-600 hover:underline">
            &larr; Admin
          </Link>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Rider Applications
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review rider applications and approve or reject them. Approved riders gain access to the
            rider dashboard.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Link
              key={f}
              href={f === "pending" ? "/admin/riders" : `/admin/riders?status=${f}`}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors ${
                filter === f
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f}
              <span
                className={`rounded-full px-1.5 text-[10px] font-bold ${
                  filter === f ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {counts[f]}
              </span>
            </Link>
          ))}
        </div>

        {riders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
            <Inbox className="text-gray-300" size={40} />
            <p className="mt-3 text-sm font-semibold text-gray-700">
              No {filter === "all" ? "" : filter} applications
            </p>
            <p className="text-xs text-gray-400">New rider applications will appear here.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {riders.map((r) => {
              const id = String(r._id);
              const status = r.status as RiderStatus;
              return (
                <li key={id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-gray-200/70">
                        {r.photoUrl ? (
                          <Image src={r.photoUrl} alt={r.fullName} fill className="object-cover" />
                        ) : (
                          <User size={22} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-bold text-gray-900">{r.fullName}</h2>
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold capitalize ${STATUS_BADGE[status]}`}
                          >
                            {status}
                          </span>
                        </div>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs capitalize text-gray-500">
                          <Bike size={12} /> {r.vehicleType}
                        </p>
                      </div>
                    </div>

                    <RiderModerationActions riderId={id} status={status} />
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
                      <span className="truncate">
                        {r.address}
                        {r.city ? `, ${r.city}` : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <IdCard size={13} className="shrink-0 text-gray-400" />
                      <span>Licence: {r.licenseNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Hash size={13} className="shrink-0 text-gray-400" />
                      <span>{r.vehicleNumber || "No plate"}</span>
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
      </div>
    </main>
  );
}
