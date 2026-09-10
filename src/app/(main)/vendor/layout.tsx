import type { ReactNode } from "react";
import { verifyRole } from "@/lib/dal";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorHeader from "@/components/vendor/VendorHeader";

export default async function VendorLayout({ children }: { children: ReactNode }) {
  const session = await verifyRole("restaurant");

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans flex">
      <VendorSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <VendorHeader
          userName={session.name}
          userEmail={session.email}
        />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
