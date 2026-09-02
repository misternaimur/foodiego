import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getOrCreateRiderProfile } from "@/lib/profile";
import RiderDashboard from "@/components/rider/RiderDashboard";

export default async function RiderPage() {
  const session = await verifySession();

  if (session.role !== "rider") {
    redirect("/");
  }

  // Ensure a rider profile exists (auto-provisioned if missing) so a logged-in
  // rider always lands on the dashboard instead of the registration form.
  const rider = await getOrCreateRiderProfile(session);

  // TEMP: Admin approval disabled — riders can use the dashboard without being approved.
  // Re-enable the admin-approval gate by restoring the status check here and in
  // src/app/(main)/rider/pending/page.tsx.

  return <RiderDashboard riderId={rider._id.toString()} />;
}


