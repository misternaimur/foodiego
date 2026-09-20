"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// UPDATE (responsive fix): VendorSidebar was "hidden ... lg:flex" with no
// mobile equivalent at all — below 1024px wide, a vendor had literally no
// way to reach Orders, Menu Management, Sales & Analytics, Payments &
// Earnings, Delivery Management, Reviews & Ratings, or Support Tickets
// (the header's avatar dropdown only ever had Home/Profile/Cart/Dashboard/
// Settings/Logout). This tiny context lets the header's new hamburger
// button (VendorHeader.tsx) and the sidebar's new mobile drawer
// (VendorSidebar.tsx) share one open/close state, the same pattern
// RiderShell.tsx already uses for the rider dashboard.

interface VendorMobileNavValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const VendorMobileNavContext = createContext<VendorMobileNavValue | null>(null);

export function VendorMobileNavProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <VendorMobileNavContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </VendorMobileNavContext.Provider>
  );
}

export function useVendorMobileNav() {
  const ctx = useContext(VendorMobileNavContext);
  if (!ctx) throw new Error("useVendorMobileNav must be used within VendorMobileNavProvider");
  return ctx;
}
