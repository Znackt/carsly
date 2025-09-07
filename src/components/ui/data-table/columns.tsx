"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export type BookingsTable = {
  customer: string;
  service: string;
  date: string;
  time: string;
  actions?: string;
  status: "Confirmed" | "Pending" | "Upcoming" | "Completed";
};

const commonColumns: ColumnDef<BookingsTable>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("customer")}</div>
    ),
  },
  {
    accessorKey: "service",
    header: "Service",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "Confirmed" ? "default" : "secondary"}
          className={status === "Confirmed" ? "bg-black text-white" : ""}
        >
          {status}
        </Badge>
      );
    },
  },
];

export const bookingsColumns: ColumnDef<BookingsTable>[] = [
  ...commonColumns,
  {
    accessorKey: "actions",
    header: "Actions",
  },
];

export const dashboardColumns: ColumnDef<BookingsTable>[] = [...commonColumns];
