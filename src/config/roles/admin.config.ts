// src/config/roles/admin.config.ts
import type { RoleConfig } from "@/types/dashboard";

export const adminConfig: RoleConfig = {
  role: "admin",
  displayName: "Admin Control Center",
  homeHref: "/admin/dashboard",
  permissions: [
    "orders:view", 
    "orders:manage", 
    "menu:manage", 
    "payments:manage", 
    "support:manage"
  ],
  nav: [
    { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
    { label: "Orders", href: "/admin/orders", icon: "ShoppingBag", permission: "orders:manage" },
    { label: "Menu", href: "/admin/menu", icon: "UtensilsCrossed", permission: "menu:manage" },
    { label: "Delivery", href: "/admin/delivery", icon: "Truck" },
    { label: "Customers", href: "/admin/customers", icon: "Users" },
    { label: "Riders", href: "/admin/riders", icon: "Truck" },
    { label: "Vendors", href: "/admin/vendors", icon: "Store" },
    { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
    { label: "Commission", href: "/admin/commission", icon: "Percent" },
    { label: "Payments", href: "/admin/payments", icon: "CreditCard", permission: "payments:manage" },
    { label: "Refunds", href: "/admin/refunds", icon: "RotateCcw" },
    { label: "Notifications", href: "/admin/notifications", icon: "Bell" },
    { label: "Support", href: "/admin/support", icon: "LifeBuoy", permission: "support:manage" },
  ],
};