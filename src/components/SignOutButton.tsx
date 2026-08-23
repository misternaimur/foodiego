"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { logout } from "@/app/(public)/actions/auth";

export function SignOutButton() {
  async function handleSignOut() {
    await signOut(auth);
    await logout();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      Sign out
    </button>
  );
}
