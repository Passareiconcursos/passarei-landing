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
  jsonb,
  date,
  uuid,
} from "drizzle-orm/pg-core";

// ============================================
// ENUMS
// ============================================

export const roleEnum = pgEnum("role", [
  "SUPER_ADMIN",
  "MODERATOR",
  "VIEWER",
  "USER",
]);
export const examTypeEnum = pgEnum("exam_type", [
  "PF", // Polícia Federal
  "PRF", // Polícia Rodoviária Federal
  "PP_FEDERAL", // Polícia Penal Federal
  "PL_FEDERAL", // Polícia Legislativa Federal
  "PM", // Polícia Militar
  "PC", // Polícia Civil
  "PP_ESTADUAL", // Polícia Penal Estadual
  "PL_ESTADUAL", // Polícia Legislativa Estadual
  "CBM", // Corpo de Bombeiros Militar
  "GM", // Guarda Municipal
  "OUTRO",
]);
export const sphereEnum = pgEnum("sphere", ["FEDERAL", "ESTADUAL"]);
export const leadStatusEnum = pgEnum("lead_status", [
  "NOVO", // Novo lead
  "CONTATADO", // Já contatado
  "QUALIFICADO", // Qualificado/Interessado
  "CONVERTIDO", // Convertido em usuário
]);
export const planEnum = pgEnum("plan", ["FREE", "CALOURO", "VETERANO"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "ACTIVE",
  "PAST_DUE",
  "CANCELED",
  "UNPAID",
  "TRIALING",
]);
export const auditActionEnum = pgEnum("audit_action", [
  "LOGIN",
  "LOGOUT",
  "CREATE",
  "UPDATE",
  "DELETE",
  "EXPORT",
  "VIEW",
]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "NEW_LEAD",
  "NEW_USER",
  "PAYMENT_FAILED",
  "SUBSCRIPTION_CANCELED",
  "HIGH_CHURN_ALERT",
  "SYSTEM_ERROR",
  "MILESTONE_REACHED",
]);
export const contentStatusEnum = pgEnum("content_status", [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

// Novos enums para sistema de conteúdo
export const positionEnum = pgEnum("position", [
  "SOLDADO",
  "CABO",
  "SARGENTO",
  "OFICIAL",
  "DELEGADO",
  "INVESTIGADOR",
  "ESCRIVAO",
  "AGENTE",
  "PERITO",
]);

export const materialTypeEnum = pgEnum("material_type", [
  "PDF",
  "APOSTILA",
  "TEXTO",
  "LINK",
]);

export const subjectEnum = pgEnum("subject", [
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
  "INFORMATICA_FORENSE",
]);

// ============================================
// ADMIN - Autenticação e Permissões
// ============================================

export const admins = pgTable("admins", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
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
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id")
    .notNull()
    .references(() => admins.id, { onDelete: "cascade" }),

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
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id")
    .notNull()
    .references(() => admins.id),

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
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  examType: examTypeEnum("exam_type").notNull(),
  state: varchar("state", { length: 2 }).notNull(),

  // Novos campos para admin
  status: leadStatusEnum("status").notNull().default("NOVO"),
  source: text("source").default("landing_page"),
  notes: text("notes"),
  assignedTo: varchar("assigned_to").references(() => admins.id),

  // Marketing/UTM
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),

  // WhatsApp opt-in
  acceptedWhatsApp: boolean("accepted_whats_app").notNull().default(true),

  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  convertedAt: timestamp("converted_at"),
});

// ============================================
// USERS - Usuários da plataforma
// ============================================

export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
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
  subscriptionId: uuid("subscription_id").unique(),
  subscriptionStatus: text("subscription_status"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),

  // Origem
  leadOriginId: uuid("lead_origin_id")
    .unique()
    .references(() => leads.id),

  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  lastActiveAt: timestamp("last_active_at"),
});

// ============================================
// SUBSCRIPTIONS - Assinaturas e Pagamentos
// ============================================

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

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
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
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
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").references(() => admins.id, {
    onDelete: "set null",
  }),

  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  link: text("link"),

  isRead: boolean("is_read").notNull().default(false),
  readAt: timestamp("read_at"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================
// CATEGORIES - Tipos de Polícia
// ============================================

export const categories = pgTable("categories", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // "Polícia Federal", "Polícia Militar"
  slug: text("slug").notNull().unique(), // "pf", "pm"
  examType: examTypeEnum("exam_type").notNull(), // PM, PC, PRF, PF
  description: text("description"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================
// SUBCATEGORIES - Esferas e Estados
// ============================================

export const subcategories = pgTable("subcategories", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),

  name: text("name").notNull(), // "Federal", "MG", "SP"
  slug: text("slug").notNull(), // "federal", "mg", "sp"
  sphere: sphereEnum("sphere").notNull(), // FEDERAL ou ESTADUAL
  state: varchar("state", { length: 2 }), // Estado (apenas se ESTADUAL)

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================
// SUBJECTS - Matérias (Tabela de Referência)
// ============================================

export const subjects = pgTable("subjects", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // "Direito Penal"
  slug: text("slug").notNull().unique(), // "direito-penal"
  subjectEnum: subjectEnum("subject_enum").notNull(), // Referência ao enum
  category: text("category").notNull(), // "DIREITO", "CONHECIMENTOS_BASICOS", "CONHECIMENTOS_TECNICOS"
  description: text("description"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================
// MATERIALS - PDFs e Apostilas
// ============================================

export const materials = pgTable("materials", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  subjectId: varchar("subject_id").references(() => subjects.id, {
    onDelete: "set null",
  }),

  title: text("title").notNull(),
  type: materialTypeEnum("type").notNull(),
  url: text("url"), // URL do PDF/Apostila
  fileName: text("file_name"),
  fileSize: integer("file_size"), // em bytes

  // Texto extraído pela IA
  extractedText: text("extracted_text"),

  // Relacionado ao concurso
  examType: examTypeEnum("exam_type"),
  sphere: sphereEnum("sphere"),
  state: varchar("state", { length: 2 }),

  uploadedBy: varchar("uploaded_by")
    .notNull()
    .references(() => admins.id),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
  processedAt: timestamp("processed_at"), // Quando IA processou

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================
// CONTENT - Conteúdo educacional
// ============================================

export const content = pgTable("content", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

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

  // NOVOS CAMPOS
  cargoTarget: text("cargo_target")
    .array()
    .default(sql`ARRAY[]::text[]`), // Array de cargos ["DELEGADO", "INVESTIGADOR"]
  generatedByAI: boolean("generated_by_ai").notNull().default(false),
  materialId: varchar("material_id").references(() => materials.id, {
    onDelete: "set null",
  }), // Material usado para gerar

  // Seções estruturadas do conteúdo
  definition: text("definition"), // Definição clara
  keyPoints: text("key_points"), // Pontos principais
  example: text("example"), // Exemplo prático
  tip: text("tip"), // Dica de prova

  // Tags para busca e categorização
  tags: text("tags")
    .array()
    .default(sql`ARRAY[]::text[]`), // Array de tags

  // Status
  status: contentStatusEnum("status").notNull().default("DRAFT"),

  // Auditoria
  createdBy: varchar("created_by")
    .notNull()
    .references(() => admins.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================
// QUESTIONS - Questões vinculadas aos conteúdos
// ============================================

export const questions = pgTable("questions", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  contentId: varchar("content_id")
    .notNull()
    .references(() => content.id, { onDelete: "cascade" }),

  // Questão
  questionText: text("question_text").notNull(),

  // Alternativas
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  optionE: text("option_e"),

  correctAnswer: varchar("correct_answer", { length: 1 }).notNull(), // A, B, C, D ou E
  explanation: text("explanation"), // Explicação da resposta

  // Metadata
  difficulty: varchar("difficulty", { length: 20 }), // "FACIL", "MEDIO", "DIFICIL"
  generatedByAI: boolean("generated_by_ai").notNull().default(false),

  // Auditoria
  createdBy: varchar("created_by")
    .notNull()
    .references(() => admins.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
// ============================================
// NOVAS TABELAS: EDITAIS E MATERIAIS
// ============================================

export const editals = pgTable("editals", {
  id: uuid("id").defaultRandom().primaryKey(),
  examType: varchar("exam_type", { length: 50 }).notNull(), // PF, PRF, PM, etc
  state: varchar("state", { length: 2 }), // SP, RJ, null=federal
  year: integer("year").notNull(), // 2024, 2025
  organization: varchar("organization", { length: 100 }), // CEBRASPE, VUNESP, FCC
  pdfUrl: text("pdf_url"),
  pdfContent: text("pdf_content"), // Conteúdo extraído do PDF
  subjects: jsonb("subjects").$type<EditalSubject[]>().notNull(), // Array de matérias
  status: varchar("status", { length: 20 }).default("active"), // active, archived
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const referenceMaterials = pgTable("reference_materials", {
  id: uuid("id").defaultRandom().primaryKey(),
  examType: varchar("exam_type", { length: 50 }).notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  materialType: varchar("material_type", { length: 50 }).notNull(), // edital, apostila, lei, jurisprudencia
  title: text("title").notNull(),
  url: text("url"),
  content: text("content"), // Conteúdo indexado
  source: varchar("source", { length: 100 }), // CEBRASPE, Estratégia, oficial
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contentGenerationLog = pgTable("content_generation_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  examType: varchar("exam_type", { length: 50 }).notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  topic: text("topic").notNull(),
  contentId: varchar("content_id", { length: 255 }).references(
    () => content.id,
    { onDelete: "set null" },
  ),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
  status: varchar("status", { length: 20 }).default("used"), // used, available
});

// Types para TypeScript
export type EditalSubject = {
  name: string;
  weight: number;
  questions: number;
  topics: string[];
};

export type Edital = typeof editals.$inferSelect;
export type InsertEdital = typeof editals.$inferInsert;
export type ReferenceMaterial = typeof referenceMaterials.$inferSelect;
export type InsertReferenceMaterial = typeof referenceMaterials.$inferInsert;
export type ContentGenerationLog = typeof contentGenerationLog.$inferSelect;
