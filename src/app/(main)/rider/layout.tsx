import type { ReactNode } from "react";
import { verifyRole } from "@/lib/dal";

export default async function RiderLayout({ children }: { children: ReactNode }) {
  await verifyRole("rider");

  return children;
}