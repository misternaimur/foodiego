import type { ReactNode } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getRoleConfig } from "@/config";
import { verifyRole } from "@/lib/dal";

interface ClientDashboardLayoutProps {
  children: ReactNode;
}

export default async function ClientDashboardLayout({ children }: ClientDashboardLayoutProps) {
  await verifyRole("customer", "client");
  const config = getRoleConfig("client");

  return (
    <DashboardShell config={config}>
      {children}
    </DashboardShell>
  );
}