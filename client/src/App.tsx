import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/hooks/useAuth";

import Landing from "@/pages/Landing";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Dreams from "@/pages/Dreams";
import NatalChart from "@/pages/NatalChart";
import SunMoon from "@/pages/SunMoon";
import NotFound from "@/pages/NotFound";

function Router() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // Pages that don't need sidebar
  const noSidebarPages = ['/landing', '/onboarding'];
  const showSidebar = isAuthenticated && !noSidebarPages.includes(location) && !isLoading;

  // If user is not authenticated and trying to access protected routes, show landing
  const protectedRoutes = ['/', '/dreams', '/natal-chart', '/sun-moon'];
  if (!isLoading && !isAuthenticated && protectedRoutes.includes(location)) {
    return <Landing />;
  }

  return (
    <Switch>
      <Route path="/landing" component={Landing} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/" component={Dashboard} />
      <Route path="/dreams" component={Dreams} />
      <Route path="/natal-chart" component={NatalChart} />
      <Route path="/sun-moon" component={SunMoon} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <AppLayout>
              <Router />
            </AppLayout>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  const noLayoutPages = ['/landing', '/onboarding'];
  const showLayout = isAuthenticated && !noLayoutPages.includes(location) && !isLoading;

  if (!showLayout) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-4 py-3 border-b">
          <SidebarTrigger data-testid="button-sidebar-toggle" />
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default App;
