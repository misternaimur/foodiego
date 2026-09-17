// src/components/vendor/orderColumns.tsx
import type { Column } from "@/components/ui/DataTable";
import type { VendorOrder } from "@/types/vendor";

export const vendorOrderColumns: Column<VendorOrder>[] = [
  {
    header: "Order ID",
    accessorKey: "id",
    cell: (row) => <span className="font-semibold text-gray-900">#{row.id.slice(-6)}</span>,
  },
  {
    header: "Customer",
    accessorKey: "clientName",
    cell: (row) => <span className="font-medium text-gray-800">{row.clientName}</span>,
  },
  {
    header: "Items",
    cell: (row) => (
      <ul className="text-xs space-y-1">
        {row.items?.map((item, idx) => (
          <li key={idx}>
            {item.quantity}x {item.name}
          </li>
        ))}
      </ul>
    ),
  },
  {
    header: "Total",
    accessorKey: "total",
    cell: (row) => <span className="font-semibold text-gray-900">${row.total.toFixed(2)}</span>,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (row) => {
      const statusColors: Record<string, string> = {
        pending: "bg-amber-100 text-amber-800",
        preparing: "bg-blue-100 text-blue-800",
        ready_for_delivery: "bg-purple-100 text-purple-800",
        delivered: "bg-emerald-100 text-emerald-800",
        cancelled: "bg-red-100 text-red-800",
      };

      return (
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
            statusColors[row.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {row.status?.replace(/_/g, " ")}
        </span>
      );
    },
  },
];