import AdminHeader from "@/components/admin/header";
import AdminSidebar from "@/components/admin/sider";
import { verifyRole } from "@/lib/dal";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await verifyRole("admin");

  return (
    <div className="min-h-screen bg-[#f9fafb] flex font-sans overflow-hidden">
      
      {/* 1. Fixed Sidebar  */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 hidden md:block">
        <AdminSidebar />
      </aside>

      {/* Main Wrapper Area  */}
      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        
        {/* 2. Fixed Header  */}
        <div className="sticky top-0 z-40 w-full shrink-0">
          <AdminHeader />
        </div>

        {/* 3. Scrollable Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#f9fafb]">
          {children}
        </main>
      </div>
    </div>
  );
}