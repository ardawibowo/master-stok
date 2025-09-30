import { 
  LayoutDashboard, 
  PackagePlus, 
  PackageMinus, 
  Warehouse, 
  ClipboardList, 
  Users, 
  Building2 
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

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
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Input Barang", url: "/input-barang", icon: PackagePlus },
  { title: "Pengeluaran Barang", url: "/pengeluaran-barang", icon: PackageMinus },
  { title: "Laporan Warehouse", url: "/laporan-warehouse", icon: Warehouse },
  { title: "Laporan Pemasangan", url: "/laporan-pemasangan", icon: ClipboardList },
  { title: "Master Teknisi", url: "/master-teknisi", icon: Users },
  { title: "Master Warehouse", url: "/master-warehouse", icon: Building2 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

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
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/"} className={getNavCls(item.url)}>
                      <item.icon className={collapsed ? "mx-auto" : "mr-2 h-4 w-4"} />
                      {!collapsed && <span>{item.title}</span>}
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
