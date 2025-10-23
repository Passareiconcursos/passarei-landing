import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  timestamp, 
  pgEnum, 
  boolean, 
  integer,
  real,
  json,
  date
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Importar schema do db para manter sincronizado
export * from "../db/schema";

// Import das tabelas específicas para criar schemas
import {
  leads,
  admins,
  adminSessions,
  auditLogs,
  users,
  subscriptions,
  dailyMetrics,
  notifications
} from "../db/schema";

// ============================================
// LEAD SCHEMAS
// ============================================

export const insertLeadSchema = createInsertSchema(leads, {
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, "WhatsApp inválido. Use o formato (99) 99999-9999"),
  examType: z.enum(["PM", "PC", "PRF", "PF", "OUTRO"]),
  state: z.string().length(2, "Estado inválido"),
  acceptedWhatsApp: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar receber conteúdo via WhatsApp",
  }),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  source: true,
  notes: true,
  assignedTo: true,
  utmSource: true,
  utmMedium: true,
  utmCampaign: true,
  convertedAt: true,
});

export const selectLeadSchema = createSelectSchema(leads);
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// ============================================
// ADMIN SCHEMAS
// ============================================

export const insertAdminSchema = createInsertSchema(admins, {
  email: z.string().email("Email inválido"),
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  passwordHash: z.string().min(60), // bcrypt hash
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
  loginAttempts: true,
  lockedUntil: true,
});

// Schema para login
export const adminLoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const selectAdminSchema = createSelectSchema(admins);
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;
export type AdminLogin = z.infer<typeof adminLoginSchema>;

// Admin sem senha (para retornar ao frontend)
export type AdminPublic = Omit<Admin, 'passwordHash' | 'loginAttempts' | 'lockedUntil'>;

// ============================================
// ADMIN SESSION SCHEMAS
// ============================================

export const insertAdminSessionSchema = createInsertSchema(adminSessions).omit({
  id: true,
  createdAt: true,
});

export const selectAdminSessionSchema = createSelectSchema(adminSessions);
export type InsertAdminSession = z.infer<typeof insertAdminSessionSchema>;
export type AdminSession = typeof adminSessions.$inferSelect;

// ============================================
// AUDIT LOG SCHEMAS
// ============================================

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true,
});

export const selectAuditLogSchema = createSelectSchema(auditLogs);
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

// ============================================
// USER SCHEMAS
// ============================================

export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Email inválido"),
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido"),
  examType: z.enum(["PM", "PC", "PRF", "PF", "OUTRO"]),
  state: z.string().length(2, "Estado inválido"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastActiveAt: true,
  passwordHash: true,
});

export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserPublic = Omit<User, 'passwordHash'>;

// ============================================
// SUBSCRIPTION SCHEMAS
// ============================================

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectSubscriptionSchema = createSelectSchema(subscriptions);
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// ============================================
// DAILY METRIC SCHEMAS
// ============================================

export const insertDailyMetricSchema = createInsertSchema(dailyMetrics).omit({
  id: true,
  updatedAt: true,
});

export const selectDailyMetricSchema = createSelectSchema(dailyMetrics);
export type InsertDailyMetric = z.infer<typeof insertDailyMetricSchema>;
export type DailyMetric = typeof dailyMetrics.$inferSelect;

// ============================================
// NOTIFICATION SCHEMAS
// ============================================

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  readAt: true,
});

export const selectNotificationSchema = createSelectSchema(notifications);
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
