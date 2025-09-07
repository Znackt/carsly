"use client";
import { useState } from "react";
import { DatePicker } from "./date-picker";
import { CalendarDays, CalendarPlus, NotebookText } from "lucide-react";

const DashboardSection = () => {
  const [selected, setSelected] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [pickingEndDate, setPickingEndDate] = useState(false);

  const getItemStyles = (item: string) =>
    `pl-2 ${
      selected === item ? "opacity-100 font-bold" : "opacity-60"
    } cursor-pointer text-sm inline-flex items-center gap-1`;

  const handleCustomClick = () => {
    setSelected("Custom");
    setDateRange({ from: "", to: "" });
    setShowDatePicker(true);
    setPickingEndDate(false);
  };

  const handleDateSelect = (date: string) => {
    if (!pickingEndDate) {
      setDateRange({ ...dateRange, from: date });
      setPickingEndDate(true);
      setTimeout(() => setShowDatePicker(true), 100);
    } else {
      setDateRange({ ...dateRange, to: date });
      setShowDatePicker(false);
      setPickingEndDate(false);
    }
  };

  const handleItemClick = (item: string) => {
    if (item === "Custom") {
      handleCustomClick();
    } else {
      setSelected(item);
    }
  };

  return (
    <div className="w-full flex-shrink-0">
      <div className="flex flex-col gap-3 items-start justify-start sm:flex-row sm:items-center md:flex-row">
        <div className="flex flex-wrap items-center flex-shrink-0">
          <span
            className={`${getItemStyles("Today")} mr-3`}
            onClick={() => handleItemClick("Today")}
          >
            Today
          </span>
          <span
            className={`${getItemStyles("This Week")} mr-3`}
            onClick={() => handleItemClick("This Week")}
          >
            This Week
          </span>
          <span
            className={`${getItemStyles("This Month")} mr-3`}
            onClick={() => handleItemClick("This Month")}
          >
            This Month
          </span>

          <span className={getItemStyles("Custom")} onClick={handleCustomClick}>
            Custom
          </span>

          {dateRange.from && dateRange.to && (
            <div className="ml-2 border border-gray-300 rounded px-3 py-1 text-sm flex items-center gap-1 bg-white shadow-sm">
              <CalendarDays size={14} />
              {`${dateRange.from} - ${dateRange.to}`}
            </div>
          )}

          {showDatePicker && (
            <div className="ml-2">
              <DatePicker onSelect={handleDateSelect} />
            </div>
          )}
        </div>

        <div className="flex gap-3 items-center">
          <span
            className={getItemStyles("Add Booking")}
            onClick={() => handleItemClick("Add Booking")}
          >
            Add Booking <CalendarPlus size={16} />
          </span>
          <span
            className={getItemStyles("Calendar")}
            onClick={() => handleItemClick("Calendar")}
          >
            Calendar <CalendarDays size={16} />
          </span>
          <span
            className={getItemStyles("Invoice")}
            onClick={() => handleItemClick("Invoice")}
          >
            Invoice <NotebookText size={16} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
