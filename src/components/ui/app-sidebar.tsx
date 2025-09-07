import {
  Home,
  User,
  BoxIcon,
  BellIcon,
  Calendar,
  Settings,
  ToolCase,
  WandSparkles,
  TriangleAlert,
} from "lucide-react";

import {
  Sidebar,
  SidebarMenu,
  SidebarGroup,
  SidebarContent,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

const uppercontents = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Bookings",
    url: "/bookings",
    icon: Calendar,
  },
  {
    title: "Services",
    url: "/services",
    icon: ToolCase,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: User,
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: BoxIcon,
  },
  {
    title: "Analytics and Reports",
    url: "/analytics-reports",
    icon: WandSparkles,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

const bottomcontents = [
  {
    title: "Issue Logs",
    url: "/issue-logs",
    icon: BellIcon,
  },
  {
    title: "Alerts",
    url: "/alerts",
    icon: TriangleAlert,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="flex flex-1">
          <SidebarGroupLabel className="font-medium text-lg">
            Carsly
          </SidebarGroupLabel>
          <SidebarGroupContent className="pt-2">
            <SidebarMenu>
              {uppercontents.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
