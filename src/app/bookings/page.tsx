"use client";
import CalendarIcon from "@/components/icons/Calendar";
import Sparkles from "@/components/icons/sparkles";
import Columns from "@/components/icons/Columns";

import { data2 } from "@/components/ui/data-table/data";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DropMenuButton, ExclusiveButton } from "@/components/ui/button";
import { bookingsColumns as columns } from "@/components/ui/data-table/columns";

import SearchComponent from "@/components/ui/SearchComponent";
import { HeaderComponent, SubHeaderComponent } from "@/components/ui/header";
import CreateBooking from "@/components/models/CreateBookingModal";
import { useState } from "react";

const page = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-full w-full">
      <div className="flex flex-1 overflow-hidden justify-between px-4 pb-5">
        <HeaderComponent Header={"Bookings"} />

        <ExclusiveButton
          onClick={() => setOpen(true)}
          Text="Create new booking"
          className="border px-4 py-2 flex rounded-md bg-[#0d80f2] text-[#fafafa] font-semibold"
        />

        {open && <CreateBooking onClose={() => setOpen(false)} />}
      </div>

      <div className="sub-header px-4 flex justify-between">
        <div className="flex py-2">
          <SubHeaderComponent SubHeader="Bookings Overview" />
          <span className="flex border rounded-sm p-0.5">
            <CalendarIcon />
            <Columns />
          </span>
        </div>

        <div>
          <SearchComponent Text="Search Bookings" />
        </div>
      </div>

      <div className="flex justify-between pl-4 pr-8">
        <span className="flex gap-2 px-6 my-6">
          <DropMenuButton Buttontext="Date" />
          <DropMenuButton Buttontext="Status" />
          <DropMenuButton Buttontext="Customer" />
          <DropMenuButton Buttontext="Source" />
        </span>

        <span className="flex items-center">
          <Sparkles />
        </span>
      </div>

      <div className="pl-10 pr-8">
        <DataTable
          columns={columns}
          data={data2}
          className={
            "rounded-lg border shadow-xs [&_th]:py-4 [&_th]:px-6 [&_td]:py-4.5 [&_td]:px-6 text-base"
          }
        />
      </div>
    </div>
  );
};

export default page;
