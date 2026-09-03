import type { Metadata } from "next";
import { Navbar } from "@/components/Share/Navbar";
import Footer from "@/components/Share/Footer";
import { getOptionalSession } from "@/lib/dal";

export const metadata: Metadata = {
  title: "Foodiego",
  description: "Smarter food delivery",
};

// Nested layout: the root layout (src/app/layout.tsx) already renders <html>,
// <body> and <Providers>. A nested layout must only add its own UI chrome,
// never another <html>/<body> — doing so breaks hydration.
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getOptionalSession();

  return (
    <>
      <Navbar user={session ? { name: session.name, role: session.role } : null} />
      {children}
      <Footer />
    </>
  );
}
