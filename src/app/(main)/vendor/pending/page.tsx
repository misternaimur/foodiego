import { redirect } from "next/navigation";
import { verifyRole } from "@/lib/dal";
import { getOrCreateRestaurantProfile } from "@/lib/profile";
import RestaurantStatusScreen from "@/components/vendor/RestaurantStatusScreen";

export default async function VendorPendingPage() {
  const session = await verifyRole("restaurant");

  const restaurant = await getOrCreateRestaurantProfile(session);

  if (!restaurant || restaurant.status === "approved") {
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
