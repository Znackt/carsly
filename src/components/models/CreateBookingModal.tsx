"use client";
import React from "react";
import { Calendar } from "../ui/calendar";
import { CalendarIcon, ChevronDown } from "lucide-react";

const CreateBooking = ({ onClose }: { onClose: () => void }) => {
  const [discount, setDiscount] = React.useState<string | null>(null);
  const [serviceType, setServiceType] = React.useState("Default");
  const [isAddonOpen, setIsAddonOpen] = React.useState(false);

  const serviceOptions = ["Default", "Premium", "Luxury", "Unlimited"];

  const [fromDate, setFromDate] = React.useState<Date | undefined>(new Date());
  const [toDate, setToDate] = React.useState<Date | undefined>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date;
  });

  const [activeCalendar, setActiveCalendar] = React.useState<
    "from" | "to" | null
  >(null);

  const addonServices = [
    "Interior Cleaning",
    "Exterior Wash",
    "Engine Detailing",
    "Polishing",
    "Ceramic Coating",
  ];

  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);
  const [duration, setDuration] = React.useState<"default" | "custom">(
    "default",
  );

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // only close if clicking outside dropdown
      if (!target.closest("#addon-dropdown")) {
        setIsAddonOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Prevent close when clicking inside */}
      <div
        className="w-full max-w-3xl bg-white rounded-2xl border shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Create New Slot</span>
        </div>

        {/* DATE RANGE */}
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Date Range</span>

            <span
              className="text-[#3b5bdb] text-sm cursor-pointer"
              onClick={() => {
                setFromDate(undefined);
                setToDate(undefined);
                setActiveCalendar(null);
              }}
            >
              Reset
            </span>
          </div>

          <div className="flex items-end gap-3 mt-3">
            {/* FROM */}
            <div className="flex flex-col gap-1 relative">
              <span className="text-sm">From</span>

              <button
                className="flex items-center justify-between px-4 py-2.5 rounded-xl border bg-[#F9FAFB] min-w-[160px]"
                onClick={() =>
                  setActiveCalendar(activeCalendar === "from" ? null : "from")
                }
              >
                <span>{fromDate?.toLocaleDateString("en-GB")}</span>
                <CalendarIcon size={16} className="text-gray-500" />
              </button>

              {activeCalendar === "from" && (
                <div className="absolute top-16 z-50 bg-white border rounded-xl shadow">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={(d) => {
                      setFromDate(d);
                      setActiveCalendar(null);
                    }}
                  />
                </div>
              )}
            </div>

            {/* TO */}
            <div className="flex flex-col gap-1 relative">
              <span className="text-sm">To</span>

              <button
                className="flex items-center justify-between px-4 py-2.5 rounded-xl border bg-[#F9FAFB] min-w-[160px]"
                onClick={() =>
                  setActiveCalendar(activeCalendar === "to" ? null : "to")
                }
              >
                <span>{toDate?.toLocaleDateString("en-GB")}</span>
                <CalendarIcon size={16} className="text-gray-500" />
              </button>

              {activeCalendar === "to" && (
                <div className="absolute top-16 z-50 bg-white border rounded-xl shadow">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={(d) => {
                      setToDate(d);
                      setActiveCalendar(null);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex gap-3 ml-2">
              {["Today", "This Week", "This Month"].map((item) => (
                <button
                  key={item}
                  className="flex items-center px-4 py-2.5 rounded-xl border bg-[#F9FAFB]"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t mt-2"></div>

        {/* Working Hours + Service Type */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Working Hours</span>
            <input
              placeholder="Set working hours for each day"
              className="w-full mt-2 px-4 py-2.5 rounded-xl border bg-[#F9FAFB]"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium">Service Type</span>
            <div className="relative mt-2">
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border bg-[#F9FAFB] appearance-none"
              >
                {serviceOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="border-t mt-2"></div>

        {/* ADD-ON SERVICES */}
        <div id="addon-dropdown" className="mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Add-on Services</span>
            <span
              className="text-[#3b5bdb] text-sm cursor-pointer"
              onClick={() => setSelectedServices([])}
            >
              Reset
            </span>
          </div>

          <div className="relative mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAddonOpen((prev) => !prev);
              }}
              className="w-full flex justify-between px-4 py-2.5 rounded-xl border bg-[#F9FAFB]"
            >
              <span className="text-sm">
                {selectedServices.length
                  ? selectedServices.join(", ")
                  : "Select add-on services"}
              </span>
              <ChevronDown size={16} />
            </button>

            {isAddonOpen && (
              <div
                className="absolute w-full mt-2 bg-white border rounded-xl shadow z-50"
                onClick={(e) => e.stopPropagation()}
              >
                {addonServices.map((service) => {
                  const isSelected = selectedServices.includes(service);

                  return (
                    <div
                      key={service}
                      onClick={() =>
                        setSelectedServices((prev) =>
                          prev.includes(service)
                            ? prev.filter((s) => s !== service)
                            : [...prev, service],
                        )
                      }
                      className={`px-4 py-2 text-sm cursor-pointer flex justify-between hover:bg-gray-100 ${
                        isSelected ? "bg-blue-50 text-[#3b5bdb]" : ""
                      }`}
                    >
                      {service}
                      {isSelected && <span>✓</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="border-t mt-2"></div>

        {/* Duration */}
        <div className="mt-4">
          <span className="text-sm font-medium">Duration and Intervals</span>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <button
              onClick={() => setDuration("default")}
              className={`py-2.5 rounded-xl border ${
                duration === "default"
                  ? "border-[#3b5bdb] text-[#3b5bdb]"
                  : "bg-[#F9FAFB]"
              }`}
            >
              Default
            </button>

            <button
              onClick={() => setDuration("custom")}
              className={`py-2.5 rounded-xl border ${
                duration === "custom"
                  ? "border-[#3b5bdb] text-[#3b5bdb]"
                  : "bg-[#F9FAFB]"
              }`}
            >
              Custom
            </button>
          </div>
        </div>

        <div className="border-t mt-2"></div>

        {/* Discounts */}
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Discounts</span>
            <span className="text-[#3b5bdb] text-sm cursor-pointer">Reset</span>
          </div>

          <span className="text-xs text-gray-500">
            Apply discounts for specific time slots
          </span>

          <div className="flex gap-3 mt-3">
            {["Evening", "Custom", "Morning"].map((item) => (
              <button
                key={item}
                onClick={() => setDiscount(item)}
                className={`px-4 py-2.5 rounded-xl w-full border text-sm ${
                  discount === item
                    ? "border-[#3b5bdb] text-[#3b5bdb]"
                    : "bg-[#F9FAFB]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t mt-2"></div>

        {/* Summary */}
        <div className="mt-4">
          <span className="text-sm font-medium">Summary</span>

          <p className="text-xs text-gray-500 mt-1">
            Review the summary of the newly created slots, including date, time,
            services, and discounts.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button className="px-4 py-2 rounded-lg border bg-gray-100">
            Reset all
          </button>

          <button className="px-4 py-2 rounded-lg bg-[#3b5bdb] text-white">
            Save slots
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBooking;
