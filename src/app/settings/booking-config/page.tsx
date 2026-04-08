"use client";

import { useState, useEffect, useCallback } from "react";
import { HeaderComponent } from "@/components/ui/header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Building2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { ExclusiveButton } from "@/components/ui/button";
import { COMPANY_ID } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ── Types matching backend DTOs exactly ───────────────────────────────────────

interface PackageCapacity {
  capacityId: number;
  packageId: number;
  packageName: string;
  totalCapacityPerDay: number;
  onlineCapacityPerDay: number;
  sameDayCutoffTime: string; // "HH:MM:SS" from LocalTime
  isActive: boolean;
}

interface LocationConfig {
  locationId: number;
  locationName: string;
  city: string;
  openingTime: string;
  closingTime: string;
  onlineBookingPaused: boolean;
  onlinePauseReason: string | null;
  packageCapacities: PackageCapacity[];
}

interface CompanySettings {
  companyId: number;
  bookingWindowDays: number;
  maxActiveBookingsPerCustomerPerLocation: number;
  maxBookingsPerCustomerPerDay: number;
  enableOnlineBooking: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Backend returns LocalTime as "HH:MM:SS" — slice to "HH:MM" for <input type="time">
function toTimeInput(t: string | null | undefined): string {
  if (!t) return "";
  return t.length >= 5 ? t.substring(0, 5) : t;
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium
      ${type === "success" ? "bg-green-50 border border-green-200 text-green-800"
                           : "bg-red-50 border border-red-200 text-red-800"}`}>
      {type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {message}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16 text-[#70707A] text-sm gap-2">
      <Loader2 className="w-4 h-4 animate-spin" /> Loading...
    </div>
  );
}

// ── Locations Tab ─────────────────────────────────────────────────────────────

function LocationsTab() {
  const [locations, setLocations] = useState<LocationConfig[]>([]);
  const [loading, setLoading]     = useState(true);
  const [reasons, setReasons]     = useState<Record<number, string>>({});
  const [saving, setSaving]       = useState<number | null>(null);
  const [toast, setToast]         = useState<{ message: string; type: "success" | "error" } | null>(null);

  const show = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/company/${COMPANY_ID}/locations/config`);
      if (!res.ok) throw new Error(`${res.status}`);
      const data: LocationConfig[] = await res.json();
      setLocations(data);
      setReasons(Object.fromEntries(data.map(l => [l.locationId, l.onlinePauseReason ?? ""])));
    } catch (e) {
      show(`Failed to load locations: ${e instanceof Error ? e.message : e}`, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = async (loc: LocationConfig) => {
    setSaving(loc.locationId);
    const endpoint = loc.onlineBookingPaused
      ? `/api/v1/locations/${loc.locationId}/resume-online-bookings`
      : `/api/v1/locations/${loc.locationId}/pause-online-bookings`;
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: !loc.onlineBookingPaused
          ? JSON.stringify({ reason: reasons[loc.locationId] || "Paused by operator" })
          : undefined,
      });
      if (!res.ok) throw new Error(`${res.status}`);
      setLocations(prev =>
        prev.map(l => l.locationId === loc.locationId
          ? { ...l, onlineBookingPaused: !l.onlineBookingPaused,
              onlinePauseReason: !loc.onlineBookingPaused ? (reasons[loc.locationId] || "Paused by operator") : null }
          : l)
      );
      show(loc.onlineBookingPaused ? `${loc.locationName} resumed` : `${loc.locationName} paused`, "success");
    } catch (e) {
      show(`Failed: ${e instanceof Error ? e.message : e}`, "error");
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#70707A] pl-1">
        Toggle online bookings per location. When paused, WhatsApp customers will be told bookings are unavailable at that branch.
      </p>
      {locations.length === 0 && (
        <p className="text-sm text-[#70707A] pl-1">No locations found for this company.</p>
      )}
      {locations.map(loc => (
        <Card key={loc.locationId} className={`py-0 overflow-hidden ${loc.onlineBookingPaused ? "border-orange-200 bg-orange-50/30" : ""}`}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 p-2 rounded-lg ${loc.onlineBookingPaused ? "bg-orange-100" : "bg-green-50"}`}>
                  <MapPin className={`w-4 h-4 ${loc.onlineBookingPaused ? "text-orange-500" : "text-green-600"}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-[#121417]">{loc.locationName}</span>
                    <Badge className={loc.onlineBookingPaused
                      ? "bg-orange-100 text-orange-700 border-orange-200"
                      : "bg-green-100 text-green-700 border-green-200"}>
                      {loc.onlineBookingPaused ? "Paused" : "Active"}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#70707A]">
                    {loc.city} · {toTimeInput(loc.openingTime)} – {toTimeInput(loc.closingTime)}
                  </p>
                  {!loc.onlineBookingPaused && (
                    <div className="mt-3">
                      <label className="text-xs text-[#70707A] font-medium block mb-1">Pause reason (optional)</label>
                      <Input
                        placeholder="e.g. Workshop maintenance"
                        value={reasons[loc.locationId] ?? ""}
                        onChange={e => setReasons(p => ({ ...p, [loc.locationId]: e.target.value }))}
                        className="h-8 text-sm w-72"
                      />
                    </div>
                  )}
                  {loc.onlineBookingPaused && loc.onlinePauseReason && (
                    <p className="text-xs text-orange-600 mt-1">Reason: {loc.onlinePauseReason}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 pt-1 shrink-0">
                <span className="text-sm text-[#70707A]">{loc.onlineBookingPaused ? "Paused" : "Accepting"}</span>
                <Switch
                  checked={!loc.onlineBookingPaused}
                  disabled={saving === loc.locationId}
                  onCheckedChange={() => toggle(loc)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {toast && <Toast {...toast} />}
    </div>
  );
}

// ── Capacity Tab ──────────────────────────────────────────────────────────────

// Local editable row — we flatten LocationConfig[] into a flat list for the table
interface CapacityRow {
  capacityId: number;
  locationId: number;
  locationName: string;
  packageId: number;
  packageName: string;
  totalCapacityPerDay: number;
  onlineCapacityPerDay: number;
  sameDayCutoffTime: string; // "HH:MM" for input
  isActive: boolean;
}

function CapacityTab() {
  const [rows, setRows]   = useState<CapacityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const show = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/company/${COMPANY_ID}/locations/config`);
      if (!res.ok) throw new Error(`${res.status}`);
      const data: LocationConfig[] = await res.json();
      // Flatten: one row per package per location
      const flat: CapacityRow[] = [];
      for (const loc of data) {
        for (const cap of loc.packageCapacities ?? []) {
          flat.push({
            capacityId:          cap.capacityId,
            locationId:          loc.locationId,
            locationName:        loc.locationName,
            packageId:           cap.packageId,
            packageName:         cap.packageName,
            totalCapacityPerDay: cap.totalCapacityPerDay,
            onlineCapacityPerDay: cap.onlineCapacityPerDay,
            sameDayCutoffTime:   toTimeInput(cap.sameDayCutoffTime),
            isActive:            cap.isActive,
          });
        }
      }
      setRows(flat);
    } catch (e) {
      show(`Failed to load capacity: ${e instanceof Error ? e.message : e}`, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = (capacityId: number, field: keyof CapacityRow, value: string | number) => {
    setRows(prev => prev.map(r => r.capacityId === capacityId ? { ...r, [field]: value } : r));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    // Group rows by locationId
    const byLocation = rows.reduce((acc, r) => {
      if (!acc[r.locationId]) acc[r.locationId] = [];
      acc[r.locationId].push(r);
      return acc;
    }, {} as Record<number, CapacityRow[]>);

    try {
      for (const [locationId, caps] of Object.entries(byLocation)) {
        const res = await fetch(`${API_BASE}/api/v1/locations/${locationId}/capacity-config`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            capacities: caps.map(c => ({
              capacityId:          c.capacityId,
              packageId:           c.packageId,
              totalCapacityPerDay: c.totalCapacityPerDay,
              onlineCapacityPerDay: c.onlineCapacityPerDay,
              sameDayCutoffTime:   c.sameDayCutoffTime + ":00", // backend expects HH:MM:SS
              isActive:            c.isActive,
            })),
          }),
        });
        if (!res.ok) throw new Error(`Location ${locationId}: ${res.status}`);
      }
      show("Capacity settings saved", "success");
      setDirty(false);
    } catch (e) {
      show(`Save failed: ${e instanceof Error ? e.message : e}`, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  const grouped = rows.reduce((acc, r) => {
    if (!acc[r.locationName]) acc[r.locationName] = [];
    acc[r.locationName].push(r);
    return acc;
  }, {} as Record<string, CapacityRow[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#70707A]">
          Set daily slot limits per package. Online = WhatsApp-bookable. Offline = walk-in / staff reserved.
        </p>
        <ExclusiveButton
          Text={saving ? "Saving..." : "Save Changes"}
          onClick={save}
          className={`px-4 py-2 rounded-md text-sm font-semibold text-white transition-colors
            ${dirty ? "bg-[#0d80f2] cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
        />
      </div>

      {Object.keys(grouped).length === 0 && (
        <p className="text-sm text-[#70707A]">No capacity config found. Add locations and packages first.</p>
      )}

      {Object.entries(grouped).map(([locationName, caps]) => (
        <div key={locationName}>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-[#70707A]" />
            <span className="font-semibold text-[#121417]">{locationName}</span>
          </div>
          <Card className="py-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-[#f8f9fa]">
                    <th className="text-left px-5 py-3 font-semibold text-[#121417]">Package</th>
                    <th className="text-left px-5 py-3 font-semibold text-[#121417]">Total / day</th>
                    <th className="text-left px-5 py-3 font-semibold text-[#0d80f2]">Online / day</th>
                    <th className="text-left px-5 py-3 font-semibold text-[#121417]">Cutoff time</th>
                    <th className="text-left px-5 py-3 font-semibold text-[#70707A] text-xs">Offline (auto)</th>
                  </tr>
                </thead>
                <tbody>
                  {caps.map(row => (
                    <tr key={row.capacityId} className="border-b last:border-0 hover:bg-[#fafafa]">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-[#70707A]" />
                          <span className="font-medium">{row.packageName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Input type="number" min={1} max={50} value={row.totalCapacityPerDay}
                          onChange={e => update(row.capacityId, "totalCapacityPerDay", parseInt(e.target.value) || 1)}
                          className="w-20 h-8 text-center" />
                      </td>
                      <td className="px-5 py-3">
                        <Input type="number" min={0} max={row.totalCapacityPerDay} value={row.onlineCapacityPerDay}
                          onChange={e => update(row.capacityId, "onlineCapacityPerDay", parseInt(e.target.value) || 0)}
                          className="w-20 h-8 text-center border-[#0d80f2]/40 focus-visible:border-[#0d80f2]" />
                      </td>
                      <td className="px-5 py-3">
                        <Input type="time" value={row.sameDayCutoffTime}
                          onChange={e => update(row.capacityId, "sameDayCutoffTime", e.target.value)}
                          className="w-28 h-8" />
                      </td>
                      <td className="px-5 py-3 text-[#70707A] font-mono text-xs">
                        {row.totalCapacityPerDay - row.onlineCapacityPerDay}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <p className="text-xs text-[#70707A] mt-1.5 pl-1">
            Cutoff = last accepted arrival time for same-day booking (not delivery time)
          </p>
        </div>
      ))}
      {toast && <Toast {...toast} />}
    </div>
  );
}

// ── Company Rules Tab ─────────────────────────────────────────────────────────

function CompanyRulesTab() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading]   = useState(true);
  const [dirty, setDirty]       = useState(false);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState<{ message: string; type: "success" | "error" } | null>(null);

  const show = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/company/${COMPANY_ID}/settings`);
      if (!res.ok) throw new Error(`${res.status}`);
      setSettings(await res.json());
    } catch (e) {
      show(`Failed to load settings: ${e instanceof Error ? e.message : e}`, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (field: keyof CompanySettings, value: number | boolean) => {
    setSettings(p => p ? { ...p, [field]: value } : p);
    setDirty(true);
  };

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/company/${COMPANY_ID}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      setSettings(await res.json());
      show("Company settings saved", "success");
      setDirty(false);
    } catch (e) {
      show(`Save failed: ${e instanceof Error ? e.message : e}`, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;
  if (!settings) return <p className="text-sm text-[#70707A]">Settings not available.</p>;

  const rules = [
    { key: "bookingWindowDays" as const,
      label: "Booking window",
      desc: "Days ahead customers can book (1 = today + tomorrow)",
      suffix: "days", min: 1, max: 7 },
    { key: "maxActiveBookingsPerCustomerPerLocation" as const,
      label: "Max active bookings per customer per location",
      desc: "Customer can't stack more than this at a single branch",
      suffix: "bookings", min: 1, max: 10 },
    { key: "maxBookingsPerCustomerPerDay" as const,
      label: "Max bookings per customer per day",
      desc: "Prevents double-booking on the same day",
      suffix: "per day", min: 1, max: 5 },
  ];

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#70707A]">Company-wide rules applied across all locations.</p>
        <ExclusiveButton
          Text={saving ? "Saving..." : "Save Changes"}
          onClick={save}
          className={`px-4 py-2 rounded-md text-sm font-semibold text-white transition-colors
            ${dirty ? "bg-[#0d80f2] cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
        />
      </div>

      {/* Master toggle */}
      <Card className="py-0">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#121417]">Global online booking</p>
              <p className="text-sm text-[#70707A] mt-0.5">
                Master switch — disables WhatsApp booking across all locations instantly
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${settings.enableOnlineBooking ? "text-green-600" : "text-orange-500"}`}>
                {settings.enableOnlineBooking ? "Enabled" : "Disabled"}
              </span>
              <Switch checked={settings.enableOnlineBooking} onCheckedChange={v => set("enableOnlineBooking", v)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Numeric rules */}
      {rules.map(rule => (
        <Card key={rule.key} className="py-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1">
                <p className="font-semibold text-[#121417]">{rule.label}</p>
                <p className="text-sm text-[#70707A] mt-0.5">{rule.desc}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => set(rule.key, Math.max(rule.min, (settings[rule.key] as number) - 1))}
                  className="w-8 h-8 rounded-md border flex items-center justify-center text-[#70707A] hover:bg-[#f0f2f5] font-semibold">
                  −
                </button>
                <div className="w-16 text-center">
                  <span className="text-xl font-bold text-[#121417]">{settings[rule.key] as number}</span>
                  <p className="text-xs text-[#70707A]">{rule.suffix}</p>
                </div>
                <button
                  onClick={() => set(rule.key, Math.min(rule.max, (settings[rule.key] as number) + 1))}
                  className="w-8 h-8 rounded-md border flex items-center justify-center text-[#70707A] hover:bg-[#f0f2f5] font-semibold">
                  +
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {toast && <Toast {...toast} />}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BookingConfigPage() {
  return (
    <div className="h-full w-full px-4 pb-10">
      <div className="pl-1 pb-2 text-sm text-[#70707A]">
        <span>Settings / </span><span className="text-[#121417]">Booking Config</span>
      </div>
      <div className="pb-6">
        <HeaderComponent Header="Booking Config" />
        <p className="text-[#70707A] text-sm mt-2 pl-2">Manage online quotas, pause locations, and company booking rules.</p>
      </div>
      <Tabs defaultValue="locations">
        <TabsList className="mb-6">
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Locations
          </TabsTrigger>
          <TabsTrigger value="capacity" className="flex items-center gap-2">
            <Package className="w-4 h-4" /> Capacity
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Company Rules
          </TabsTrigger>
        </TabsList>
        <TabsContent value="locations"><LocationsTab /></TabsContent>
        <TabsContent value="capacity"><CapacityTab /></TabsContent>
        <TabsContent value="rules"><CompanyRulesTab /></TabsContent>
      </Tabs>
    </div>
  );
}
