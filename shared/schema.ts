import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  
  // Birth data for natal chart
  birthDate: date("birth_date"),
  birthTime: varchar("birth_time"), // HH:MM format
  birthLocation: varchar("birth_location"),
  birthLatitude: text("birth_latitude"),
  birthLongitude: text("birth_longitude"),
  
  // Calculated astrological data
  sunSign: varchar("sun_sign"),
  moonSign: varchar("moon_sign"),
  ascendantSign: varchar("ascendant_sign"),
  
  // Gamification
  level: integer("level").default(1),
  experiencePoints: integer("experience_points").default(0),
});

export const usersRelations = relations(users, ({ many }) => ({
  dreams: many(dreams),
  achievements: many(userAchievements),
  dailyInsights: many(dailyInsights),
}));

// Natal chart storage
export const natalCharts = pgTable("natal_charts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  chartData: jsonb("chart_data").notNull(), // Stores complete planetary positions
  createdAt: timestamp("created_at").defaultNow(),
});

export const natalChartsRelations = relations(natalCharts, ({ one }) => ({
  user: one(users, {
    fields: [natalCharts.userId],
    references: [users.id],
  }),
}));

// Dreams journal
export const dreams = pgTable("dreams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  dreamText: text("dream_text").notNull(),
  dreamDate: timestamp("dream_date").defaultNow(),
  
  // AI Analysis
  analyzed: boolean("analyzed").default(false),
  themeCentral: text("theme_central"),
  simbolosChave: text("simbolos_chave"),
  mensagemInconsciente: text("mensagem_inconsciente"),
  ritualSugerido: text("ritual_sugerido"),
  
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dreamsRelations = relations(dreams, ({ one }) => ({
  user: one(users, {
    fields: [dreams.userId],
    references: [users.id],
  }),
}));

// Achievements definitions
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  icon: varchar("icon").notNull(), // Lucide icon name
  category: varchar("category").notNull(), // 'daily', 'dreams', 'lunar', 'exploration'
  requiredCount: integer("required_count").default(1),
});

// User achievements (many-to-many)
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievementId: varchar("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  progress: integer("progress").default(0),
});

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

// Daily insights cache
export const dailyInsights = pgTable("daily_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: date("date").notNull(),
  
  energiaPrincipal: text("energia_principal").notNull(),
  conselhos: jsonb("conselhos").notNull(), // Array of 3 advice strings
  humorCosmico: text("humor_cosmico").notNull(),
  
  sunSignToday: varchar("sun_sign_today").notNull(),
  moonSignToday: varchar("moon_sign_today").notNull(),
  moonPhase: varchar("moon_phase").notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const dailyInsightsRelations = relations(dailyInsights, ({ one }) => ({
  user: one(users, {
    fields: [dailyInsights.userId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertDreamSchema = createInsertSchema(dreams).pick({
  dreamText: true,
});

export const insertNatalChartSchema = createInsertSchema(natalCharts).pick({
  chartData: true,
});

export const onboardingSchema = z.object({
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  birthTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)"),
  birthLocation: z.string().min(1, "Local de nascimento é obrigatório"),
  birthLatitude: z.string().min(1, "Latitude é obrigatória"),
  birthLongitude: z.string().min(1, "Longitude é obrigatória"),
});

// TypeScript types
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type Dream = typeof dreams.$inferSelect;
export type InsertDream = z.infer<typeof insertDreamSchema>;
export type NatalChart = typeof natalCharts.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type DailyInsight = typeof dailyInsights.$inferSelect;
export type OnboardingData = z.infer<typeof onboardingSchema>;
