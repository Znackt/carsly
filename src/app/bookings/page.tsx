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

const STATUS_MAP: Record<string, BookingsTable["status"]> = {
  CONFIRMED: "Confirmed",
  PENDING: "Pending", 
  COMPLETED: "Completed",
  CANCELLED: "Pending",
  IN_PROGRESS: "Upcoming",
};

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
  const [rows, setRows] = useState<BookingsTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const [period, setPeriod] = useState("month");
  const [viewMode, setViewMode] = useState<"calendar" | "columns">("calendar");

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
      <div className="px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
          <HeaderComponent Header="Bookings" />
          <div className="flex items-center shrink-0">
            <ExclusiveButton
              onClick={() => setOpen(true)}
              Text="Create new booking slot"
              className="px-3 py-2 sm:px-5 sm:py-2.5 flex justify-center rounded-lg bg-[#4338CA] hover:bg-[#3730A3] text-white font-medium text-xs sm:text-sm transition-colors shadow-sm whitespace-nowrap"
            />
            {open && <CreateBooking onClose={() => setOpen(false)} />}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between px-4 sm:px-6 py-2 gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center justify-between md:justify-start gap-3">
            <SubHeaderComponent SubHeader="Bookings Overview" />

            <span className="flex items-center border rounded-md p-0.5 bg-gray-50/50">
              <button 
                onClick={() => setViewMode("calendar")}
                className={`p-1 rounded-sm transition-colors ${
                  viewMode === "calendar" 
                    ? "bg-white border border-gray-200 shadow-sm text-gray-800" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <CalendarIcon />
              </button>
              <button 
                onClick={() => setViewMode("columns")}
                className={`p-1 rounded-sm transition-colors ${
                  viewMode === "columns" 
                    ? "bg-white border border-gray-200 shadow-sm text-gray-800" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Columns />
              </button>
            </span>
          </div>
          
          <button className="w-full sm:w-auto border border-[#4338CA] text-[#4338CA] bg-white px-4 py-2 sm:px-5 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-indigo-50 transition-colors">
            Choose unavailable booking slot by days
          </button>
        </div>
        
        <div className="w-full lg:w-80">
          <SearchComponent Text="Search Bookings" className="w-full bg-gray-50 border-gray-200" />
        </div>
      </div>

      <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 gap-4 w-full">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <DropMenuButton Buttontext="Date" />
          <DropMenuButton Buttontext="Status" />
          <DropMenuButton Buttontext="Customer" />
          <DropMenuButton Buttontext="Source" />
        </div>
        <span className="flex items-center">
            <Sparkles />
        </span>
      </div>

      {error && (
        <div className="mx-4 sm:mx-6 mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="px-4 sm:px-6 pb-8 w-full max-w-full">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-[#70707A] text-sm border rounded-xl shadow-sm">
            Loading bookings...
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-xl shadow-sm w-full">
            <div className="inline-block min-w-full align-middle">
              <DataTable
                columns={bookingsColumns}
                data={rows}
                className="w-full text-sm [ &_th]:py-3 [ &_th]:px-4 sm:[ &_th]:py-3.5 sm:[ &_th]:px-5 [ &_th]:text-gray-600 [ &_th]:font-medium [ &_td]:py-3 [ &_td]:px-4 sm:[ &_td]:py-4 sm:[ &_td]:px-5 border-0 whitespace-nowrap"
              />
            </div>
          </div>
        )}
      </div>

      {!loading && !error && rows.length === 0 && (
        <div className="text-center py-12 text-[#70707A] text-sm">
          No bookings found for this period.
        </div>
      )}
    </div>
  );
}