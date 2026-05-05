import { Users, ClipboardList, Fence, PanelLeftClose, PanelLeft, Contact, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Leads", url: "/admin", icon: ClipboardList },
  { title: "Contacts", url: "/admin/contacts", icon: Contact },
  { title: "Settings", url: "/admin/team", icon: Settings },
];

export default function AdminSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const profileQuery = useQuery({
    queryKey: ["my_profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, email")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const profile = profileQuery.data;
  const displayName = profile?.full_name || profile?.email || user?.email || "";
  const initials = (profile?.full_name || profile?.email || "?").charAt(0).toUpperCase();


  const isProfileActive = location.pathname === "/admin/profile";

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-charcoal">
      <SidebarContent className="bg-charcoal">
        {/* Brand */}
        <div className={`py-5 border-b border-secondary/20 ${collapsed ? "px-2 flex justify-center" : "px-4"}`}>
          <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
            <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
              <Fence className="h-5 w-5 text-primary" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-display font-bold text-sm text-cream leading-tight">McCall CRM</h2>
                <p className="text-[10px] text-metal-light leading-tight">Lead Management</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup className="px-2 pt-4">
          {!collapsed && (
            <p className="text-[10px] uppercase tracking-widest text-metal px-3 mb-2 font-medium">Menu</p>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => {
                const isActive = item.url === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/admin"}
                        className={`rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-primary/15 text-primary"
                            : "text-metal-light hover:bg-secondary/20 hover:text-cream"
                        }`}
                        activeClassName=""
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span className="font-medium text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom section */}
        <div className="mt-auto px-2 pb-4 space-y-1">
          {/* User profile */}
          <div className={`border-b border-secondary/20 pb-3 mb-2 ${collapsed ? "px-0" : "px-1"}`}>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/admin/profile"
                    end
                    className={`rounded-lg transition-all duration-200 ${
                      isProfileActive
                        ? "bg-primary/15 text-primary"
                        : "text-metal-light hover:bg-secondary/20 hover:text-cream"
                    }`}
                    activeClassName=""
                  >
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt=""
                        className="h-5 w-5 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-primary">{initials}</span>
                      </div>
                    )}
                    {!collapsed && (
                      <span className="font-medium text-sm truncate">{displayName}</span>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={toggleSidebar}
                className="rounded-lg text-metal-light hover:bg-secondary/20 hover:text-cream cursor-pointer transition-all duration-200"
              >
                {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                {!collapsed && <span className="font-medium text-sm">Collapse Menu</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
