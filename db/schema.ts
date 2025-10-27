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

// ============================================
// ENUMS
// ============================================

export const roleEnum = pgEnum("role", ["SUPER_ADMIN", "MODERATOR", "VIEWER", "USER"]);
export const examTypeEnum = pgEnum("exam_type", ["PM", "PC", "PRF", "PF", "OUTRO"]);
export const sphereEnum = pgEnum("sphere", ["FEDERAL", "ESTADUAL"]);
export const leadStatusEnum = pgEnum("lead_status", [
  "NOVO",          // Novo lead
  "CONTATADO",     // Já contatado
  "QUALIFICADO",   // Qualificado/Interessado
  "CONVERTIDO"     // Convertido em usuário
]);
export const planEnum = pgEnum("plan", ["FREE", "CALOURO", "VETERANO"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "ACTIVE",
  "PAST_DUE",
  "CANCELED",
  "UNPAID",
  "TRIALING"
]);
export const auditActionEnum = pgEnum("audit_action", [
  "LOGIN",
  "LOGOUT",
  "CREATE",
  "UPDATE",
  "DELETE",
  "EXPORT",
  "VIEW"
]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "NEW_LEAD",
  "NEW_USER",
  "PAYMENT_FAILED",
  "SUBSCRIPTION_CANCELED",
  "HIGH_CHURN_ALERT",
  "SYSTEM_ERROR",
  "MILESTONE_REACHED"
]);
export const contentStatusEnum = pgEnum("content_status", ["DRAFT", "PUBLISHED", "ARCHIVED"]);
export const subjectEnum = pgEnum("subject", [
  "DIREITO_PENAL",
  "DIREITO_CONSTITUCIONAL",
  "DIREITO_ADMINISTRATIVO",
  "PORTUGUES",
  "RACIOCINIO_LOGICO",
  "INFORMATICA"
]);

// ============================================
// ADMIN - Autenticação e Permissões
// ============================================

export const admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: roleEnum("role").notNull().default("SUPER_ADMIN"),
  
  // Segurança
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  loginAttempts: integer("login_attempts").notNull().default(0),
  lockedUntil: timestamp("locked_until"),
  
  // Auditoria
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: varchar("created_by"),
});

export const adminSessions = pgTable("admin_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").notNull().references(() => admins.id, { onDelete: "cascade" }),
  
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================
// AUDIT LOG - Rastreamento de ações
// ============================================

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").notNull().references(() => admins.id),
  
  action: auditActionEnum("action").notNull(),
  resource: text("resource").notNull(), // "Lead", "User", "Content"
  resourceId: varchar("resource_id"),
  changes: json("changes"), // Antes/depois
  
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// ============================================
// LEADS - Atualizado com novos campos
// ============================================

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  examType: examTypeEnum("exam_type").notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  
  // Novos campos para admin
  status: leadStatusEnum("status").notNull().default("NEW"),
  source: text("source").default("landing_page"),
  notes: text("notes"),
  assignedTo: varchar("assigned_to").references(() => admins.id),
  
  // Marketing/UTM
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  
  // WhatsApp opt-in
  acceptedWhatsApp: boolean("accepted_whatsapp").notNull().default(true),
  
  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  convertedAt: timestamp("converted_at"),
});

// ============================================
// USERS - Usuários da plataforma
// ============================================

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  
  // Autenticação
  passwordHash: text("password_hash"),
  
  // Perfil
  examType: examTypeEnum("exam_type").notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  plan: planEnum("plan").notNull().default("FREE"),
  
  // Status
  isActive: boolean("is_active").notNull().default(true),
  emailVerified: boolean("email_verified").notNull().default(false),
  phoneVerified: boolean("phone_verified").notNull().default(false),
  
  // Assinatura
  subscriptionId: varchar("subscription_id").unique(),
  subscriptionStatus: text("subscription_status"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  
  // Origem
  leadOriginId: varchar("lead_origin_id").unique().references(() => leads.id),
  
  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  lastActiveAt: timestamp("last_active_at"),
});

// ============================================
// SUBSCRIPTIONS - Assinaturas e Pagamentos
// ============================================

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Gateway de pagamento
  externalId: text("external_id").notNull().unique(),
  plan: planEnum("plan").notNull(),
  status: subscriptionStatusEnum("status").notNull(),
  
  // Valores
  amount: real("amount").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("BRL"),
  interval: text("interval").notNull(), // "month" ou "year"
  
  // Datas
  startDate: timestamp("start_date").notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  canceledAt: timestamp("canceled_at"),
  endedAt: timestamp("ended_at"),
  
  // Pagamento
  paymentMethod: text("payment_method"),
  lastPaymentAt: timestamp("last_payment_at"),
  nextPaymentAt: timestamp("next_payment_at"),
  
  // Auditoria
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================
// DAILY METRICS - Cache de métricas diárias
// ============================================

export const dailyMetrics = pgTable("daily_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: date("date").notNull().unique(),
  
  // Leads
  newLeads: integer("new_leads").notNull().default(0),
  convertedLeads: integer("converted_leads").notNull().default(0),
  
  // Usuários
  newUsers: integer("new_users").notNull().default(0),
  activeUsers: integer("active_users").notNull().default(0),
  churnedUsers: integer("churned_users").notNull().default(0),
  
  // Financeiro
  mrr: real("mrr").notNull().default(0), // Monthly Recurring Revenue
  newRevenue: real("new_revenue").notNull().default(0),
  churnRevenue: real("churn_revenue").notNull().default(0),
  
  // Engajamento
  questionsAnswered: integer("questions_answered").notNull().default(0),
  avgStudyTime: integer("avg_study_time").notNull().default(0), // minutos
  
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================
// NOTIFICATIONS - Notificações internas
// ============================================

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").notNull().references(() => admins.id),
  
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  link: text("link"),
  
  isRead: boolean("is_read").notNull().default(false),
  readAt: timestamp("read_at"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================
// CONTENT - Conteúdo educacional
// ============================================

export const content = pgTable("content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Informações básicas
  title: text("title").notNull(),
  subject: subjectEnum("subject").notNull(),
  body: text("body").notNull(), // Conteúdo completo (200-500 palavras) - mantido para compatibilidade
  
  // Link do edital (opcional)
  editalUrl: text("edital_url"),
  
  // Esfera e localização
  sphere: sphereEnum("sphere"), // FEDERAL ou ESTADUAL
  state: varchar("state", { length: 2 }), // Estado (apenas se ESTADUAL)
  
  // Categoria/Concurso
  examType: examTypeEnum("exam_type").notNull(), // PM, PC, PRF, PF, OUTRO (ALL = OUTRO)
  
  // Seções estruturadas do conteúdo
  definition: text("definition"), // Definição clara
  keyPoints: text("key_points"), // Pontos principais
  example: text("example"), // Exemplo prático
  tip: text("tip"), // Dica de prova
  
  // Tags para busca e categorização
  tags: text("tags").array().default(sql`ARRAY[]::text[]`), // Array de tags
  
  // Status
  status: contentStatusEnum("status").notNull().default("DRAFT"),
  
  // Auditoria
  createdBy: varchar("created_by").notNull().references(() => admins.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
