import {
  Home, User, BoxIcon, BellIcon, Calendar, Settings,
  ToolCase, WandSparkles, TriangleAlert,
  SlidersHorizontal, MessageCircle, Gauge,
} from "lucide-react";

import {
  Sidebar, SidebarMenu, SidebarGroup, SidebarContent,
  SidebarMenuItem, SidebarGroupLabel, SidebarMenuButton, SidebarGroupContent,
} from "@/components/ui/sidebar";

const uppercontents = [
  { title: "Dashboard",            url: "/",                icon: Home },
  { title: "Bookings",             url: "/bookings",        icon: Calendar },
  { title: "Services",             url: "/services",        icon: ToolCase },
  { title: "Customers",            url: "/customers",       icon: User },
  { title: "Inventory",            url: "/inventory",       icon: BoxIcon },
  { title: "Analytics and Reports",url: "/analytics-reports",icon: WandSparkles },
  { title: "Settings",             url: "/settings",        icon: Settings },
];

const operatortools = [
  { title: "Booking Config",       url: "/settings/booking-config",         icon: SlidersHorizontal },
  { title: "Capacity Monitor",     url: "/capacity-monitor",                icon: Gauge },
  { title: "WhatsApp Simulator",   url: "/settings/whatsapp-simulator",     icon: MessageCircle },
];

const bottomcontents = [
  { title: "Issue Logs", url: "/issue-logs", icon: BellIcon },
  { title: "Alerts",     url: "/alerts",     icon: TriangleAlert },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="flex flex-1">
          <SidebarGroupLabel className="font-medium text-lg">Carsly</SidebarGroupLabel>
          <SidebarGroupContent className="pt-2">
            <SidebarMenu>
              {uppercontents.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}><item.icon /><span>{item.title}</span></a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Operator Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {operatortools.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}><item.icon /><span>{item.title}</span></a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomcontents.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}><item.icon /><span>{item.title}</span></a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
