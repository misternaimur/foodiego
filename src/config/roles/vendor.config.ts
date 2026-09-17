// src/config/roles/vendor.config.ts
import type { RoleConfig } from "@/types/dashboard";

export const vendorConfig: RoleConfig = {
  role: "vendor",
  displayName: "Vendor Dashboard",
  homeHref: "/vendor",
  permissions: ["orders:view", "orders:manage", "menu:manage", "payments:manage"],
  nav: [
    { label: "Dashboard", href: "/vendor", icon: "LayoutDashboard" },
    { label: "Menu", href: "/vendor/menu", icon: "UtensilsCrossed", permission: "menu:manage" },
    { label: "Orders", href: "/vendor/orders", icon: "ClipboardList", permission: "orders:manage", badgeKey: "activeOrders" },
    { label: "Payments", href: "/vendor/payments", icon: "Wallet", permission: "payments:manage" },
    { label: "Reviews", href: "/vendor/reviews", icon: "Star" },
    { label: "Profile", href: "/vendor/profile", icon: "Store" }, // প্রোফাইলের জন্য উপযুক্ত আইকন
    { label: "Support", href: "/vendor/support", icon: "LifeBuoy" },
    { label: "Settings", href: "/vendor/settings", icon: "Settings" },
  ],
};