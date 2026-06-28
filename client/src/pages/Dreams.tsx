import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Heart, Trash2, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Dream } from "@shared/schema";

export default function Dreams() {
  const [dreamText, setDreamText] = useState("");
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

  const { data: dreams, isLoading } = useQuery<Dream[]>({
    queryKey: ["/api/dreams"],
    enabled: isAuthenticated,
  });

  const addDreamMutation = useMutation({
    mutationFn: async (text: string) => {
      return await apiRequest("POST", "/api/dreams", { dreamText: text });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dreams"] });
      setDreamText("");
      toast({
        title: "Sonho Adicionado",
        description: "Aguarde enquanto a IA Onírica analisa seu sonho...",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Não autorizado",
          description: "Você foi desconectado. Fazendo login novamente...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const analyzeDreamMutation = useMutation({
    mutationFn: async (dreamId: string) => {
      return await apiRequest("POST", `/api/dreams/${dreamId}/analyze`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dreams"] });
      toast({
        title: "Análise Completa",
        description: "A IA Onírica revelou os símbolos do seu sonho",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao analisar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteDreamMutation = useMutation({
    mutationFn: async (dreamId: string) => {
      return await apiRequest("DELETE", `/api/dreams/${dreamId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dreams"] });
      toast({
        title: "Sonho Removido",
        description: "O registro foi excluído com sucesso",
      });
    },
  });

  const handleSubmit = () => {
    if (dreamText.trim().length < 20) {
      toast({
        title: "Sonho muito curto",
        description: "Por favor, descreva seu sonho com mais detalhes",
        variant: "destructive",
      });
      return;
    }
    addDreamMutation.mutate(dreamText);
  };

  if (authLoading || !user) {
    return <DreamsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">
            Diário de Sonhos
          </h1>
          <p className="text-muted-foreground">
            Registre seus sonhos e descubra mensagens do seu inconsciente
          </p>
        </div>

        {/* Dream Input */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Novo Sonho</h2>
                <p className="text-sm text-muted-foreground">O que você sonhou?</p>
              </div>
            </div>
            <Textarea
              placeholder="Descreva seu sonho em detalhes... Quanto mais informações, melhor a análise da IA Onírica."
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              className="min-h-32 resize-none"
              data-testid="input-dream-text"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                {dreamText.length} caracteres (mínimo 20)
              </p>
              <Button
                onClick={handleSubmit}
                disabled={addDreamMutation.isPending || dreamText.length < 20}
                data-testid="button-submit-dream"
              >
                {addDreamMutation.isPending ? (
                  <>Salvando...</>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Registrar Sonho
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Dreams List */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Seus Sonhos</h2>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
            </div>
          ) : dreams && dreams.length > 0 ? (
            <AnimatePresence>
              {dreams.map((dream) => (
                <DreamCard
                  key={dream.id}
                  dream={dream}
                  onAnalyze={() => analyzeDreamMutation.mutate(dream.id)}
                  onDelete={() => deleteDreamMutation.mutate(dream.id)}
                  isAnalyzing={analyzeDreamMutation.isPending}
                />
              ))}
            </AnimatePresence>
          ) : (
            <Card className="p-12 text-center">
              <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Você ainda não registrou nenhum sonho. Comece agora!
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function DreamCard({ dream, onAnalyze, onDelete, isAnalyzing }: {
  dream: Dream;
  onAnalyze: () => void;
  onDelete: () => void;
  isAnalyzing: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <Card className="p-6 hover-elevate">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {new Date(dream.dreamDate).toLocaleDateString('pt-BR')}
              </span>
              {dream.analyzed && (
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Analisado
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" data-testid={`button-favorite-${dream.id}`}>
                <Heart className={`w-4 h-4 ${dream.isFavorite ? 'fill-current text-destructive' : ''}`} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={onDelete}
                data-testid={`button-delete-${dream.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Dream Text */}
          <div>
            <p className="text-sm leading-relaxed" data-testid={`text-dream-${dream.id}`}>
              {expanded ? dream.dreamText : dream.dreamText.substring(0, 150) + (dream.dreamText.length > 150 ? '...' : '')}
            </p>
            {dream.dreamText.length > 150 && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="px-0 h-auto"
              >
                {expanded ? 'Ver menos' : 'Ver mais'}
              </Button>
            )}
          </div>

          {/* AI Analysis */}
          {!dream.analyzed ? (
            <Button
              variant="outline"
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="w-full"
              data-testid={`button-analyze-${dream.id}`}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analisando...' : 'Pedir Análise da IA Onírica'}
            </Button>
          ) : (
            <div className="space-y-3 pt-4 border-t">
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">🌙 Tema Central</p>
                  <p className="text-sm">{dream.themeCentral}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">🔮 Símbolos-Chave</p>
                  <p className="text-sm">{dream.simbolosChave}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">💭 Mensagem do Inconsciente</p>
                  <p className="text-sm">{dream.mensagemInconsciente}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">✨ Ritual Sugerido</p>
                  <p className="text-sm italic">{dream.ritualSugerido}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function DreamsSkeleton() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-48 rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
