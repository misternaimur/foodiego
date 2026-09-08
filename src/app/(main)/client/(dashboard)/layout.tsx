import type { ReactNode } from "react";
import { verifyRole } from "@/lib/dal";
import ClientDashboardShell from "@/components/client/ClientDashboardShell";

export default async function ClientDashboardLayout({ children }: { children: ReactNode }) {
  const session = await verifyRole("customer");

  return (
    <ClientDashboardShell user={{ name: session.name, email: session.email }}>
      {children}
    </ClientDashboardShell>
  );
}