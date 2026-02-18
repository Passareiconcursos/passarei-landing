import { LayoutDashboard, UserCheck, DollarSign, Settings, GraduationCap, Ticket, Bot, BookOpen } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Painel",
    url: "/educ/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Leads",
    url: "/educ/leads",
    icon: UserCheck,
  },
  {
    title: "Alunos",
    url: "/educ/users",
    icon: GraduationCap,
  },
  {
    title: "Beta Testers",
    url: "/educ/beta",
    icon: Ticket,
  },
  {
    title: "Financeiro",
    url: "/educ/revenue",
    icon: DollarSign,
  },
  {
    title: "Conteúdo",
    url: "/educ/content",
    icon: BookOpen,
  },
  {
    title: "Suporte IA",
    url: "/educ/support",
    icon: Bot,
  },
  {
    title: "Configurações",
    url: "/educ/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const [location] = useLocation();
  const { admin, logout } = useAdminAuth();

  return (
    <Sidebar data-testid="sidebar-admin">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary p-2">
            <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Passarei</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild data-active={isActive}>
                      <Link href={item.url} data-testid={`link-${item.title.toLowerCase()}`}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="space-y-2">
          <div className="text-sm">
            <p className="font-medium">{admin?.name}</p>
            <p className="text-xs text-muted-foreground">{admin?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{admin?.role.replace('_', ' ')}</p>
          </div>
          <Button
            data-testid="button-logout"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={logout}
          >
            Sair
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
