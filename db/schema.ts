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
  // Federais - Segurança
  "PF", // Polícia Federal
  "PRF", // Polícia Rodoviária Federal
  "PP_FEDERAL", // Polícia Penal Federal
  "PL_FEDERAL", // Polícia Legislativa Federal
  "PF_FERROVIARIA", // Polícia Ferroviária Federal
  "PJ_CNJ", // Polícia Judicial CNJ
  "ABIN", // Agência Brasileira de Inteligência

  // Federais - Militares
  "EXERCITO", // Exército (ESPCEX, IME, ESA)
  "MARINHA", // Marinha (Colégio Naval, Escola Naval, Fuzileiros)
  "FAB", // Força Aérea (ITA, EPCAR, EAGS)
  "MIN_DEFESA", // Ministério da Defesa

  // Federais - Outros
  "ANAC", // Agência Nacional de Aviação Civil
  "CPNU", // Concurso Público Nacional Unificado

  // Estaduais
  "PM", // Polícia Militar
  "PC", // Polícia Civil
  "PP_ESTADUAL", // Polícia Penal Estadual
  "PL_ESTADUAL", // Polícia Legislativa Estadual
  "CBM", // Corpo de Bombeiros Militar
  "PC_CIENTIFICA", // Polícia Científica Estadual

  // Municipais
  "GM", // Guarda Municipal
  "GP", // Guarda Portuária

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
  // Polícias Civis
  "DELEGADO",
  "INVESTIGADOR",
  "ESCRIVAO",
  "AGENTE",
  "PERITO",
  "PAPILOSCOPISTA",

  // Polícias Militares / Bombeiros
  "SOLDADO",
  "CABO",
  "SARGENTO",
  "OFICIAL",
  "CFO", // Curso de Formação de Oficiais

  // Polícia Federal
  "AGENTE_PF",
  "ESCRIVAO_PF",
  "DELEGADO_PF",
  "PAPILOSCOPISTA_PF",

  // PRF
  "POLICIAL_RODOVIARIO",

  // Penal
  "AGENTE_PENITENCIARIO",
  "TECNICO_PENITENCIARIO",
  "POLICIAL_PENAL",

  // Legislativa
  "POLICIAL_LEGISLATIVO",

  // Judicial
  "POLICIAL_JUDICIAL",

  // Militares
  "ESPCEX", // Escola Preparatória de Cadetes do Exército
  "IME", // Instituto Militar de Engenharia
  "ESA", // Escola de Sargentos das Armas
  "FUZILEIRO_NAVAL",
  "ESCOLA_NAVAL",
  "COLEGIO_NAVAL",
  "ITA", // Instituto Tecnológico de Aeronáutica
  "EPCAR", // Escola Preparatória de Cadetes do Ar
  "EAGS", // Escola de Especialistas de Aeronáutica

  // Guardas
  "GUARDA_MUNICIPAL",
  "GUARDA_PORTUARIO",

  // ABIN
  "OFICIAL_INTELIGENCIA",

  // Genérico
  "TECNICO",
  "ANALISTA",
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

export const users = pgTable("User", {
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

  // Redação - controle mensal
  monthlyEssaysUsed: integer("monthly_essays_used").notNull().default(0),
  lastEssayMonth: varchar("last_essay_month", { length: 7 }), // YYYY-MM
  totalEssaysSubmitted: integer("total_essays_submitted").notNull().default(0),

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
// ESSAYS - Redações e Correções
// ============================================

export const essayStatusEnum = pgEnum("essay_status", [
  "DRAFT",      // Rascunho
  "SUBMITTED",  // Enviada para correção
  "CORRECTING", // Em correção pela IA
  "CORRECTED",  // Corrigida
  "ERROR",      // Erro na correção
]);

export const essays = pgTable("essays", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Tema e texto
  theme: text("theme").notNull(),
  prompt: text("prompt"), // Proposta de redação
  text: text("text").notNull(),
  wordCount: integer("word_count").notNull().default(0),

  // Status
  status: essayStatusEnum("status").notNull().default("SUBMITTED"),

  // Notas (5 competências de redação: 0-200 cada)
  score1: integer("score_1"), // Competência 1: Domínio da norma culta
  score2: integer("score_2"), // Competência 2: Compreensão do tema
  score3: integer("score_3"), // Competência 3: Seleção e organização
  score4: integer("score_4"), // Competência 4: Coesão textual
  score5: integer("score_5"), // Competência 5: Proposta de intervenção
  totalScore: integer("total_score"), // Nota total (0-1000)

  // Feedback da IA
  feedback: text("feedback"), // Feedback geral
  feedbackComp1: text("feedback_comp_1"),
  feedbackComp2: text("feedback_comp_2"),
  feedbackComp3: text("feedback_comp_3"),
  feedbackComp4: text("feedback_comp_4"),
  feedbackComp5: text("feedback_comp_5"),

  // Pagamento
  wasFree: boolean("was_free").notNull().default(false),
  amountPaid: real("amount_paid").default(0),

  // Timestamps
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  correctedAt: timestamp("corrected_at"),
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

// Tabela: Respostas dos usuários
export const userAnswers = pgTable("user_answers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("userId", { length: 255 }).notNull(),
  contentId: varchar("contentId", { length: 255 }), // ← NOVO!
  questionId: integer("questionId"), // ← Tornar opcional
  selectedAnswer: integer("selectedAnswer").notNull(),
  correct: boolean("correct").notNull(),
  answeredAt: timestamp("answeredAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================
// SM2 - REVISÃO ESPAÇADA (VETERANO)
// ============================================

export const sm2Reviews = pgTable("sm2_reviews", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  contentId: varchar("content_id", { length: 255 }).notNull(),

  // Campos do algoritmo SM2
  easeFactor: real("ease_factor").notNull().default(2.5), // 1.3 a 5.0
  interval: integer("interval").notNull().default(1), // dias até próxima revisão
  repetitions: integer("repetitions").notNull().default(0), // vezes revisada
  nextReviewDate: timestamp("next_review_date").notNull(), // quando revisar

  // Histórico
  lastQuality: integer("last_quality"), // 0-5 qualidade da resposta
  timesCorrect: integer("times_correct").notNull().default(0),
  timesIncorrect: integer("times_incorrect").notNull().default(0),
  totalReviews: integer("total_reviews").notNull().default(0),

  // Timestamps
  firstSeenAt: timestamp("first_seen_at").notNull().defaultNow(),
  lastReviewedAt: timestamp("last_reviewed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================
// SIMULADOS - PROVAS MENSAIS (VETERANO)
// ============================================

export const simuladoStatusEnum = pgEnum("simulado_status", [
  "AVAILABLE", // Disponível para iniciar
  "IN_PROGRESS", // Em andamento
  "COMPLETED", // Finalizado
  "EXPIRED", // Expirado (não completou no prazo)
]);

// Simulados disponíveis (criados mensalmente)
export const simulados = pgTable("simulados", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  examType: examTypeEnum("exam_type").notNull(),

  // Configuração
  totalQuestions: integer("total_questions").notNull().default(50),
  durationMinutes: integer("duration_minutes").notNull().default(120), // 2 horas
  passingScore: integer("passing_score").notNull().default(60), // 60%

  // Período de disponibilidade
  month: varchar("month", { length: 7 }).notNull(), // YYYY-MM
  availableFrom: timestamp("available_from").notNull(),
  availableUntil: timestamp("available_until").notNull(),

  // Status
  isActive: boolean("is_active").notNull().default(true),

  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Questões de cada simulado
export const simuladoQuestions = pgTable("simulado_questions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  simuladoId: uuid("simulado_id")
    .notNull()
    .references(() => simulados.id, { onDelete: "cascade" }),
  contentId: varchar("content_id", { length: 255 }).notNull(),
  questionOrder: integer("question_order").notNull(),

  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Tentativas dos usuários
export const userSimulados = pgTable("user_simulados", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  simuladoId: uuid("simulado_id")
    .notNull()
    .references(() => simulados.id, { onDelete: "cascade" }),

  // Progresso
  status: simuladoStatusEnum("status").notNull().default("IN_PROGRESS"),
  currentQuestion: integer("current_question").notNull().default(0),
  correctAnswers: integer("correct_answers").notNull().default(0),
  wrongAnswers: integer("wrong_answers").notNull().default(0),

  // Resultados
  score: integer("score"), // Percentual final
  passed: boolean("passed"), // Se passou (>= passingScore)
  timeSpentMinutes: integer("time_spent_minutes"),

  // Timestamps
  startedAt: timestamp("started_at").notNull().defaultNow(),
  finishedAt: timestamp("finished_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Respostas do simulado
export const simuladoAnswers = pgTable("simulado_answers", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userSimuladoId: uuid("user_simulado_id")
    .notNull()
    .references(() => userSimulados.id, { onDelete: "cascade" }),
  questionId: uuid("question_id")
    .notNull()
    .references(() => simuladoQuestions.id, { onDelete: "cascade" }),

  selectedAnswer: integer("selected_answer").notNull(),
  correct: boolean("correct").notNull(),
  answeredAt: timestamp("answered_at").notNull().defaultNow(),
});

// ============================================
// TRANSACTIONS - Histórico de Pagamentos MP
// ============================================

export const transactionStatusEnum = pgEnum("transaction_status", [
  "APPROVED",
  "PENDING",
  "REJECTED",
  "CANCELLED",
  "REFUNDED",
  "IN_PROCESS",
  "IN_MEDIATION",
]);

export const transactions = pgTable("transactions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  // Mercado Pago IDs
  mpPaymentId: varchar("mp_payment_id", { length: 50 }).notNull().unique(),
  mpPreferenceId: varchar("mp_preference_id", { length: 100 }),

  // Usuário
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  telegramId: varchar("telegram_id", { length: 50 }),
  payerEmail: varchar("payer_email", { length: 255 }),

  // Detalhes do pagamento
  packageId: varchar("package_id", { length: 50 }).notNull(),
  amount: real("amount").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("BRL"),
  status: transactionStatusEnum("status").notNull(),
  statusDetail: varchar("status_detail", { length: 100 }),

  // Método de pagamento
  paymentMethodId: varchar("payment_method_id", { length: 50 }),
  paymentTypeId: varchar("payment_type_id", { length: 50 }), // credit_card, debit_card, pix
  installments: integer("installments").default(1),

  // Antifraude
  deviceId: varchar("device_id", { length: 100 }),
  ipAddress: varchar("ip_address", { length: 45 }),

  // Dados brutos do MP
  rawData: jsonb("raw_data"),

  // Timestamps
  mpDateCreated: timestamp("mp_date_created"),
  mpDateApproved: timestamp("mp_date_approved"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================
// REFUNDS - Estornos de Pagamentos
// ============================================

export const refundStatusEnum = pgEnum("refund_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const refunds = pgTable("refunds", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  transactionId: uuid("transaction_id"),
  mpPaymentId: varchar("mp_payment_id", { length: 50 }),
  mpRefundId: varchar("mp_refund_id", { length: 50 }),
  userId: text("user_id"),
  telegramId: varchar("telegram_id", { length: 50 }),

  amount: real("amount").notNull(),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 20 }).default("PENDING"),

  processedBy: text("processed_by"),
  processedAt: timestamp("processed_at"),

  mpResponse: jsonb("mp_response"),
  notes: text("notes"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Refund = typeof refunds.$inferSelect;
export type InsertRefund = typeof refunds.$inferInsert;

// ============================================
// PROMO CODES - Códigos Promocionais
// ============================================

export const promoTypeEnum = pgEnum("promo_type", [
  "DISCOUNT",
  "GRATUITY",
]);

export const promoCodes = pgTable("promo_codes", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  code: varchar("code", { length: 20 }).notNull().unique(),
  description: text("description"),

  type: varchar("type", { length: 20 }).notNull(), // DISCOUNT ou GRATUITY

  // Se DISCOUNT:
  discountPercent: integer("discount_percent"),

  // Se GRATUITY:
  grantedPlan: varchar("granted_plan", { length: 20 }), // CALOURO ou VETERANO
  grantedDays: integer("granted_days"),

  maxUses: integer("max_uses").default(100),
  currentUses: integer("current_uses").default(0),

  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),

  createdBy: text("created_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const promoRedemptions = pgTable("promo_redemptions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  promoCodeId: uuid("promo_code_id").references(() => promoCodes.id, { onDelete: "cascade" }),
  userId: text("user_id"),
  telegramId: varchar("telegram_id", { length: 50 }),

  redeemedAt: timestamp("redeemed_at").notNull().defaultNow(),

  benefitApplied: jsonb("benefit_applied"),
});

export type PromoCode = typeof promoCodes.$inferSelect;
export type InsertPromoCode = typeof promoCodes.$inferInsert;
export type PromoRedemption = typeof promoRedemptions.$inferSelect;
export type InsertPromoRedemption = typeof promoRedemptions.$inferInsert;

// ============================================
// CONCURSOS - Estrutura de Concursos e Cargos
// ============================================

export const concursoSphereEnum = pgEnum("concurso_sphere", [
  "FEDERAL",
  "ESTADUAL",
  "MUNICIPAL",
]);

// Tabela de Concursos/Instituições
export const concursos = pgTable("concursos", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  // Informações básicas
  nome: varchar("nome", { length: 100 }).notNull(), // Ex: "Polícia Federal"
  sigla: varchar("sigla", { length: 20 }).notNull().unique(), // Ex: "PF"
  descricao: text("descricao"),

  // Classificação
  esfera: concursoSphereEnum("esfera").notNull(), // FEDERAL, ESTADUAL, MUNICIPAL
  examType: examTypeEnum("exam_type").notNull(),

  // Links úteis
  editalUrl: text("edital_url"),
  siteOficial: text("site_oficial"),

  // Configuração
  isActive: boolean("is_active").notNull().default(true),
  ordem: integer("ordem").default(0), // Para ordenação no frontend

  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Tabela de Cargos por Concurso
export const cargos = pgTable("cargos", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  concursoId: uuid("concurso_id")
    .notNull()
    .references(() => concursos.id, { onDelete: "cascade" }),

  // Informações do cargo
  nome: varchar("nome", { length: 100 }).notNull(), // Ex: "Agente"
  codigo: varchar("codigo", { length: 50 }).notNull(), // Ex: "AGENTE_PF"
  descricao: text("descricao"),

  // Requisitos
  escolaridade: varchar("escolaridade", { length: 50 }), // "MEDIO", "SUPERIOR"
  requisitos: text("requisitos"),

  // Configuração
  isActive: boolean("is_active").notNull().default(true),
  ordem: integer("ordem").default(0),

  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Tabela de Matérias por Cargo
export const cargoMaterias = pgTable("cargo_materias", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  cargoId: uuid("cargo_id")
    .notNull()
    .references(() => cargos.id, { onDelete: "cascade" }),

  // Informações da matéria
  nome: varchar("nome", { length: 100 }).notNull(), // Ex: "Direito Penal"
  codigo: varchar("codigo", { length: 50 }).notNull(), // Ex: "DIREITO_PENAL"
  descricao: text("descricao"),

  // Peso no concurso
  peso: real("peso").default(1), // Peso da matéria
  quantidadeQuestoes: integer("quantidade_questoes").default(10),

  // Tópicos cobrados (JSON array)
  topicos: jsonb("topicos").$type<string[]>().default([]),

  // Configuração
  isActive: boolean("is_active").notNull().default(true),
  ordem: integer("ordem").default(0),

  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Tabela para associar conteúdos a cargos específicos
export const conteudoCargos = pgTable("conteudo_cargos", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  contentId: varchar("content_id", { length: 255 })
    .notNull()
    .references(() => content.id, { onDelete: "cascade" }),

  cargoId: uuid("cargo_id")
    .notNull()
    .references(() => cargos.id, { onDelete: "cascade" }),

  cargoMateriaId: uuid("cargo_materia_id")
    .references(() => cargoMaterias.id, { onDelete: "set null" }),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Types para as novas tabelas
export type Concurso = typeof concursos.$inferSelect;
export type InsertConcurso = typeof concursos.$inferInsert;
export type Cargo = typeof cargos.$inferSelect;
export type InsertCargo = typeof cargos.$inferInsert;
export type CargoMateria = typeof cargoMaterias.$inferSelect;
export type InsertCargoMateria = typeof cargoMaterias.$inferInsert;

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
