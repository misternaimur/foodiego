import type { Permission, RoleConfig } from "@/types/dashboard";

export function can(config: RoleConfig, permission: Permission): boolean {
  return config.permissions.includes(permission);
}