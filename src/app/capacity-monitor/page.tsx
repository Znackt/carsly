"use client";

import { useEffect, useState, useCallback } from "react";
import { HeaderComponent } from "@/components/ui/header";
import { MapPin, RefreshCw, Package, Wifi, WifiOff, PauseCircle } from "lucide-react";

const API_BASE   = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const COMPANY_ID = "100";

// ── Types matching backend DTOs ───────────────────────────────────────────────

interface PackageCapacityStatus {
  packageId: number;
  packageName: string;
  onlineCapacityLimit: number;
  onlineBookingsUsed: number;
  onlineSlotsRemaining: number;
  totalCapacityLimit: number;
  totalBookingsUsed: number;
  status: "AVAILABLE" | "LOW" | "FULL";
}

interface DayCapacityDTO {
  date: string;
  displayDate: string;
  packages: PackageCapacityStatus[];
}

interface LocationCapacityDTO {
  locationId: number;
  locationName: string;
  city: string;
  onlineBookingPaused: boolean;
  days: DayCapacityDTO[];
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    AVAILABLE: "bg-green-100 text-green-700 border-green-200",
    LOW:       "bg-orange-100 text-orange-700 border-orange-200",
    FULL:      "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

// ── Capacity bar ──────────────────────────────────────────────────────────────

function CapacityBar({ used, limit, status }: { used: number; limit: number; status: string }) {
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  const color =
    status === "FULL"      ? "bg-red-400"
    : status === "LOW"     ? "bg-orange-400"
    : "bg-[#0d80f2]";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-[#70707A] font-mono w-12 text-right shrink-0">
        {used}/{limit}
      </span>
    </div>
  );
}

// ── Package row ───────────────────────────────────────────────────────────────

function PackageRow({ pkg }: { pkg: PackageCapacityStatus }) {
  return (
    <div className="py-3 border-b last:border-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Package className="w-3.5 h-3.5 text-[#70707A]" />
          <span className="text-sm font-medium text-[#121417]">{pkg.packageName}</span>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={pkg.status} />
          <span className={`text-lg font-bold ${
            pkg.onlineSlotsRemaining === 0 ? "text-red-500"
            : pkg.status === "LOW" ? "text-orange-500"
            : "text-[#0d80f2]"}`}>
            {pkg.onlineSlotsRemaining}
          </span>
          <span className="text-xs text-[#70707A]">left</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#70707A] w-16 shrink-0">Online</span>
          <CapacityBar used={pkg.onlineBookingsUsed} limit={pkg.onlineCapacityLimit} status={pkg.status} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#70707A] w-16 shrink-0">Total</span>
          <CapacityBar used={pkg.totalBookingsUsed} limit={pkg.totalCapacityLimit} status="AVAILABLE" />
        </div>
      </div>
    </div>
  );
}

// ── Location card ─────────────────────────────────────────────────────────────

function LocationCard({ loc }: { loc: LocationCapacityDTO }) {
  const today    = loc.days.find(d => d.displayDate === "Today");
  const tomorrow = loc.days.find(d => d.displayDate === "Tomorrow");

  // Summary stats
  const todayFull    = today?.packages.filter(p => p.status === "FULL").length ?? 0;
  const todayTotal   = today?.packages.length ?? 0;
  const overallStatus =
    todayFull === todayTotal && todayTotal > 0 ? "FULL"
    : todayFull > 0 ? "LOW"
    : "AVAILABLE";

  return (
    <div className={`border rounded-xl overflow-hidden ${
      loc.onlineBookingPaused ? "border-orange-200" : ""
    }`}>
      {/* Location header */}
      <div className={`px-5 py-4 flex items-center justify-between ${
        loc.onlineBookingPaused ? "bg-orange-50" : "bg-[#f8f9fa]"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${loc.onlineBookingPaused ? "bg-orange-100" : "bg-white border"}`}>
            <MapPin className={`w-4 h-4 ${loc.onlineBookingPaused ? "text-orange-500" : "text-[#70707A]"}`} />
          </div>
          <div>
            <p className="font-semibold text-[#121417]">{loc.locationName}</p>
            <p className="text-xs text-[#70707A]">{loc.city}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {loc.onlineBookingPaused ? (
            <span className="flex items-center gap-1.5 text-xs text-orange-600 font-medium bg-orange-100 px-3 py-1 rounded-full">
              <PauseCircle className="w-3.5 h-3.5" /> Bookings Paused
            </span>
          ) : (
            <StatusBadge status={overallStatus} />
          )}
        </div>
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-2 divide-x">
        {[today, tomorrow].map((day, i) => day && (
          <div key={i} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-[#121417]">{day.displayDate}</span>
              <span className="text-[10px] text-[#70707A]">{day.date}</span>
            </div>
            {day.packages.length === 0 ? (
              <p className="text-xs text-[#70707A] text-center py-4">No capacity configured</p>
            ) : (
              day.packages.map(pkg => <PackageRow key={pkg.packageId} pkg={pkg} />)
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CapacityMonitorPage() {
  const [data, setData]       = useState<LocationCapacityDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/v1/api/companies/${COMPANY_ID}/capacity-dashboard`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      setData(await res.json());
      setLastRefresh(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load capacity data");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Summary across all locations for today
  const allTodayPkgs = data.flatMap(loc => loc.days.find(d => d.displayDate === "Today")?.packages ?? []);
  const totalFull      = allTodayPkgs.filter(p => p.status === "FULL").length;
  const totalLow       = allTodayPkgs.filter(p => p.status === "LOW").length;
  const totalAvailable = allTodayPkgs.filter(p => p.status === "AVAILABLE").length;

  return (
    <div className="h-full w-full px-4 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between pb-6">
        <div>
          <HeaderComponent Header="Capacity Monitor" />
          <p className="text-[#70707A] text-sm mt-1 pl-2">
            Live slot availability — today &amp; tomorrow
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <span className="text-xs text-[#70707A]">
            Updated {lastRefresh.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </span>
          <button onClick={load} disabled={loading}
            className="flex items-center gap-1.5 text-sm text-[#70707A] border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-[#f0f2f5] transition-colors disabled:opacity-50">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Summary strip */}
      {!loading && data.length > 0 && (
        <div className="flex gap-3 mb-6">
          {[
            { label: "Available",  count: totalAvailable, color: "bg-green-50 border-green-200 text-green-700" },
            { label: "Low slots",  count: totalLow,       color: "bg-orange-50 border-orange-200 text-orange-700" },
            { label: "Full",       count: totalFull,      color: "bg-red-50 border-red-200 text-red-700" },
          ].map(item => (
            <div key={item.label} className={`flex-1 border rounded-xl px-4 py-3 ${item.color}`}>
              <p className="text-2xl font-bold">{item.count}</p>
              <p className="text-xs font-medium mt-0.5">{item.label} (today)</p>
            </div>
          ))}
          <div className="flex-1 border rounded-xl px-4 py-3 bg-[#f8f9fa] border-gray-200">
            <p className="text-2xl font-bold text-[#121417]">{data.length}</p>
            <p className="text-xs font-medium text-[#70707A] mt-0.5">Location{data.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <WifiOff className="w-4 h-4 shrink-0" />
          {error} — ensure backend is running at {API_BASE}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-[#70707A] text-sm gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" /> Loading capacity data...
        </div>
      )}

      {/* Location cards */}
      {!loading && data.length === 0 && !error && (
        <div className="text-center py-20 text-[#70707A] text-sm">
          No locations or capacity config found for this company.
        </div>
      )}

      <div className="space-y-4">
        {data.map(loc => <LocationCard key={loc.locationId} loc={loc} />)}
      </div>
    </div>
  );
}
