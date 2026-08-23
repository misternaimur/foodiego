import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";

export default async function AdminPage() {
  const session = await verifySession();

  if (session.role !== "admin") {
    redirect("/");
  }

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900">Admin dashboard</h1>
      <p className="mt-2 text-sm text-gray-500">
        Signed in as {session.name}. The admin role is fixed and cannot be selected during
        registration &mdash; admin accounts are provisioned directly, e.g. via{" "}
        <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">npm run seed:admin</code>.
      </p>
    </main>
  );
}
