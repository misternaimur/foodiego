import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { Rider } from "@/models/Rider";
import RiderDashboard from "@/components/rider/RiderDashboard";

export default async function RiderPage() {
  const session = await verifySession();

  if (session.role !== "rider") {
    redirect("/");
  }

  await dbConnect();
  const rider = await Rider.findOne({ userId: session.id }).lean();

  if (!rider) {
    redirect("/auth/register/rider");
  }

  if (rider.status !== "approved") {
    redirect("/rider/pending");
  }

  return <RiderDashboard />;
}
