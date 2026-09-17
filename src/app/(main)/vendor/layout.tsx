import DashboardShell from "@/components/dashboard/DashboardShell";
import { getRoleConfig } from "@/config";
import { verifyRole } from "@/lib/dal";
import { getVendorBadgeCounts } from "@/services/vendor.service";

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const session = await verifyRole("restaurant", "vendor");
  const config = getRoleConfig("vendor");
  const badgeCounts = await getVendorBadgeCounts(session.id);

  return (
    <DashboardShell config={config} badgeCounts={badgeCounts}>
      {children}
    </DashboardShell>
  );
}