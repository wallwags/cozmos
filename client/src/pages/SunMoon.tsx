import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sun, Moon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { DailyInsight } from "@shared/schema";

export default function SunMoon() {
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

  const { data: dailyInsight, isLoading } = useQuery<DailyInsight>({
    queryKey: ["/api/daily-advice"],
    enabled: isAuthenticated,
  });

  if (authLoading || !user) {
    return <SunMoonSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">
            Sol & Lua de Hoje
          </h1>
          <p className="text-muted-foreground">
            As energias celestiais que moldam o dia
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        ) : dailyInsight ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sun Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-8 bg-gradient-to-br from-chart-2/10 to-chart-2/5 border-chart-2/20 h-full">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-chart-2/20 flex items-center justify-center">
                      <Sun className="w-8 h-8 text-chart-2" />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl font-bold">Sol</h2>
                      <p className="text-sm text-muted-foreground">Energia Masculina • Ação</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Sol em</p>
                      <p className="text-2xl font-serif font-bold">{dailyInsight.sunSignToday}</p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-sm leading-relaxed">
                        O Sol representa sua vitalidade, propósito e identidade essencial. 
                        Hoje em {dailyInsight.sunSignToday}, a energia solar ilumina aspectos específicos 
                        da sua vida, trazendo clareza e motivação para agir.
                      </p>
                    </div>
                  </div>

                  <div className="bg-card/50 rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Energia de {dailyInsight.sunSignToday}
                    </p>
                    <p className="text-sm">
                      {getSunSignEnergy(dailyInsight.sunSignToday)}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Moon Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-8 bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20 h-full">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-chart-3/20 flex items-center justify-center">
                      <Moon className="w-8 h-8 text-chart-3" />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl font-bold">Lua</h2>
                      <p className="text-sm text-muted-foreground">Energia Feminina • Emoção</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Lua em</p>
                      <p className="text-2xl font-serif font-bold">{dailyInsight.moonSignToday}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Fase Lunar</p>
                      <p className="font-semibold">{dailyInsight.moonPhase}</p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-sm leading-relaxed">
                        A Lua governa suas emoções, intuição e necessidades interiores. 
                        Em {dailyInsight.moonSignToday}, ela influencia como você se sente e 
                        reage emocionalmente ao mundo ao seu redor.
                      </p>
                    </div>
                  </div>

                  <div className="bg-card/50 rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Fase: {dailyInsight.moonPhase}
                    </p>
                    <p className="text-sm">
                      {getMoonPhaseEnergy(dailyInsight.moonPhase)}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        ) : null}

        {/* Combined Energy */}
        {dailyInsight && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-8 bg-gradient-to-r from-primary/5 via-chart-2/5 to-chart-3/5">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="font-serif text-xl font-semibold">
                  Energia Combinada de Hoje
                </h2>
              </div>
              <p className="text-lg leading-relaxed">
                Com o Sol em {dailyInsight.sunSignToday} e a Lua em {dailyInsight.moonSignToday}, 
                o dia traz um equilíbrio único entre ação e emoção. {dailyInsight.humorCosmico}
              </p>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function getSunSignEnergy(sign: string): string {
  const energies: Record<string, string> = {
    'Áries': 'Energia de iniciativa, coragem e pioneirismo. Tempo de agir com ousadia.',
    'Touro': 'Energia de estabilidade, praticidade e sensualidade. Aprecie os prazeres simples.',
    'Gêmeos': 'Energia de comunicação, curiosidade e versatilidade. Conecte-se e aprenda.',
    'Câncer': 'Energia de nutrição, emocionalidade e proteção. Cuide de si e dos seus.',
    'Leão': 'Energia de criatividade, expressão e generosidade. Brilhe com confiança.',
    'Virgem': 'Energia de organização, análise e serviço. Refine e aperfeiçoe.',
    'Libra': 'Energia de harmonia, relacionamentos e justiça. Busque equilíbrio.',
    'Escorpião': 'Energia de transformação, profundidade e intensidade. Mergulhe fundo.',
    'Sagitário': 'Energia de expansão, aventura e filosofia. Explore novos horizontes.',
    'Capricórnio': 'Energia de ambição, disciplina e realização. Construa com propósito.',
    'Aquário': 'Energia de inovação, independência e visão. Seja original.',
    'Peixes': 'Energia de compaixão, intuição e transcendência. Confie na sua sensibilidade.',
  };
  return energies[sign] || 'Energia cósmica especial guia seu caminho.';
}

function getMoonPhaseEnergy(phase: string): string {
  const phases: Record<string, string> = {
    'Lua Nova': 'Tempo de novos começos e intenções. Plante sementes para o futuro.',
    'Lua Crescente': 'Energia de crescimento e construção. Tome ação em seus planos.',
    'Lua Cheia': 'Momento de culminação e revelação. Celebre conquistas e libere o velho.',
    'Lua Minguante': 'Fase de reflexão e liberação. Solte o que não serve mais.',
  };
  return phases[phase] || 'A lua guia suas emoções com sabedoria.';
}

function SunMoonSkeleton() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
        <Skeleton className="h-32 rounded-xl" />
      </div>
    </div>
  );
}
