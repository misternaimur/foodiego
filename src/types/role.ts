// src/types/role.ts

export type AppRole = "admin" | "client" | "vendor" | "rider";

export type ActionPermission = "create" | "read" | "update" | "delete" | "manage";

export interface Permission {
  action: ActionPermission;
  subject: string; // e.g., 'Order', 'Menu', 'Restaurant', 'User'
}

export interface RoleMetadata {
  name: AppRole;
  displayName: string;
  description: string;
  defaultRoute: string;
  permissions: Permission[];
}