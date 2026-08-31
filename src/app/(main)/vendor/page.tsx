import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { Restaurant } from "@/models/Restaurant";
import RestaurantDashboard from "@/components/vendor/RestaurantDashboard";

export default async function VendorPage() {
  const session = await verifySession();

  if (session.role !== "restaurant") {
    redirect("/");
  }

  await dbConnect();
  const restaurant = await Restaurant.findOne({ userId: session.id }).lean();

  if (!restaurant) {
    redirect("/auth/register/restaurant");
  }

  if (restaurant.status !== "approved") {
    redirect("/vendor/pending");
  }

  return <RestaurantDashboard />;
}
