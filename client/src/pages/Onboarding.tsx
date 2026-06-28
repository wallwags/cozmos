import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, MapPin, Calendar, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { onboardingSchema, type OnboardingData } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const STEPS = ["Bem-vindo", "Data de Nascimento", "Hora e Local", "Confirmação"];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<OnboardingData>>({});

  const form = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      birthDate: "",
      birthTime: "",
      birthLocation: "",
      birthLatitude: "",
      birthLongitude: "",
    },
  });

  const onboardingMutation = useMutation({
    mutationFn: async (data: OnboardingData) => {
      return await apiRequest("POST", "/api/onboarding", data);
    },
    onSuccess: () => {
      toast({
        title: "Mapa Astral Criado!",
        description: "Seu perfil cósmico está pronto. Bem-vindo ao Cosmos!",
      });
      window.location.href = "/";
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar perfil",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (currentStep === STEPS.length - 1) {
      form.handleSubmit((data) => {
        onboardingMutation.mutate(data);
      })();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-chart-2/10">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-8 space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Passo {currentStep + 1} de {STEPS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8">
              {currentStep === 0 && <WelcomeStep />}
              {currentStep === 1 && <BirthDateStep form={form} />}
              {currentStep === 2 && <BirthTimeLocationStep form={form} />}
              {currentStep === 3 && <ConfirmationStep formData={form.getValues()} />}

              <div className="flex gap-3 mt-8">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                    data-testid="button-back"
                  >
                    Voltar
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className="flex-1"
                  disabled={onboardingMutation.isPending}
                  data-testid="button-next"
                >
                  {currentStep === STEPS.length - 1 ? "Criar Mapa Astral" : "Próximo"}
                  {currentStep < STEPS.length - 1 && <Sparkles className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function WelcomeStep() {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
        <Sparkles className="w-10 h-10 text-primary" />
      </div>
      <div className="space-y-2">
        <h2 className="font-serif text-3xl font-bold">Bem-vindo ao Cosmos!</h2>
        <p className="text-muted-foreground">
          Vamos criar seu mapa astral personalizado. Para isso, precisamos conhecer alguns detalhes sobre você.
        </p>
      </div>
      <div className="bg-muted/50 rounded-lg p-4 text-sm text-left space-y-2">
        <p className="font-medium">O que você vai descobrir:</p>
        <ul className="space-y-1 text-muted-foreground">
          <li>• Seu Sol, Lua e Ascendente</li>
          <li>• Conselhos diários personalizados</li>
          <li>• Análise de sonhos com IA</li>
          <li>• Fases lunares e energias cósmicas</li>
        </ul>
      </div>
    </div>
  );
}

function BirthDateStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Calendar className="w-12 h-12 mx-auto text-primary" />
        <h2 className="font-serif text-2xl font-semibold">Quando Você Nasceu?</h2>
        <p className="text-sm text-muted-foreground">
          Sua data de nascimento revela a posição dos planetas no momento da sua chegada
        </p>
      </div>

      <Form {...form}>
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Nascimento</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  data-testid="input-birth-date"
                  className="text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </div>
  );
}

function BirthTimeLocationStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Clock className="w-12 h-12 mx-auto text-primary" />
        <h2 className="font-serif text-2xl font-semibold">Hora e Local</h2>
        <p className="text-sm text-muted-foreground">
          Estes detalhes nos ajudam a calcular seu Ascendente e casas astrológicas
        </p>
      </div>

      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="birthTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de Nascimento</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    data-testid="input-birth-time"
                    className="text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Local de Nascimento</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Cidade, Estado, País"
                      {...field}
                      className="pl-10"
                      data-testid="input-birth-location"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="birthLatitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Latitude</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="-23.5505"
                      {...field}
                      data-testid="input-latitude"
                      className="text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthLongitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Longitude</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="-46.6333"
                      {...field}
                      data-testid="input-longitude"
                      className="text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </Form>
    </div>
  );
}

function ConfirmationStep({ formData }: { formData: Partial<OnboardingData> }) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Sparkles className="w-12 h-12 mx-auto text-primary" />
        <h2 className="font-serif text-2xl font-semibold">Confirme Seus Dados</h2>
        <p className="text-sm text-muted-foreground">
          Verifique se tudo está correto antes de gerar seu mapa astral
        </p>
      </div>

      <div className="space-y-3 bg-muted/30 rounded-lg p-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Data de Nascimento</p>
          <p className="font-medium">{formData.birthDate || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Hora</p>
          <p className="font-medium">{formData.birthTime || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Local</p>
          <p className="font-medium">{formData.birthLocation || "—"}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Latitude</p>
            <p className="text-sm font-medium">{formData.birthLatitude || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Longitude</p>
            <p className="text-sm font-medium">{formData.birthLongitude || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
