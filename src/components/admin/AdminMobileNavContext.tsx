"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// UPDATE (responsive fix): AdminSidebar was "hidden md:block" with no
// mobile equivalent — below 768px wide, an admin had no way at all to
// reach Orders, Delivery, Menu, Customers, Vendors, Riders, Payments,
// Commission, Refunds, Analytics, Promotions, Reviews, Support, or
// Notifications (the header had no navigation of its own). Same
// shared-context pattern as VendorMobileNavContext.tsx.

interface AdminMobileNavValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const AdminMobileNavContext = createContext<AdminMobileNavValue | null>(null);

export function AdminMobileNavProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <AdminMobileNavContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </AdminMobileNavContext.Provider>
  );
}

export function useAdminMobileNav() {
  const ctx = useContext(AdminMobileNavContext);
  if (!ctx) throw new Error("useAdminMobileNav must be used within AdminMobileNavProvider");
  return ctx;
}
