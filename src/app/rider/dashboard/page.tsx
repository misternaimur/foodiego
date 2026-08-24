import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";

export default async function RiderDashboardPage() {
  const session = await verifySession();

  if (session.role !== "rider") {
    redirect("/");
  }

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900">Rider dashboard</h1>
      <p className="mt-2 text-sm text-gray-500">Welcome, {session.name}.</p>
    </main>
  );
}
