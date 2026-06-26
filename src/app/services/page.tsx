"use client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { HeaderComponent } from "@/components/ui/header";
import { ExclusiveButton } from "@/components/ui/button";
import SearchComponent from "@/components/ui/SearchComponent";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sparkles from "@/components/icons/sparkles";

const services = [
  "Smart inventory system",
  "AI-powered diagnostics",
  "Maintenance",
  "Automotive management",
  "Service location",
  "View options",
  "Training",
  "Collaboration",
  "Data analysis",
  "Monitoring system",
];

const page = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [lastSelected, setLastSelected] = useState<string | null>(null);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
    setLastSelected(service);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header Section */}
      <div className="w-full px-3 sm:pl-4 sm:pr-6 pt-4">
        <div className="flex justify-between items-center pb-3">
          <HeaderComponent Header={"Services"} />
          <ExclusiveButton
            Text="+ Add item"
            className="border px-4 py-2 flex rounded-md bg-[#0d80f2] text-[#fafafa] font-semibold"
          />
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="sub-header px-4 flex justify-end">
        <div className="pr-2 pt-2">
          <SearchComponent Text="Search Bookings" />
        </div>
      </div>

      <div className="main-div px-3 sm:pl-6 sm:pr-6 flex flex-col md:flex-row pt-4 gap-4 md:gap-0">
        {/* Sidebar: Services List */}
        <div className="flex flex-col space-y-1 shrink-0 min-w-0 md:min-w-[240px] w-full md:w-auto">
          {services.map((item) => {
            const isChecked = selectedServices.includes(item);
            const isLast = lastSelected === item;

            return (
              <div
                key={item}
                onClick={() => toggleService(item)}
                className={`flex items-center gap-3 px-3 py-2 ro cursor-pointer transition
                  ${isLast ? "bg-gray-100" : "hover:bg-gray-50"}
                `}
              >
                <Checkbox
                  checked={isChecked}
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={() => toggleService(item)}
                  className={`
                    ${isChecked ? "border-indigo-600 data-[state=checked]:bg-indigo-600" : ""}
                    ${isLast ? "data-[state=checked]:bg-black border-black" : ""}
                  `}
                />
                <span className="text-sm text-gray-700 truncate">{item}</span>
              </div>
            );
          })}
        </div>

        {/* Main Content: Details Area */}
        <div className="flex flex-col overflow-hidden pb-3 pl-0 md:pl-8 flex-1 min-w-0">
          <HeaderComponent Header={"Details"} />
          
          <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-end mt-2 gap-2">
            <Tabs defaultValue="details">
              <TabsList variant={"line"}>
                <TabsTrigger value="details" className="pb-2">View details</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex ">
              <Sparkles />
            </div>
          </div>

          {/* Details Content Grid */}
          <div className="flex flex-col pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
              
              {/* Row 1 */}
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900">Vehicle types</span>
                <span className="text-black text-right">Online tools</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900">Service</span>
                <span className="text-black text-right">AI diagnostics of wheel alignment</span>
              </div>

              {/* Row 2 */}
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900">Product</span>
                <span className="text-black text-right">Code: 2948108</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900">Total cost</span>
                <span className="text-black text-right">1</span>
              </div>

              {/* Row 3 */}
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900">Origin</span>
                <span className="text-black text-right">Customer</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900">Available</span>
                <span className="text-black text-right">Percentage in stock: 80%</span>
              </div>

              {/* Row 4 */}
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900">Tax rate: 12%</span>
                <span className="text-black text-right">Inventory level: 80%</span>
              </div>
              <div />

              <div className="col-span-1 sm:col-span-2 flex flex-col gap-y-2">
                <div className="flex justify-between pt-1">
                  <span className="font-bold text-slate-900">Price details</span>
                  <span className="text-black">Standard cost</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">Distribution</span>
                  <span className="text-black">Not applicable</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">Inventory</span>
                  <span className="text-black">Not applicable</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">Billing details</span>
                  <span className="text-black">Not available</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">Product code</span>
                  <span className="text-black">Reference number: 8-183</span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-10 pb-6 sm:pb-10">
              <button className="px-6 sm:px-10 py-2 border border-blue-600 text-blue-900 font-semibold ro hover:bg-blue-50 transition-colors rounded-md">
                Edit item
              </button>
              <button className="px-6 sm:px-10 py-2 bg-slate-100 text-black font-semibold ro cursor-not-allowed rounded-md">
                Remove item
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;