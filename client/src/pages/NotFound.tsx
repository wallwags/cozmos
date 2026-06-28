import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="font-serif text-6xl md:text-8xl font-bold text-primary">
            404
          </h1>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold">
            Página Não Encontrada
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Parece que você se perdeu no cosmos. Esta página não existe ou foi movida.
          </p>
        </div>
        <Button
          onClick={() => window.location.href = "/"}
          className="rounded-full px-8"
          data-testid="button-go-home"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Voltar ao Início
        </Button>
      </div>
    </div>
  );
}
