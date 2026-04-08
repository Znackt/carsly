"use client";
import { useEffect, useState, useCallback } from "react";
import CalendarIcon from "@/components/icons/Calendar";
import Sparkles from "@/components/icons/sparkles";
import Columns from "@/components/icons/Columns";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DropMenuButton, ExclusiveButton } from "@/components/ui/button";
import { bookingsColumns } from "@/components/ui/data-table/columns";
import SearchComponent from "@/components/ui/SearchComponent";
import { HeaderComponent, SubHeaderComponent } from "@/components/ui/header";
import { getBookings, COMPANY_ID, BookingRow } from "@/lib/api";
import type { BookingsTable } from "@/components/ui/data-table/columns";
import CreateBooking from "@/components/models/CreateBookingModal";

// ✅ Your status mapping logic
const STATUS_MAP: Record<string, BookingsTable["status"]> = {
  CONFIRMED: "Confirmed",
  PENDING: "Pending", 
  COMPLETED: "Completed",
  CANCELLED: "Pending",
  IN_PROGRESS: "Upcoming",
};

// ✅ Your data transformation function
function toTableRow(b: BookingRow): BookingsTable {
  return {
    customer: b.customerName,
    service: b.serviceName,
    date: b.date,
    time: b.timeSlot,
    status: STATUS_MAP[b.status?.toUpperCase()] ?? "Pending",
    actions: "View",
  };
}

export default function BookingsPage() {
  // ✅ Your API states
  const [rows, setRows] = useState<BookingsTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("today");
  
  // ✅ Teammate's modal state (merged in)
  const [open, setOpen] = useState(false);

  // ✅ Your API loading logic
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows((await getBookings(COMPANY_ID, period)).map(toTableRow));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-white">
      {/* ✅ Header + Create Button (teammate's UI + your structure) */}
      <div className="px-4 py-3 border-b bg-white">
        <div className="flex items-center justify-between">
          <HeaderComponent Header="Bookings" />
          <div className="flex items-center gap-3">
            <ExclusiveButton
              onClick={() => setOpen(true)}
              Text="Create new booking"
              className="border px-4 py-2 flex rounded-md bg-[#0d80f2] text-[#fafafa] font-semibold"
            />
            {open && <CreateBooking onClose={() => setOpen(false)} />}
          </div>
        </div>
      </div>

      {/* ✅ Sub-header with Search */}
      <div className="sub-header px-4 flex justify-between">
        <div className="flex py-2">
          <SubHeaderComponent SubHeader="Bookings Overview" />
          <span className="flex border rounded-sm p-0.5">
            <CalendarIcon />
            <Columns />
          </span>
        </div>
        <SearchComponent Text="Search Bookings" />
      </div>

      {/* ✅ Filters: Your period buttons + teammate's dropdowns */}
      <div className="flex justify-between pl-4 pr-8">
        <span className="flex gap-2 px-6 my-6">
          {/* Your period toggle buttons */}
          {(["today", "7Days", "month"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-sm border text-sm transition-colors ${
                period === p
                  ? "bg-[#0d80f2] text-white border-[#0d80f2]"
                  : "bg-[#f0f2f5] text-[#121417] border-gray-200 hover:bg-gray-200"
              }`}
            >
              {p === "today" ? "Today" : p === "7Days" ? "Last 7 Days" : "Last 30 Days"}
            </button>
          ))}
          {/* Teammate's dropdown filters */}
          <DropMenuButton Buttontext="Status" />
          <DropMenuButton Buttontext="Customer" />
          <DropMenuButton Buttontext="Source" />
        </span>
        <span className="flex items-center">
          <Sparkles />
        </span>
      </div>

      {/* ✅ Your error state */}
      {error && (
        <div className="mx-10 mb-3 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* ✅ Your data table with loading state */}
      <div className="pl-10 pr-8">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-[#70707A] text-sm">
            Loading bookings...
          </div>
        ) : (
          <DataTable
            columns={bookingsColumns}
            data={rows}
            className="rounded-lg border shadow-xs [ &_th]:py-4 [ &_th]:px-6 [ &_td]:py-4.5 [ &_td]:px-6 text-base"
          />
        )}
      </div>

      {/* ✅ Your empty state */}
      {!loading && !error && rows.length === 0 && (
        <div className="text-center py-12 text-[#70707A] text-sm">
          No bookings found for this period.
        </div>
      )}
    </div>
  );
}