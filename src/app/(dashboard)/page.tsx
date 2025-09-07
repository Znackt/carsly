import StatCard from "@/components/ui/StatCard";
import { HeaderComponent } from "@/components/ui/header";
import DashboardSection from "@/components/ui/DashboardSection";
import { DataTable } from "@/components/ui/data-table/data-table";
import { data } from "@/components/ui/data-table/data";
import { dashboardColumns as columns } from "@/components/ui/data-table/columns";
import { CircleCheck, User } from "lucide-react";

const Page = () => {
  return (
    <div className="h-full w-full">
      <div className="pb-5 px-2">
        <HeaderComponent Header={"Dashboard"} />
      </div>

      <div className="flex px-2">
        <DashboardSection />
      </div>

      <div className="w-full px-4 py-6 flex flex-col lg:flex-row md:flex-col sm:flex-row gap-4">
        <StatCard title="Total Revenue" value="$12,500" changePercentage="15" />
        <StatCard title="Total Bookings" value="350" changePercentage="10" />
        <StatCard title="Alerts" value="2" changePercentage="5" />
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Upcoming Bookings</h1>

        <div className="flex">
          <div>
            <DataTable
              columns={columns}
              data={data}
              className={"rounded-lg border shadow-xs [&_th]:py-4 [&_th]:px-6 [&_td]:py-4.5 [&_td]:px-6 text-base"}
            />
          </div>

          <div className="px-4">
            <h1 className="text-2xl font-semibold mb-4">Alerts</h1>
            <div className="flex items-center gap-3 pb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-100">
                <CircleCheck className="w-5 h-5 text-gray-700" />
              </span>
              <div>
                <p className="font-medium">Booking Confirmation</p>
                <p className="text-sm text-gray-500">2025-03-14 10:00 AM</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-100">
                <User className="w-5 h-5 text-gray-700" />
              </span>
              <div>
                <p className="font-medium">New Customer Registration</p>
                <p className="text-sm text-gray-500">2025-03-13 2:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
