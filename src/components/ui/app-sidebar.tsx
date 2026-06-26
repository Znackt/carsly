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
  SlidersHorizontal,
  MessageCircle,
  Gauge,
} from "lucide-react";

import Link from "next/link";

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
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Bookings", url: "/bookings", icon: Calendar },
  { title: "Services", url: "/services", icon: ToolCase },
  { title: "Customers", url: "/customers", icon: User },
  { title: "Inventory", url: "/inventory", icon: BoxIcon },
  {
    title: "Analytics and Reports",
    url: "/analytics-reports",
    icon: WandSparkles,
  },
  { title: "Settings", url: "/settings", icon: Settings },
];

const operatortools = [
  {
    title: "Booking Config",
    url: "/settings/booking-config",
    icon: SlidersHorizontal,
  },
  { title: "Capacity Monitor", url: "/capacity-monitor", icon: Gauge },
  {
    title: "WhatsApp Simulator",
    url: "/settings/whatsapp-simulator",
    icon: MessageCircle,
  },
];

const bottomcontents = [
  { title: "Issue Logs", url: "/issue-logs", icon: BellIcon },
  { title: "Alerts", url: "/alerts", icon: TriangleAlert },
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
                  <SidebarMenuButton>
                    <Link href={item.url} className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 h-8">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
                  <SidebarMenuButton>
                    <Link href={item.url} className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 h-8">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
                  <SidebarMenuButton>
                    <Link href={item.url} className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 h-8">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
