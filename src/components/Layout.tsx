import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  MessageCircle, 
  Search, 
  Inbox, 
  Bookmark, 
  User, 
  FileText, 
  Shield, 
  Pill, 
  LogOut
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const activeRoute = location.pathname;

  const isActive = (path: string) => {
    return activeRoute === path;
  };

  const menuItems = [
    { id: "dashboard", title: "Dashboard", icon: Home, url: "/", adminOnly: false },
    { id: "assistant", title: "AI Assistant", icon: MessageCircle, url: "/assistant", adminOnly: false },
    { id: "drug-search", title: "Drug Search", icon: Search, url: "/drug-search", adminOnly: false },
    { id: "drug-interaction", title: "Drug Interactions", icon: Pill, url: "/drug-interaction", adminOnly: false },
    { id: "chat-history", title: "Chat History", icon: Inbox, url: "/chat-history", adminOnly: false },
    { id: "certificate", title: "Certificate", icon: FileText, url: "/certificate", normalOnly: true },
    { id: "admin-certificates", title: "Certificate Review", icon: Shield, url: "/admin/certificates", adminOnly: true },
    { id: "admin-drugs", title: "Manage Interactions", icon: Pill, url: "/admin/drugs", adminOnly: true },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (isAdmin) {
      return !item.normalOnly;
    }
    return !item.adminOnly;
  });

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-background to-muted/30">
      <Sidebar className="border-r border-border/40">
        <SidebarContent>
          <div className="p-4 flex items-center">
            <span className="text-xl font-bold text-primary bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">MedBot</span>
          </div>
          <SidebarGroup>
            <SidebarGroupLabel className="font-medium text-xs uppercase tracking-wider text-muted-foreground">Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredMenuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.url)}
                      className={isActive(item.url) ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50 transition-all"}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className={isActive(item.url) ? "text-primary" : "text-muted-foreground"} />
                        <span className={isActive(item.url) ? "text-primary" : ""}>{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => signOut()}
                    className="hover:bg-destructive/10 hover:text-destructive transition-colors mt-4"
                  >
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <LogOut size={18} />
                      <span>Logout</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 overflow-auto flex flex-col">
        <div className="px-4 py-3 border-b bg-background/95 backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-9 w-9 rounded-md border" />
              <h1 className="text-lg font-medium bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hidden md:block">MedBot</h1>
            </div>
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-primary/20">
                    <User size={18} className="text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-border/40">
                  <DropdownMenuLabel className="flex flex-col gap-1">
                    <span className="font-medium">{profile?.first_name} {profile?.last_name}</span>
                    <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                    {isAdmin && <span className="mt-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm w-fit">Administrator</span>}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                    <User size={16} className="mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/admin/certificates")} className="cursor-pointer">
                        <Shield size={16} className="mr-2" />
                        Certificate Management
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/admin/drugs")} className="cursor-pointer">
                        <Pill size={16} className="mr-2" />
                        Drug Interactions Management
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive">
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <div className="p-6 flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
