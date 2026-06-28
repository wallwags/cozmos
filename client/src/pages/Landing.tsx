import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Moon, Sun, Stars, Scroll, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-16 md:py-24 overflow-hidden">
        {/* Animated background stars */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-20 left-10 animate-pulse">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="absolute top-40 right-20 animate-pulse delay-100">
            <Stars className="w-6 h-6 text-primary" />
          </div>
          <div className="absolute bottom-32 left-1/4 animate-pulse delay-200">
            <Sparkles className="w-3 h-3 text-primary" />
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Descubra Seu{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-chart-2 to-chart-3">
                Universo Interior
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Astrologia personalizada e IA místican para guiar sua jornada de autoconhecimento. 
              Descubra conselhos diários, interprete sonhos e desbloqueie insights cósmicos.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-base font-semibold"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-get-started"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Começar Jornada
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 text-base"
              data-testid="button-learn-more"
            >
              Saiba Mais
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-semibold">
              Ferramentas Cósmicas
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para explorar sua essência espiritual
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover-elevate h-full transition-all duration-300 hover:-translate-y-1" data-testid={`feature-card-${index}`}>
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-semibold">
              Como Funciona
            </h2>
            <p className="text-muted-foreground">
              Sua jornada espiritual em 3 passos simples
            </p>
          </motion.div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex items-start gap-6"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-xl">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-8 p-12 rounded-2xl bg-gradient-to-br from-primary/10 via-chart-2/10 to-chart-3/10"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            Pronto para Despertar?
          </h2>
          <p className="text-lg text-muted-foreground">
            Junte-se a milhares de exploradores espirituais em sua jornada de autoconhecimento
          </p>
          <Button
            size="lg"
            className="rounded-full px-10 py-6 text-lg font-semibold"
            onClick={() => window.location.href = "/api/login"}
            data-testid="button-cta-bottom"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Iniciar Agora
          </Button>
        </motion.div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: Sun,
    title: "Mapa Astral Personalizado",
    description: "Descubra seu Sol, Lua e Ascendente. Compreenda a energia única que molda sua personalidade e destino."
  },
  {
    icon: Moon,
    title: "Conselhos Diários",
    description: "Receba orientações práticas baseadas nos trânsitos astrológicos atuais para navegar seu dia com sabedoria."
  },
  {
    icon: Scroll,
    title: "Diário de Sonhos com IA",
    description: "Interprete seus sonhos com a IA Onírica, revelando símbolos e mensagens do seu inconsciente."
  },
  {
    icon: Stars,
    title: "Sol & Lua do Dia",
    description: "Acompanhe as energias solares e lunares diárias, incluindo fases da lua e seus significados."
  },
  {
    icon: Sparkles,
    title: "Insights Personalizados",
    description: "Análises profundas conectando seus sonhos, trânsitos e padrões de comportamento."
  },
  {
    icon: Award,
    title: "Gamificação Espiritual",
    description: "Desbloqueie conquistas, suba de nível e acompanhe seu progresso na jornada de autoconhecimento."
  },
];

const steps = [
  {
    title: "Crie Seu Perfil Cósmico",
    description: "Compartilhe sua data, hora e local de nascimento para gerar seu mapa astral completo e personalizado."
  },
  {
    title: "Receba Orientações Diárias",
    description: "Todo dia, descubra a energia cósmica atual e conselhos práticos adaptados ao seu mapa astral."
  },
  {
    title: "Explore e Evolua",
    description: "Registre sonhos, desbloqueie conquistas e aprofunde seu autoconhecimento com insights da IA."
  },
];
