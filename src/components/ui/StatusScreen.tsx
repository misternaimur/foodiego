import type { ReactNode } from "react";

type AccountStatus = "pending" | "rejected" | "suspended";

interface StatusScreenProps {
  status: AccountStatus;
  title: string;
  message: string;
  action?: ReactNode;
}

const STATUS_STYLES: Record<AccountStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  suspended: "bg-gray-50 text-gray-700 border-gray-200",
};

export function StatusScreen({ status, title, message, action }: StatusScreenProps) {
  return (
    <div className={`mx-auto mt-16 max-w-md rounded-xl border p-8 text-center ${STATUS_STYLES[status]}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}