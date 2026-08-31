import { verifyRole } from "@/lib/dal";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await verifyRole("admin");

  return <>{children}</>;
}
