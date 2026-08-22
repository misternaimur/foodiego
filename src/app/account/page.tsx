import { verifySession } from "@/lib/dal";
import { SignOutButton } from "@/components/SignOutButton";

export default async function AccountPage() {
  const session = await verifySession();

  return (
    <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-16">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Hi, {session.name}</h1>
        <p className="text-sm text-gray-500 mb-6">
          You&apos;re signed in as{" "}
          <span className="font-medium capitalize text-gray-800">{session.role}</span>.
        </p>

        <SignOutButton />
      </div>
    </main>
  );
}
