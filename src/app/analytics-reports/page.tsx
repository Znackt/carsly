"use client";
import { useState } from "react";
import { ExclusiveButton } from "@/components/ui/button";
import { HeaderComponent } from "@/components/ui/header";
import { Header3Component } from "@/components/ui/Header3";
import { DataTable } from "@/components/ui/data-table/data-table";

import { reportsColumns as columns } from "@/components/ui/data-table/columns";
import { data2, data4 } from "@/components/ui/data-table/data";

const Page = () => {
  const [selectedTab, setSelectedTab] = useState("weekly");

  return (
    <div className="w-full h-full px-4">
      <div className="pb-5 px-2">
        <HeaderComponent Header={"Analytics & Reports"} />
      </div>

      <div className="sub_header flex pl-2 pb-15 justify-between items-center">
        <div className="flex gap-x-6 pl-2">
          <span
            className={`cursor-pointer pb-1 ${
              selectedTab === "weekly"
                ? "font-bold border-b-3 border-[#e5e8eb]"
                : ""
            }`}
            onClick={() => setSelectedTab("weekly")}
          >
            Weekly auto reports
          </span>
          <span
            className={`cursor-pointer pb-1 ${
              selectedTab === "summary"
                ? "font-bold border-b-3 border-[#e5e8eb]"
                : ""
            }`}
            onClick={() => setSelectedTab("summary")}
          >
            Summaries, trends
          </span>
        </div>

        <div>
          <ExclusiveButton
            Text="Create new booking"
            className="border px-4 py-2 flex rounded-md bg-[#0d80f2] text-[#fafafa] font-semibold"
          />
        </div>
      </div>

      <div className="third_header pl-4 pb-5">
        <Header3Component Header="Report Logs"/>
      </div>
    
      <div>
        <DataTable 
          data={data4}
          columns={columns}
          className={
            "rounded-lg border shadow-xs [&_th]:py-4 [&_th]:px-6 [&_td]:py-4.5 [&_td]:px-6 text-base"
          }
        />
      </div>
    </div>
  );
};

export default Page;
