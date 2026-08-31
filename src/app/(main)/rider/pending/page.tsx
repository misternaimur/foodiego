import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { Rider } from "@/models/Rider";
import RiderStatusScreen from "@/components/rider/RiderStatusScreen";

export default async function RiderPendingPage() {
  const session = await verifySession();

  if (session.role !== "rider") {
    redirect("/");
  }

  await dbConnect();
  const rider = await Rider.findOne({ userId: session.id }).lean();

  if (!rider) {
    redirect("/auth/register/rider");
  }

  if (rider.status === "approved") {
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
