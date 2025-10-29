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
  notifications,
  content,
  categories,
  subcategories,
  subjects,
  materials,
  questions
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

// ============================================
// CONTENT SCHEMAS
// ============================================

const baseContentSchema = createInsertSchema(content, {
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  subject: z.enum([
    // Direito
    "DIREITO_PENAL",
    "DIREITO_CONSTITUCIONAL",
    "DIREITO_ADMINISTRATIVO",
    "DIREITO_PROCESSUAL_PENAL",
    "DIREITO_CIVIL",
    "DIREITO_PENAL_MILITAR",
    "DIREITO_PROCESSUAL_PENAL_MILITAR",
    "DIREITOS_HUMANOS",
    "LEGISLACAO_ESPECIAL",
    // Conhecimentos Básicos
    "PORTUGUES",
    "RACIOCINIO_LOGICO",
    "MATEMATICA",
    "INFORMATICA",
    "ATUALIDADES",
    "GEOGRAFIA",
    "HISTORIA",
    "ETICA_SERVICO_PUBLICO",
    "INGLES",
    "ESPANHOL",
    // Conhecimentos Técnicos
    "CRIMINOLOGIA",
    "MEDICINA_LEGAL",
    "LEGISLACAO_TRANSITO",
    "NOCOES_FISICA",
    "GEOPOLITICA",
    "PRIMEIROS_SOCORROS",
    "ESTATISTICA",
    "CONTABILIDADE",
    "ARQUIVOLOGIA",
    "ADMINISTRACAO_PUBLICA",
    // Específicas Peritos
    "BIOLOGIA_FORENSE",
    "QUIMICA_FORENSE",
    "FISICA_FORENSE",
    "INFORMATICA_FORENSE"
  ]),
  body: z.string().min(20, "Conteúdo deve ter pelo menos 20 caracteres"),
  
  // Novos campos opcionais
  editalUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  sphere: z.enum(["FEDERAL", "ESTADUAL"], { required_error: "Selecione a esfera do concurso" }),
  state: z.string().length(2, "Estado deve ter 2 caracteres").optional().or(z.literal("")),
  
  // NOVOS CAMPOS
  cargoTarget: z.array(z.string()).default([]), // Array de cargos
  materialId: z.string().optional().or(z.literal("")), // Material usado para gerar
  
  // Seções estruturadas (opcionais)
  definition: z.string().optional().or(z.literal("")),
  keyPoints: z.string().optional().or(z.literal("")),
  example: z.string().optional().or(z.literal("")),
  tip: z.string().optional().or(z.literal("")),
  
  // Tags
  tags: z.array(z.string()).default([]),
  
  examType: z.enum(["PM", "PC", "PRF", "PF", "OUTRO"]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
}).omit({
  id: true,
  createdBy: true, // Backend injeta o ID do admin autenticado
  generatedByAI: true, // Backend controla este campo
  createdAt: true,
  updatedAt: true,
});

// Adicionar validação condicional: state é obrigatório quando sphere = ESTADUAL
export const insertContentSchema = baseContentSchema.refine(
  (data) => {
    if (data.sphere === "ESTADUAL" && (!data.state || data.state === "")) {
      return false;
    }
    return true;
  },
  {
    message: "Estado é obrigatório quando a esfera for Estadual",
    path: ["state"],
  }
);

export const selectContentSchema = createSelectSchema(content);
export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof content.$inferSelect;

// ============================================
// CATEGORY SCHEMAS
// ============================================

export const insertCategorySchema = createInsertSchema(categories, {
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  slug: z.string().min(2, "Slug inválido"),
  examType: z.enum(["PM", "PC", "PRF", "PF", "OUTRO"]),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectCategorySchema = createSelectSchema(categories);
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// ============================================
// SUBCATEGORY SCHEMAS
// ============================================

export const insertSubcategorySchema = createInsertSchema(subcategories, {
  categoryId: z.string(),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  slug: z.string().min(2, "Slug inválido"),
  sphere: z.enum(["FEDERAL", "ESTADUAL"]),
  state: z.string().length(2, "Estado inválido").optional().or(z.literal("")),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectSubcategorySchema = createSelectSchema(subcategories);
export type InsertSubcategory = z.infer<typeof insertSubcategorySchema>;
export type Subcategory = typeof subcategories.$inferSelect;

// ============================================
// SUBJECT SCHEMAS (Tabela de Referência)
// ============================================

export const insertSubjectSchema = createInsertSchema(subjects, {
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  slug: z.string().min(2, "Slug inválido"),
  category: z.string().min(3, "Categoria inválida"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectSubjectSchema = createSelectSchema(subjects);
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjects.$inferSelect;

// ============================================
// MATERIAL SCHEMAS
// ============================================

export const insertMaterialSchema = createInsertSchema(materials, {
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  type: z.enum(["PDF", "APOSTILA", "TEXTO", "LINK"]),
  url: z.string().url("URL inválida").optional().or(z.literal("")),
  examType: z.enum(["PM", "PC", "PRF", "PF", "OUTRO"]).optional(),
  sphere: z.enum(["FEDERAL", "ESTADUAL"]).optional(),
  state: z.string().length(2, "Estado inválido").optional().or(z.literal("")),
}).omit({
  id: true,
  uploadedBy: true, // Backend injeta o ID do admin autenticado
  uploadedAt: true,
  processedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const selectMaterialSchema = createSelectSchema(materials);
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type Material = typeof materials.$inferSelect;

// ============================================
// QUESTION SCHEMAS
// ============================================

export const insertQuestionSchema = createInsertSchema(questions, {
  contentId: z.string(),
  questionText: z.string().min(10, "Questão deve ter pelo menos 10 caracteres"),
  optionA: z.string().min(1, "Opção A é obrigatória"),
  optionB: z.string().min(1, "Opção B é obrigatória"),
  optionC: z.string().min(1, "Opção C é obrigatória"),
  optionD: z.string().min(1, "Opção D é obrigatória"),
  optionE: z.string().optional().or(z.literal("")),
  correctAnswer: z.enum(["A", "B", "C", "D", "E"]),
  explanation: z.string().optional().or(z.literal("")),
  difficulty: z.enum(["FACIL", "MEDIO", "DIFICIL"]).optional(),
}).omit({
  id: true,
  createdBy: true, // Backend injeta o ID do admin autenticado
  createdAt: true,
  updatedAt: true,
});

export const selectQuestionSchema = createSelectSchema(questions);
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;
