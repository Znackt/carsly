import ChevronDownIcon from "@/components/icons/chevrondown";
import Columns from "@/components/icons/Columns";
import {
  DropMenuButton,
  ExclusiveButton,
  TransparentButton,
} from "@/components/ui/button";
import { HeaderComponent, SubHeaderComponent } from "@/components/ui/header";
import SearchComponent from "@/components/ui/SearchComponent";
import { FileDown, FileUp, Mail, Upload } from "lucide-react";

const page = () => {
  return (
    <div className="w-full h-full pl-4 pr-6">
      <div className="flex flex-1 overflow-hidden justify-between pb-5">
        <HeaderComponent Header={"Customers"} />

        <ExclusiveButton
          Text="+ Add customer"
          className="border px-4 py-2 flex rounded-md bg-[#0d80f2] text-[#fafafa] font-semibold"
        />
      </div>

      <div className="sub-header flex justify-between items-center">
        <span className="flex gap-2 pl-2 my-6">
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
    </div>
  );
};

export default page;
