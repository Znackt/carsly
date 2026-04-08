"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { customerColumns } from "@/components/ui/data-table/columns";
import { ExclusiveButton, TransparentButton } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table";
import { HeaderComponent } from "@/components/ui/header";
import ChevronDownIcon from "@/components/icons/chevrondown";
import SuperSlider from "@/components/icons/super_slider";
import { FileDown, FileUp, Mail, X } from "lucide-react";
import { getCustomers, createCustomer, COMPANY_ID, CustomerRow } from "@/lib/api";
import type { CustomersTable } from "@/components/ui/data-table/columns";
import { Input } from "@/components/ui/input";

function toTableRow(c: CustomerRow): CustomersTable {
  return {
    full_name: `${c.firstName} ${c.lastName}`.trim(),
    email: c.email ?? "—",
    phone: c.phone as unknown as number,
    last_visit: "—",
    total_spends: "—",
    actions: "View",
  };
}

// ── Add Customer Modal ────────────────────────────────────────────────────────
function AddCustomerModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", whatsAppNumber: "", city: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!form.firstName || !form.phone) { setErr("First name and phone are required"); return; }
    setSaving(true); setErr("");
    try {
      await createCustomer(COMPANY_ID, { ...form });
      onSaved(); onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to save");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-[#121417]">Add Customer</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-[#70707A]" /></button>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { label: "First Name *", key: "firstName" as const },
            { label: "Last Name",    key: "lastName"  as const },
            { label: "Email",        key: "email"     as const },
            { label: "Phone *",      key: "phone"     as const },
            { label: "WhatsApp",     key: "whatsAppNumber" as const },
            { label: "City",         key: "city"      as const },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="text-xs font-medium text-[#70707A] block mb-1">{label}</label>
              <Input value={form[key]} onChange={e => set(key, e.target.value)} className="h-9" />
            </div>
          ))}
          {err && <p className="text-xs text-red-500">{err}</p>}
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose}
            className="flex-1 px-4 py-2 border rounded-md text-sm text-[#70707A] hover:bg-[#f0f2f5]">
            Cancel
          </button>
          <button onClick={submit} disabled={saving}
            className="flex-1 px-4 py-2 rounded-md text-sm font-semibold bg-[#0d80f2] text-white disabled:opacity-60">
            {saving ? "Saving..." : "Add Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CustomersPage() {
  const [rows, setRows]         = useState<CustomersTable[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [search, setSearch]     = useState("");
  const [showModal, setShowModal] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  const load = useCallback(async (q?: string) => {
    setLoading(true); setError(null);
    try { setRows((await getCustomers(COMPANY_ID, q)).map(toTableRow)); }
    catch (e) { setError(e instanceof Error ? e.message : "Failed to load customers"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (val: string) => {
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => load(val || undefined), 350);
  };

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
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search customers..."
            className="h-9 border border-gray-200 rounded-md px-3 text-sm text-[#121417] outline-none focus:border-[#0d80f2] w-56"
          />
        </div>
      </div>

      {/* Third row */}
      <div className="third_header flex justify-between items-center pb-4">
        <span className="flex pl-6">
          <span className="text-[#a0aec0]">Show: </span>
          <span className="flex pl-2">All customers <ChevronDownIcon /></span>
        </span>
        <span className="flex gap-x-2">
          <TransparentButton Buttontext="Filters" icon={<SuperSlider />}
            className="border flex px-2 py-2 rounded-md text-[#67778e] bg-[#f0f2f5] cursor-pointer select-none" />
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mb-3 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      {/* Table */}
      <div className="pl-4 pb-5">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-[#70707A] text-sm">Loading customers...</div>
        ) : (
          <DataTable data={rows} columns={customerColumns}
            className="rounded-lg border shadow-xs [&_th]:py-4 [&_th]:px-6 [&_td]:py-4.5 [&_td]:px-6 text-base" />
        )}
      </div>

      {!loading && !error && rows.length === 0 && (
        <div className="text-center py-12 text-[#70707A] text-sm">No customers found.</div>
      )}

      {showModal && (
        <AddCustomerModal
          onClose={() => setShowModal(false)}
          onSaved={() => load()}
        />
      )}
    </div>
  );
}
