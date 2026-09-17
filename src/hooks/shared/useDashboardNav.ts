// src/hooks/shared/useDashboardNav.ts
"use client";

import { usePathname } from "next/navigation";
import type { RoleConfig } from "@/types/dashboard";

export function useDashboardNav(config: RoleConfig) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === config.homeHref) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const currentNavItem = config.nav.find((item) => isActive(item.href));

  return {
    pathname,
    isActive,
    currentNavItem,
  };
}