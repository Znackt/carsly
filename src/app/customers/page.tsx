"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { HeaderComponent } from "@/components/ui/header";
import { ExclusiveButton, TransparentButton } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table";
import SearchComponent from "@/components/ui/SearchComponent";
import ChevronDownIcon from "@/components/icons/chevrondown";
import SuperSlider from "@/components/icons/super_slider";
import { FileDown, FileUp, Mail, X, CheckCircle2, AlertCircle, Clock, User, Phone, MessageCircle, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const API_BASE  = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const COMPANY_ID = "100";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CustomerRow {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsAppNumber: string;
  city: string;
  status: string;
}

interface BalanceDTO {
  id: number;
  packageName: string;
  remainingQuantity: number;
  validUntil: string;
  subscriptionCode: string;
  expiringSoon: boolean;
}

interface CustomerDetail {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsAppNumber: string;
  city: string;
  status: string;
  activePlan: string | null;
  subscriptionStatus: string;
  subscriptionEndsAt: string | null;
  balances: BalanceDTO[];
}

// ── Customer Detail Slide-over ────────────────────────────────────────────────

function CustomerDetailPanel({
  customerId,
  onClose,
}: {
  customerId: number;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/v1/api/companies/${COMPANY_ID}/customers/${customerId}/detail`)
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then(setDetail)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [customerId]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[440px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-[#f8f9fa]">
          <div>
            <h2 className="text-lg font-semibold text-[#121417]">Customer Details</h2>
            <p className="text-xs text-[#70707A] mt-0.5">Service balance & subscription info</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-[#70707A]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-16 text-[#70707A] text-sm">
              Loading customer details...
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Failed to load: {error}
            </div>
          )}

          {detail && (
            <>
              {/* Customer info card */}
              <div className="bg-[#f8f9fa] rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#0d80f2]/10 flex items-center justify-center text-[#0d80f2] font-bold text-lg">
                    {detail.firstName?.[0]}{detail.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-[#121417] text-base">
                      {detail.firstName} {detail.lastName}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${detail.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"}`}>
                      {detail.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-1">
                  {detail.phone && (
                    <div className="flex items-center gap-2 text-sm text-[#70707A]">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>{detail.phone}</span>
                    </div>
                  )}
                  {detail.whatsAppNumber && (
                    <div className="flex items-center gap-2 text-sm text-[#70707A]">
                      <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>+{detail.whatsAppNumber}</span>
                    </div>
                  )}
                  {detail.email && (
                    <div className="flex items-center gap-2 text-sm text-[#70707A]">
                      <User className="w-3.5 h-3.5 shrink-0" />
                      <span>{detail.email}</span>
                    </div>
                  )}
                  {detail.city && (
                    <div className="flex items-center gap-2 text-sm text-[#70707A]">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{detail.city}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Subscription */}
              <div>
                <h3 className="text-sm font-semibold text-[#121417] mb-3">Subscription</h3>
                {detail.activePlan ? (
                  <div className="border rounded-xl p-4 flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-[#121417]">{detail.activePlan}</p>
                      <p className="text-xs text-[#70707A] mt-0.5">
                        Expires: {detail.subscriptionEndsAt ?? "—"}
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                      {detail.subscriptionStatus}
                    </span>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-xl p-4 text-center text-sm text-[#70707A]">
                    No active subscription
                  </div>
                )}
              </div>

              {/* Package Balances */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-[#121417]">Service Balance</h3>
                  <span className="text-xs text-[#70707A]">{detail.balances.length} service{detail.balances.length !== 1 ? "s" : ""}</span>
                </div>

                {detail.balances.length === 0 ? (
                  <div className="border border-dashed rounded-xl p-6 text-center">
                    <CheckCircle2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-[#70707A]">No pending service credits</p>
                    <p className="text-xs text-[#a0aec0] mt-1">All credits have been used or no active plan</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {detail.balances.map(bal => {
                      const pct = Math.min(100, (bal.remainingQuantity / 8) * 100); // max 8 for visual bar
                      return (
                        <div key={bal.id} className={`border rounded-xl p-4 ${bal.expiringSoon ? "border-orange-200 bg-orange-50/40" : ""}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-[#121417] text-sm">{bal.packageName}</p>
                              {bal.subscriptionCode && (
                                <p className="text-[10px] text-[#70707A] font-mono mt-0.5">{bal.subscriptionCode}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-[#0d80f2] leading-none">{bal.remainingQuantity}</p>
                              <p className="text-[10px] text-[#70707A]">remaining</p>
                            </div>
                          </div>

                          {/* Visual progress bar */}
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                            <div
                              className={`h-full rounded-full transition-all ${
                                bal.remainingQuantity === 0 ? "bg-gray-300"
                                : bal.expiringSoon ? "bg-orange-400"
                                : "bg-[#0d80f2]"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-[11px] text-[#70707A]">
                              <Clock className="w-3 h-3" />
                              <span>Valid until {bal.validUntil ?? "—"}</span>
                            </div>
                            {bal.expiringSoon && (
                              <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                                Expiring soon
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── Add Customer Modal ────────────────────────────────────────────────────────

function AddCustomerModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", whatsAppNumber: "", city: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState("");

  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!form.firstName || !form.phone) { setErr("First name and phone are required"); return; }
    setSaving(true); setErr("");
    try {
      const res = await fetch(`${API_BASE}/v1/api/companies/${COMPANY_ID}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      onSaved(); onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to save");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Add Customer</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-[#70707A]" /></button>
        </div>
        <div className="flex flex-col gap-3">
          {([
            ["First Name *", "firstName"], ["Last Name", "lastName"], ["Email", "email"],
            ["Phone *", "phone"], ["WhatsApp Number", "whatsAppNumber"], ["City", "city"],
          ] as [string, keyof typeof form][]).map(([label, key]) => (
            <div key={key}>
              <label className="text-xs font-medium text-[#70707A] block mb-1">{label}</label>
              <Input value={form[key]} onChange={e => set(key, e.target.value)} className="h-9" />
            </div>
          ))}
          {err && <p className="text-xs text-red-500">{err}</p>}
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 px-4 py-2 border rounded-md text-sm text-[#70707A] hover:bg-[#f0f2f5]">Cancel</button>
          <button onClick={submit} disabled={saving}
            className="flex-1 px-4 py-2 rounded-md text-sm font-semibold bg-[#0d80f2] text-white disabled:opacity-60">
            {saving ? "Saving..." : "Add Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Table columns with View button ────────────────────────────────────────────

function makeColumns(onView: (id: number) => void): ColumnDef<CustomerRow>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={v => table.toggleAllPageRowsSelected(!!v)} aria-label="Select all" />
      ),
      cell: ({ row }) => (
        <Checkbox checked={row.getIsSelected()}
          onCheckedChange={v => row.toggleSelected(!!v)} aria-label="Select row" />
      ),
      enableSorting: false, enableHiding: false,
    },
    {
      accessorKey: "firstName",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.firstName} {row.original.lastName}
        </div>
      ),
    },
    { accessorKey: "email",  header: "Email" },
    { accessorKey: "phone",  header: "Phone" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={row.original.status === "ACTIVE"
          ? "bg-green-100 text-green-700 border-green-200"
          : "bg-gray-100 text-gray-600 border-gray-200"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => onView(row.original.id)}
          className="text-[#0d80f2] text-sm font-medium hover:underline">
          View
        </button>
      ),
    },
  ];
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CustomersPage() {
  const [rows, setRows]         = useState<CustomerRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [search, setSearch]     = useState("");
  const [showModal, setShowModal]   = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async (q?: string) => {
    setLoading(true); setError(null);
    try {
      const url = q
        ? `${API_BASE}/v1/api/companies/${COMPANY_ID}/customers?search=${encodeURIComponent(q)}`
        : `${API_BASE}/v1/api/companies/${COMPANY_ID}/customers`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status}`);
      setRows(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load customers");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (val: string) => {
    setSearch(val);
      if (searchTimer.current) {
    clearTimeout(searchTimer.current);
  }
  
  // ✅ Set new timer
  searchTimer.current = setTimeout(() => {
    load(val || undefined);
  }, 350);
  };

  const columns = makeColumns((id) => setSelectedId(id));

  return (
    <div className="w-full h-full pl-4 pr-6">
      {/* Header */}
      <div className="flex flex-1 overflow-hidden justify-between pb-3">
        <HeaderComponent Header="Customers" />
        <ExclusiveButton Text="+ Add customer"
          className="border px-4 py-2 flex rounded-md bg-[#0d80f2] text-[#fafafa] font-semibold"
          onClick={() => setShowModal(true)} />
      </div>

      {/* Toolbar */}
      <div className="sub-header flex justify-between items-center pb-5">
        <span className="flex gap-2 pl-2 my-4">
          <TransparentButton Buttontext="Import" icon={<FileDown />} ChevronIcon={<ChevronDownIcon />} />
          <TransparentButton Buttontext="Export" icon={<FileUp />}   ChevronIcon={<ChevronDownIcon />} />
          <TransparentButton Buttontext="Email Segment" icon={<Mail />} />
        </span>
        <input value={search} onChange={e => handleSearch(e.target.value)}
          placeholder="Search customers..."
          className="h-9 border border-gray-200 rounded-md px-3 text-sm text-[#121417] outline-none focus:border-[#0d80f2] w-56" />
      </div>

      {/* Third row */}
      <div className="third_header flex justify-between items-center pb-4">
        <span className="flex pl-6">
          <span className="text-[#a0aec0]">Show: </span>
          <span className="flex pl-2">All customers <ChevronDownIcon /></span>
        </span>
        <TransparentButton Buttontext="Filters" icon={<SuperSlider />}
          className="border flex px-2 py-2 rounded-md text-[#67778e] bg-[#f0f2f5] cursor-pointer select-none" />
      </div>

      {error && (
        <div className="mx-4 mb-3 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <div className="pl-4 pb-5">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-[#70707A] text-sm">Loading customers...</div>
        ) : (
          <DataTable data={rows} columns={columns}
            className="rounded-lg border shadow-xs [&_th]:py-4 [&_th]:px-6 [&_td]:py-4.5 [&_td]:px-6 text-base" />
        )}
      </div>

      {!loading && !error && rows.length === 0 && (
        <div className="text-center py-12 text-[#70707A] text-sm">No customers found.</div>
      )}

      {/* Detail slide-over */}
      {selectedId !== null && (
        <CustomerDetailPanel customerId={selectedId} onClose={() => setSelectedId(null)} />
      )}

      {/* Add modal */}
      {showModal && (
        <AddCustomerModal onClose={() => setShowModal(false)} onSaved={() => load()} />
      )}
    </div>
  );
}
