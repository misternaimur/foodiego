import type { ReactNode } from "react";
import { Ban, Clock, XCircle, Mail } from "lucide-react";
import { verifyRole } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { Restaurant, type RestaurantStatus } from "@/models/Restaurant";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorHeader from "@/components/vendor/VendorHeader";
import { VendorMobileNavProvider } from "@/components/vendor/VendorMobileNavContext";
import Interactive3DBackground from "@/app/(main)/vendor/components/Interactive3DBackground";

// UPDATE (admin-approval fix): the standalone /vendor/pending route + its
// RestaurantStatusScreen component were removed in an earlier redesign, so
// there was nowhere to send a restaurant that isn't approved yet once the
// admin-approval gate got re-enabled (see src/app/(public)/actions/restaurant.ts).
// This inline screen replaces it, covering "pending" and "rejected" the same
// way the existing "suspended" screen below already did.
const STATUS_COPY: Partial<Record<RestaurantStatus, { icon: typeof Clock; title: string; body: string; tone: string }>> = {
  pending: {
    icon: Clock,
    title: "Your application is under review",
    body: "Thanks for applying to become a Foodiego restaurant partner. Our team is reviewing your details and will notify you once a decision is made.",
    tone: "amber",
  },
  rejected: {
    icon: XCircle,
    title: "Your application wasn't approved",
    body: "After review, we're unable to approve this application right now. If you believe this is a mistake, please reach out to our partner support team.",
    tone: "rose",
  },
  suspended: {
    icon: Ban,
    title: "Your account is suspended",
    body: "Foodiego has suspended this restaurant's access. Contact support if you believe this is a mistake.",
    tone: "rose",
  },
};

export default async function VendorLayout({ children }: { children: ReactNode }) {
  const session = await verifyRole("restaurant");

  await dbConnect();
  const restaurant = await Restaurant.findOne({ userId: session.id }).select("status").lean();

  const copy = restaurant?.status ? STATUS_COPY[restaurant.status] : undefined;

  if (copy) {
    const Icon = copy.icon;
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-4">
        <div className={`w-full max-w-md rounded-3xl border p-8 text-center shadow-lg ${
          copy.tone === "rose" ? "border-rose-100 bg-white" : "border-amber-100 bg-white"
        }`}>
          <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
            copy.tone === "rose" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
          }`}>
            <Icon size={26} />
          </div>
          <h1 className="mt-5 text-xl font-bold text-gray-900">{copy.title}</h1>
          <p className="mt-2 text-sm text-gray-500">{copy.body}</p>
          <a
            href="mailto:support@foodiego.com"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#15462D] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0e3320]"
          >
            <Mail size={15} /> Contact Support
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] font-sans">
      <Interactive3DBackground />
      <VendorMobileNavProvider>
        <div className="relative z-10 flex h-screen min-h-0">
          <VendorSidebar />
          <div className="flex min-w-0 flex-1 flex-col min-h-0">
            <VendorHeader userName={session.name} userEmail={session.email} />
            <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">{children}</main>
          </div>
        </div>
      </VendorMobileNavProvider>
    </div>
  );
}
