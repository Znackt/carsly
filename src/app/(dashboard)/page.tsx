"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/ui/StatCard";
import { HeaderComponent } from "@/components/ui/header";
import DashboardSection from "@/components/ui/DashboardSection";
import { DataTable } from "@/components/ui/data-table/data-table";
import { dashboardColumns } from "@/components/ui/data-table/columns";
import { CircleCheck, User } from "lucide-react";
import type { BookingsTable } from "@/components/ui/data-table/columns";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const COMPANY_ID = "100";

const STATUS_MAP: Record<string, BookingsTable["status"]> = {
  CONFIRMED:   "Confirmed",
  PENDING:     "Pending",
  COMPLETED:   "Completed",
  CANCELLED:   "Pending",
  IN_PROGRESS: "Upcoming",
};

interface DashboardData {
  totalBookings: number;
  activeReminders: number;
  revenue: number;
  changeInRevenue: number;
  changeInActiveReminders: number;
  changeInTotalBookings: number;
}

interface BookingRow {
  id: string;
  customerName: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  status: string;
}

function toTableRow(b: BookingRow): BookingsTable {
  return {
    customer: b.customerName,
    service:  b.serviceName,
    date:     b.date,
    time:     b.timeSlot,
    status:   STATUS_MAP[b.status?.toUpperCase()] ?? "Pending",
  };
}

function fmt(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export default function DashboardPage() {
  const [stats, setStats]           = useState<DashboardData | null>(null);
  const [bookings, setBookings]     = useState<BookingsTable[]>([]);
  const [loadingStats, setLS]       = useState(true);
  const [loadingBooks, setLB]       = useState(true);
  const [statsErr, setStatsErr]     = useState<string | null>(null);
  const [booksErr, setBooksErr]     = useState<string | null>(null);

  useEffect(() => {
    // Fetch dashboard stats
    fetch(`${API_BASE}/v1/api/companies/${COMPANY_ID}/dashboard`)
      .then(r => r.json())
      .then(setStats)
      .catch(e => setStatsErr(e.message))
      .finally(() => setLS(false));

    // Fetch upcoming bookings (today + tomorrow)
    const today    = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const start = fmt(today);
    const end   = fmt(tomorrow);

    fetch(`${API_BASE}/v1/api/companies/${COMPANY_ID}/bookings?period=upcoming&startDate=${start}&endDate=${end}`)
      .then(r => r.json())
      .then((data: BookingRow[]) => setBookings(data.map(toTableRow)))
      .catch(e => setBooksErr(e.message))
      .finally(() => setLB(false));
  }, []);

  const confirmed  = bookings.filter(b => b.status === "Confirmed").length;
  const totalToday = bookings.length;

  return (
    <div className="h-full w-full">
      <div className="pb-5 px-2">
        <HeaderComponent Header="Dashboard" />
      </div>

      {statsErr && (
        <div className="mx-4 my-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          Stats unavailable: {statsErr}
        </div>
      )}

      {/* Stat cards */}
      <div className="w-full px-4 py-6 flex flex-col lg:flex-row md:flex-col sm:flex-row gap-4">
        <StatCard
          title="Total Revenue"
          value={loadingStats ? "..." : stats?.revenue ? `₹${stats.revenue.toLocaleString("en-IN")}` : "₹0"}
          changePercentage={stats?.changeInRevenue?.toString() ?? "0"}
        />
        <StatCard
          title="Total Bookings"
          value={loadingStats ? "..." : stats?.totalBookings?.toString() ?? "0"}
          changePercentage={stats?.changeInTotalBookings?.toString() ?? "0"}
        />
        <StatCard
          title="Active Reminders"
          value={loadingStats ? "..." : stats?.activeReminders?.toString() ?? "0"}
          changePercentage={stats?.changeInActiveReminders?.toString() ?? "0"}
        />
      </div>

      {/* Upcoming bookings — today + tomorrow, no period bar */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Upcoming Bookings</h1>
          <span className="text-sm text-[#70707A] bg-[#f0f2f5] px-3 py-1 rounded-full">
            Today & Tomorrow
          </span>
        </div>

        {booksErr && (
          <div className="mb-3 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {booksErr}
          </div>
        )}

        <div className="flex gap-6">
          {/* Table */}
          <div className="flex-1 min-w-0">
            {loadingBooks ? (
              <div className="flex items-center justify-center py-12 text-[#70707A] text-sm border rounded-lg">
                Loading bookings...
              </div>
            ) : bookings.length === 0 && !booksErr ? (
              <div className="flex items-center justify-center py-12 text-[#70707A] text-sm border rounded-lg">
                No upcoming bookings for today or tomorrow.
              </div>
            ) : (
              <DataTable
                columns={dashboardColumns}
                data={bookings}
                className="rounded-lg border shadow-xs [&_th]:py-4 [&_th]:px-6 [&_td]:py-4.5 [&_td]:px-6 text-base"
              />
            )}
          </div>

          {/* Alerts */}
          <div className="w-64 shrink-0 px-4">
            <h1 className="text-2xl font-semibold mb-4">Alerts</h1>
            {totalToday > 0 ? (
              <>
                <div className="flex items-center gap-3 pb-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-100">
                    <CircleCheck className="w-5 h-5 text-gray-700" />
                  </span>
                  <div>
                    <p className="font-medium text-sm">
                      {totalToday} booking{totalToday !== 1 ? "s" : ""} upcoming
                    </p>
                    <p className="text-xs text-gray-500">Today & tomorrow</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-100">
                    <User className="w-5 h-5 text-gray-700" />
                  </span>
                  <div>
                    <p className="font-medium text-sm">{confirmed} confirmed</p>
                    <p className="text-xs text-gray-500">
                      {totalToday - confirmed} pending
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-[#70707A]">No alerts for today.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
