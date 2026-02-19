import { db } from "./index";
import { sql } from "drizzle-orm";

/**
 * Auto-migração que roda no startup do servidor.
 * Verifica e cria tabelas/colunas necessárias se não existirem.
 * Seguro para rodar múltiplas vezes (idempotente).
 */
export async function runAutoMigrations() {
  console.log("🔄 [Auto-Migrate] Verificando banco de dados...");

  try {
    // 1. Verificar tabela leads
    await migrateLeadsTable();

    // 2. Verificar coluna last_active_at na User
    await migrateUserColumns();

    // 3. Configurar beta tester
    await migrateBetaTester();

    // 4. Garantir tabelas de promo codes
    await migratePromoCodes();

    // 5. Criar códigos promo iniciais
    await createDefaultPromoCodes();

    // 6. Colunas de revisão (Professor Revisor - Fase D)
    await migrateReviewColumns();

    // 7. Tabela de redações (essays)
    await migrateEssaysTable();

    // 8. Colunas de auth web (Sala de Aula)
    await migrateStudentAuthColumns();

    // 9. Colunas de gamificação (streak, ranking)
    await migrateGamificationColumns();

    // 10. Criar tabelas de educação (questions, sm2_reviews, simulados, ...)
    await migrateEducationTables();

    // 11. Tornar questions.created_by nullable (geração automática de IA)
    await migrateQuestionsCreatedByNullable();

    console.log("✅ [Auto-Migrate] Banco de dados OK!\n");
  } catch (error) {
    console.error("⚠️ [Auto-Migrate] Erro (não fatal):", error);
  }
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

  // Adicionar colunas de revisão ao question (tabela Prisma, stored lowercase no PG)
  const questionCol = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'question' AND column_name = 'reviewStatus'
    ) as exists
  `) as any[];

  if (!questionCol[0]?.exists) {
    console.log("  🔄 Adicionando colunas de revisão ao question...");
    await db.execute(sql`
      ALTER TABLE question
      ADD COLUMN IF NOT EXISTS "reviewStatus" VARCHAR(20) DEFAULT 'PENDENTE',
      ADD COLUMN IF NOT EXISTS "reviewScore" INTEGER,
      ADD COLUMN IF NOT EXISTS "reviewNotes" TEXT,
      ADD COLUMN IF NOT EXISTS "reviewedAt" TIMESTAMP
    `);
    console.log("  ✅ Colunas de revisão do question adicionadas");
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
  // ── questions (plural, Drizzle) ───────────────────────────────────────
  const qExists = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'questions'
    ) as exists
  `) as any[];

  if (!qExists[0]?.exists) {
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
  } else {
    console.log("  ✅ [Migration] Tabela questions verificada/existente");
  }

  // ── sm2_reviews ───────────────────────────────────────────────────────
  const sm2Exists = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'sm2_reviews'
    ) as exists
  `) as any[];

  if (!sm2Exists[0]?.exists) {
    console.log("  🔄 Criando tabela sm2_reviews...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sm2_reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        content_id VARCHAR(255) NOT NULL,
        ease_factor REAL NOT NULL DEFAULT 2.5,
        interval INTEGER NOT NULL DEFAULT 1,
        repetitions INTEGER NOT NULL DEFAULT 0,
        next_review_date TIMESTAMP NOT NULL,
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
  } else {
    console.log("  ✅ [Migration] Tabela sm2_reviews verificada/existente");
  }

  // ── simulados + tabelas relacionadas ──────────────────────────────────
  const simExists = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'simulados'
    ) as exists
  `) as any[];

  if (!simExists[0]?.exists) {
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
        user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
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
  } else {
    console.log("  ✅ [Migration] Tabelas de simulados verificadas/existentes");
  }
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
