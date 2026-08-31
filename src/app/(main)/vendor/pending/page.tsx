import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { Restaurant } from "@/models/Restaurant";
import RestaurantStatusScreen from "@/components/vendor/RestaurantStatusScreen";

export default async function VendorPendingPage() {
  const session = await verifySession();

  if (session.role !== "restaurant") {
    redirect("/");
  }

  await dbConnect();
  const restaurant = await Restaurant.findOne({ userId: session.id }).lean();

  if (!restaurant) {
    redirect("/auth/register/restaurant");
  }

  if (restaurant.status === "approved") {
    redirect("/vendor");
  }

  return (
    <RestaurantStatusScreen
      status={restaurant.status}
      restaurantName={restaurant.restaurantName}
      ownerName={restaurant.ownerName}
      address={restaurant.address}
      logoUrl={restaurant.logoUrl}
      submittedAt={restaurant.createdAt.toISOString()}
    />
  );
}
