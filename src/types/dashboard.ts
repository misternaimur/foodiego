// src/types/dashboard.ts
export type Role = "client" | "vendor" | "rider" | "admin";

export type Permission =
  | "orders:view"
  | "orders:manage"
  | "menu:manage"
  | "deliveries:accept"
  | "earnings:view"
  | "payments:manage"
  | "support:manage";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  permission?: Permission;      // hide item if user lacks this
  badgeKey?: string;            // e.g. "pendingOrders" -> dynamic count
}

export interface RoleConfig {
  role: Role;
  displayName: string;          // "Vendor Dashboard", "My Account", etc.
  homeHref: string;
  nav: NavItem[];
  permissions: Permission[];
}