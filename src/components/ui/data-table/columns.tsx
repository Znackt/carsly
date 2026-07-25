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
  status: "Upcoming" | "Completed" | "Incomplete" | "Cancelled";
};

export type CustomersTable = {
  full_name: string;
  email: string;
  phone: number;
  last_visit: string;
  total_spends: string;
  actions: string;
};

export type ReportsTable = {
  report_name: string;
  description: string;
  last_updated: string;
  actions: string;
}

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
      <div className="font-medium lg:py-2.5 lg:px-4 md:py-2 md:px-3 sm:py-1.5 sm:px-2">{row.getValue("customer")}</div>
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
          variant={status === "Upcoming" ? "default" : "secondary"}
          className={status === "Upcoming" ? "bg-black text-white" : ""}
        >
          {status}
        </Badge>
      );
    },
  },
];

const extCustomerColumns: ColumnDef<CustomersTable>[] = [
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
    accessorKey: "full_name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("full_name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "last_visit",
    header: "Last Visit",
  },
  {
    accessorKey: "total_spends",
    header: "Total Spends",
  },
];

export const customerColumns: ColumnDef<CustomersTable>[] = [
  ...extCustomerColumns,
  {
    accessorKey: "actions",
    header: "Actions",
  },
];

// Added the interactive button here for the View action
export const bookingsColumns: ColumnDef<BookingsTable>[] = [
  ...commonColumns,
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <button
          onClick={() => {
            const event = new CustomEvent("viewBooking", { detail: row.original });
            window.dispatchEvent(event);
          }}
          className="text-[#4338CA] hover:text-[#3730A3] font-medium transition-colors"
        >
          View
        </button>
      );
    },
  },
];

export const reportsColumns: ColumnDef<ReportsTable>[] = [
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
    accessorKey: "report_name",
    header: "Report name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "last_updated",
    header: "Last Updated",
  },
  {
    accessorKey: "actions",
    header: "Actions",
  },
]

export const dashboardColumns: ColumnDef<BookingsTable>[] = [...commonColumns];