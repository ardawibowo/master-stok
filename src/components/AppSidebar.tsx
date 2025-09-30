import { 
  LayoutDashboard, 
  PackagePlus, 
  PackageMinus, 
  Warehouse, 
  ClipboardList, 
  Users, 
  Building2,
  Tag,
  Cpu,
  ChevronDown
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const mainMenuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Input Barang", url: "/input-barang", icon: PackagePlus },
  { title: "Pengeluaran Barang", url: "/pengeluaran-barang", icon: PackageMinus },
  { title: "Laporan Warehouse", url: "/laporan-warehouse", icon: Warehouse },
  { title: "Laporan Pemasangan", url: "/laporan-pemasangan", icon: ClipboardList },
];

const masterDataItems = [
  { title: "Master Teknisi", url: "/master-teknisi", icon: Users },
  { title: "Master Warehouse", url: "/master-warehouse", icon: Building2 },
  { title: "Master Brand", url: "/master-brand", icon: Tag },
  { title: "Master Type", url: "/master-type", icon: Cpu },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";
  const [masterDataOpen, setMasterDataOpen] = useState(true);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isMasterDataActive = masterDataItems.some(item => isActive(item.url));

  const getNavCls = (path: string) => {
    return isActive(path) 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "text-center" : ""}>
            {collapsed ? "Menu" : "Navigasi Utama"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/"} className={getNavCls(item.url)}>
                      <item.icon className={collapsed ? "mx-auto" : "mr-2 h-4 w-4"} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {!collapsed && (
                <Collapsible open={masterDataOpen} onOpenChange={setMasterDataOpen}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className={isMasterDataActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : ""}>
                        <Building2 className="mr-2 h-4 w-4" />
                        <span>Master Data</span>
                        <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${masterDataOpen ? "rotate-180" : ""}`} />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {masterDataItems.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild>
                              <NavLink to={item.url} className={getNavCls(item.url)}>
                                <item.icon className="mr-2 h-4 w-4" />
                                <span>{item.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )}

              {collapsed && masterDataItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls(item.url)}>
                      <item.icon className="mx-auto" />
                    </NavLink>
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
