"use client";

import { useEffect, useState } from "react";
import { HeaderComponent } from "@/components/ui/header";
import { StarIcon } from "@/components/icons/StarIcon";
import { QuestionMarkIcon } from "@/components/icons/QuestionMark";
import { ExclusiveButton, XnoxButton } from "@/components/ui/button";
import PlanCard from "@/components/ui/PlanCard";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  getSubscriptionPlans, createSubscriptionPlan,
  getCompanySubscriptions, COMPANY_ID,
  SubscriptionPlan, Subscription
} from "@/lib/api";

// ── Create Plan Modal ─────────────────────────────────────────────────────────
function CreatePlanModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ name: "", description: "", price: "", billingCycle: "MONTHLY" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.price) { setErr("Name and price are required"); return; }
    setSaving(true); setErr("");
    try {
      await createSubscriptionPlan(COMPANY_ID, {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        billingCycle: form.billingCycle,
      });
      onSaved(); onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to save plan");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-4 sm:p-6 mx-3 sm:mx-0 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Create Subscription Plan</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-[#70707A]" /></button>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-[#70707A] block mb-1">Plan Name *</label>
            <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Gold Plan" />
          </div>
          <div>
            <label className="text-xs font-medium text-[#70707A] block mb-1">Description</label>
            <Input value={form.description} onChange={e => set("description", e.target.value)}
              placeholder="What's included" />
          </div>
          <div>
            <label className="text-xs font-medium text-[#70707A] block mb-1">Price (₹) *</label>
            <Input type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="999" />
          </div>
          <div>
            <label className="text-xs font-medium text-[#70707A] block mb-1">Billing Cycle</label>
            <select value={form.billingCycle} onChange={e => set("billingCycle", e.target.value)}
              className="w-full h-9 border border-input rounded-md px-3 text-sm outline-none focus:border-ring">
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
          {err && <p className="text-xs text-red-500">{err}</p>}
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose}
            className="flex-1 px-4 py-2 border rounded-md text-sm text-[#70707A] hover:bg-[#f0f2f5]">
            Cancel
          </button>
          <button onClick={submit} disabled={saving}
            className="flex-1 px-4 py-2 rounded-md text-sm font-semibold bg-[#3241B3] text-white disabled:opacity-60">
            {saving ? "Saving..." : "Create Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionLoyaltyPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"plans" | "subscriptions">("plans");

  const loadPlans = async () => {
    setLoadingPlans(true);
    try { setPlans(await getSubscriptionPlans(COMPANY_ID)); }
    catch (e) { console.error(e); }
    finally { setLoadingPlans(false); }
  };

  const loadSubscriptions = async () => {
    try { setSubscriptions(await getCompanySubscriptions(COMPANY_ID)); }
    catch (e) { console.error(e); }
  };

  useEffect(() => { loadPlans(); loadSubscriptions(); }, []);

  return (
    <div className="w-full h-full px-2">
      {/* Breadcrumb */}
      <div className="pl-3 pb-5">
        <span className="text-bold">Settings / </span>
        <span>Subscriptions & Loyalty</span>
      </div>

      <div className="flex flex-col pb-10">
        <HeaderComponent Header="Subscriptions & Loyalty" />
        <span className="mytext mt-3 pl-2 text-[#70707A]">
          Manage your subscriptions and loyalty points
        </span>
      </div>

      <div className="space-grotesk text-2xl pl-2 pb-5">Loyalty Points</div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-x-3 mb-7">
        <div className="flex gap-x-3">
          <span className="flex pl-2 justify-center items-center"><StarIcon /></span>
          <span className="flex flex-col">
            <span className="space-grotesk text-[#121417] leading-5">Total Points</span>
            <span className="font-medium text-[#70707A] leading-5">100 points</span>
          </span>
        </div>
        <div className="flex gap-x-3">
          <span className="flex pl-2 items-center"><QuestionMarkIcon /></span>
          <span className="flex flex-col">
            <span className="space-grotesk text-[#121417] leading-5">How to Earn</span>
            <span className="font-medium text-[#70707A] leading-5">₹1 spent = 1 point</span>
          </span>
        </div>
        <div className="flex gap-x-3">
          <span className="flex pl-2 items-center"><QuestionMarkIcon /></span>
          <span className="flex flex-col justify-center">
            <span className="space-grotesk text-[#121417] leading-5">How to Redeem</span>
            <span className="font-medium text-[#70707A] leading-5">Points for discounts on washes</span>
          </span>
        </div>
      </div>

      <div className="flex gap-2 pl-2 mb-6">
        {(["plans", "subscriptions"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === t ? "bg-[#3241B3] text-white" : "bg-[#f0f2f5] text-[#121417] hover:bg-gray-200"}`}>
            {t === "plans" ? "Plans" : "Active Subscriptions"}
          </button>
        ))}
      </div>

      {activeTab === "plans" && (
        <>
          <div className="px-2 flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
            <span className="text-2xl font-bold">Plans</span>
            <ExclusiveButton
              Text="+ Create plan"
              className="border mr-0 sm:mr-8 px-4 py-2 flex rounded-md bg-[#3241B3] text-[#fafafa] font-semibold self-start"
              onClick={() => setShowModal(true)}
            />
          </div>
          <div className="flex flex-wrap mt-2 ml-2 gap-2 sm:gap-x-3 mb-5">
            <XnoxButton Text="Filter by billing" />
            <XnoxButton Text="Active only" />
          </div>
          {loadingPlans ? (
            <div className="pl-2 text-sm text-[#70707A]">Loading plans...</div>
          ) : plans.length === 0 ? (
            <div className="pl-2 text-sm text-[#70707A]">No plans yet. Create your first plan.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-2 ml-2">
              {plans.map(plan => (
                <PlanCard
                  key={plan.id}
                  title={plan.name}
                  description={`₹${plan.price}/${plan.billingCycle.toLowerCase()} · ${plan.description ?? ""}`}
                  onModify={() => alert(`Modify ${plan.name}`)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "subscriptions" && (
        <>
          <div className="px-2 mb-4">
            <span className="text-2xl font-bold">Active Subscriptions</span>
          </div>
          {subscriptions.length === 0 ? (
            <div className="pl-2 text-sm text-[#70707A]">No active subscriptions.</div>
          ) : (
            <div className="overflow-x-auto ml-2 mr-2 sm:mr-8">
              <table className="w-full text-sm border rounded-lg overflow-hidden">
                <thead>
                  <tr className="border-b bg-[#f8f9fa]">
                    {["Code", "Customer", "Plan", "Price", "Billing", "Starts", "Ends", "Status"].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-[#121417]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map(sub => (
                    <tr key={sub.id} className="border-b hover:bg-[#fafafa]">
                      <td className="px-4 py-3 font-mono text-xs">{sub.subscriptionCode}</td>
                      <td className="px-4 py-3">{sub.customerName}</td>
                      <td className="px-4 py-3">{sub.planName}</td>
                      <td className="px-4 py-3">₹{sub.price}</td>
                      <td className="px-4 py-3 capitalize">{sub.billingCycle.toLowerCase()}</td>
                      <td className="px-4 py-3 text-xs">{new Date(sub.startsAt).toLocaleDateString("en-IN")}</td>
                      <td className="px-4 py-3 text-xs">{new Date(sub.endsAt).toLocaleDateString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          sub.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {showModal && (
        <CreatePlanModal onClose={() => setShowModal(false)} onSaved={loadPlans} />
      )}
    </div>
  );
}
