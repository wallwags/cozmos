import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, ArrowUp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { User } from "@shared/schema";

export default function NatalChart() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

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

  const { data: chartData, isLoading } = useQuery({
    queryKey: ["/api/natal-chart"],
    enabled: isAuthenticated && !!user?.birthDate,
  });

  if (authLoading || !user) {
    return <NatalChartSkeleton />;
  }

  if (!user.birthDate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center">
          <Sparkles className="w-12 h-12 mx-auto text-primary mb-4" />
          <h2 className="font-serif text-2xl font-bold mb-2">
            Complete Seu Perfil
          </h2>
          <p className="text-muted-foreground mb-6">
            Para ver seu mapa astral, precisamos dos seus dados de nascimento
          </p>
          <button
            onClick={() => window.location.href = "/onboarding"}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold"
          >
            Completar Perfil
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">
            Seu Mapa Astral
          </h1>
          <p className="text-muted-foreground">
            Gerado em {user.birthLocation || 'Localização não especificada'} • {user.birthDate} às {user.birthTime}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Wheel Chart */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="font-serif text-2xl font-semibold mb-6">Mapa Natal</h2>
              <div className="aspect-square max-w-md mx-auto flex items-center justify-center bg-muted/20 rounded-full relative">
                {/* Simplified wheel chart representation */}
                <WheelChartPlaceholder
                  sunSign={user.sunSign || 'Áries'}
                  moonSign={user.moonSign || 'Touro'}
                  ascendant={user.ascendantSign || 'Gêmeos'}
                />
              </div>
            </Card>
          </div>

          {/* Planet List */}
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Seus Signos Principais</h3>
              <div className="space-y-4">
                <PlanetCard
                  icon={<Sun className="w-5 h-5 text-chart-2" />}
                  name="Sol"
                  sign={user.sunSign || 'Calculando...'}
                  description="Sua essência, identidade e propósito de vida"
                />
                <PlanetCard
                  icon={<Moon className="w-5 h-5 text-chart-3" />}
                  name="Lua"
                  sign={user.moonSign || 'Calculando...'}
                  description="Suas emoções, necessidades e mundo interior"
                />
                <PlanetCard
                  icon={<ArrowUp className="w-5 h-5 text-primary" />}
                  name="Ascendente"
                  sign={user.ascendantSign || 'Calculando...'}
                  description="Sua aparência e primeira impressão"
                />
              </div>
            </Card>

            <Card className="p-6 bg-primary/5">
              <h3 className="font-semibold mb-2">Resumo Rápido</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Com Sol em <strong>{user.sunSign}</strong>, você é naturalmente expressivo e criativo. 
                Sua Lua em <strong>{user.moonSign}</strong> traz estabilidade emocional. 
                O Ascendente em <strong>{user.ascendantSign}</strong> faz você parecer comunicativo e versátil.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function WheelChartPlaceholder({ sunSign, moonSign, ascendant }: { sunSign: string; moonSign: string; ascendant: string }) {
  return (
    <div className="w-full h-full relative">
      {/* Outer ring */}
      <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
      
      {/* Inner rings */}
      <div className="absolute inset-8 border-2 border-primary/10 rounded-full" />
      <div className="absolute inset-16 border border-muted-foreground/10 rounded-full" />
      
      {/* Center */}
      <div className="absolute inset-1/3 bg-primary/10 rounded-full flex items-center justify-center">
        <div className="text-center">
          <Sun className="w-8 h-8 mx-auto text-primary mb-2" />
          <p className="font-serif font-semibold text-lg">{sunSign}</p>
          <p className="text-xs text-muted-foreground">Sol</p>
        </div>
      </div>

      {/* Zodiac positions (simplified) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Badge variant="secondary" className="text-xs">
          <ArrowUp className="w-3 h-3 mr-1" />
          {ascendant}
        </Badge>
      </div>
      
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
        <Badge variant="secondary" className="text-xs">
          <Moon className="w-3 h-3 mr-1" />
          {moonSign}
        </Badge>
      </div>
    </div>
  );
}

function PlanetCard({ icon, name, sign, description }: {
  icon: React.ReactNode;
  name: string;
  sign: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-all">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-muted-foreground">{name}</span>
          <span className="font-semibold">{sign}</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function NatalChartSkeleton() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="aspect-square max-w-md rounded-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
