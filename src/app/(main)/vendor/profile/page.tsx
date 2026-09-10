import RestaurantProfile from "@/app/(main)/vendor/components/RestaurantProfile";

export const metadata = {
  title: "Restaurant Profile | FoodieGo Vendor",
  description: "Manage your restaurant details, delivery settings, and operating hours",
};

export default function VendorProfilePage() {
  return <RestaurantProfile />;
}
