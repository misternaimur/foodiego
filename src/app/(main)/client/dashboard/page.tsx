import { verifySession } from "@/lib/dal";
import ClientDashboard from "@/components/ClientDashboard";

export const metadata = {
  title: "Dashboard · Foodiego",
};

export default async function ClientDashboardPage() {
  const session = await verifySession();

  return (
    <ClientDashboard
      name={session.name}
      role={session.role}
      email={session.email}
    />
  );
}