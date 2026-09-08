import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";

export default async function AccountPage() {
  const session = await verifySession();

  if (session.role === "admin") redirect("/admin");
  if (session.role === "restaurant") redirect("/vendor");
  if (session.role === "rider") redirect("/rider");

  redirect("/client/dashboard");
}
