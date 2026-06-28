import { db } from "./db";
import { achievements } from "@shared/schema";

const achievementsList = [
  {
    id: "first_onboarding",
    name: "Primeiros Passos",
    description: "Complete seu perfil cósmico e descubra seu mapa astral",
    icon: "Sparkles",
    category: "daily",
    requiredCount: 1,
  },
  {
    id: "first_dream",
    name: "Explorador Onírico",
    description: "Registre seu primeiro sonho no diário",
    icon: "Moon",
    category: "dreams",
    requiredCount: 1,
  },
  {
    id: "dream_week",
    name: "Semana dos Sonhos",
    description: "Registre 7 sonhos no total",
    icon: "Stars",
    category: "dreams",
    requiredCount: 7,
  },
  {
    id: "first_analysis",
    name: "Sabedoria da IA Onírica",
    description: "Receba sua primeira análise de sonho",
    icon: "Scroll",
    category: "dreams",
    requiredCount: 1,
  },
  {
    id: "daily_visitor",
    name: "Visitante Diário",
    description: "Acesse o app por 7 dias consecutivos",
    icon: "Sun",
    category: "daily",
    requiredCount: 7,
  },
  {
    id: "lunar_observer",
    name: "Observador Lunar",
    description: "Acompanhe todas as 4 fases da lua",
    icon: "Moon",
    category: "lunar",
    requiredCount: 4,
  },
];

export async function seedAchievements() {
  try {
    console.log("Seeding achievements...");
    
    for (const achievement of achievementsList) {
      // Check if already exists
      const existing = await db.query.achievements.findFirst({
        where: (a, { eq }) => eq(a.id, achievement.id),
      });

      if (!existing) {
        await db.insert(achievements).values(achievement);
        console.log(`✓ Created achievement: ${achievement.name}`);
      }
    }

    console.log("✓ Achievements seeding complete!");
  } catch (error) {
    console.error("Error seeding achievements:", error);
  }
}
