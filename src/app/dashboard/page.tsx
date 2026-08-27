import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";

export default async function DashboardPage() {
  const session = await verifySession();

  if (session.role === "restaurant") {
    redirect("/dashboard/restaurant");
  } else if (session.role === "rider") {
    redirect("/dashboard/rider");
  } else {
    redirect("/");
  }
}

