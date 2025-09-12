import { customerColumns as columns } from "@/components/ui/data-table/columns";
import { ExclusiveButton, TransparentButton } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table";
import SearchComponent from "@/components/ui/SearchComponent";
import ChevronDownIcon from "@/components/icons/chevrondown";
import SuperSlider from "@/components/icons/super_slider";
import { HeaderComponent } from "@/components/ui/header";
import { data3 } from "@/components/ui/data-table/data";
import { FileDown, FileUp, Mail } from "lucide-react";

const page = () => {
  return (
    <div className="w-full h-full pl-4 pr-6">
      <div className="flex flex-1 overflow-hidden justify-between pb-3">
        <HeaderComponent Header={"Customers"} />

        <ExclusiveButton
          Text="+ Add customer"
          className="border px-4 py-2 flex rounded-md bg-[#0d80f2] text-[#fafafa] font-semibold"
        />
      </div>

      <div className="sub-header flex justify-between items-center pb-5">
        <span className="flex gap-2 pl-2 my-4">
          <TransparentButton
            Buttontext="Import"
            icon={<FileDown />}
            ChevronIcon={<ChevronDownIcon />}
          />
          <TransparentButton
            Buttontext="Export"
            icon={<FileUp />}
            ChevronIcon={<ChevronDownIcon />}
          />
          <TransparentButton Buttontext="Email Segment" icon={<Mail />} />
        </span>

        <div>
          <SearchComponent Text="Search Bookings" />
        </div>
      </div>

      <div className="third_header flex justify-between items-center pb-4">
        <span className="flex pl-6">
          <span className="text-[#a0aec0]">Show: </span>
          <span className="flex pl-2">
            All orders <ChevronDownIcon />
          </span>
        </span>

        <span className="flex gap-x-2">
          <span>
            {" "}
            <ExclusiveButton
              Text="Merge Duplicates"
              className="border flex px-4 py-2 rounded-md text-[#67778e] bg-[#f0f2f5] cursor-pointer select-none"
            />{" "}
          </span>
          <span>
            <TransparentButton
              Buttontext="Filters"
              icon={<SuperSlider />}
              className="border flex px-2 py-2 rounded-md text-[#67778e] bg-[#f0f2f5] cursor-pointer select-none"
            />
          </span>
        </span>
      </div>

      <div className="pl-4 pb-5">
        <DataTable
          data={data3}
          columns={columns}
          className={
            "rounded-lg border shadow-xs [&_th]:py-4 [&_th]:px-6 [&_td]:py-4.5 [&_td]:px-6 text-base"
          }
        />
      </div>
    </div>
  );
};

export default page;
