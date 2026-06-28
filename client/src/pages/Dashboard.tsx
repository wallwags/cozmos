import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sun, Moon, Sparkles, Share2, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import type { User, DailyInsight } from "@shared/schema";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Não autorizado",
        description: "Você precisa fazer login. Redirecionando...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [authLoading, isAuthenticated, toast]);

  const { data: dailyInsight, isLoading: insightLoading } = useQuery<DailyInsight>({
    queryKey: ["/api/daily-advice"],
    enabled: isAuthenticated,
  });

  if (authLoading || !user) {
    return <DashboardSkeleton />;
  }

  // Check if user has completed onboarding
  if (!user.birthDate) {
    window.location.href = "/onboarding";
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="font-serif text-3xl md:text-4xl font-bold" data-testid="text-welcome">
            Bem-vindo, {user.firstName || "Explorador"}
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Energy Card */}
            {insightLoading ? (
              <Skeleton className="h-48 w-full rounded-xl" />
            ) : dailyInsight ? (
              <EnergyCard insight={dailyInsight} />
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  Gerando suas energias do dia...
                </p>
              </Card>
            )}

            {/* Advice Cards */}
            {insightLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
              </div>
            ) : dailyInsight?.conselhos ? (
              <AdviceGrid conselhos={dailyInsight.conselhos as string[]} />
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {insightLoading ? (
              <>
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
              </>
            ) : dailyInsight ? (
              <>
                <SunMoonCard
                  sunSign={dailyInsight.sunSignToday}
                  moonSign={dailyInsight.moonSignToday}
                  moonPhase={dailyInsight.moonPhase}
                />
                <QuickActions />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function EnergyCard({ insight }: { insight: DailyInsight }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="p-8 bg-gradient-to-br from-primary/5 via-chart-2/5 to-chart-3/5 border-primary/20">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-semibold">Energia de Hoje</h2>
            <p className="text-sm text-muted-foreground">Sua vibração cósmica atual</p>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" data-testid="button-save-insight">
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" data-testid="button-share-insight">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-lg leading-relaxed mb-4" data-testid="text-energy">
          {insight.energiaPrincipal}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4" />
          <span>{insight.humorCosmico}</span>
        </div>
      </Card>
    </motion.div>
  );
}

function AdviceGrid({ conselhos }: { conselhos: string[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {conselhos.map((conselho, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6 hover-elevate h-full" data-testid={`advice-card-${index}`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                {index + 1}
              </div>
              <p className="text-sm leading-relaxed">{conselho}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function SunMoonCard({ sunSign, moonSign, moonPhase }: { sunSign: string; moonSign: string; moonPhase: string }) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Sol & Lua de Hoje</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-chart-2/20 flex items-center justify-center">
            <Sun className="w-5 h-5 text-chart-2" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Sol em</p>
            <p className="font-semibold" data-testid="text-sun-sign">{sunSign}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-chart-3/20 flex items-center justify-center">
            <Moon className="w-5 h-5 text-chart-3" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Lua em</p>
            <p className="font-semibold" data-testid="text-moon-sign">{moonSign}</p>
          </div>
        </div>
        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground mb-1">Fase Lunar</p>
          <p className="text-sm font-medium" data-testid="text-moon-phase">{moonPhase}</p>
        </div>
      </div>
    </Card>
  );
}

function QuickActions() {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Ações Rápidas</h3>
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => window.location.href = "/dreams"}
          data-testid="button-add-dream"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Adicionar Sonho
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => window.location.href = "/natal-chart"}
          data-testid="button-view-chart"
        >
          <Sun className="w-4 h-4 mr-2" />
          Ver Mapa Astral
        </Button>
      </div>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 rounded-xl" />
            <div className="grid md:grid-cols-2 gap-4">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
