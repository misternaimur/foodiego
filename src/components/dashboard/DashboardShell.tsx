// src/components/dashboard/DashboardShell.tsx
import type { RoleConfig } from "@/types/dashboard";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

interface DashboardShellProps {
  config: RoleConfig;
  badgeCounts?: Record<string, number>;
  children: React.ReactNode;
}

export default function DashboardShell({ config, badgeCounts, children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-[#EDEFF1]">
      {/* Full-screen wrapper layout without framed margins */}
      <div className="flex w-full min-h-screen overflow-hidden bg-black">
        <DashboardSidebar config={config} badgeCounts={badgeCounts} />
        <main className="flex-1 overflow-y-auto bg-white p-6 md:p-10 rounded-l-[28px] my-1 mr-1">
          {children}
        </main>
      </div>
    </div>
  );
}