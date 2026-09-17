// src/hooks/shared/usePermissions.ts
"use client";

import { useMemo } from "react";
// আপনার রোল বা পারমিশন ডেফিনেশন অনুযায়ী ইমপোর্ট করুন
import type { AppRole, ActionPermission } from "@/types/role";

interface UsePermissionsProps {
  role?: AppRole;
}

export function usePermissions({ role = "client" }: UsePermissionsProps) {
  const permissions = useMemo(() => {
    // রোল ভিত্তিক পারমিশন ম্যাপিং লজিক
    switch (role) {
      case "admin":
        return [{ action: "manage" as ActionPermission, subject: "All" }];
      case "vendor":
        return [
          { action: "create" as ActionPermission, subject: "Menu" },
          { action: "update" as ActionPermission, subject: "Restaurant" },
          { action: "read" as ActionPermission, subject: "Order" },
        ];
      case "rider":
        return [
          { action: "read" as ActionPermission, subject: "Delivery" },
          { action: "update" as ActionPermission, subject: "DeliveryStatus" },
        ];
      case "client":
      default:
        return [
          { action: "create" as ActionPermission, subject: "Order" },
          { action: "read" as ActionPermission, subject: "Food" },
        ];
    }
  }, [role]);

  const can = (action: ActionPermission, subject: string): boolean => {
    if (role === "admin") return true;
    return permissions.some(
      (p) => (p.action === action || p.action === "manage") && (p.subject === subject || p.subject === "All")
    );
  };

  return { permissions, can };
}