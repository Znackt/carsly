"use client";
import React, { useState, useEffect } from "react";
import { Calendar } from "../ui/calendar";
import { CalendarIcon, ChevronDown, Loader2 } from "lucide-react";
import { createBooking } from "@/lib/api";

// --- PRODUCTION TYPE DEFINITIONS ---
interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface ServicePackage {
  id: number;
  name: string;
  price: number;
}

interface Location {
  id: number;
  name: string;
  address: string;
}

interface CreateBookingProps {
  companyId: string | number;
  onClose: () => void;
  onSave?: (data: any) => void;
}

const CreateBooking = ({ companyId, onClose, onSave }: CreateBookingProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [selectedCustomerId, setSelectedCustomerId] = useState<number | "">("");
  const [selectedPackageId, setSelectedPackageId] = useState<number | "">("");
  const [selectedLocationId, setSelectedLocationId] = useState<number | "">("");
  const [discount, setDiscount] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
  const [toDate, setToDate] = useState<Date | undefined>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date;
  });
  
  const [activeCalendar, setActiveCalendar] = useState<"from" | "to" | null>(null);
  const [isAddonOpen, setIsAddonOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [duration, setDuration] = useState<"default" | "custom">("default");

  const addonServices = [
    "Interior Cleaning", "Exterior Wash", "Engine Detailing", "Polishing", "Ceramic Coating",
  ];

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        setIsFetchingData(true);
        const [custRes, pkgRes, locRes] = await Promise.all([
          fetch(`http://localhost:8080/v1/api/companies/${companyId}/customers`),
          fetch(`http://localhost:8080/v1/api/companies/${companyId}/packages`),
          fetch(`http://localhost:8080/v1/api/companies/${companyId}/locations`)
        ]);

        if (!custRes.ok || !pkgRes.ok || !locRes.ok) {
          throw new Error("Failed to load reference data from the database.");
        }

        setCustomers(await custRes.json());
        setPackages(await pkgRes.json());
        setLocations(await locRes.json());
      } catch (err: any) {
        console.error(err);
        setFetchError(err.message || "An error occurred while loading data.");
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchReferenceData();
  }, [companyId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#addon-dropdown")) setIsAddonOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleSaveClick = async () => {
    if (!selectedCustomerId || !selectedPackageId || !selectedLocationId) {
      alert("Please select a Customer, Location, and Service Package.");
      return;
    }

    if (!fromDate) {
      alert("Please select a booking date.");
      return;
    }

    try {
      setIsSubmitting(true);

      const bookingData = {
        bookingDate: fromDate.toISOString().split('T')[0],
        arrivalWindow: discount === "Evening" ? "EVENING" : "MORNING",
        customerId: Number(selectedCustomerId),
        packageId: Number(selectedPackageId),
        locationId: Number(selectedLocationId),
      };

      await createBooking(String(companyId), bookingData); 
      
      alert("Booking saved successfully!");
      if (onSave) onSave(bookingData); 
      onClose(); 
      
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save booking. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetchingData) {
    return (
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl flex flex-col items-center">
          <Loader2 className="animate-spin text-[#3b5bdb] mb-4" size={32} />
          <p>Loading database records...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl flex flex-col items-center">
          <p className="text-red-500 mb-4">{fetchError}</p>
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={onClose}>
      <div className="w-full max-w-3xl bg-white rounded-2xl border shadow-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto mx-3 sm:mx-0" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Create New Slot</span>
        </div>

        {/* DATE CALENDARS */}
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Date Range</span>
            <span className="text-[#3b5bdb] text-sm cursor-pointer" onClick={() => { setFromDate(undefined); setToDate(undefined); setActiveCalendar(null); }}>
              Reset
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 mt-3">
            <div className="flex flex-col gap-1 relative">
              <span className="text-sm">From</span>
              <button className="flex items-center justify-between px-4 py-2.5 rounded-xl border bg-[#F9FAFB] min-w-[160px]" onClick={() => setActiveCalendar(activeCalendar === "from" ? null : "from")}>
                <span>{fromDate?.toLocaleDateString("en-GB") || "Select date"}</span>
                <CalendarIcon size={16} className="text-gray-500" />
              </button>
              {activeCalendar === "from" && (
                <div className="absolute top-16 z-50 bg-white border rounded-xl shadow">
                  <Calendar mode="single" selected={fromDate} onSelect={(d) => { setFromDate(d); setActiveCalendar(null); }} />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1 relative">
              <span className="text-sm">To (Optional)</span>
              <button className="flex items-center justify-between px-4 py-2.5 rounded-xl border bg-[#F9FAFB] min-w-[160px]" onClick={() => setActiveCalendar(activeCalendar === "to" ? null : "to")}>
                <span>{toDate?.toLocaleDateString("en-GB") || "Select date"}</span>
                <CalendarIcon size={16} className="text-gray-500" />
              </button>
              {activeCalendar === "to" && (
                <div className="absolute top-16 z-50 bg-white border rounded-xl shadow">
                  <Calendar mode="single" selected={toDate} onSelect={(d) => { setToDate(d); setActiveCalendar(null); }} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t mt-4"></div>

        {/* --- DYNAMIC DATABASE SELECTORS --- */}
        <div className="mt-4">
          <span className="text-sm font-medium text-red-500">*</span> <span className="text-sm font-medium">Customer Details</span>
          <div className="relative mt-2">
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border bg-[#F9FAFB] appearance-none"
            >
              <option value="" disabled>Select a registered customer...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.email})</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-red-500">*</span> <span className="text-sm font-medium">Location</span>
            <div className="relative mt-2">
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border bg-[#F9FAFB] appearance-none"
              >
                <option value="" disabled>Select a facility...</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-red-500">*</span> <span className="text-sm font-medium">Service Package</span>
            <div className="relative mt-2">
              <select
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border bg-[#F9FAFB] appearance-none"
              >
                <option value="" disabled>Select a package...</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>{pkg.name} - ${pkg.price}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="border-t mt-4"></div>

        {/* ADDONS & DISCOUNTS (UI Preserved) */}
        <div id="addon-dropdown" className="mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Add-on Services</span>
            <span className="text-[#3b5bdb] text-sm cursor-pointer" onClick={() => setSelectedServices([])}>Reset</span>
          </div>
          <div className="relative mt-2">
            <button onClick={(e) => { e.stopPropagation(); setIsAddonOpen((prev) => !prev); }} className="w-full flex justify-between px-4 py-2.5 rounded-xl border bg-[#F9FAFB]">
              <span className="text-sm">{selectedServices.length ? selectedServices.join(", ") : "Select add-on services"}</span>
              <ChevronDown size={16} />
            </button>
            {isAddonOpen && (
              <div className="absolute w-full mt-2 bg-white border rounded-xl shadow z-50" onClick={(e) => e.stopPropagation()}>
                {addonServices.map((service) => {
                  const isSelected = selectedServices.includes(service);
                  return (
                    <div key={service} onClick={() => setSelectedServices((prev) => prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service] )} className={`px-4 py-2 text-sm cursor-pointer flex justify-between hover:bg-gray-100 ${isSelected ? "bg-blue-50 text-[#3b5bdb]" : ""}`}>
                      {service} {isSelected && <span>✓</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="border-t mt-4"></div>
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Discounts</span>
            <span className="text-[#3b5bdb] text-sm cursor-pointer" onClick={() => setDiscount(null)}>Reset</span>
          </div>
          <span className="text-xs text-gray-500">Apply discounts for specific time slots</span>
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-3">
            {["Evening", "Custom", "Morning"].map((item) => (
              <button key={item} onClick={() => setDiscount(item)} className={`px-4 py-2.5 rounded-xl w-full border text-sm sm:w-auto ${discount === item ? "border-[#3b5bdb] text-[#3b5bdb]" : "bg-[#F9FAFB]"}`}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t mt-4"></div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} disabled={isSubmitting} className="px-4 py-2 rounded-lg border bg-gray-100 disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSaveClick} disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-[#3b5bdb] text-white flex items-center justify-center min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Save slots"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBooking;