import Link from "next/link";
import { Store, Bike, Clock, CheckCircle2, Users, ChevronRight } from "lucide-react";
import { dbConnect } from "@/lib/dbConnect";
import { verifyRole } from "@/lib/dal";
import { Restaurant } from "@/models/Restaurant";
import { Rider } from "@/models/Rider";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await verifyRole("admin");
  await dbConnect();

  const [
    restaurantPending,
    restaurantApproved,
    riderPending,
    riderApproved,
    userCount,
  ] = await Promise.all([
    Restaurant.countDocuments({ status: "pending" }),
    Restaurant.countDocuments({ status: "approved" }),
    Rider.countDocuments({ status: "pending" }),
    Rider.countDocuments({ status: "approved" }),
    User.estimatedDocumentCount(),
  ]);

  const stats = [
    {
      label: "Restaurants pending",
      value: restaurantPending,
      icon: Clock,
      tone: "text-amber-600 bg-amber-50",
    },
    {
      label: "Riders pending",
      value: riderPending,
      icon: Clock,
      tone: "text-amber-600 bg-amber-50",
    },
    {
      label: "Active partners",
      value: restaurantApproved + riderApproved,
      icon: CheckCircle2,
      tone: "text-emerald-600 bg-emerald-50",
    },
    { label: "Total users", value: userCount, icon: Users, tone: "text-gray-600 bg-gray-100" },
  ];

  const queues = [
    {
      href: "/admin/vendors",
      icon: Store,
      title: "Restaurant Applications",
      pending: restaurantPending,
      noun: "application",
    },
    {
      href: "/admin/riders",
      icon: Bike,
      title: "Rider Applications",
      pending: riderPending,
      noun: "application",
    },
  ];

  return (
    <main className="flex-1 bg-gray-50/60 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">Overview of the Foodiego marketplace.</p>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${s.tone}`}>
                <s.icon size={18} />
              </div>
              <p className="mt-3 text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs font-medium text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          {queues.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <q.icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{q.title}</p>
                  <p className="text-xs text-gray-500">
                    {q.pending > 0
                      ? `${q.pending} ${q.noun}${q.pending === 1 ? "" : "s"} waiting for review`
                      : "No applications waiting"}
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
