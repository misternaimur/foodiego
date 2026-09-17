// src/config/roles/rider.config.ts
import type { RoleConfig } from "@/types/dashboard";

export const riderConfig: RoleConfig = {
  role: "rider",
  displayName: "Rider Dashboard",
  homeHref: "/rider",
  permissions: ["deliveries:accept", "earnings:view"],
  nav: [
    { label: "Dashboard", href: "/rider", icon: "LayoutDashboard" },
    { label: "Deliveries", href: "/rider/deliveries", icon: "Bike", permission: "deliveries:accept", badgeKey: "activeDeliveries" },
    { label: "Earnings", href: "/rider/earnings", icon: "Wallet", permission: "earnings:view" },
    { label: "Shift History", href: "/rider/shift-history", icon: "History" },
    { label: "Settings", href: "/rider/settings", icon: "Settings" },
  ],
};