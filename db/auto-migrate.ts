import { db } from "./index";
import { sql } from "drizzle-orm";

/**
 * Auto-migração que roda no startup do servidor.
 * Verifica e cria tabelas/colunas necessárias se não existirem.
 * Seguro para rodar múltiplas vezes (idempotente).
 */
export async function runAutoMigrations() {
  console.log("🔄 [Auto-Migrate] Verificando banco de dados...");

  // Cada passo tem try/catch individual: falha em um não bloqueia os demais
  const run = async (name: string, fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (err: any) {
      console.error(`⚠️ [Auto-Migrate] Passo "${name}" falhou (não fatal):`, err?.message ?? err);
    }
  };

  await run("leads",             migrateLeadsTable);
  await run("userColumns",       migrateUserColumns);
  await run("betaTester",        migrateBetaTester);
  await run("promoCodes",        migratePromoCodes);
  await run("defaultPromoCodes", createDefaultPromoCodes);
  await run("reviewColumns",     migrateReviewColumns);
  await run("essays",            migrateEssaysTable);
  await run("studentAuth",       migrateStudentAuthColumns);
  await run("gamification",      migrateGamificationColumns);
  await run("educationTables",   migrateEducationTables);
  await run("questionsNullable", migrateQuestionsCreatedByNullable);
  await run("concursosTables",   migrateConcursosTables);
  await run("userConcurso",      migrateUserConcursoColumn);
  await run("simuladoType",      migrateSimuladoTypeColumn);
  await run("cleanupPFF",        cleanupPFFConcurso);
  await run("cleanupRedundant",  cleanupRedundantConcursos);
  await run("repairEssayCredits", repairEssayCredits);
  await run("phase5Integrity",   verifyPhase5Integrity);
  await run("phase5Content",     migratePhase5ContentColumns);
  await run("phase5Question",    migratePhase5QuestionColumns);
  await run("phase5Subject",     migratePhase5SubjectColumns);
  await run("studyProgressCols", migrateStudyProgressColumns);
  await run("backfillCorrectOption", backfillCorrectOption);
  await run("backfillCertoErrado",  backfillCertoErrado);
  await run("essayCooldown",        migrateEssayCooldown);
  await run("redacaoTemplates",     migrateRedacaoTemplates);
  await run("passwordResetCodes",   migratePasswordResetCodes);
  await run("globalLogout",         migrateGlobalLogout);
  await run("mnemonicsTable",        migrateMnemonicsTable);

  console.log("✅ [Auto-Migrate] Banco de dados OK!\n");
}

async function migrateLeadsTable() {
  // Verificar se tabela "leads" existe
  const leadsExists = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'leads'
    ) as exists
  `) as any[];

  if (!leadsExists[0]?.exists) {
    // Verificar se tabela "Lead" existe (PascalCase do Prisma)
    const leadExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'Lead'
      ) as exists
    `) as any[];

    if (leadExists[0]?.exists) {
      console.log("  🔄 Renomeando 'Lead' para 'leads'...");
      // Garantir que o enum existe antes de renomear
      await db.execute(sql`
        DO $$ BEGIN
          CREATE TYPE lead_status AS ENUM ('NOVO', 'CONTATADO', 'QUALIFICADO', 'CONVERTIDO');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);
      await db.execute(sql`ALTER TABLE "Lead" RENAME TO leads`);
      console.log("  ✅ Tabela renomeada");
    } else {
      // Tabela não existe de nenhuma forma - criar do zero
      console.log("  🔄 Criando tabela 'leads'...");

      await db.execute(sql`
        DO $$ BEGIN
          CREATE TYPE lead_status AS ENUM ('NOVO', 'CONTATADO', 'QUALIFICADO', 'CONVERTIDO');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS leads (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          phone TEXT NOT NULL,
          exam_type TEXT NOT NULL,
          state VARCHAR(2) NOT NULL,
          status lead_status NOT NULL DEFAULT 'NOVO',
          source TEXT DEFAULT 'landing_page',
          notes TEXT,
          assigned_to VARCHAR,
          utm_source TEXT,
          utm_medium TEXT,
          utm_campaign TEXT,
          accepted_whats_app BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          converted_at TIMESTAMP,
          "dripEmail1SentAt" TIMESTAMP,
          "dripEmail2SentAt" TIMESTAMP,
          "dripEmail3SentAt" TIMESTAMP,
          "dripEmail4SentAt" TIMESTAMP
        )
      `);
      console.log("  ✅ Tabela 'leads' criada");
      return;
    }
  }

  // Tabela leads existe (pré-existente ou acabou de ser renomeada) - normalizar colunas Prisma
  {
    // Renomear colunas camelCase (Prisma) → snake_case (se existirem)
    const camelCols = await db.execute(sql`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'leads' AND column_name = 'createdAt'
    `) as any[];

    if (camelCols.length > 0) {
      console.log("  🔄 Normalizando colunas leads (camelCase → snake_case)...");
      // Todas as renames em try/catch para ser resiliente
      try { await db.execute(sql`ALTER TABLE leads RENAME COLUMN "createdAt" TO created_at`); } catch (_e) { console.log("    createdAt já snake_case"); }
      try { await db.execute(sql`ALTER TABLE leads RENAME COLUMN "updatedAt" TO updated_at`); } catch (_e) { console.log("    updatedAt já snake_case"); }
      try { await db.execute(sql`ALTER TABLE leads RENAME COLUMN "convertedAt" TO converted_at`); } catch (_e) {}
      try { await db.execute(sql`ALTER TABLE leads RENAME COLUMN "examType" TO exam_type`); } catch (_e) {}
      try { await db.execute(sql`ALTER TABLE leads RENAME COLUMN "acceptedWhatsApp" TO accepted_whats_app`); } catch (_e) {}
      // Adicionar colunas que podem não existir na tabela Prisma original
      try {
        await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'landing_page'`);
        await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT`);
        await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_to VARCHAR`);
        await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_source TEXT`);
        await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_medium TEXT`);
        await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_campaign TEXT`);
        // Adicionar drip columns se não existirem (renamed table may not have them)
        await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS "dripEmail1SentAt" TIMESTAMP`);
        await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS "dripEmail2SentAt" TIMESTAMP`);
        await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS "dripEmail3SentAt" TIMESTAMP`);
        await db.execute(sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS "dripEmail4SentAt" TIMESTAMP`);
      } catch (_e) { console.log("    Colunas extras já existem"); }
      console.log("  ✅ Colunas normalizadas");
    }
  }
}

async function migrateUserColumns() {
  // Verificar se last_active_at existe
  const colExists = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'User' AND column_name = 'last_active_at'
    ) as exists
  `) as any[];

  if (!colExists[0]?.exists) {
    console.log("  🔄 Adicionando coluna last_active_at...");
    await db.execute(sql`
      ALTER TABLE "User"
      ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP
    `);
    console.log("  ✅ Coluna last_active_at adicionada");
  }
}

async function migrateBetaTester() {
  const EMAIL = "oficialpassarei@gmail.com";

  // Verificar se já é VETERANO
  const userResult = await db.execute(sql`
    SELECT id, plan, "planStatus", "planEndDate"
    FROM "User"
    WHERE email = ${EMAIL}
    LIMIT 1
  `) as any[];

  if (!userResult || userResult.length === 0) {
    return; // Usuário não existe ainda
  }

  const user = userResult[0];

  // Já é VETERANO permanente? Não precisa atualizar
  if (user.plan === "VETERANO" && user.planEndDate) {
    const endDate = new Date(user.planEndDate);
    if (endDate.getFullYear() >= 2099) {
      return;
    }
  }

  console.log("  🔄 Configurando beta tester:", EMAIL);
  await db.execute(sql`
    UPDATE "User"
    SET
      plan = 'VETERANO',
      "planStatus" = 'active',
      "planEndDate" = '2099-12-31'::timestamp,
      "updatedAt" = NOW()
    WHERE email = ${EMAIL}
  `);
  console.log("  ✅ Beta tester configurado: VETERANO permanente");
}

async function migratePromoCodes() {
  // Verificar se tabela promo_codes existe
  const exists = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'promo_codes'
    ) as exists
  `) as any[];

  if (exists[0]?.exists) {
    return;
  }

  console.log("  🔄 Criando tabelas de códigos promocionais...");

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS promo_codes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code VARCHAR(20) UNIQUE NOT NULL,
      description TEXT,
      type VARCHAR(20) NOT NULL,
      discount_percent INTEGER,
      granted_plan VARCHAR(20),
      granted_days INTEGER,
      max_uses INTEGER DEFAULT 100,
      current_uses INTEGER DEFAULT 0,
      expires_at TIMESTAMP,
      is_active BOOLEAN DEFAULT true,
      created_by TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS promo_redemptions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      promo_code_id UUID REFERENCES promo_codes(id) ON DELETE CASCADE,
      user_id TEXT,
      telegram_id VARCHAR(50),
      redeemed_at TIMESTAMP DEFAULT NOW() NOT NULL,
      benefit_applied JSONB
    )
  `);

  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_promo_redemptions_telegram ON promo_redemptions(telegram_id)`);

  console.log("  ✅ Tabelas de promo codes criadas");
}

async function createDefaultPromoCodes() {
  // Código DONO2026 - para o proprietário usar no bot
  const donoExists = await db.execute(sql`
    SELECT id FROM promo_codes WHERE code = 'DONO2026' LIMIT 1
  `) as any[];

  if (!donoExists || donoExists.length === 0) {
    console.log("  🔄 Criando código DONO2026...");
    await db.execute(sql`
      INSERT INTO promo_codes (code, description, type, granted_plan, granted_days, max_uses, is_active)
      VALUES ('DONO2026', 'Acesso proprietário - VETERANO permanente', 'GRATUITY', 'VETERANO', 36500, 1, true)
    `);
    console.log("  ✅ Código DONO2026 criado (VETERANO ~100 anos)");
  }

  // Códigos BETA001-BETA010 - para beta testers (1 uso cada, 30 dias)
  for (let i = 1; i <= 10; i++) {
    const code = `BETA${String(i).padStart(3, "0")}`;
    const exists = await db.execute(sql`
      SELECT id FROM promo_codes WHERE code = ${code} LIMIT 1
    `) as any[];

    if (!exists || exists.length === 0) {
      await db.execute(sql`
        INSERT INTO promo_codes (code, description, type, granted_plan, granted_days, max_uses, is_active)
        VALUES (${code}, ${"Beta tester - VETERANO 30 dias"}, 'GRATUITY', 'VETERANO', 30, 1, true)
      `);
      console.log(`  ✅ Código ${code} criado (VETERANO 30 dias, 1 uso)`);
    }
  }
}

async function migrateEssaysTable() {
  // Verificar se tabela essays existe
  const exists = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'essays'
    ) as exists
  `) as any[];

  if (exists[0]?.exists) {
    return;
  }

  console.log("  🔄 Criando tabela essays...");

  // Criar enum de status se não existir
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE essay_status AS ENUM ('DRAFT', 'SUBMITTED', 'CORRECTING', 'CORRECTED', 'ERROR');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS essays (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      user_id TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
      theme TEXT NOT NULL,
      prompt TEXT,
      text TEXT NOT NULL,
      word_count INTEGER NOT NULL DEFAULT 0,
      status essay_status NOT NULL DEFAULT 'SUBMITTED',
      score_1 INTEGER,
      score_2 INTEGER,
      score_3 INTEGER,
      score_4 INTEGER,
      score_5 INTEGER,
      total_score INTEGER,
      feedback TEXT,
      feedback_comp_1 TEXT,
      feedback_comp_2 TEXT,
      feedback_comp_3 TEXT,
      feedback_comp_4 TEXT,
      feedback_comp_5 TEXT,
      was_free BOOLEAN NOT NULL DEFAULT false,
      amount_paid REAL DEFAULT 0,
      submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
      corrected_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_essays_user_id ON essays(user_id)`);

  console.log("  ✅ Tabela essays criada");

  // Adicionar colunas de redação na User se não existirem (camelCase = Prisma legacy)
  const essayCol = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'User' AND column_name = 'monthlyEssaysUsed'
    ) as exists
  `) as any[];

  if (!essayCol[0]?.exists) {
    console.log("  🔄 Adicionando colunas de redação na User...");
    await db.execute(sql`
      ALTER TABLE "User"
      ADD COLUMN IF NOT EXISTS "monthlyEssaysUsed" INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "lastEssayMonth" VARCHAR(7),
      ADD COLUMN IF NOT EXISTS "totalEssaysSubmitted" INTEGER NOT NULL DEFAULT 0
    `);
    console.log("  ✅ Colunas de redação adicionadas na User");
  }
}

async function migrateReviewColumns() {
  // Adicionar colunas de revisão ao Content
  const contentCol = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'Content' AND column_name = 'reviewStatus'
    ) as exists
  `) as any[];

  if (!contentCol[0]?.exists) {
    console.log("  🔄 Adicionando colunas de revisão ao Content...");
    await db.execute(sql`
      ALTER TABLE "Content"
      ADD COLUMN IF NOT EXISTS "reviewStatus" VARCHAR(20) DEFAULT 'PENDENTE',
      ADD COLUMN IF NOT EXISTS "reviewScore" INTEGER,
      ADD COLUMN IF NOT EXISTS "reviewNotes" TEXT,
      ADD COLUMN IF NOT EXISTS "reviewedAt" TIMESTAMP
    `);
    console.log("  ✅ Colunas de revisão do Content adicionadas");
  }

  // Adicionar colunas de revisão ao Question (Prisma legacy)
  // A tabela pode existir como "Question" (quoted PascalCase) dependendo da versão do Prisma
  try {
    const questionCol = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_name IN ('Question', 'question') AND column_name = 'reviewStatus'
      ) as exists
    `) as any[];

    if (!questionCol[0]?.exists) {
      console.log("  🔄 Adicionando colunas de revisão ao Question...");
      // Tentar PascalCase (mais comum no Prisma com quotes)
      await db.execute(sql`
        ALTER TABLE "Question"
        ADD COLUMN IF NOT EXISTS "reviewStatus" VARCHAR(20) DEFAULT 'PENDENTE',
        ADD COLUMN IF NOT EXISTS "reviewScore" INTEGER,
        ADD COLUMN IF NOT EXISTS "reviewNotes" TEXT,
        ADD COLUMN IF NOT EXISTS "reviewedAt" TIMESTAMP
      `);
      console.log("  ✅ Colunas de revisão do Question adicionadas");
    }
  } catch (qErr: any) {
    console.warn("  ⚠️ Colunas de revisão do Question: tabela não encontrada ou já migrada:", qErr?.message?.split("\n")[0]);
  }
}

async function migrateStudentAuthColumns() {
  // Adicionar password_hash para login web (Sala de Aula)
  const pwCol = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'User' AND column_name = 'passwordHash'
    ) as exists
  `) as any[];

  if (!pwCol[0]?.exists) {
    console.log("  🔄 Adicionando colunas de auth web na User...");
    await db.execute(sql`
      ALTER TABLE "User"
      ADD COLUMN IF NOT EXISTS "passwordHash" TEXT
    `);
    console.log("  ✅ Coluna passwordHash adicionada na User");
  }
}

async function migrateEducationTables() {
  // Helper local: tenta criar uma tabela; loga mas não lança
  const createTable = async (label: string, fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (err: any) {
      console.warn(`  ⚠️ Criação de ${label} falhou (não fatal): ${err?.message?.split("\n")[0]}`);
    }
  };

  // ── questions ──────────────────────────────────────────────────────────
  await createTable("questions", async () => {
    const r = await db.execute(sql`
      SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'questions') as exists
    `) as any[];
    if (r[0]?.exists) { console.log("  ✅ [Migration] Tabela questions verificada/existente"); return; }
    console.log("  🔄 Criando tabela questions...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS questions (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        content_id VARCHAR(255) NOT NULL,
        question_text TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        option_e TEXT,
        correct_answer VARCHAR(1) NOT NULL,
        explanation TEXT,
        difficulty VARCHAR(20),
        generated_by_ai BOOLEAN NOT NULL DEFAULT false,
        created_by VARCHAR,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_questions_content_id ON questions(content_id)`);
    console.log("  ✅ Tabela questions criada");
  });

  // ── sm2_reviews (sem FK — user_id pode ser TEXT ou UUID dependendo do Prisma) ──
  await createTable("sm2_reviews", async () => {
    const r = await db.execute(sql`
      SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sm2_reviews') as exists
    `) as any[];
    if (r[0]?.exists) { console.log("  ✅ [Migration] Tabela sm2_reviews verificada/existente"); return; }
    console.log("  🔄 Criando tabela sm2_reviews...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sm2_reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        content_id VARCHAR(255) NOT NULL,
        ease_factor REAL NOT NULL DEFAULT 2.5,
        interval INTEGER NOT NULL DEFAULT 1,
        repetitions INTEGER NOT NULL DEFAULT 0,
        next_review_date TIMESTAMP NOT NULL DEFAULT NOW(),
        last_quality INTEGER,
        times_correct INTEGER NOT NULL DEFAULT 0,
        times_incorrect INTEGER NOT NULL DEFAULT 0,
        total_reviews INTEGER NOT NULL DEFAULT 0,
        first_seen_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_reviewed_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_sm2_user_content ON sm2_reviews(user_id, content_id)`);
    console.log("  ✅ Tabela sm2_reviews criada");
  });

  // ── simulados ──────────────────────────────────────────────────────────
  await createTable("simulados", async () => {
    const r = await db.execute(sql`
      SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'simulados') as exists
    `) as any[];
    if (r[0]?.exists) { console.log("  ✅ [Migration] Tabelas simulados verificadas/existentes"); return; }
    console.log("  🔄 Criando tabelas de simulados...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS simulados (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        exam_type TEXT NOT NULL,
        total_questions INTEGER NOT NULL DEFAULT 50,
        duration_minutes INTEGER NOT NULL DEFAULT 120,
        passing_score INTEGER NOT NULL DEFAULT 60,
        month VARCHAR(7) NOT NULL,
        available_from TIMESTAMP NOT NULL,
        available_until TIMESTAMP NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS simulado_questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        simulado_id UUID NOT NULL REFERENCES simulados(id) ON DELETE CASCADE,
        content_id VARCHAR(255) NOT NULL,
        question_order INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_simulados (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        simulado_id UUID NOT NULL REFERENCES simulados(id) ON DELETE CASCADE,
        status TEXT NOT NULL DEFAULT 'IN_PROGRESS',
        current_question INTEGER NOT NULL DEFAULT 0,
        correct_answers INTEGER NOT NULL DEFAULT 0,
        wrong_answers INTEGER NOT NULL DEFAULT 0,
        score INTEGER,
        passed BOOLEAN,
        time_spent_minutes INTEGER,
        started_at TIMESTAMP NOT NULL DEFAULT NOW(),
        finished_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS simulado_answers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_simulado_id UUID NOT NULL REFERENCES user_simulados(id) ON DELETE CASCADE,
        question_id UUID NOT NULL REFERENCES simulado_questions(id) ON DELETE CASCADE,
        selected_answer INTEGER NOT NULL,
        correct BOOLEAN NOT NULL,
        answered_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log("  ✅ Tabelas simulados, simulado_questions, user_simulados, simulado_answers criadas");
  });
}

async function migrateQuestionsCreatedByNullable() {
  const col = await db.execute(sql`
    SELECT is_nullable FROM information_schema.columns
    WHERE table_name = 'questions' AND column_name = 'created_by'
    LIMIT 1
  `) as any[];

  if (col[0]?.is_nullable === "NO") {
    console.log("  🔄 Tornando questions.created_by nullable...");
    await db.execute(sql`
      ALTER TABLE questions ALTER COLUMN created_by DROP NOT NULL
    `);
    console.log("  ✅ questions.created_by agora é nullable (suporte a geração por IA)");
  }
}

async function migrateConcursosTables() {
  // 1. Criar tabela concursos (com colunas de inteligência de editais)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS concursos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nome VARCHAR(100) NOT NULL,
      sigla VARCHAR(20) NOT NULL UNIQUE,
      descricao TEXT,
      esfera VARCHAR(20) NOT NULL DEFAULT 'FEDERAL',
      exam_type VARCHAR(50) NOT NULL DEFAULT 'PF',
      edital_url TEXT,
      site_oficial TEXT,
      is_active BOOLEAN NOT NULL DEFAULT true,
      ordem INTEGER DEFAULT 0,
      estado VARCHAR(2),
      banca VARCHAR(100),
      cargo_padrao VARCHAR(100),
      lista_materias_json JSONB NOT NULL DEFAULT '[]',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  // 2. Adicionar colunas extras caso a tabela já exista (via Drizzle push sem elas)
  await db.execute(sql`ALTER TABLE concursos ADD COLUMN IF NOT EXISTS estado VARCHAR(2)`);
  await db.execute(sql`ALTER TABLE concursos ADD COLUMN IF NOT EXISTS banca VARCHAR(100)`);
  await db.execute(sql`ALTER TABLE concursos ADD COLUMN IF NOT EXISTS cargo_padrao VARCHAR(100)`);
  await db.execute(sql`ALTER TABLE concursos ADD COLUMN IF NOT EXISTS lista_materias_json JSONB NOT NULL DEFAULT '[]'`);

  // 3. Criar tabela edital_vinculos (link content ↔ concurso)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS edital_vinculos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      concurso_id UUID NOT NULL REFERENCES concursos(id) ON DELETE CASCADE,
      content_id TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE(concurso_id, content_id)
    )
  `);

  // 4. Pre-seed completo: todos os concursos do PDF "EDITAIS CONCURSOS"
  // Dados baseados nos últimos editais reais (CEBRASPE/VUNESP/FCC patterns)
  const concursosData: Array<{
    nome: string; sigla: string; esfera: string; exam_type: string;
    banca: string; cargo_padrao: string; estado: string | null;
    materias: Array<{ name: string; weight: number; questions: number; topics: string[] }>;
  }> = [
    // ── POLÍCIA FEDERAL (CEBRASPE) ──────────────────────────────────────────
    // Edital PF 2025 — Ed_1_PF_25_Abertura.pdf — 120 questões C/E
    { nome: "Polícia Federal", sigla: "PF", esfera: "FEDERAL", exam_type: "PF",
      banca: "CEBRASPE", cargo_padrao: "Agente de Polícia Federal", estado: null,
      materias: [
        { name: "Língua Portuguesa",       weight: 2, questions: 20, topics: [] },
        { name: "Raciocínio Lógico",       weight: 2, questions: 10, topics: [] },
        { name: "Estatística",             weight: 1, questions:  5, topics: [] },
        { name: "Direito Constitucional",  weight: 2, questions: 10, topics: [] },
        { name: "Direito Administrativo",  weight: 2, questions: 10, topics: [] },
        { name: "Direito Penal",           weight: 3, questions: 15, topics: [] },
        { name: "Direito Processual Penal",weight: 3, questions: 15, topics: [] },
        { name: "Direitos Humanos",        weight: 1, questions:  5, topics: [] },
        { name: "Legislação Especial",     weight: 2, questions: 10, topics: [] },
        { name: "Informática",             weight: 1, questions:  5, topics: [] },
        { name: "Contabilidade Geral",     weight: 1, questions:  5, topics: [] },
      ] },
    // Edital PF 2025 — Escrivão de Polícia Federal
    { nome: "Polícia Federal - Escrivão", sigla: "PF_ESC", esfera: "FEDERAL", exam_type: "PF",
      banca: "CEBRASPE", cargo_padrao: "Escrivão de Polícia Federal", estado: null,
      materias: [
        { name: "Língua Portuguesa",       weight: 2, questions: 20, topics: [] },
        { name: "Raciocínio Lógico",       weight: 2, questions: 10, topics: [] },
        { name: "Estatística",             weight: 1, questions:  5, topics: [] },
        { name: "Direito Constitucional",  weight: 2, questions: 10, topics: [] },
        { name: "Direito Administrativo",  weight: 2, questions: 10, topics: [] },
        { name: "Direito Penal",           weight: 3, questions: 15, topics: [] },
        { name: "Direito Processual Penal",weight: 3, questions: 15, topics: [] },
        { name: "Direitos Humanos",        weight: 1, questions:  5, topics: [] },
        { name: "Legislação Especial",     weight: 2, questions: 10, topics: [] },
        { name: "Informática",             weight: 1, questions:  5, topics: [] },
        { name: "Contabilidade Geral",     weight: 1, questions:  5, topics: [] },
        { name: "Arquivologia",            weight: 1, questions:  5, topics: [] },
      ] },
    // Edital PF 2025 — Papiloscopista Federal
    { nome: "Polícia Federal - Papiloscopista", sigla: "PF_PAPILO", esfera: "FEDERAL", exam_type: "PF",
      banca: "CEBRASPE", cargo_padrao: "Papiloscopista Federal", estado: null,
      materias: [
        { name: "Língua Portuguesa",       weight: 2, questions: 15, topics: [] },
        { name: "Raciocínio Lógico",       weight: 1, questions: 10, topics: [] },
        { name: "Estatística",             weight: 1, questions:  5, topics: [] },
        { name: "Direito Constitucional",  weight: 1, questions:  5, topics: [] },
        { name: "Direito Administrativo",  weight: 1, questions:  5, topics: [] },
        { name: "Direito Penal",           weight: 1, questions: 10, topics: [] },
        { name: "Direito Processual Penal",weight: 1, questions: 10, topics: [] },
        { name: "Direitos Humanos",        weight: 1, questions:  5, topics: [] },
        { name: "Legislação Especial",     weight: 1, questions:  5, topics: [] },
        { name: "Papiloscopia",            weight: 3, questions: 20, topics: [] },
        { name: "Criminalística",          weight: 2, questions: 15, topics: [] },
        { name: "Biologia",               weight: 1, questions:  5, topics: [] },
        { name: "Física",                 weight: 1, questions:  5, topics: [] },
        { name: "Química",                weight: 1, questions:  5, topics: [] },
      ] },
    // Edital PF 2025 — Delegado de Polícia Federal
    { nome: "Polícia Federal - Delegado", sigla: "PF_DEL", esfera: "FEDERAL", exam_type: "PF",
      banca: "CEBRASPE", cargo_padrao: "Delegado de Polícia Federal", estado: null,
      materias: [
        { name: "Língua Portuguesa",       weight: 1, questions:  5, topics: [] },
        { name: "Raciocínio Lógico",       weight: 1, questions:  5, topics: [] },
        { name: "Estatística",             weight: 1, questions:  5, topics: [] },
        { name: "Direito Constitucional",  weight: 2, questions: 15, topics: [] },
        { name: "Direito Administrativo",  weight: 1, questions: 10, topics: [] },
        { name: "Direito Penal",           weight: 3, questions: 25, topics: [] },
        { name: "Direito Processual Penal",weight: 3, questions: 25, topics: [] },
        { name: "Direitos Humanos",        weight: 1, questions:  5, topics: [] },
        { name: "Legislação Especial",     weight: 2, questions: 10, topics: [] },
        { name: "Direito Civil",           weight: 1, questions:  5, topics: [] },
        { name: "Medicina Legal",          weight: 1, questions:  5, topics: [] },
        { name: "Criminalística",          weight: 1, questions:  5, topics: [] },
      ] },
    // ── POLÍCIA RODOVIÁRIA FEDERAL (CEBRASPE) ────────────────────────────────
    // Edital PRF 2021/2025 — Cebraspe — 120 questões C/E — 1 cargo
    // Bloco I (55q): LP, RLM, Info, Física, Ética, Geopolítica, LE
    // Bloco II (30q): Legislação de Trânsito
    // Bloco III (35q): Dir. Const, Dir. Adm, Dir. Penal, DPP, Leg. Especial, DH
    { nome: "Polícia Rodoviária Federal", sigla: "PRF", esfera: "FEDERAL", exam_type: "PRF",
      banca: "CEBRASPE", cargo_padrao: "Policial Rodoviário Federal", estado: null,
      materias: [
        // Bloco I
        { name: "Língua Portuguesa",        weight: 3, questions: 20, topics: [] },
        { name: "Raciocínio Lógico",        weight: 2, questions: 10, topics: [] },
        { name: "Informática",              weight: 1, questions:  5, topics: [] },
        { name: "Física",                   weight: 1, questions:  5, topics: [] },
        { name: "Ética no Serviço Público", weight: 1, questions:  5, topics: [] },
        { name: "Geopolítica",              weight: 1, questions:  5, topics: [] },
        { name: "Língua Estrangeira",       weight: 1, questions:  5, topics: [] },
        // Bloco II
        { name: "Legislação de Trânsito",   weight: 3, questions: 30, topics: [] },
        // Bloco III
        { name: "Direito Constitucional",   weight: 2, questions: 10, topics: [] },
        { name: "Direito Administrativo",   weight: 1, questions:  5, topics: [] },
        { name: "Direito Penal",            weight: 1, questions:  5, topics: [] },
        { name: "Direito Processual Penal", weight: 1, questions:  5, topics: [] },
        { name: "Legislação Especial",      weight: 2, questions:  5, topics: [] },
        { name: "Direitos Humanos",         weight: 1, questions:  5, topics: [] },
      ] },
    // ── AGENTE ADMIN PRF — NÍVEL MÉDIO ───────────────────────────────────────
    // Edital PRF 2014 — FUNCAB — 60 questões — Agente Administrativo Classe A
    // Conhecimentos Básicos (24q): LP 12, Ética 6, RLM 6
    // Conhecimentos Específicos (36q): Dir.Const 6, Dir.Adm 6, Adm 6, Arq 6, Info 6, Leg.PRF 6
    { nome: "PRF - Agente Administrativo", sigla: "PRF_ADMIN", esfera: "FEDERAL", exam_type: "PRF",
      banca: "FUNCAB", cargo_padrao: "Agente Administrativo PRF (Nível Médio)", estado: null,
      materias: [
        // Conhecimentos Básicos
        { name: "Língua Portuguesa",              weight: 3, questions: 12, topics: [] },
        { name: "Ética e Conduta Pública",        weight: 1, questions:  6, topics: [] },
        { name: "Raciocínio Lógico",              weight: 1, questions:  6, topics: [] },
        // Conhecimentos Específicos
        { name: "Direito Constitucional",         weight: 2, questions:  6, topics: [] },
        { name: "Direito Administrativo",         weight: 2, questions:  6, topics: [] },
        { name: "Noções de Administração",        weight: 1, questions:  6, topics: [] },
        { name: "Arquivologia",                   weight: 1, questions:  6, topics: [] },
        { name: "Informática",                    weight: 1, questions:  6, topics: [] },
        { name: "Legislação Especial",            weight: 2, questions:  6, topics: [] },
      ] },
    // ── AGENTE ADMIN PF — NÍVEL MÉDIO ────────────────────────────────────────
    // Edital PF (Cebraspe) — Agente Administrativo Nível Médio
    // P1 objetiva: LP + RL + Ética (incl. Lei 8.112, Lei 8.429, Lei 12.813) + Info
    // P2 discursiva: Atualidades (apenas redação — peso baixo)
    { nome: "Polícia Federal - Agente Administrativo", sigla: "PF_ADMIN", esfera: "FEDERAL", exam_type: "PF",
      banca: "CEBRASPE", cargo_padrao: "Agente Administrativo (Nível Médio)", estado: null,
      materias: [
        { name: "Língua Portuguesa",        weight: 3, questions: 20, topics: [] },
        { name: "Raciocínio Lógico",        weight: 3, questions: 15, topics: [] },
        { name: "Noções de Informática",    weight: 3, questions: 20, topics: [] },
        { name: "Ética no Serviço Público", weight: 3, questions: 15, topics: [] }, // Lei 8.112, Lei 8.429, Lei 12.813
        { name: "Atualidades",              weight: 1, questions:  5, topics: [] }, // discursiva apenas
      ] },
    // ── RECEITA FEDERAL (ESAF/CEBRASPE) ──────────────────────────────────────
    // Edital RFB 2014 — ESAF — 140 questões — Auditor-Fiscal da RFB
    // Gerais (70q, peso 1): LP 20, LE 10, RLM 10, Adm 10, Dir.Const 10, Dir.Adm 10
    // Específicos (70q, peso 2): Dir.Trib 15, Auditoria 10, Contab 20, Leg.Trib 10, Com.Int 15
    { nome: "Receita Federal", sigla: "RFB", esfera: "FEDERAL", exam_type: "RECEITA_FEDERAL",
      banca: "ESAF", cargo_padrao: "Auditor-Fiscal da Receita Federal", estado: null,
      materias: [
        // Conhecimentos Gerais (peso 1)
        { name: "Língua Portuguesa",                        weight: 3, questions: 20, topics: [] },
        { name: "Língua Estrangeira",                       weight: 1, questions: 10, topics: [] },
        { name: "Raciocínio Lógico",                        weight: 2, questions: 10, topics: [] },
        { name: "Administração Geral e Pública",            weight: 2, questions: 10, topics: [] },
        { name: "Direito Constitucional",                   weight: 2, questions: 10, topics: [] },
        { name: "Direito Administrativo",                   weight: 2, questions: 10, topics: [] },
        // Conhecimentos Específicos (peso 2)
        { name: "Contabilidade Geral e Avançada",           weight: 3, questions: 20, topics: [] },
        { name: "Direito Tributário",                       weight: 3, questions: 15, topics: [] },
        { name: "Comércio Internacional e Leg. Aduaneira",  weight: 3, questions: 15, topics: [] },
        { name: "Auditoria",                                weight: 2, questions: 10, topics: [] },
        { name: "Legislação Tributária",                    weight: 2, questions: 10, topics: [] },
      ] },
    // ── RECEITA FEDERAL — ANALISTA TRIBUTÁRIO ────────────────────────────────
    // Edital RFB 2012 — ESAF — 140 questões — Analista-Tributário da RFB
    // Estrutura similar ao Auditor com menos Contabilidade e mais Dir. Tributário
    { nome: "Receita Federal - Analista Tributário", sigla: "RFB_INSP", esfera: "FEDERAL", exam_type: "RECEITA_FEDERAL",
      banca: "ESAF", cargo_padrao: "Analista-Tributário da Receita Federal", estado: null,
      materias: [
        // Conhecimentos Gerais (peso 1)
        { name: "Língua Portuguesa",                        weight: 3, questions: 20, topics: [] },
        { name: "Língua Estrangeira",                       weight: 1, questions: 10, topics: [] },
        { name: "Raciocínio Lógico",                        weight: 2, questions: 10, topics: [] },
        { name: "Administração Geral e Pública",            weight: 2, questions: 10, topics: [] },
        { name: "Direito Constitucional",                   weight: 2, questions: 10, topics: [] },
        { name: "Direito Administrativo",                   weight: 2, questions: 10, topics: [] },
        // Conhecimentos Específicos (peso 2)
        { name: "Direito Tributário",                       weight: 3, questions: 20, topics: [] },
        { name: "Contabilidade Geral",                      weight: 3, questions: 20, topics: [] },
        { name: "Auditoria",                                weight: 2, questions: 15, topics: [] },
        { name: "Legislação Tributária",                    weight: 2, questions: 15, topics: [] },
      ] },
    // ── POLÍCIA PENAL FEDERAL / DEPEN (CEBRASPE) ────────────────────────────
    // Edital DEPEN 2020 Nº 1 — Agente Federal de Execução Penal (Nível Médio) — 120q C/E
    // Bloco I: Conhecimentos Básicos (30q) | Bloco II: Específicos (50q) | Bloco III: Complementares (40q)
    { nome: "Polícia Penal Federal", sigla: "PPF", esfera: "FEDERAL", exam_type: "PP_FEDERAL",
      banca: "CEBRASPE", cargo_padrao: "Agente Federal de Execução Penal", estado: null,
      materias: [
        // Bloco I — Conhecimentos Básicos (30q)
        { name: "Língua Portuguesa",                              weight: 2, questions: 10, topics: [] },
        { name: "Ética no Serviço Público",                       weight: 1, questions: 10, topics: [] },
        { name: "Raciocínio Lógico",                              weight: 2, questions:  5, topics: [] },
        { name: "Informática",                                    weight: 1, questions:  5, topics: [] },
        // Bloco II — Conhecimentos Específicos (50q)
        { name: "Direito Constitucional",                         weight: 3, questions: 10, topics: [] },
        { name: "Direito Administrativo",                         weight: 3, questions: 10, topics: [] },
        { name: "Direito Penal",                                  weight: 3, questions: 10, topics: [] },
        { name: "Direito Processual Penal",                       weight: 3, questions: 10, topics: [] },
        { name: "Direitos Humanos e Participação Social",         weight: 2, questions:  5, topics: [] },
        { name: "Legislação Especial",                            weight: 2, questions:  5, topics: [] },
        // Bloco III — Conhecimentos Complementares (40q)
        { name: "Execução Penal",                                 weight: 3, questions: 20, topics: [] },
        { name: "Legislação e Regulamentação DEPEN",              weight: 2, questions: 20, topics: [] },
      ] },
    // ── POLÍCIA LEGISLATIVA FEDERAL / CÂMARA (CEBRASPE) ─────────────────────
    // Edital cd_26_pl — Policial Legislativo Federal — 90q P1 + 90q P2 C/E
    // P1: Conhecimentos Gerais | P2: Conhecimentos Específicos
    { nome: "Polícia Legislativa Federal", sigla: "PLF", esfera: "FEDERAL", exam_type: "PL_FEDERAL",
      banca: "CEBRASPE", cargo_padrao: "Policial Legislativo Federal", estado: null,
      materias: [
        // P1 — Conhecimentos Gerais (90q)
        { name: "Língua Portuguesa",                              weight: 3, questions: 20, topics: [] },
        { name: "Língua Inglesa",                                 weight: 1, questions: 10, topics: [] },
        { name: "Raciocínio Lógico e Estatística",                weight: 2, questions: 15, topics: [] },
        { name: "Direito Constitucional",                         weight: 3, questions: 20, topics: [] },
        { name: "Direito Administrativo",                         weight: 2, questions: 15, topics: [] },
        { name: "Informática e Dados",                            weight: 1, questions: 10, topics: [] },
        // P2 — Conhecimentos Específicos (90q)
        { name: "Direito Penal e Processual Penal",               weight: 3, questions: 40, topics: [] },
        { name: "Criminologia e Criminalística",                  weight: 2, questions: 20, topics: [] },
        { name: "Direitos Humanos e Legislação Correlata",        weight: 2, questions: 15, topics: [] },
        { name: "Atividade de Inteligência",                      weight: 2, questions: 15, topics: [] },
      ] },
    // ── POLÍCIA JUDICIAL CNJ (FCC/CEBRASPE) ──────────────────────────────────
    // Derivado do padrão TRT/STJ/TST — Analista Judiciário Área Policial
    // w3 = universal no Judiciário Federal | w2 = frequente | w1 = complementar
    { nome: "Polícia Judicial CNJ", sigla: "PJ_CNJ", esfera: "FEDERAL", exam_type: "PJ_CNJ",
      banca: "FCC", cargo_padrao: "Analista Judiciário - Área Policial", estado: null,
      materias: [
        { name: "Língua Portuguesa",          weight: 3, questions: 15, topics: [] },
        { name: "Direito Constitucional",     weight: 3, questions: 20, topics: [] },
        { name: "Direito Administrativo",     weight: 3, questions: 15, topics: [] },
        { name: "Raciocínio Lógico",          weight: 2, questions: 10, topics: [] },
        { name: "Legislação Específica CNJ",  weight: 2, questions: 15, topics: [] }, // Regimento Interno CNJ + legislação do judiciário
        { name: "Direito Penal",              weight: 2, questions: 10, topics: [] },
        { name: "Direito Processual Penal",   weight: 2, questions: 10, topics: [] },
        { name: "Direitos Humanos",           weight: 1, questions:  5, topics: [] },
        { name: "Informática",                weight: 1, questions:  5, topics: [] },
      ] },
    // ── ABIN (CEBRASPE) ───────────────────────────────────────────────────────
    // Edital ABIN 2018 — Cargo 1: Oficial de Inteligência — P1=60q + P2=90q C/E
    // P1: Conhecimentos Gerais (comuns a todos os cargos) | P2: Específicos Área 1
    { nome: "Agência Brasileira de Inteligência", sigla: "ABIN", esfera: "FEDERAL", exam_type: "ABIN",
      banca: "CEBRASPE", cargo_padrao: "Oficial de Inteligência", estado: null,
      materias: [
        // P1 — Conhecimentos Gerais (60q)
        { name: "Língua Portuguesa",                              weight: 2, questions: 15, topics: [] },
        { name: "Língua Inglesa / Espanhola",                     weight: 1, questions: 10, topics: [] },
        { name: "Raciocínio Lógico",                              weight: 2, questions: 10, topics: [] },
        { name: "Direito Constitucional",                         weight: 2, questions: 10, topics: [] },
        { name: "Direito Administrativo",                         weight: 1, questions: 10, topics: [] },
        { name: "Atividade de Inteligência e Legislação",         weight: 3, questions:  5, topics: [] },
        // P2 — Conhecimentos Específicos Área 1 (90q)
        { name: "História do Brasil e do Mundo",                  weight: 2, questions: 20, topics: [] },
        { name: "Geografia do Brasil e do Mundo",                 weight: 1, questions: 15, topics: [] },
        { name: "Política e Segurança Internacional",             weight: 3, questions: 20, topics: [] },
        { name: "Direito Internacional Público",                  weight: 2, questions: 20, topics: [] },
        { name: "Direito Penal",                                  weight: 2, questions: 15, topics: [] },
      ] },
    // ── ABIN — Oficial Técnico de Inteligência (CEBRASPE) ────────────────────
    // Edital ABIN 2018 — Cargo 2: Oficial Técnico — P1=60q + P2=90q C/E
    // P2 Área 1 (mais comum): perfil Admin/Finanças/Contabilidade
    { nome: "ABIN - Oficial Técnico de Inteligência", sigla: "ABIN_OTI", esfera: "FEDERAL", exam_type: "ABIN",
      banca: "CEBRASPE", cargo_padrao: "Oficial Técnico de Inteligência", estado: null,
      materias: [
        // P1 — Conhecimentos Gerais (60q — comuns a todos os cargos)
        { name: "Língua Portuguesa",                              weight: 2, questions: 15, topics: [] },
        { name: "Língua Inglesa / Espanhola",                     weight: 1, questions: 10, topics: [] },
        { name: "Raciocínio Lógico",                              weight: 2, questions: 10, topics: [] },
        { name: "Direito Constitucional",                         weight: 2, questions: 10, topics: [] },
        { name: "Direito Administrativo",                         weight: 1, questions: 10, topics: [] },
        { name: "Atividade de Inteligência e Legislação",         weight: 3, questions:  5, topics: [] },
        // P2 — Conhecimentos Específicos Área 1 (90q)
        { name: "Administração Pública",                          weight: 3, questions: 20, topics: [] },
        { name: "Administração Financeira e Orçamentária",        weight: 2, questions: 20, topics: [] },
        { name: "Gestão de Pessoas nas Organizações",             weight: 2, questions: 15, topics: [] },
        { name: "Contabilidade Aplicada ao Setor Público",        weight: 2, questions: 15, topics: [] },
        { name: "Contabilidade Geral",                            weight: 2, questions: 10, topics: [] },
        { name: "Noções de Economia",                             weight: 1, questions: 10, topics: [] },
      ] },
    // ── ABIN — Agente de Inteligência (CEBRASPE) ─────────────────────────────
    // Edital ABIN 2018 — Cargo 3: Agente de Inteligência — P1=50q + P2=70q C/E
    { nome: "ABIN - Agente de Inteligência", sigla: "ABIN_AGT", esfera: "FEDERAL", exam_type: "ABIN",
      banca: "CEBRASPE", cargo_padrao: "Agente de Inteligência", estado: null,
      materias: [
        // P1 — Conhecimentos Básicos (50q)
        { name: "Língua Portuguesa",                              weight: 2, questions: 15, topics: [] },
        { name: "Língua Inglesa / Espanhola",                     weight: 1, questions:  5, topics: [] },
        { name: "Raciocínio Lógico",                              weight: 2, questions: 10, topics: [] },
        { name: "Direito Constitucional",                         weight: 2, questions:  5, topics: [] },
        { name: "Direito Administrativo",                         weight: 1, questions:  5, topics: [] },
        { name: "Atividade de Inteligência e Legislação",         weight: 3, questions: 10, topics: [] },
        // P2 — Conhecimentos Específicos (70q)
        { name: "Legislação de Interesse da Inteligência",        weight: 3, questions: 20, topics: [] },
        { name: "Ciências Humanas (História/Geografia/Política)", weight: 2, questions: 30, topics: [] },
        { name: "Atualidades e Geopolítica",                      weight: 1, questions: 20, topics: [] },
      ] },
    // ── ABIN — Agente Técnico de Inteligência (CEBRASPE) ─────────────────────
    // Edital ABIN 2018 — Cargo 4: Agente Técnico de Inteligência — perfil jurídico (Área 2 OTI)
    // P1 (básicos comuns): LP + RL + Dir.Const + Dir.Adm + Ativ.Inteligência
    // P2 (específicos): Dir.Const + Dir.Adm + Dir.Civil + Dir.Proc.Civil + Dir.Com + Dir.Fin + Dir.Pen/DPP + Dir.Prev
    { nome: "ABIN - Agente Técnico de Inteligência", sigla: "ABIN_ATI", esfera: "FEDERAL", exam_type: "ABIN",
      banca: "CEBRASPE", cargo_padrao: "Agente Técnico de Inteligência", estado: null,
      materias: [
        { name: "Língua Portuguesa",                      weight: 2, questions: 15, topics: [] },
        { name: "Raciocínio Lógico",                      weight: 2, questions: 10, topics: [] },
        { name: "Atividade de Inteligência e Legislação", weight: 3, questions:  5, topics: [] },
        { name: "Direito Constitucional",                 weight: 3, questions: 15, topics: [] }, // P1 + P2
        { name: "Direito Administrativo",                 weight: 3, questions: 15, topics: [] }, // P1 + P2
        { name: "Direito Civil",                          weight: 2, questions: 15, topics: [] },
        { name: "Direito Penal",                          weight: 2, questions: 10, topics: [] },
        { name: "Direito Processual Penal",               weight: 2, questions:  8, topics: [] },
        { name: "Direito Processual Civil",               weight: 1, questions: 10, topics: [] },
        { name: "Direito Comercial",                      weight: 1, questions: 10, topics: [] },
        { name: "Direito Financeiro",                     weight: 1, questions:  8, topics: [] },
        { name: "Direito Previdenciário",                 weight: 1, questions:  6, topics: [] },
      ] },
    // ── ANAC — Área 1: Operações de Voo (CEBRASPE) ───────────────────────────
    // Edital ANAC — Cargo 1: Especialista em Reg. Aviação Civil — Área 1 (Operações)
    // Básicos comuns + Específicos Área 1 | Total estimado ~150q C/E
    { nome: "ANAC - Operações de Voo", sigla: "ANAC", esfera: "FEDERAL", exam_type: "ANAC",
      banca: "CEBRASPE", cargo_padrao: "Especialista em Regulação de Aviação Civil - Área 1", estado: null,
      materias: [
        // Conhecimentos Básicos (comuns a todas as áreas)
        { name: "Língua Inglesa",                                 weight: 2, questions: 10, topics: [] },
        { name: "Noções de Direito Administrativo",               weight: 1, questions: 10, topics: [] },
        { name: "Ética no Serviço Público",                       weight: 1, questions:  5, topics: [] },
        { name: "Direitos Humanos",                               weight: 1, questions:  5, topics: [] },
        { name: "Tecnologia da Informação",                       weight: 1, questions: 10, topics: [] },
        { name: "Legislação do Sistema de Aviação Civil",         weight: 3, questions: 20, topics: [] },
        // Conhecimentos Específicos Área 1 — Operações de Voo
        { name: "Meteorologia Aeronáutica",                       weight: 2, questions: 10, topics: [] },
        { name: "Planejamento de Voo",                            weight: 2, questions: 10, topics: [] },
        { name: "Navegação Aérea",                                weight: 2, questions: 10, topics: [] },
        { name: "Procedimentos Operacionais",                     weight: 2, questions: 10, topics: [] },
        { name: "Teoria de Voo",                                  weight: 3, questions: 15, topics: [] },
        { name: "Regras de Tráfego Aéreo",                        weight: 2, questions: 10, topics: [] },
        { name: "Radiocomunicações Aeronáuticas",                 weight: 1, questions:  5, topics: [] },
        { name: "Sistemas e Equipamentos de Aeronaves",           weight: 2, questions: 10, topics: [] },
        { name: "Regulamento Brasileiro da Aviação Civil (RBAC)", weight: 3, questions: 10, topics: [] },
      ] },
    // ── ANAC — Área 2: Engenharia Aeronáutica (CEBRASPE) ─────────────────────
    // Cargo 2: Especialista em Reg. Aviação Civil — Área 2 (Engenharia)
    { nome: "ANAC - Engenharia Aeronáutica", sigla: "ANAC_A2", esfera: "FEDERAL", exam_type: "ANAC",
      banca: "CEBRASPE", cargo_padrao: "Especialista em Regulação de Aviação Civil - Área 2", estado: null,
      materias: [
        // Conhecimentos Básicos (comuns)
        { name: "Língua Inglesa",                                 weight: 2, questions: 10, topics: [] },
        { name: "Noções de Direito Administrativo",               weight: 1, questions: 10, topics: [] },
        { name: "Ética no Serviço Público",                       weight: 1, questions:  5, topics: [] },
        { name: "Direitos Humanos",                               weight: 1, questions:  5, topics: [] },
        { name: "Tecnologia da Informação",                       weight: 1, questions: 10, topics: [] },
        { name: "Legislação do Sistema de Aviação Civil",         weight: 2, questions: 20, topics: [] },
        // Conhecimentos Específicos Área 2 — Engenharia
        { name: "Mecânica dos Sólidos e Resistência dos Materiais", weight: 3, questions: 15, topics: [] },
        { name: "Aerodinâmica e Mecânica de Voo",                 weight: 3, questions: 15, topics: [] },
        { name: "Propulsão Aeronáutica e Materiais",              weight: 2, questions: 10, topics: [] },
        { name: "Circuitos Elétricos e Eletrônica",               weight: 2, questions: 15, topics: [] },
        { name: "Microprocessadores e Sistemas Embarcados",       weight: 2, questions: 10, topics: [] },
        { name: "Sistemas de Controle e Automação",               weight: 2, questions: 10, topics: [] },
        { name: "Engenharia de Confiabilidade",                   weight: 2, questions:  5, topics: [] },
      ] },
    // ── ANAC — Área 3: Econômico-Regulatório (CEBRASPE) ──────────────────────
    // Cargo 3: Especialista em Reg. Aviação Civil — Área 3 (Economia/Regulação)
    { nome: "ANAC - Econômico-Regulatório", sigla: "ANAC_A3", esfera: "FEDERAL", exam_type: "ANAC",
      banca: "CEBRASPE", cargo_padrao: "Especialista em Regulação de Aviação Civil - Área 3", estado: null,
      materias: [
        // Conhecimentos Básicos (comuns)
        { name: "Língua Inglesa",                                 weight: 2, questions: 10, topics: [] },
        { name: "Noções de Direito Administrativo",               weight: 1, questions: 10, topics: [] },
        { name: "Ética no Serviço Público",                       weight: 1, questions:  5, topics: [] },
        { name: "Direitos Humanos",                               weight: 1, questions:  5, topics: [] },
        { name: "Tecnologia da Informação",                       weight: 1, questions: 10, topics: [] },
        { name: "Legislação do Sistema de Aviação Civil",         weight: 2, questions: 20, topics: [] },
        // Conhecimentos Específicos Área 3 — Econômico/Regulatório
        { name: "Microeconomia",                                  weight: 3, questions: 15, topics: [] },
        { name: "Estatística",                                    weight: 2, questions: 10, topics: [] },
        { name: "Gestão Pública e Regulação",                     weight: 3, questions: 15, topics: [] },
        { name: "Economia da Regulação",                          weight: 2, questions: 10, topics: [] },
        { name: "Gestão da Qualidade",                            weight: 1, questions:  5, topics: [] },
        { name: "Direito Econômico",                              weight: 2, questions: 10, topics: [] },
        { name: "Análise de Dados e Informações",                 weight: 2, questions: 15, topics: [] },
      ] },
    // ── EXÉRCITO ──────────────────────────────────────────────────────────────
    // Edital ESPCEX — Vestibular Militar — 8 provas (Física, Química, Geo, Hist, Inglês, Mat, Port/Lit, Redação)
    { nome: "Exército Brasileiro - ESPCEX", sigla: "ESPCEX", esfera: "FEDERAL", exam_type: "EXERCITO",
      banca: "VUNESP", cargo_padrao: "Cadete do Exército (ESPCEX)", estado: null,
      materias: [
        { name: "Matemática",                      weight: 3, questions: 20, topics: [] },
        { name: "Física",                           weight: 3, questions: 15, topics: [] },
        { name: "Química",                          weight: 2, questions: 10, topics: [] },
        { name: "Língua Portuguesa / Literatura",  weight: 2, questions: 15, topics: [] },
        { name: "História",                         weight: 1, questions:  5, topics: [] },
        { name: "Geografia",                        weight: 1, questions:  5, topics: [] },
        { name: "Língua Inglesa",                   weight: 1, questions:  5, topics: [] },
        { name: "Redação",                          weight: 2, questions:  1, topics: [] },
      ] },
    // Edital IME CFG ATIVA 2025/2026 — 5 provas discursivas (Mat, Fís, Quím, Port/Red, Inglês)
    // Física inclui Relatividade Restrita e Física Moderna (nível superior ao ESPCEX)
    { nome: "Instituto Militar de Engenharia", sigla: "IME", esfera: "FEDERAL", exam_type: "EXERCITO",
      banca: "IME", cargo_padrao: "Cadete de Engenharia (IME)", estado: null,
      materias: [
        { name: "Matemática",                    weight: 3, questions: 14, topics: [] },
        { name: "Física",                         weight: 3, questions: 17, topics: [] },
        { name: "Química",                        weight: 2, questions: 32, topics: [] },
        { name: "Língua Portuguesa / Redação",   weight: 2, questions:  3, topics: [] },
        { name: "Língua Inglesa",                 weight: 1, questions:  3, topics: [] },
      ] },
    // Edital ESA CA 2026 — Área Geral: Mat(14q) + Port(14q) + Hist/Geo Brasil(12q) + Inglês(10q) + Redação(eliminatória)
    { nome: "Escola de Sargentos das Armas", sigla: "ESA", esfera: "FEDERAL", exam_type: "EXERCITO",
      banca: "ESPCEX", cargo_padrao: "Sargento do Exército", estado: null,
      materias: [
        { name: "Matemática",                      weight: 3, questions: 14, topics: [] },
        { name: "Língua Portuguesa / Literatura",  weight: 2, questions: 14, topics: [] },
        { name: "História do Brasil",              weight: 2, questions:  6, topics: [] },
        { name: "Geografia do Brasil",             weight: 2, questions:  6, topics: [] },
        { name: "Língua Inglesa",                  weight: 1, questions: 10, topics: [] },
        { name: "Redação",                         weight: 2, questions:  1, topics: [] },
      ] },
    // ── MARINHA ───────────────────────────────────────────────────────────────
    // Edital CN — 5 áreas: Mat, Port/Red, Estudos Sociais (Hist+Geo), Ciências (Fís+Quím+Bio), Inglês
    { nome: "Colégio Naval - Marinha do Brasil", sigla: "CN", esfera: "FEDERAL", exam_type: "MARINHA",
      banca: "CN", cargo_padrao: "Aluno do Colégio Naval", estado: null,
      materias: [
        { name: "Matemática",                      weight: 3, questions: 30, topics: [] },
        { name: "Língua Portuguesa / Redação",    weight: 2, questions: 20, topics: [] },
        { name: "Física",                          weight: 2, questions: 10, topics: [] },
        { name: "Química",                         weight: 2, questions: 10, topics: [] },
        { name: "Biologia",                        weight: 2, questions: 10, topics: [] },
        { name: "História do Brasil",              weight: 1, questions: 10, topics: [] },
        { name: "Geografia do Brasil",             weight: 1, questions: 10, topics: [] },
        { name: "Língua Inglesa",                  weight: 1, questions: 20, topics: [] },
      ] },
    // Edital EN — Dia1: Mat(22q)+Inglês(18q) | Dia2: Física(22q)+Port(18q)+Redação
    // Mat inclui Cálculo Diferencial e Integral; Física inclui Hidrodinâmica; SEM Química
    { nome: "Escola Naval - Marinha do Brasil", sigla: "EN", esfera: "FEDERAL", exam_type: "MARINHA",
      banca: "EN", cargo_padrao: "Guarda-Marinha", estado: null,
      materias: [
        { name: "Matemática",                      weight: 3, questions: 22, topics: [] },
        { name: "Física",                          weight: 3, questions: 22, topics: [] },
        { name: "Língua Portuguesa / Redação",    weight: 2, questions: 18, topics: [] },
        { name: "Língua Inglesa",                  weight: 2, questions: 18, topics: [] },
      ] },
    // Edital FUZNAVAIS 2025/2026 — 50q objetivas: Port(25q) + Mat(25q) — 3h — mín 10q cada
    // Sem Inglês, Raciocínio Lógico ou Conhecimentos Gerais
    { nome: "Fuzileiros Navais - Marinha do Brasil", sigla: "FUZNAVAIS", esfera: "FEDERAL", exam_type: "MARINHA",
      banca: "MARINHA", cargo_padrao: "Soldado Fuzileiro Naval", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 3, questions: 25, topics: [] },
        { name: "Matemática",        weight: 3, questions: 25, topics: [] },
      ] },
    // ── FORÇA AÉREA ───────────────────────────────────────────────────────────
    // Edital ITA Vestibular 2026 — 1ª Fase: 60q objetivas (12q × 5 matérias)
    // 2ª Fase: discursivas (Mat/Fís/Quím/Port) + Redação dissertativo-argumentativa
    // Física inclui Física Moderna/Relatividade; Mat inclui Complexos/Matrizes/Cônicas
    // Port inclui Literatura Brasileira e Portuguesa (todas as escolas)
    { nome: "Instituto Tecnológico de Aeronáutica", sigla: "ITA", esfera: "FEDERAL", exam_type: "FAB",
      banca: "ITA", cargo_padrao: "Cadete do ITA", estado: null,
      materias: [
        { name: "Matemática",                     weight: 3, questions: 12, topics: [] },
        { name: "Física",                          weight: 3, questions: 12, topics: [] },
        { name: "Química",                         weight: 2, questions: 12, topics: [] },
        { name: "Língua Portuguesa / Literatura",  weight: 2, questions: 12, topics: [] },
        { name: "Língua Inglesa",                  weight: 1, questions: 12, topics: [] },
        { name: "Redação",                         weight: 2, questions:  1, topics: [] },
      ] },
    // Edital EPCAR — nível Ensino Fundamental, 3 provas (SEM Física/Química/Biologia)
    // Matemática: funções afim/quadrática, geo plana básica — sem Cálculo ou Trigonometria avançada
    { nome: "Escola Preparatória de Cadetes do Ar", sigla: "EPCAR", esfera: "FEDERAL", exam_type: "FAB",
      banca: "EPCAR", cargo_padrao: "Cadete do Ar (EPCAR)", estado: null,
      materias: [
        { name: "Matemática",                      weight: 3, questions: 30, topics: [] },
        { name: "Língua Portuguesa",               weight: 2, questions: 25, topics: [] },
        { name: "Língua Inglesa",                  weight: 1, questions: 15, topics: [] },
      ] },
    // Edital EAGS — Língua Portuguesa (comum a todos) + 7 especialidades:
    // SAD (Adm/Contab/Dir.Const/Dir.Admin/Informática), SEL (Eletricidade Básica/Industrial/ABNT/NR-10),
    // BET (Eletricidade/Eletrônica Analógica-Digital/Telecomunicações), SEF (Enfermagem),
    // SLB (Laboratório Clínico), SIN (Programação/SO/BD/Redes/Seg.Info), SMU (Música)
    // "iremos oferecer as matérias no geral sem distinção de cargo interno"
    { nome: "Escola de Especialistas da Aeronáutica - Sargentos", sigla: "EAGS", esfera: "FEDERAL", exam_type: "FAB",
      banca: "EAGS", cargo_padrao: "Sargento da Aeronáutica", estado: null,
      materias: [
        { name: "Língua Portuguesa",                        weight: 2, questions: 20, topics: [] },
        { name: "Administração Geral",                      weight: 2, questions: 15, topics: [] },
        { name: "Contabilidade Geral e Pública",            weight: 2, questions: 15, topics: [] },
        { name: "Direito Constitucional",                   weight: 2, questions: 10, topics: [] },
        { name: "Direito Administrativo",                   weight: 2, questions: 10, topics: [] },
        { name: "Informática / Tecnologia da Informação",   weight: 2, questions: 15, topics: [] },
        { name: "Eletricidade Básica e Industrial",         weight: 2, questions: 15, topics: [] },
        { name: "Eletrônica (Analógica e Digital)",         weight: 2, questions: 15, topics: [] },
        { name: "Telecomunicações",                         weight: 2, questions: 10, topics: [] },
        { name: "Enfermagem",                               weight: 2, questions: 20, topics: [] },
        { name: "Análises Clínicas e Laboratório",          weight: 2, questions: 20, topics: [] },
        { name: "Redes de Computadores e Segurança da Info",weight: 2, questions: 10, topics: [] },
        { name: "Teoria Musical",                           weight: 1, questions: 15, topics: [] },
      ] },
    // ── POLÍCIA MILITAR ───────────────────────────────────────────────────────
    // PM_SD — cruzamento ES + SP + RJ (editais 2023-2026)
    // weight 3 = universal | weight 2 = 2/3 estados | weight 1 = específico de 1 estado
    { nome: "Polícia Militar - Soldado", sigla: "PM_SD", esfera: "ESTADUAL", exam_type: "PM",
      banca: "VUNESP", cargo_padrao: "Soldado PM", estado: null,
      materias: [
        { name: "Língua Portuguesa",               weight: 3, questions: 18, topics: [] },
        { name: "Matemática",                      weight: 3, questions: 18, topics: [] },
        { name: "Conhecimentos Gerais e Atualidades", weight: 2, questions: 20, topics: [] },
        { name: "Legislação Institucional PM",     weight: 2, questions: 10, topics: [] },
        { name: "Direito Administrativo",          weight: 1, questions: 20, topics: [] },
        { name: "Direito Penal",                   weight: 1, questions: 20, topics: [] },
        { name: "Informática",                     weight: 1, questions: 10, topics: [] },
        { name: "Direitos Humanos",                weight: 1, questions: 10, topics: [] },
        { name: "Direito Processual Penal",        weight: 1, questions: 10, topics: [] },
      ] },
    // PM_CFO — cruzamento ES+SP+RJ (editais CFO 2023-2026)
    // Nenhuma matéria é universal (SP=vestibular-style, RJ=jurídico-pesado, ES=meio-termo)
    // weight 2 = aparece em 2/3 estados | weight 1 = específico de 1 estado
    { nome: "Polícia Militar - Oficial (CFO)", sigla: "PM_CFO", esfera: "ESTADUAL", exam_type: "PM",
      banca: "VUNESP", cargo_padrao: "Oficial (Cadete PM)", estado: null,
      materias: [
        { name: "Matemática",                        weight: 2, questions: 23, topics: [] },
        { name: "Língua Portuguesa",                 weight: 2, questions: 20, topics: [] },
        { name: "Conhecimentos Gerais e Atualidades",weight: 2, questions: 18, topics: [] },
        { name: "Direito Administrativo",            weight: 2, questions: 18, topics: [] },
        { name: "Direito Constitucional",            weight: 2, questions: 18, topics: [] },
        { name: "Informática",                       weight: 2, questions: 13, topics: [] },
        { name: "Direito Penal",                     weight: 1, questions: 25, topics: [] },
        { name: "Direito Processual Penal",          weight: 1, questions: 20, topics: [] },
        { name: "Física",                            weight: 1, questions: 15, topics: [] },
        { name: "Direito Penal Militar",             weight: 1, questions: 15, topics: [] },
        { name: "Direitos Humanos",                  weight: 1, questions: 15, topics: [] },
        { name: "Química",                           weight: 1, questions: 10, topics: [] },
        { name: "Biologia",                          weight: 1, questions: 10, topics: [] },
        { name: "Língua Inglesa",                    weight: 1, questions: 10, topics: [] },
        { name: "Legislação Institucional PM",       weight: 1, questions: 10, topics: [] },
      ] },
    // ── CORPO DE BOMBEIROS MILITAR ────────────────────────────────────────────
    // CBM_SD — cruzamento ES+SC+RJ (editais SD 2023-2026)
    // w3=universal | w2=2/3 estados | w1=específico de 1 estado
    { nome: "Corpo de Bombeiros Militar - Soldado", sigla: "CBM_SD", esfera: "ESTADUAL", exam_type: "CBM",
      banca: "VUNESP", cargo_padrao: "Soldado CBM", estado: null,
      materias: [
        { name: "Língua Portuguesa",               weight: 3, questions: 16, topics: [] },
        { name: "Matemática",                      weight: 3, questions: 15, topics: [] },
        { name: "Conhecimentos Gerais e Atualidades", weight: 2, questions: 10, topics: [] },
        { name: "Física",                          weight: 2, questions: 10, topics: [] },
        { name: "Química",                         weight: 2, questions:  7, topics: [] },
        { name: "Biologia",                        weight: 1, questions: 10, topics: [] },
        { name: "Legislação Institucional CBM",    weight: 1, questions:  8, topics: [] },
        { name: "Informática",                     weight: 1, questions:  2, topics: [] },
      ] },
    // CBM_CFO — cruzamento ES+SC+RJ (editais CFO 2023-2026)
    // Destaque: Port+Mat+Física+Química universais (w3) — ciências exatas dominam CBM
    // SC CFO diferencia-se com Direito, RL, Inglês e Redação
    { nome: "Corpo de Bombeiros Militar - Oficial (CFO)", sigla: "CBM_CFO", esfera: "ESTADUAL", exam_type: "CBM",
      banca: "VUNESP", cargo_padrao: "Oficial CBM", estado: null,
      materias: [
        { name: "Língua Portuguesa",                 weight: 3, questions: 12, topics: [] },
        { name: "Matemática",                        weight: 3, questions: 12, topics: [] },
        { name: "Física",                            weight: 3, questions: 12, topics: [] },
        { name: "Química",                           weight: 3, questions:  8, topics: [] },
        { name: "Conhecimentos Gerais e Atualidades",weight: 2, questions: 15, topics: [] },
        { name: "Biologia",                          weight: 2, questions: 13, topics: [] },
        { name: "Direito Administrativo",            weight: 1, questions:  5, topics: [] },
        { name: "Direito Constitucional",            weight: 1, questions:  5, topics: [] },
        { name: "Raciocínio Lógico",                 weight: 1, questions:  4, topics: [] },
        { name: "Administração Pública",             weight: 1, questions:  4, topics: [] },
        { name: "Informática",                       weight: 1, questions:  4, topics: [] },
        { name: "Língua Inglesa",                    weight: 1, questions:  4, topics: [] },
        { name: "Redação",                           weight: 1, questions:  1, topics: [] },
      ] },
    // ── POLÍCIA CIVIL ─────────────────────────────────────────────────────────
    // PC_AGT — cruzamento ES (Ibade ~2022) + SC (FEPESE 2023)
    { nome: "Polícia Civil - Agente", sigla: "PC_AGT", esfera: "ESTADUAL", exam_type: "PC",
      banca: "VUNESP", cargo_padrao: "Agente de Polícia Civil", estado: null,
      materias: [
        { name: "Direito Penal",                    weight: 3, questions: 18, topics: [] },
        { name: "Língua Portuguesa",                weight: 3, questions: 13, topics: [] },
        { name: "Matemática",                       weight: 3, questions: 13, topics: [] },
        { name: "Direito Constitucional",           weight: 3, questions: 13, topics: [] },
        { name: "Direito Administrativo",           weight: 3, questions: 13, topics: [] },
        { name: "Informática",                      weight: 3, questions: 10, topics: [] },
        { name: "Direito Processual Penal",         weight: 3, questions: 10, topics: [] },
        { name: "Contabilidade Geral e Pública",    weight: 3, questions:  8, topics: [] },
        { name: "Administração Geral e Pública",    weight: 1, questions: 10, topics: [] },
        { name: "Direito Civil",                    weight: 1, questions: 10, topics: [] },
        { name: "Legislação Institucional PC",      weight: 1, questions: 10, topics: [] },
        { name: "Direitos Humanos",                 weight: 1, questions:  5, topics: [] },
      ] },
    // PC_PERITO — Edital PC-SP (VUNESP) — Perito Criminal
    // 11 matérias: ciências exatas/forenses dominam; Noções de Direito inclui 11 leis específicas
    { nome: "Polícia Civil - Perito Criminal", sigla: "PC_PERITO", esfera: "ESTADUAL", exam_type: "PC",
      banca: "VUNESP", cargo_padrao: "Perito Criminal", estado: null,
      materias: [
        { name: "Criminalística",                     weight: 3, questions: 18, topics: [] }, // local crime, manchas, balística, cadeia custódia
        { name: "Medicina Legal",                     weight: 3, questions: 15, topics: [] }, // tanatologia, traumatologia, toxicologia, psiquiatria
        { name: "Biologia",                           weight: 3, questions: 15, topics: [] }, // genética forense, PCR, DNA, eletroforese
        { name: "Química",                            weight: 3, questions: 12, topics: [] }, // orgânica, inorgânica, físico-química, eletroquímica
        { name: "Física",                             weight: 2, questions: 12, topics: [] }, // mecânica, óptica, eletricidade, termodinâmica
        { name: "Noções de Direito",                  weight: 2, questions: 20, topics: [] }, // CF, DH, Dir Penal, DPP, Dir Adm + 11 leis especiais
        { name: "Língua Portuguesa",                  weight: 2, questions: 12, topics: [] },
        { name: "Matemática e Raciocínio Lógico",     weight: 2, questions: 15, topics: [] }, // combinatória, probabilidade, geo analítica, matrizes
        { name: "Noções de Criminologia",             weight: 2, questions:  8, topics: [] },
        { name: "Contabilidade",                      weight: 1, questions: 10, topics: [] }, // contabilidade geral + matemática financeira
        { name: "Informática",                        weight: 1, questions: 10, topics: [] },
      ] },
    // PC_PAPILO — Edital PC-SP (VUNESP) — Papiloscopista
    // Core: Noções de Identificação (papiloscopia, datiloscopia, AFIS, Vucetich, necropapiloscopia)
    // Noções de Direito muito amplas: CF + DH + Dir Penal + DPP + 14 leis especiais + Dir Adm
    { nome: "Polícia Civil - Papiloscopista", sigla: "PC_PAPILO", esfera: "ESTADUAL", exam_type: "PC",
      banca: "VUNESP", cargo_padrao: "Papiloscopista", estado: null,
      materias: [
        { name: "Noções de Identificação",         weight: 3, questions: 25, topics: [] }, // datiloscopia, Vucetich, AFIS, impressões papilares
        { name: "Noções de Direito",               weight: 3, questions: 25, topics: [] }, // CF + DH + Dir Penal + DPP + 14 leis + Dir Adm
        { name: "Noções de Biologia",              weight: 2, questions: 15, topics: [] }, // citologia, genética (ABO, Rh, doenças), embriologia
        { name: "Medicina e Odontologia Legal",    weight: 2, questions: 12, topics: [] }, // anatomia crânio-facial, identificação, tanatologia
        { name: "Noções de Criminologia",          weight: 2, questions:  5, topics: [] },
        { name: "Língua Portuguesa",               weight: 2, questions: 12, topics: [] },
        { name: "Noções de Informática",           weight: 1, questions:  8, topics: [] },
        { name: "Noções de Lógica",                weight: 1, questions:  5, topics: [] }, // proposições, tabelas-verdade, diagramas
        { name: "Atualidades",                     weight: 1, questions:  5, topics: [] },
      ] },
    // PC_INV — mesma base ES+SC de PC_AGT + Criminologia (específica do cargo investigador)
    { nome: "Polícia Civil - Investigador", sigla: "PC_INV", esfera: "ESTADUAL", exam_type: "PC",
      banca: "VUNESP", cargo_padrao: "Investigador de Polícia", estado: null,
      materias: [
        { name: "Direito Penal",                    weight: 3, questions: 18, topics: [] },
        { name: "Língua Portuguesa",                weight: 3, questions: 13, topics: [] },
        { name: "Matemática",                       weight: 3, questions: 13, topics: [] },
        { name: "Direito Constitucional",           weight: 3, questions: 13, topics: [] },
        { name: "Direito Administrativo",           weight: 3, questions: 13, topics: [] },
        { name: "Informática",                      weight: 3, questions: 10, topics: [] },
        { name: "Direito Processual Penal",         weight: 3, questions: 10, topics: [] },
        { name: "Contabilidade Geral e Pública",    weight: 3, questions:  8, topics: [] },
        { name: "Criminologia",                     weight: 2, questions:  8, topics: [] },
        { name: "Direito Civil",                    weight: 1, questions: 10, topics: [] },
        { name: "Direitos Humanos",                 weight: 1, questions:  5, topics: [] },
      ] },
    // PC_ESC — mesma base ES+SC de PC_AGT (editais Agente/Escrivão são compartilhados na maioria dos estados)
    { nome: "Polícia Civil - Escrivão", sigla: "PC_ESC", esfera: "ESTADUAL", exam_type: "PC",
      banca: "VUNESP", cargo_padrao: "Escrivão de Polícia Civil", estado: null,
      materias: [
        { name: "Direito Penal",                    weight: 3, questions: 18, topics: [] },
        { name: "Língua Portuguesa",                weight: 3, questions: 13, topics: [] },
        { name: "Matemática",                       weight: 3, questions: 13, topics: [] },
        { name: "Direito Constitucional",           weight: 3, questions: 13, topics: [] },
        { name: "Direito Administrativo",           weight: 3, questions: 13, topics: [] },
        { name: "Informática",                      weight: 3, questions: 10, topics: [] },
        { name: "Direito Processual Penal",         weight: 3, questions: 10, topics: [] },
        { name: "Contabilidade Geral e Pública",    weight: 3, questions:  8, topics: [] },
        { name: "Administração Geral e Pública",    weight: 1, questions: 10, topics: [] },
        { name: "Direito Civil",                    weight: 1, questions: 10, topics: [] },
        { name: "Legislação Institucional PC",      weight: 1, questions: 10, topics: [] },
        { name: "Direitos Humanos",                 weight: 1, questions:  5, topics: [] },
      ] },
    // PC_DEL — Edital PCDF 2021 (Cebraspe) — único edital de referência (DF)
    // 180q divididas em 3 blocos de 60q cada. Cargo de elite: carga jurídica pesada.
    { nome: "Polícia Civil - Delegado", sigla: "PC_DEL", esfera: "ESTADUAL", exam_type: "PC",
      banca: "CEBRASPE", cargo_padrao: "Delegado de Polícia", estado: null,
      materias: [
        { name: "Direito Penal",                    weight: 3, questions: 25, topics: [] },
        { name: "Direito Processual Penal",         weight: 3, questions: 20, topics: [] },
        { name: "Direito Constitucional",           weight: 3, questions: 20, topics: [] },
        { name: "Direito Administrativo",           weight: 3, questions: 20, topics: [] },
        { name: "Direito Civil",                    weight: 2, questions: 15, topics: [] },
        { name: "Criminologia",                     weight: 2, questions: 10, topics: [] },
        { name: "Direitos Humanos",                 weight: 2, questions: 10, topics: [] },
        { name: "Direito Empresarial",              weight: 1, questions: 10, topics: [] },
        { name: "Direito Tributário",               weight: 1, questions: 10, topics: [] },
        { name: "Medicina Legal",                   weight: 1, questions:  5, topics: [] },
        { name: "Criminalística",                   weight: 1, questions:  5, topics: [] },
      ] },
    // ── POLÍCIA PENAL ESTADUAL ────────────────────────────────────────────────
    // PPE — cruzamento ES (IBADE 2024) + MG (SECCRED 2023) + SP (VUNESP 2025)
    { nome: "Polícia Penal Estadual", sigla: "PPE", esfera: "ESTADUAL", exam_type: "PP_ESTADUAL",
      banca: "VUNESP", cargo_padrao: "Policial Penal", estado: null,
      materias: [
        { name: "Língua Portuguesa",                 weight: 3, questions: 17, topics: [] },
        { name: "Direito Penal",                     weight: 3, questions: 12, topics: [] },
        { name: "Informática",                       weight: 3, questions: 10, topics: [] },
        { name: "Direito Constitucional",            weight: 3, questions: 10, topics: [] },
        { name: "Direitos Humanos",                  weight: 3, questions:  8, topics: [] },
        { name: "Legislação Institucional PP",       weight: 3, questions:  5, topics: [] },
        { name: "Conhecimentos Gerais e Atualidades",weight: 2, questions: 15, topics: [] },
        { name: "Matemática",                        weight: 2, questions: 14, topics: [] },
        { name: "Direito Administrativo",            weight: 2, questions: 10, topics: [] },
        { name: "Raciocínio Lógico",                 weight: 2, questions:  9, topics: [] },
        { name: "Legislação Penal Especial",         weight: 2, questions:  8, topics: [] },
        { name: "Direito Processual Penal",          weight: 1, questions:  8, topics: [] },
        { name: "Ética no Serviço Público",          weight: 1, questions:  5, topics: [] },
      ] },
    // PPE_TEC — sem edital específico; mantém Legislação Penal Especial como diferencial
    { nome: "Polícia Penal Estadual - Técnico Superior", sigla: "PPE_TEC", esfera: "ESTADUAL", exam_type: "PP_ESTADUAL",
      banca: "CEBRASPE", cargo_padrao: "Técnico Superior Penitenciário", estado: null,
      materias: [
        { name: "Língua Portuguesa",                 weight: 3, questions: 17, topics: [] },
        { name: "Direito Penal",                     weight: 3, questions: 12, topics: [] },
        { name: "Informática",                       weight: 3, questions: 10, topics: [] },
        { name: "Direito Constitucional",            weight: 3, questions: 10, topics: [] },
        { name: "Direitos Humanos",                  weight: 3, questions:  8, topics: [] },
        { name: "Legislação Institucional PP",       weight: 3, questions:  5, topics: [] },
        { name: "Legislação Penal Especial",         weight: 3, questions:  8, topics: [] },
        { name: "Direito Administrativo",            weight: 2, questions: 10, topics: [] },
        { name: "Direito Processual Penal",          weight: 2, questions:  8, topics: [] },
        { name: "Psicologia Aplicada",               weight: 1, questions:  5, topics: [] },
      ] },
    // ── POLÍCIA CIENTÍFICA ESTADUAL ───────────────────────────────────────────
    // PC_CIENT — derivado de PC_PERITO SP — Polícia Científica (instituição separada da PC em alguns estados)
    // Sem Contabilidade (específico SP/PC); mantém mesmo perfil pericial forense
    { nome: "Polícia Científica Estadual - Perito", sigla: "PC_CIENT", esfera: "ESTADUAL", exam_type: "PC_CIENTIFICA",
      banca: "VUNESP", cargo_padrao: "Perito Criminal Estadual", estado: null,
      materias: [
        { name: "Criminalística",                 weight: 3, questions: 18, topics: [] },
        { name: "Medicina Legal",                 weight: 3, questions: 15, topics: [] },
        { name: "Biologia",                       weight: 3, questions: 15, topics: [] },
        { name: "Química",                        weight: 3, questions: 12, topics: [] },
        { name: "Física",                         weight: 2, questions: 12, topics: [] },
        { name: "Noções de Direito",              weight: 2, questions: 18, topics: [] }, // Dir Penal + DPP + CF + leis forenses
        { name: "Língua Portuguesa",              weight: 2, questions: 12, topics: [] },
        { name: "Matemática e Raciocínio Lógico", weight: 2, questions: 15, topics: [] },
        { name: "Noções de Criminologia",         weight: 2, questions:  8, topics: [] },
        { name: "Informática",                    weight: 1, questions: 10, topics: [] },
      ] },
    // ── POLÍCIA LEGISLATIVA ESTADUAL ──────────────────────────────────────────
    // PLE — cruzamento ES (ALES 2024, 40q) + Federal Câmara (Cebraspe)
    { nome: "Polícia Legislativa Estadual", sigla: "PLE", esfera: "ESTADUAL", exam_type: "PL_ESTADUAL",
      banca: "FCC", cargo_padrao: "Agente de Polícia Legislativa", estado: null,
      materias: [
        { name: "Língua Portuguesa",                 weight: 3, questions: 10, topics: [] },
        { name: "Direito Constitucional",            weight: 3, questions: 10, topics: [] },
        { name: "Informática",                       weight: 3, questions:  8, topics: [] },
        { name: "Direito Penal",                     weight: 3, questions:  6, topics: [] },
        { name: "Direitos Humanos",                  weight: 3, questions:  4, topics: [] },
        { name: "Direito Administrativo",            weight: 1, questions: 15, topics: [] },
        { name: "Raciocínio Lógico",                 weight: 1, questions: 10, topics: [] },
        { name: "Criminologia e Criminalística",     weight: 1, questions: 10, topics: [] },
        { name: "Direito Processual Penal",          weight: 1, questions:  7, topics: [] },
        { name: "Matemática",                        weight: 1, questions:  5, topics: [] },
        { name: "Conhecimentos Gerais e Atualidades",weight: 1, questions:  5, topics: [] },
        { name: "Legislação Institucional PL",       weight: 1, questions:  5, topics: [] },
        { name: "Língua Inglesa",                    weight: 1, questions:  5, topics: [] },
        { name: "Atividade de Inteligência",         weight: 1, questions:  5, topics: [] },
      ] },
    // ── GUARDA PORTUÁRIA ──────────────────────────────────────────────────────
    // GP — cruzamento Pará (EMAP 2023) + Santos (CODESP 2024)
    { nome: "Guarda Portuária", sigla: "GP", esfera: "ESTADUAL", exam_type: "GP",
      banca: "CEBRASPE", cargo_padrao: "Guarda Portuário", estado: null,
      materias: [
        { name: "Língua Portuguesa",                weight: 3, questions: 15, topics: [] },
        { name: "Legislação Portuária",             weight: 3, questions: 15, topics: [] },
        { name: "Raciocínio Lógico",                weight: 3, questions:  8, topics: [] },
        { name: "Direitos Humanos",                 weight: 3, questions:  8, topics: [] },
        { name: "Segurança Operacional",            weight: 3, questions:  7, topics: [] },
        { name: "Noções de Segurança e Vigilância", weight: 3, questions:  5, topics: [] },
        { name: "Direito Constitucional",           weight: 1, questions: 10, topics: [] },
        { name: "Direito Penal",                    weight: 1, questions: 10, topics: [] },
        { name: "Informática",                      weight: 1, questions: 10, topics: [] },
        { name: "Legislação Geral",                 weight: 1, questions:  8, topics: [] },
        { name: "Ética no Serviço Público",         weight: 1, questions:  5, topics: [] },
        { name: "Matemática",                       weight: 1, questions:  5, topics: [] },
        { name: "Língua Inglesa",                   weight: 1, questions:  5, topics: [] },
        { name: "Legislação Específica Porto",      weight: 1, questions:  5, topics: [] },
      ] },
    // ── GUARDA MUNICIPAL ──────────────────────────────────────────────────────
    // GM — cruzamento Vitória ES + SP (VUNESP 2025) + Goiânia GO
    { nome: "Guarda Municipal", sigla: "GM", esfera: "MUNICIPAL", exam_type: "GM",
      banca: "VUNESP", cargo_padrao: "Guarda Municipal", estado: null,
      materias: [
        { name: "Língua Portuguesa",                  weight: 3, questions: 15, topics: [] },
        { name: "Direito Constitucional",             weight: 3, questions: 12, topics: [] },
        { name: "Legislação Específica GM",           weight: 3, questions: 10, topics: [] },
        { name: "Direito Penal",                      weight: 2, questions: 14, topics: [] },
        { name: "Conhecimentos Gerais e Atualidades", weight: 2, questions: 13, topics: [] },
        { name: "Matemática",                         weight: 2, questions: 11, topics: [] },
        { name: "Informática",                        weight: 2, questions: 10, topics: [] },
        { name: "Legislação Geral",                   weight: 2, questions: 10, topics: [] },
      ] },
  ];

  let seeded = 0;
  for (const c of concursosData) {
    await db.execute(sql`
      INSERT INTO concursos (nome, sigla, esfera, exam_type, banca, cargo_padrao, estado, lista_materias_json, created_at, updated_at)
      VALUES (
        ${c.nome}, ${c.sigla}, ${c.esfera}, ${c.exam_type},
        ${c.banca}, ${c.cargo_padrao}, ${c.estado ?? null},
        ${JSON.stringify(c.materias)}::jsonb,
        NOW(), NOW()
      )
      ON CONFLICT (sigla) DO UPDATE SET
        banca = EXCLUDED.banca,
        cargo_padrao = EXCLUDED.cargo_padrao,
        lista_materias_json = EXCLUDED.lista_materias_json,
        updated_at = NOW()
    `);
    seeded++;
  }

  console.log(`  ✅ Tabelas concursos + edital_vinculos OK (${seeded} concursos pré-seeded)`);
  console.log("     Bloco A: PF/PF_ADMIN/PRF/PRF_ADMIN/PLF/PPF/RFB/GP");
  console.log("     Bloco B: Exército(ESPCEX/ESA/IME)/Marinha(CN/EN/FUZNAVAIS)/FAB(ITA/EPCAR/EAGS)");
  console.log("     Bloco C: ABIN/ANAC/CPNU");
  console.log("     Bloco D: PJ_CNJ");
  console.log("     Bloco E: PM/PC/CBM/PPE/PLE/PC_CIENT/GM/GP_municipal");
}

async function migrateUserConcursoColumn() {
  await db.execute(sql`
    ALTER TABLE "User" ADD COLUMN IF NOT EXISTS target_concurso_id TEXT
  `);
  console.log("  ✅ Coluna User.target_concurso_id adicionada");
}

async function migrateSimuladoTypeColumn() {
  await db.execute(sql`
    ALTER TABLE simulados ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'MONTHLY'
  `);
  console.log("  ✅ Coluna simulados.type adicionada");
}

async function migrateGamificationColumns() {
  const col = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'User' AND column_name = 'streak_days'
    ) as exists
  `) as any[];

  if (!col[0]?.exists) {
    console.log("  🔄 Adicionando colunas de gamificação na User...");
    await db.execute(sql`
      ALTER TABLE "User"
      ADD COLUMN IF NOT EXISTS streak_days INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS best_streak INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS last_streak_date VARCHAR(10)
    `);
    console.log("  ✅ Colunas streak_days, best_streak, last_streak_date adicionadas");
  }
}

async function cleanupPFFConcurso() {
  // Remove Polícia Ferroviária Federal — concurso extinto/sem previsão de edital
  const deleted = await db.execute(sql`
    DELETE FROM concursos WHERE sigla = 'PFF' RETURNING id
  `) as any[];
  if (deleted.length > 0) {
    console.log(`  🗑️ Concurso PFF (Polícia Ferroviária Federal) removido do banco`);
  }
}

async function cleanupRedundantConcursos() {
  // 1. Renomear PF genérico para "Polícia Federal - Agente" (evita botão sem cargo ao lado dos específicos)
  await db.execute(sql`
    UPDATE concursos SET nome = 'Polícia Federal - Agente'
    WHERE sigla = 'PF' AND nome = 'Polícia Federal'
  `);

  // 2. Remover registros genéricos que convivem com sub-variantes específicas (causam botões duplicados)
  //    PM, CBM, PC genéricos → substituídos por PM_CFO, PM_SD, CBM_CFO, CBM_SD, PC_AGT etc.
  // 3. Remover variantes por estado (SP) — não devem aparecer sem filtro de estado
  // 4. Remover ENEM (não faz parte do escopo do produto)
  const deleted = await db.execute(sql`
    DELETE FROM concursos
    WHERE sigla IN ('PM', 'CBM', 'PC', 'PM_SP', 'PC_SP', 'ENEM')
    RETURNING sigla
  `) as any[];
  if (deleted.length > 0) {
    const siglas = deleted.map((r: any) => r.sigla).join(', ');
    console.log(`  🗑️ Concursos redundantes removidos do banco: ${siglas}`);
  }

  // 5. Remover Ministério da Defesa e todos os seus aliases
  const delMD = await db.execute(sql`
    DELETE FROM concursos
    WHERE sigla IN ('MIN_DEF', 'MD', 'MIN_DEFESA')
    RETURNING sigla
  `) as any[];
  if (delMD.length > 0) {
    const siglas = delMD.map((r: any) => r.sigla).join(', ');
    console.log(`  🗑️ Ministério da Defesa removido do banco: ${siglas}`);
  }
}

// ============================================
// REPARO DE CRÉDITOS DE REDAÇÃO
// Recalcula monthlyEssaysUsed baseado apenas nas redações com status=CORRECTED.
// Corrige consumo indevido que ocorria antes da transação atômica ser implementada.
// Idempotente — pode rodar múltiplas vezes sem efeito colateral.
// ============================================
async function repairEssayCredits() {
  // Verifica se a tabela essays existe antes de tentar reparar
  const tableExists = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables WHERE table_name = 'essays'
    ) as exists
  `) as any[];
  if (!tableExists[0]?.exists) return;

  const currentMonth = new Date().toISOString().slice(0, 7);

  // Recalcular monthlyEssaysUsed para cada usuário no mês atual:
  // conta apenas redações CORRECTED (sucesso real) — ERROR não debita crédito
  // Conta todas as redações CORRECTED do mês (grátis + pagas)
  // — exclui ERROR (falha IA, crédito não debitado)
  // — exclui CORRECTING (em andamento, crédito ainda não debitado)
  const updated = await db.execute(sql`
    UPDATE "User" u
    SET "monthlyEssaysUsed" = (
      SELECT COUNT(*)::integer
      FROM essays e
      WHERE e.user_id = u.id
        AND e.status = 'CORRECTED'
        AND TO_CHAR(e.submitted_at, 'YYYY-MM') = ${currentMonth}
    )
    WHERE "lastEssayMonth" = ${currentMonth}
      AND "monthlyEssaysUsed" > 0
    RETURNING id, "monthlyEssaysUsed"
  `) as any[];

  if (updated.length > 0) {
    console.log(`  ✅ [Essay Repair] ${updated.length} usuário(s) com créditos recalculados`);
  }
}

// ============================================
// FASE 5 — VERIFICAÇÃO DE INTEGRIDADE
// Garante que nenhuma referência a colunas obsoletas (s.slug, c.body,
// q.contentId) exista nas tabelas de conteúdo antes da população.
// ============================================
async function verifyPhase5Integrity() {
  // 1. Confirmar que "Subject" NÃO tem coluna slug
  const slugCheck = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'Subject' AND column_name = 'slug'
    ) as exists
  `) as any[];
  if (slugCheck[0]?.exists) {
    console.warn("  ⚠️ [Phase5 Integrity] Subject.slug encontrado — coluna obsoleta presente (não fatal)");
  } else {
    console.log("  ✅ [Phase5 Integrity] Subject.slug ausente — OK");
  }

  // 2. Confirmar que "Content" NÃO tem coluna body (usa textContent)
  const bodyCheck = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'Content' AND column_name = 'body'
    ) as exists
  `) as any[];
  if (bodyCheck[0]?.exists) {
    console.warn("  ⚠️ [Phase5 Integrity] Content.body encontrado — usar textContent nas queries");
  } else {
    console.log("  ✅ [Phase5 Integrity] Content.body ausente (usa textContent) — OK");
  }

  // 3. Confirmar que "Question" TEM coluna contentId (usada pelo Tier 3a-0 para evitar roleta russa)
  const contentIdCheck = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'Question' AND column_name = 'contentId'
    ) as exists
  `) as any[];
  if (contentIdCheck[0]?.exists) {
    console.log("  ✅ [Phase5 Integrity] Question.contentId presente — vínculo por conteúdo ativo (Tier 3a-0)");
  } else {
    console.warn("  ⚠️ [Phase5 Integrity] Question.contentId ausente — seeds Group A não funcionarão corretamente");
  }

  console.log("  ✅ [Phase5 Integrity] Verificação concluída");
}

// ============================================
// FASE 5 — COLUNAS DE CONTEÚDO INTELIGENTE
// Adiciona suporte a átomos de teoria enriquecidos na tabela "Content":
//   mnemonic        — regra mnemônica curta (ex: "LIMPE")
//   keyPoint        — ponto-chave do assunto (< 120 chars)
//   practicalExample — exemplo prático concreto (< 200 chars)
// ============================================
async function migratePhase5ContentColumns() {
  const cols = await db.execute(sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'Content'
      AND column_name IN ('mnemonic', 'keyPoint', 'practicalExample')
  `) as any[];
  const existing = new Set(cols.map((c: any) => c.column_name));

  if (existing.has('mnemonic') && existing.has('keyPoint') && existing.has('practicalExample')) {
    return; // já migrado
  }

  console.log("  🔄 [Phase5] Adicionando colunas de enriquecimento em Content...");

  if (!existing.has('mnemonic')) {
    await db.execute(sql`ALTER TABLE "Content" ADD COLUMN IF NOT EXISTS "mnemonic" TEXT`);
  }
  if (!existing.has('keyPoint')) {
    await db.execute(sql`ALTER TABLE "Content" ADD COLUMN IF NOT EXISTS "keyPoint" TEXT`);
  }
  if (!existing.has('practicalExample')) {
    await db.execute(sql`ALTER TABLE "Content" ADD COLUMN IF NOT EXISTS "practicalExample" TEXT`);
  }

  console.log("  ✅ [Phase5] Content: mnemonic, keyPoint, practicalExample adicionados");
}

// ============================================
// FASE 5 — COLUNAS DE FEEDBACK DINÂMICO
// Adiciona dois tipos de explicação em "Question":
//   explanationCorrect — reforço positivo exibido no acerto
//   explanationWrong   — explicação pedagógica exibida no erro
// (complementa wrongExplanations JSONB já existente por alternativa)
// ============================================
async function migratePhase5QuestionColumns() {
  const cols = await db.execute(sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'Question'
      AND column_name IN ('explanationCorrect', 'explanationWrong')
  `) as any[];
  const existing = new Set(cols.map((c: any) => c.column_name));

  if (existing.has('explanationCorrect') && existing.has('explanationWrong')) {
    return; // já migrado
  }

  console.log("  🔄 [Phase5] Adicionando colunas de feedback dinâmico em Question...");

  if (!existing.has('explanationCorrect')) {
    await db.execute(sql`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "explanationCorrect" TEXT`);
  }
  if (!existing.has('explanationWrong')) {
    await db.execute(sql`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "explanationWrong" TEXT`);
  }

  console.log("  ✅ [Phase5] Question: explanationCorrect, explanationWrong adicionados");
}

// ============================================
// FASE 5 — COLUNA DE SEQUENCIAMENTO
// Adiciona minStudyRequirement em "Subject":
//   minStudyRequirement — número mínimo de pílulas que o aluno deve
//     completar antes de avançar para o próximo assunto (default: 1)
// ============================================
async function migratePhase5SubjectColumns() {
  const cols = await db.execute(sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'Subject'
      AND column_name = 'minStudyRequirement'
  `) as any[];

  if (cols.length > 0) {
    return; // já migrado
  }

  console.log("  🔄 [Phase5] Adicionando minStudyRequirement em Subject...");
  await db.execute(sql`
    ALTER TABLE "Subject"
    ADD COLUMN IF NOT EXISTS "minStudyRequirement" INTEGER NOT NULL DEFAULT 1
  `);
  console.log("  ✅ [Phase5] Subject: minStudyRequirement adicionado (default: 1)");
}

// ============================================
// COLUNAS DE PROGRESSO DO ALUNO NA TABELA "User"
// lastStudyContentIds — JSON array de IDs de conteúdo visualizados
//   (antes em migrate-reminder.ts, que nunca foi chamado)
// ============================================
async function migrateStudyProgressColumns() {
  const cols = await db.execute(sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'User' AND column_name = 'lastStudyContentIds'
  `) as any[];

  if (cols.length > 0) return; // já existe

  console.log("  🔄 [StudyProgress] Adicionando lastStudyContentIds em User...");
  await db.execute(sql`
    ALTER TABLE "User"
    ADD COLUMN IF NOT EXISTS "lastStudyContentIds" TEXT DEFAULT '[]'
  `);
  console.log("  ✅ [StudyProgress] User: lastStudyContentIds adicionado");
}

// ============================================
// BACKFILL CERTO/ERRADO — normaliza letras C/E → A/B
// Seeds antigos (pre-Phase5) gravaram alternativas com letra "C" (Certo)
// e "E" (Errado). O backfillCorrectOption anterior corretamente leu
// correctAnswer='E' → correctOption=4. Mas 4 fica fora das 2 opções
// renderizadas (A e B), causando "Gabarito: E" inválido na UI.
// Este backfill renormaliza: C→A (índice 0), E→B (índice 1).
// Idempotente: WHERE correctAnswer IN ('C','E') AND questionType='CERTO_ERRADO'.
// ============================================
async function backfillCertoErrado() {
  const result = await db.execute(sql`
    UPDATE "Question"
    SET
      "correctAnswer" = CASE "correctAnswer"
        WHEN 'C' THEN 'A'
        WHEN 'E' THEN 'B'
        ELSE "correctAnswer"
      END,
      "correctOption" = CASE "correctAnswer"
        WHEN 'C' THEN 0
        WHEN 'E' THEN 1
        ELSE "correctOption"
      END,
      "alternatives" = CASE
        WHEN "questionType" = 'CERTO_ERRADO'
        THEN '[{"letter":"A","text":"Certo"},{"letter":"B","text":"Errado"}]'::jsonb
        ELSE "alternatives"
      END
    WHERE "questionType" = 'CERTO_ERRADO'
      AND ("correctAnswer" = 'C' OR "correctAnswer" = 'E')
  `) as any;
  const updated = result.rowCount ?? result.count ?? 0;
  if (updated > 0) {
    console.log(`  ✅ [Backfill] CERTO/ERRADO: ${updated} questões normalizadas (C/E → A/B)`);
  } else {
    console.log("  ✅ [Backfill] CERTO/ERRADO: todas as questões já normalizadas");
  }
}

// ============================================
// ESSAY COOLDOWN — adiciona last_essay_at na User e rewrite_suggestion na essays
// Substitui o sistema de reset mensal por cooldown de 15 dias rolling.
// ============================================
async function migrateEssayCooldown() {
  const col1 = await db.execute(sql`
    SELECT EXISTS (SELECT FROM information_schema.columns
      WHERE table_name = 'User' AND column_name = 'last_essay_at') as exists
  `) as any[];
  if (!col1[0]?.exists) {
    await db.execute(sql`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS last_essay_at TIMESTAMP`);
    console.log("  ✅ Coluna last_essay_at adicionada em User");
  }

  const col2 = await db.execute(sql`
    SELECT EXISTS (SELECT FROM information_schema.columns
      WHERE table_name = 'essays' AND column_name = 'rewrite_suggestion') as exists
  `) as any[];
  if (!col2[0]?.exists) {
    await db.execute(sql`ALTER TABLE essays ADD COLUMN IF NOT EXISTS rewrite_suggestion TEXT`);
    console.log("  ✅ Coluna rewrite_suggestion adicionada em essays");
  }
}

// ============================================
// REDAÇÃO TEMPLATES — tabela + seed de 9 temas (PF, PM, PC)
// ============================================
async function migrateRedacaoTemplates() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS redacao_templates (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      title TEXT NOT NULL,
      motivating_text TEXT NOT NULL,
      concurso_category TEXT NOT NULL,
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  const count = await db.execute(sql`SELECT COUNT(*) as n FROM redacao_templates`) as any[];
  if (Number(count[0]?.n) > 0) return;

  const templates = [
    // PF — Cebraspe (dissertativo-argumentativo)
    {
      category: "PF",
      title: "O papel da inteligência policial no combate ao crime organizado",
      motivating: "A crescente sofisticação das organizações criminosas exige que a Polícia Federal adote estratégias de inteligência cada vez mais avançadas. Segundo o Relatório de Inteligência 2023, o uso de análise de dados e monitoramento digital ampliou em 40% a taxa de desarticulação de redes criminosas nos últimos cinco anos. Discuta o papel da inteligência policial no combate ao crime organizado e proponha medidas para fortalecer essa atuação.",
    },
    {
      category: "PF",
      title: "Privacidade e segurança: limites do monitoramento digital pelo Estado",
      motivating: "A expansão das tecnologias de vigilância digital levanta questões éticas sobre o equilíbrio entre segurança pública e direito à privacidade. A Constituição Federal garante a inviolabilidade das comunicações, mas o Supremo Tribunal Federal reconhece exceções para fins de investigação criminal. Discuta os limites do monitoramento digital pelo Estado à luz dos direitos fundamentais e apresente uma proposta de intervenção.",
    },
    {
      category: "PF",
      title: "Segurança nas fronteiras e soberania nacional: desafios para a Polícia Federal",
      motivating: "O Brasil possui 16.886 km de fronteiras terrestres e 7.491 km de litoral, tornando o controle fronteiriço um desafio permanente. O tráfico de drogas, armas e pessoas representa ameaça à soberania e à segurança nacional. Redija um texto dissertativo-argumentativo sobre os desafios da Polícia Federal no controle das fronteiras brasileiras e proponha medidas para aprimorar esse trabalho.",
    },
    // PM — Vunesp (dissertativo com análise textual)
    {
      category: "PM",
      title: "Policiamento comunitário como estratégia de redução da violência urbana",
      motivating: "Estudos do Instituto de Pesquisa Econômica Aplicada (IPEA) apontam que o policiamento comunitário pode reduzir em até 25% os índices de criminalidade em áreas urbanas. A aproximação entre a Polícia Militar e a comunidade fortalece vínculos de confiança e facilita a obtenção de informações. Desenvolva um texto sobre a importância do policiamento comunitário para a redução da violência nas cidades.",
    },
    {
      category: "PM",
      title: "Saúde mental dos profissionais de segurança pública: um dever institucional",
      motivating: "Pesquisa do Fórum Brasileiro de Segurança Pública (2023) revelou que 47% dos policiais militares apresentam algum nível de estresse pós-traumático ao longo da carreira. A exposição constante a situações de risco e violência compromete a saúde mental dos profissionais. Escreva um texto dissertativo sobre a importância do cuidado com a saúde mental dos policiais militares e as medidas necessárias para garanti-la.",
    },
    {
      category: "PM",
      title: "O uso de câmeras corporais por policiais militares: transparência e accountability",
      motivating: "A adoção de câmeras corporais (bodycams) por policiais militares tem sido apontada como ferramenta eficaz para aumentar a transparência das ações policiais e reduzir denúncias de abusos. Em São Paulo, a implantação das câmeras reduziu em 60% as reclamações contra policiais. Discorra sobre os benefícios e desafios do uso de câmeras corporais pela Polícia Militar.",
    },
    // PC — FGV (dissertativo-argumentativo)
    {
      category: "PC",
      title: "Tecnologia forense e modernização das investigações criminais",
      motivating: "O avanço da tecnologia forense revolucionou as investigações criminais nas últimas décadas. Técnicas como análise de DNA, perícia digital e inteligência artificial permitem solucionar crimes que antes permaneceriam impunes. Segundo o Ministério da Justiça, estados que investiram em laboratórios forenses modernos apresentaram taxa de elucidação de homicídios 35% superior à média nacional. Discuta a importância da tecnologia forense para a Polícia Civil e proponha medidas para sua ampliação.",
    },
    {
      category: "PC",
      title: "A investigação criminal e o respeito aos direitos fundamentais do investigado",
      motivating: "O processo investigativo criminal deve equilibrar a eficiência na elucidação de crimes com o respeito aos direitos e garantias fundamentais dos investigados. O Código de Processo Penal prevê mecanismos como o contraditório e a ampla defesa para proteger o cidadão de arbitrariedades. Redija um texto sobre como a Polícia Civil pode conduzir investigações eficientes sem violar os direitos fundamentais dos investigados.",
    },
    {
      category: "PC",
      title: "Combate à corrupção: o papel estratégico da Polícia Civil",
      motivating: "A corrupção causa prejuízos estimados em R$ 200 bilhões anuais ao Brasil, segundo a Federação das Indústrias do Estado de São Paulo (FIESP). A Polícia Civil tem papel fundamental na investigação de crimes contra a administração pública, atuando em conjunto com o Ministério Público e órgãos de controle. Desenvolva um texto sobre o papel da Polícia Civil no combate à corrupção e proponha estratégias para fortalecer essa atuação.",
    },
  ];

  for (const t of templates) {
    await db.execute(sql`
      INSERT INTO redacao_templates (title, motivating_text, concurso_category, active)
      VALUES (${t.title}, ${t.motivating}, ${t.category}, true)
    `);
  }
  console.log("  ✅ redacao_templates criada com 9 temas seeded");
}

// ============================================
// BACKFILL correctOption — questões antigas sem índice numérico
// Seeds pré-Phase5 popularam "correctAnswer" (letra A/B/C/D/E) mas
// não "correctOption" (índice 0-4). O endpoint de resposta usa
// correctOption para calcular isCorrect — sem ele, qualquer resposta
// diferente de A é marcada incorreta e o gabarito exibe "?".
// Idempotente: WHERE "correctOption" IS NULL.
// ============================================
async function backfillCorrectOption() {
  const result = await db.execute(sql`
    UPDATE "Question"
    SET "correctOption" = CASE "correctAnswer"
      WHEN 'A' THEN 0
      WHEN 'B' THEN 1
      WHEN 'C' THEN 2
      WHEN 'D' THEN 3
      WHEN 'E' THEN 4
      ELSE NULL
    END
    WHERE "correctOption" IS NULL
      AND "correctAnswer" IS NOT NULL
      AND "correctAnswer" IN ('A','B','C','D','E')
  `) as any;
  const updated = result.rowCount ?? result.count ?? 0;
  if (updated > 0) {
    console.log(`  ✅ [Backfill] correctOption: ${updated} questões corrigidas (gabarito '?' eliminado)`);
  } else {
    console.log("  ✅ [Backfill] correctOption: todas as questões já estavam corretas");
  }
}

// ============================================
// PASSWORD RESET CODES — tabela para recuperação de senha
// ============================================
async function migratePasswordResetCodes() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS password_reset_codes (
      id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id     TEXT        NOT NULL,
      code        VARCHAR(6)  NOT NULL,
      expires_at  TIMESTAMP   NOT NULL,
      created_at  TIMESTAMP   DEFAULT NOW(),
      used_at     TIMESTAMP
    )
  `);
  console.log("  ✅ password_reset_codes OK");
}

// ============================================
// GLOBAL LOGOUT — coluna para invalidar tokens anteriores
// ============================================
async function migrateGlobalLogout() {
  await db.execute(sql`
    ALTER TABLE "User" ADD COLUMN IF NOT EXISTS last_global_logout_at TIMESTAMP
  `);
  console.log("  ✅ last_global_logout_at OK");
}

// ============================================
// MNEMONICS TABLE — tabela standalone de mnemônicos estratégicos
// ============================================
async function migrateMnemonicsTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS mnemonics (
      id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
      subject_id  TEXT,
      title       TEXT        NOT NULL UNIQUE,
      phrase      TEXT        NOT NULL,
      meaning     TEXT        NOT NULL,
      category    TEXT        NOT NULL DEFAULT 'GERAL',
      difficulty  TEXT        NOT NULL DEFAULT 'MEDIO',
      is_active   BOOLEAN     NOT NULL DEFAULT true,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  console.log("  ✅ mnemonics OK");
}

// ============================================
// ENTRY POINT — CLI direto (npx tsx db/auto-migrate.ts)
// ============================================
runAutoMigrations()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ [Auto-Migrate] Erro fatal:", err);
    process.exit(1);
  });
