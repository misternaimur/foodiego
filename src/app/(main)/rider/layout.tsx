import type { ReactNode } from "react";
import { Ban } from "lucide-react";
import { verifyRole } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { Rider } from "@/models/Rider";

export default async function RiderLayout({ children }: { children: ReactNode }) {
  const session = await verifyRole("rider");

  await dbConnect();
  const rider = await Rider.findOne({ userId: session.id }).select("status").lean();

  if (rider?.status === "suspended") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4">
        <div className="w-full max-w-md rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <Ban size={26} />
          </div>
          <h1 className="mt-5 text-xl font-bold text-gray-900">Your account is suspended</h1>
          <p className="mt-2 text-sm text-gray-500">
            Foodiego has suspended your rider account. Contact support if you believe this is a mistake.
          </p>
          <a
            href="mailto:support@foodiego.com"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800"
          >
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  return children;
}