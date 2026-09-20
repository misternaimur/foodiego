import { redirect } from "next/navigation";
import { verifyRole } from "@/lib/dal";
import { getOrCreateRiderProfile } from "@/lib/profile";
import RiderDashboard from "@/components/rider/RiderDashboard";

export default async function RiderPage() {
  const session = await verifyRole("rider");

  // Ensure a rider profile exists (auto-provisioned if missing) so a logged-in
  // rider always lands on the dashboard instead of the registration form.
  const rider = await getOrCreateRiderProfile(session);

  // UPDATE (admin-approval fix): re-enabled. A rider who applied through the
  // dedicated registration form (src/app/(public)/actions/rider.ts) now
  // starts "pending" and must be approved from /admin/riders before reaching
  // this dashboard — see src/app/(main)/rider/pending/page.tsx for the
  // status screen shown while waiting (or if rejected). "suspended" is
  // handled separately, by the layout (src/app/(main)/rider/layout.tsx).
  if (rider && rider.status !== "approved" && rider.status !== "suspended") {
    redirect("/rider/pending");
  }

  return <RiderDashboard />;
}


