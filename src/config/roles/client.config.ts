// src/config/roles/client.config.ts
import type { RoleConfig } from "@/types/dashboard";

export const clientConfig: RoleConfig = {
  role: "client",
  displayName: "My Account",
  homeHref: "/client",
  permissions: ["orders:view"],
  nav: [
    { label: "Dashboard", href: "/client", icon: "LayoutDashboard" },
    { label: "Orders", href: "/client/orders", icon: "ClipboardList", permission: "orders:view" },
    { label: "Addresses", href: "/client/addresses", icon: "MapPin" },
    { label: "Favorites", href: "/client/favorites", icon: "Heart" },
    { label: "Profile", href: "/client/profile", icon: "User" },
  ],
}