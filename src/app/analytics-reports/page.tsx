"use client";
import { useState, useEffect } from "react";
import { ExclusiveButton } from "@/components/ui/button";
import { HeaderComponent } from "@/components/ui/header";
import { Header3Component } from "@/components/ui/Header3";
import { DataTable } from "@/components/ui/data-table/data-table";

import { reportsColumns as columns } from "@/components/ui/data-table/columns";
import { data4 } from "@/components/ui/data-table/data";

import SummariesTrends from "@/components/analytics/SummariesTrends";
import { mockAnalyticsData } from "../data/mockAnalyticsData"; 
import { AnalyticsData } from "@/lib/types";

const Page = () => {
  const [selectedTab, setSelectedTab] = useState("weekly");
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        setTimeout(() => {
          setAnalyticsData(mockAnalyticsData);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  return (
    <div className="w-full h-full px-2 md:px-4">
      <div className="pb-5 px-2">
        {/* If the sidebar toggle button was previously inside this HeaderComponent, 
            you will need to remove it from that component's file. */}
        <HeaderComponent Header={"Analytics & Reports"} />
      </div>

      {/* FIX: Changed to flex-wrap. This naturally handles tablet dimensions by dropping the button 
          to a new line only if there isn't enough room, preventing overlap. */}
      <div className="sub_header flex flex-wrap pl-2 pb-10 md:pb-15 justify-between items-center gap-5 pr-2 md:pr-0">
        
        <div className="flex gap-x-4 md:gap-x-6 pl-2 w-full sm:w-auto overflow-x-auto scrollbar-hide">
          <span
            className={`cursor-pointer pb-1 whitespace-nowrap ${
              selectedTab === "weekly"
                ? "font-bold border-b-3 border-[#e5e8eb]"
                : ""
            }`}
            onClick={() => setSelectedTab("weekly")}
          >
            Weekly auto reports
          </span>
          <span
            className={`cursor-pointer pb-1 whitespace-nowrap ${
              selectedTab === "summary"
                ? "font-bold border-b-3 border-[#e5e8eb]"
                : ""
            }`}
            onClick={() => setSelectedTab("summary")}
          >
            Summaries, trends
          </span>
        </div>

        <div className="w-full sm:w-auto">
          <ExclusiveButton
            Text="Create new booking"
            className="border px-4 py-2 flex justify-center rounded-md bg-[#0d80f2] text-[#fafafa] font-semibold w-full sm:w-auto"
          />
        </div>
      </div>

      {selectedTab === "weekly" && (
        <div className="animate-in fade-in duration-300">
          <div className="third_header pl-4 pb-5">
            <Header3Component Header="Report Logs"/>
          </div>
        
          <div className="w-full overflow-x-auto pr-4 md:pr-0">
            <div className="min-w-[700px] md:min-w-0">
              <DataTable 
                data={data4}
                columns={columns}
                className={
                  "rounded-lg border shadow-xs [&_th]:py-4 [&_th]:px-6 [&_td]:py-4.5 [&_td]:px-6 text-base"
                }
              />
            </div>
          </div>
        </div>
      )}

      {selectedTab === "summary" && (
        <div className="animate-in fade-in duration-300 pl-2 md:pl-4">
          {isLoading ? (
            <div className="text-gray-500 font-medium py-10">Loading trends data...</div>
          ) : analyticsData ? (
            <SummariesTrends trendsData={analyticsData.trends} />
          ) : (
            <div className="text-red-500 font-medium py-10">Failed to load data.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;