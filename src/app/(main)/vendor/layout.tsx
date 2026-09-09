import type { ReactNode } from "react";
import { verifyRole } from "@/lib/dal";

export default async function VendorLayout({ children }: { children: ReactNode }) {
  await verifyRole("restaurant");

  return children;
}