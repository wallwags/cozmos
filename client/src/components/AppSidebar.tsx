import { Home, Sun, Moon, Stars, Scroll, Award, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useLocation } from "wouter";

const mainItems = [
  {
    title: "Meu Dia",
    url: "/",
    icon: Home,
    testId: "nav-dashboard",
  },
  {
    title: "Sol & Lua",
    url: "/sun-moon",
    icon: Sun,
    testId: "nav-sun-moon",
  },
  {
    title: "Mapa Astral",
    url: "/natal-chart",
    icon: Stars,
    testId: "nav-natal-chart",
  },
  {
    title: "Sonhos",
    url: "/dreams",
    icon: Scroll,
    testId: "nav-dreams",
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-4">
            <div className="flex items-center gap-2">
              <Stars className="w-5 h-5 text-primary" />
              <span className="font-serif text-lg font-bold">Cosmos</span>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={item.testId}
                  >
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
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => window.location.href = "/api/logout"} data-testid="button-logout">
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
