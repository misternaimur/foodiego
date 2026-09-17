// src/config/index.ts
import type { Role, RoleConfig } from "@/types/dashboard";
import { clientConfig } from "./roles/client.config";
import { vendorConfig } from "./roles/vendor.config";
import { riderConfig } from "./roles/rider.config";
import { adminConfig } from "./roles/admin.config";

const configs: Record<string, RoleConfig> = {
  customer: clientConfig,     
  restaurant: vendorConfig,   
  rider: riderConfig,
  admin: adminConfig,
  client: clientConfig,
  vendor: vendorConfig,
};

export function getRoleConfig(role: string): RoleConfig {
  return configs[role] || clientConfig; 
}