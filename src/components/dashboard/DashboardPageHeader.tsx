// src/components/dashboard/DashboardPageHeader.tsx
import type { ReactNode } from "react";

interface DashboardPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function DashboardPageHeader({
  title,
  description,
  action,
}: DashboardPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-[28px] font-bold leading-9 tracking-tight text-[#111827]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-[14px] leading-5 text-[#6B7280]">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex shrink-0 items-center gap-3">{action}</div>
      )}
    </div>
  );
}