import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { db } from "./db";
import {
  users,
  dreams,
  natalCharts,
  dailyInsights,
  achievements,
  userAchievements,
  insertDreamSchema,
  onboardingSchema,
  type Dream,
  type DailyInsight,
  type User,
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  // Onboarding endpoint - Save birth data and calculate natal chart
  app.post("/api/onboarding", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const data = onboardingSchema.parse(req.body);

      // Calculate basic sun, moon, ascendant signs (simplified for MVP)
      const { sunSign, moonSign, ascendantSign } = calculateNatalChart(
        new Date(data.birthDate),
        data.birthTime,
        parseFloat(data.birthLatitude),
        parseFloat(data.birthLongitude)
      );

      // Update user with birth data
      await db
        .update(users)
        .set({
          birthDate: data.birthDate,
          birthTime: data.birthTime,
          birthLocation: data.birthLocation,
          birthLatitude: data.birthLatitude,
          birthLongitude: data.birthLongitude,
          sunSign,
          moonSign,
          ascendantSign,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      // Store natal chart data
      await db.insert(natalCharts).values({
        userId: userId,
        chartData: {
          sun: sunSign,
          moon: moonSign,
          ascendant: ascendantSign,
          birthData: data,
        },
      });

      // Grant "First Steps" achievement
      await grantAchievement(userId, "first_onboarding");

      res.json({ success: true, sunSign, moonSign, ascendantSign });
    } catch (error: any) {
      console.error("Onboarding error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Get daily advice
  app.get("/api/daily-advice", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      
      const today = new Date().toISOString().split("T")[0];

      // Check if we have today's advice cached
      const [cached] = await db
        .select()
        .from(dailyInsights)
        .where(and(eq(dailyInsights.userId, userId), eq(dailyInsights.date, today)));

      if (cached) {
        return res.json(cached);
      }

      // Generate new daily advice
      const advice = generateDailyAdvice(user!);
      
      const [newInsight] = await db
        .insert(dailyInsights)
        .values({
          userId: userId,
          date: today,
          ...advice,
        })
        .returning();

      res.json(newInsight);
    } catch (error: any) {
      console.error("Daily advice error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get natal chart
  app.get("/api/natal-chart", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const [chart] = await db
        .select()
        .from(natalCharts)
        .where(eq(natalCharts.userId, userId));

      if (!chart) {
        return res.status(404).json({ error: "Natal chart not found" });
      }

      res.json(chart);
    } catch (error: any) {
      console.error("Natal chart error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get dreams
  app.get("/api/dreams", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const userDreams = await db
        .select()
        .from(dreams)
        .where(eq(dreams.userId, userId))
        .orderBy(desc(dreams.dreamDate));

      res.json(userDreams);
    } catch (error: any) {
      console.error("Get dreams error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Add dream
  app.post("/api/dreams", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const data = insertDreamSchema.parse(req.body);

      const [newDream] = await db
        .insert(dreams)
        .values({
          userId: userId,
          dreamText: data.dreamText,
          dreamDate: new Date(),
        })
        .returning();

      // Grant dream achievement
      const dreamCount = await db
        .select()
        .from(dreams)
        .where(eq(dreams.userId, userId));
      
      if (dreamCount.length === 1) {
        await grantAchievement(userId, "first_dream");
      } else if (dreamCount.length === 7) {
        await grantAchievement(userId, "dream_week");
      }

      res.json(newDream);
    } catch (error: any) {
      console.error("Add dream error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Analyze dream with AI
  app.post("/api/dreams/:id/analyze", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      const dreamId = req.params.id;

      const [dream] = await db
        .select()
        .from(dreams)
        .where(and(eq(dreams.id, dreamId), eq(dreams.userId, userId)));

      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }

      if (dream.analyzed) {
        return res.json(dream);
      }

      // Call OpenAI for dream analysis
      const analysis = await analyzeDreamWithAI(dream.dreamText, user!);

      // Update dream with analysis
      const [updatedDream] = await db
        .update(dreams)
        .set({
          analyzed: true,
          themeCentral: analysis.themeCentral,
          simbolosChave: analysis.simbolosChave,
          mensagemInconsciente: analysis.mensagemInconsciente,
          ritualSugerido: analysis.ritualSugerido,
        })
        .where(eq(dreams.id, dreamId))
        .returning();

      // Grant analysis achievement
      await grantAchievement(userId, "first_analysis");

      res.json(updatedDream);
    } catch (error: any) {
      console.error("Analyze dream error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete dream
  app.delete("/api/dreams/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const dreamId = req.params.id;

      await db
        .delete(dreams)
        .where(and(eq(dreams.id, dreamId), eq(dreams.userId, userId)));

      res.json({ success: true });
    } catch (error: any) {
      console.error("Delete dream error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get achievements
  app.get("/api/achievements", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const userAchievs = await db
        .select()
        .from(userAchievements)
        .where(eq(userAchievements.userId, userId));

      res.json(userAchievs);
    } catch (error: any) {
      console.error("Get achievements error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper: Calculate natal chart (simplified)
function calculateNatalChart(
  birthDate: Date,
  birthTime: string,
  latitude: number,
  longitude: number
) {
  // Simplified sun sign calculation based on birth month/day
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();

  const sunSign = getSunSign(month, day);
  
  // For MVP, moon sign is offset by 2 signs
  const moonSign = getOffsetSign(sunSign, 2);
  
  // Ascendant based on birth time (simplified)
  const hour = parseInt(birthTime.split(":")[0]);
  const ascendantSign = getSignByHour(hour);

  return { sunSign, moonSign, ascendantSign };
}

function getSunSign(month: number, day: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Áries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Touro";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gêmeos";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Câncer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leão";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgem";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Escorpião";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagitário";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricórnio";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquário";
  return "Peixes";
}

function getOffsetSign(sign: string, offset: number): string {
  const signs = [
    "Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem",
    "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"
  ];
  const index = signs.indexOf(sign);
  return signs[(index + offset) % 12];
}

function getSignByHour(hour: number): string {
  const signs = [
    "Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem",
    "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"
  ];
  return signs[Math.floor(hour / 2) % 12];
}

// Helper: Generate daily advice
function generateDailyAdvice(user: User) {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const sunSignToday = getSunSign(month, day);
  const moonSignToday = getOffsetSign(sunSignToday, Math.floor(day / 3));
  const moonPhase = getMoonPhase(today);

  const energiaPrincipal = getEnergyMessage(sunSignToday, moonSignToday);
  const conselhos = getAdviceForSigns(sunSignToday, moonSignToday, user.sunSign || sunSignToday);
  const humorCosmico = getCosmicMood(moonPhase);

  return {
    energiaPrincipal,
    conselhos,
    humorCosmico,
    sunSignToday,
    moonSignToday,
    moonPhase,
  };
}

function getMoonPhase(date: Date): string {
  // Simplified moon phase calculation
  const day = date.getDate();
  if (day <= 7) return "Lua Nova";
  if (day <= 14) return "Lua Crescente";
  if (day <= 21) return "Lua Cheia";
  return "Lua Minguante";
}

function getEnergyMessage(sunSign: string, moonSign: string): string {
  return `Hoje o cosmos traz uma combinação poderosa: o Sol em ${sunSign} ilumina seu caminho com determinação, enquanto a Lua em ${moonSign} nutre suas emoções mais profundas. É um dia para equilibrar ação externa com reflexão interna.`;
}

function getAdviceForSigns(sunSign: string, moonSign: string, userSunSign: string): string[] {
  return [
    `Com o Sol em ${sunSign}, foque em expressar sua autenticidade. Sua luz interior precisa brilhar hoje.`,
    `A Lua em ${moonSign} pede que você honre suas necessidades emocionais. Reserve tempo para autocuidado.`,
    `Como ${userSunSign}, você está especialmente sintonizado com as energias cósmicas hoje. Confie na sua intuição.`,
  ];
}

function getCosmicMood(moonPhase: string): string {
  const moods: Record<string, string> = {
    "Lua Nova": "Energia de renovação e novos começos",
    "Lua Crescente": "Momento de crescimento e expansão",
    "Lua Cheia": "Pico de manifestação e revelações",
    "Lua Minguante": "Tempo de liberação e desapego",
  };
  return moods[moonPhase] || "Energia equilibrada e harmoniosa";
}

// Helper: Analyze dream with OpenAI
async function analyzeDreamWithAI(dreamText: string, user: User) {
  const prompt = `Você é a IA Onírica, uma especialista em interpretação de sonhos baseada na psicologia junguiana e no simbolismo arquetípico. Analise o seguinte sonho com profundidade e sabedoria:

SONHO: "${dreamText}"

CONTEXTO DO SONHADOR:
- Signo Solar: ${user.sunSign || "Desconhecido"}
- Signo Lunar: ${user.moonSign || "Desconhecido"}

Por favor, forneça uma análise estruturada em formato JSON com os seguintes campos:
{
  "themeCentral": "Qual é o tema central deste sonho? (1-2 frases)",
  "simbolosChave": "Quais são os 3 símbolos mais importantes e seus significados? (2-3 frases)",
  "mensagemInconsciente": "Que mensagem o inconsciente está tentando comunicar? (2-3 frases)",
  "ritualSugerido": "Sugira um ritual simples e místico para integrar essa mensagem (1-2 frases)"
}

Seja profundo, poético e transformador. Use linguagem acessível mas mística.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é a IA Onírica, uma sábia intérprete de sonhos que combina psicologia junguiana com sabedoria mística. Sempre responda em português brasileiro com formato JSON válido.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0].message.content;
    const analysis = JSON.parse(response || "{}");

    return {
      themeCentral: analysis.themeCentral || "Tema não identificado",
      simbolosChave: analysis.simbolosChave || "Símbolos não identificados",
      mensagemInconsciente: analysis.mensagemInconsciente || "Mensagem não identificada",
      ritualSugerido: analysis.ritualSugerido || "Reflita sobre seu sonho em silêncio",
    };
  } catch (error) {
    console.error("OpenAI error:", error);
    // Fallback analysis
    return {
      themeCentral: "Seu sonho reflete uma jornada interior importante",
      simbolosChave: "Os elementos do sonho representam aspectos de sua psique buscando integração",
      mensagemInconsciente: "Há uma transformação acontecendo em seu mundo interior",
      ritualSugerido: "Medite sobre os símbolos do sonho por 5 minutos antes de dormir",
    };
  }
}

// Helper: Grant achievement
async function grantAchievement(userId: string, achievementId: string) {
  try {
    // Check if already granted
    const [existing] = await db
      .select()
      .from(userAchievements)
      .where(
        and(
          eq(userAchievements.userId, userId),
          eq(userAchievements.achievementId, achievementId)
        )
      );

    if (!existing) {
      await db.insert(userAchievements).values({
        userId,
        achievementId,
        unlockedAt: new Date(),
        progress: 100,
      });
    }
  } catch (error) {
    console.error("Grant achievement error:", error);
  }
}
