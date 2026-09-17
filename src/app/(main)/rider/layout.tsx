import DashboardShell from "@/components/dashboard/DashboardShell";
import { getRoleConfig } from "@/config";
import { verifyRole } from "@/lib/dal";
import { getRiderBadgeCounts } from "@/services/rider.service";

export default async function RiderLayout({ children }: { children: React.ReactNode }) {
  await verifyRole("rider");
  const config = getRoleConfig("rider");
  const badgeCounts = await getRiderBadgeCounts();

  return <DashboardShell config={config} badgeCounts={badgeCounts}>{children}</DashboardShell>;
}