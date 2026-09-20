import AdminHeader from "@/components/admin/header";
import AdminSidebar from "@/components/admin/sider";
import { AdminMobileNavProvider } from "@/components/admin/AdminMobileNavContext";
import { verifyRole } from "@/lib/dal";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifyRole("admin");

  return (
    <AdminMobileNavProvider>
      <div className="min-h-screen bg-[#f9fafb] flex font-sans overflow-hidden">

        {/* UPDATE (responsive fix): AdminSidebar now renders its own
            desktop <aside> (still "hidden md:flex") AND a mobile drawer,
            instead of this wrapper hiding it outright below md with
            nothing to replace it. */}
        <AdminSidebar />

        {/* Main Wrapper Area  */}
        <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">

          {/* 2. Fixed Header  */}
          <div className="sticky top-0 z-40 w-full shrink-0">
            <AdminHeader adminName={session.name} />
          </div>

          {/* 3. Scrollable Main Content */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#f9fafb]">
            {children}
          </main>
        </div>
      </div>
    </AdminMobileNavProvider>
  );
}