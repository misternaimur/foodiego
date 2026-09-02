import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getOrCreateRestaurantProfile } from "@/lib/profile";
import RestaurantDashboard from "@/components/vendor/RestaurantDashboard";

export default async function VendorPage() {
  const session = await verifySession();

  if (session.role !== "restaurant") {
    redirect("/");
  }

  // Ensure a restaurant profile exists (auto-provisioned if missing) so a
  // logged-in restaurant always lands on the dashboard instead of the
  // registration form.
  await getOrCreateRestaurantProfile(session);

  // TEMP: Admin approval disabled — restaurants can use the dashboard without
  // being approved. Re-enable the admin-approval gate by restoring the status
  // check here and in src/app/(main)/vendor/pending/page.tsx.

  return <RestaurantDashboard />;
}
