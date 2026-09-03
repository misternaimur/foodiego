import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getOrCreateRiderProfile } from "@/lib/profile";
import RiderStatusScreen from "@/components/rider/RiderStatusScreen";

export default async function RiderPendingPage() {
  const session = await verifySession();

  if (session.role !== "rider") {
    redirect("/");
  }

  const rider = await getOrCreateRiderProfile(session);

  if (!rider || rider.status === "approved") {
    redirect("/rider");
  }

  return (
    <RiderStatusScreen
      status={rider.status}
      fullName={rider.fullName}
      city={rider.city}
      vehicleType={rider.vehicleType}
      photoUrl={rider.photoUrl}
      submittedAt={rider.createdAt.toISOString()}
    />
  );
}
