"use client";
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import CalendarIcon from "@/components/icons/Calendar";
import Sparkles from "@/components/icons/sparkles";
import Columns from "@/components/icons/Columns";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ExclusiveButton } from "@/components/ui/button";
import { bookingsColumns } from "@/components/ui/data-table/columns";
import SearchComponent from "@/components/ui/SearchComponent";
import { HeaderComponent, SubHeaderComponent } from "@/components/ui/header";

import { getBookings, createBooking, COMPANY_ID, BookingRow } from "@/lib/api"; 
import type { BookingsTable } from "@/components/ui/data-table/columns";
import CreateBooking from "@/components/models/CreateBookingModal";
import { ChevronDown } from "lucide-react";

const STATUS_MAP: Record<string, BookingsTable["status"]> = {
  CONFIRMED: "Upcoming",
  PENDING: "Incomplete",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  IN_PROGRESS: "Upcoming",
};

function toTableRow(b: BookingRow): BookingsTable {
  return {
    customer: b.customerName,
    service: b.serviceName,
    date: b.date,
    time: b.timeSlot,
    status: STATUS_MAP[b.status?.toUpperCase()] ?? "Upcoming",
    actions: "View",
  };
}

const SortDropdown = ({ label, options, onSelect }: { label: string, options: { label: string, value: string }[], onSelect: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border rounded-full text-sm hover:bg-gray-100 transition-colors">
        {label} <ChevronDown size={14} />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 w-40 bg-white border rounded-lg shadow-lg z-50 py-1">
          {options.map((opt) => (
            <button key={opt.value} onClick={() => { onSelect(opt.value); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const MultiSelectDropdown = ({ label, options, selected, onChange }: { label: string, options: string[], selected: string[], onChange: (val: string[]) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border rounded-full text-sm hover:bg-gray-100 transition-colors">
        {label} {selected.length > 0 && `(${selected.length})`} <ChevronDown size={14} />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 w-48 bg-white border rounded-lg shadow-lg z-50 py-1">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer w-full">
              <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggleOption(opt)} className="rounded text-indigo-600 focus:ring-indigo-500" />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default function BookingsPage() {
  const [rows, setRows] = useState<BookingsTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<BookingsTable | null>(null);

  const [period, setPeriod] = useState("month");
  const [viewMode, setViewMode] = useState<"calendar" | "columns">("calendar");

  const [sortConfig, setSortConfig] = useState<{ key: keyof BookingsTable, direction: "asc" | "desc" } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const statusOptions = ["Upcoming", "Completed", "Incomplete", "Cancelled"];

  useEffect(() => {
    const handleView = (e: any) => setViewingCustomer(e.detail);
    window.addEventListener('viewBooking', handleView);
    return () => window.removeEventListener('viewBooking', handleView);
  }, []);

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

  const processedRows = useMemo(() => {
    let result = [...rows];

    if (statusFilter.length > 0) {
      result = result.filter(row => statusFilter.includes(row.status));
    }

    if (sortConfig) {
      result.sort((a, b) => {
        let aVal: any = a[sortConfig.key];
        let bVal: any = b[sortConfig.key];

        if (sortConfig.key === 'date') {
          aVal = new Date(`${a.date} ${a.time}`).getTime();
          bVal = new Date(`${b.date} ${b.time}`).getTime();
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [rows, statusFilter, sortConfig]);

  // NEW: Connected logic to the database 
  const handleCreateBooking = async (newSlotData: any) => {
    try {
      // 1. Sent to Database with hardcoded IDs mapping to your Java Request Payload
      // Note: In the future, these IDs will come dynamically from the modal dropdowns
      await createBooking(COMPANY_ID, {
        locationId: 1,      
        packageId: 1,       
        customerId: 1,      
        bookingDate: newSlotData.date,
        arrivalWindow: "MORNING" 
      });
      
      // 2. Fetch the fresh list directly from Database to fix refresh issue
      await load(); 
      
      // 3. Close Modal
      setOpen(false); 
    } catch (err) {
      console.error("Failed to create booking", err);
      // Optional: Add a UI toast error message here
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      <div className="px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
          <HeaderComponent Header="Bookings" />
          <div className="flex items-center shrink-0">
            <ExclusiveButton
              onClick={() => setOpen(true)}
              Text="Create new booking slot"
              className="px-3 py-2 sm:px-5 sm:py-2.5 flex justify-center rounded-lg bg-[#4338CA] hover:bg-[#3730A3] text-white font-medium text-xs sm:text-sm transition-colors shadow-sm whitespace-nowrap"
            />
            {open && <CreateBooking companyId={100} onClose={() => setOpen(false)} onSave={handleCreateBooking} />}
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
                className={`p-1 rounded-sm transition-colors ${viewMode === "calendar" ? "bg-white border border-gray-200 shadow-sm text-gray-800" : "text-gray-400 hover:text-gray-600"}`}
              >
                <CalendarIcon />
              </button>
              <button 
                onClick={() => setViewMode("columns")}
                className={`p-1 rounded-sm transition-colors ${viewMode === "columns" ? "bg-white border border-gray-200 shadow-sm text-gray-800" : "text-gray-400 hover:text-gray-600"}`}
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
          
          <SortDropdown 
            label="Date" 
            options={[{ label: "Oldest First", value: "asc" }, { label: "Newest First", value: "desc" }]} 
            onSelect={(val) => setSortConfig({ key: 'date', direction: val as "asc" | "desc" })} 
          />
          
          <MultiSelectDropdown 
            label="Status" 
            options={statusOptions} 
            selected={statusFilter} 
            onChange={setStatusFilter} 
          />
          
          <SortDropdown 
            label="Customer" 
            options={[{ label: "A-Z", value: "asc" }, { label: "Z-A", value: "desc" }]} 
            onSelect={(val) => setSortConfig({ key: 'customer', direction: val as "asc" | "desc" })} 
          />
          
          <SortDropdown 
            label="Source" 
            options={[{ label: "A-Z", value: "asc" }, { label: "Z-A", value: "desc" }]} 
            onSelect={(val) => setSortConfig({ key: 'service', direction: val as "asc" | "desc" })} 
          />

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
                data={processedRows}
                className="w-full text-sm [ &_th]:py-3 [ &_th]:px-4 sm:[ &_th]:py-3.5 sm:[ &_th]:px-5 [ &_th]:text-gray-600 [ &_th]:font-medium [ &_td]:py-5 [ &_td]:px-4 sm:[ &_td]:py-6 sm:[ &_td]:px-5 border-0 whitespace-nowrap"
              />
            </div>
          </div>
        )}
      </div>

      {!loading && !error && processedRows.length === 0 && (
        <div className="text-center py-12 text-[#70707A] text-sm">
          No bookings found for this period.
        </div>
      )}

      {/* View Customer Details Modal */}
      {viewingCustomer && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={() => setViewingCustomer(null)}>
          <div className="bg-white p-6 rounded-2xl max-w-md w-full mx-4 shadow-lg" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
            
            <div className="space-y-4 border rounded-xl p-4 bg-gray-50/50">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Name</span>
                <span className="font-medium text-gray-900">{viewingCustomer.customer}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Service Plan</span>
                <span className="font-medium text-gray-900">{viewingCustomer.service}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Date & Time</span>
                <span className="font-medium text-gray-900">{viewingCustomer.date} at {viewingCustomer.time}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Status</span>
                <span className="font-medium text-gray-900">{viewingCustomer.status}</span>
              </div>
            </div>

            <button 
              onClick={() => setViewingCustomer(null)}
              className="mt-6 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}