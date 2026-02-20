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
    { nome: "Polícia Federal", sigla: "PF", esfera: "FEDERAL", exam_type: "PF",
      banca: "CEBRASPE", cargo_padrao: "Agente de Polícia Federal", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Inglês", weight: 1, questions: 5, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 10, topics: [] },
        { name: "Direito Constitucional", weight: 2, questions: 10, topics: [] },
        { name: "Direito Administrativo", weight: 1, questions: 10, topics: [] },
        { name: "Direito Penal", weight: 2, questions: 10, topics: [] },
        { name: "Direito Processual Penal", weight: 2, questions: 10, topics: [] },
        { name: "Criminalística", weight: 1, questions: 10, topics: [] },
        { name: "Legislação Especial", weight: 1, questions: 5, topics: [] },
        { name: "Informática", weight: 1, questions: 5, topics: [] },
      ] },
    { nome: "Polícia Federal - Escrivão", sigla: "PF_ESC", esfera: "FEDERAL", exam_type: "PF",
      banca: "CEBRASPE", cargo_padrao: "Escrivão de Polícia Federal", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 2, questions: 20, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 10, topics: [] },
        { name: "Direito Constitucional", weight: 2, questions: 10, topics: [] },
        { name: "Direito Administrativo", weight: 1, questions: 10, topics: [] },
        { name: "Direito Penal", weight: 2, questions: 10, topics: [] },
        { name: "Direito Processual Penal", weight: 2, questions: 10, topics: [] },
        { name: "Criminalística", weight: 1, questions: 10, topics: [] },
        { name: "Informática", weight: 1, questions: 10, topics: [] },
      ] },
    { nome: "Polícia Federal - Papiloscopista", sigla: "PF_PAPILO", esfera: "FEDERAL", exam_type: "PF",
      banca: "CEBRASPE", cargo_padrao: "Papiloscopista Federal", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 10, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 10, topics: [] },
        { name: "Direito Constitucional", weight: 1, questions: 5, topics: [] },
        { name: "Direito Penal", weight: 1, questions: 10, topics: [] },
        { name: "Direito Processual Penal", weight: 1, questions: 10, topics: [] },
        { name: "Papiloscopia", weight: 3, questions: 25, topics: [] },
        { name: "Criminalística", weight: 2, questions: 15, topics: [] },
      ] },
    { nome: "Polícia Federal - Delegado", sigla: "PF_DEL", esfera: "FEDERAL", exam_type: "PF",
      banca: "CEBRASPE", cargo_padrao: "Delegado de Polícia Federal", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 5, topics: [] },
        { name: "Direito Constitucional", weight: 2, questions: 15, topics: [] },
        { name: "Direito Administrativo", weight: 1, questions: 10, topics: [] },
        { name: "Direito Penal", weight: 3, questions: 25, topics: [] },
        { name: "Direito Processual Penal", weight: 3, questions: 25, topics: [] },
        { name: "Direito Civil", weight: 1, questions: 10, topics: [] },
        { name: "Medicina Legal", weight: 1, questions: 5, topics: [] },
        { name: "Criminalística", weight: 1, questions: 5, topics: [] },
      ] },
    // ── POLÍCIA RODOVIÁRIA FEDERAL (CEBRASPE) ────────────────────────────────
    { nome: "Polícia Rodoviária Federal", sigla: "PRF", esfera: "FEDERAL", exam_type: "PRF",
      banca: "CEBRASPE", cargo_padrao: "Policial Rodoviário Federal", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 15, topics: [] },
        { name: "Matemática", weight: 1, questions: 5, topics: [] },
        { name: "Direito Constitucional", weight: 1, questions: 10, topics: [] },
        { name: "Legislação de Trânsito", weight: 3, questions: 20, topics: [] },
        { name: "Direito Administrativo", weight: 1, questions: 5, topics: [] },
        { name: "Informática", weight: 1, questions: 5, topics: [] },
        { name: "Atualidades", weight: 1, questions: 5, topics: [] },
      ] },
    // ── POLÍCIA PENAL FEDERAL / DEPEN (CEBRASPE) ────────────────────────────
    { nome: "Polícia Penal Federal", sigla: "PPF", esfera: "FEDERAL", exam_type: "PP_FEDERAL",
      banca: "CEBRASPE", cargo_padrao: "Agente de Polícia Penal Federal", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Direito Constitucional", weight: 2, questions: 20, topics: [] },
        { name: "Direito Penal", weight: 2, questions: 20, topics: [] },
        { name: "Direito Processual Penal", weight: 2, questions: 20, topics: [] },
        { name: "Direito Administrativo", weight: 1, questions: 15, topics: [] },
        { name: "Legislação de Execução Penal", weight: 2, questions: 10, topics: [] },
      ] },
    // ── POLÍCIA FERROVIÁRIA FEDERAL (estimado — sem edital recente) ──────────
    { nome: "Polícia Ferroviária Federal", sigla: "PFF", esfera: "FEDERAL", exam_type: "PF_FERROVIARIA",
      banca: "CEBRASPE", cargo_padrao: "Agente Ferroviário", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 10, topics: [] },
        { name: "Direito Constitucional", weight: 1, questions: 15, topics: [] },
        { name: "Direito Administrativo", weight: 1, questions: 15, topics: [] },
        { name: "Direito Penal", weight: 1, questions: 10, topics: [] },
        { name: "Legislação Ferroviária", weight: 2, questions: 15, topics: [] },
        { name: "Informática", weight: 1, questions: 5, topics: [] },
      ] },
    // ── POLÍCIA LEGISLATIVA FEDERAL / CÂMARA (CEBRASPE) ─────────────────────
    { nome: "Polícia Legislativa Federal", sigla: "PLF", esfera: "FEDERAL", exam_type: "PL_FEDERAL",
      banca: "CEBRASPE", cargo_padrao: "Policial Legislativo Federal", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 10, topics: [] },
        { name: "Direito Constitucional", weight: 2, questions: 20, topics: [] },
        { name: "Direito Administrativo", weight: 2, questions: 15, topics: [] },
        { name: "Legislação da Câmara dos Deputados", weight: 2, questions: 15, topics: [] },
        { name: "Informática", weight: 1, questions: 5, topics: [] },
        { name: "Atualidades", weight: 1, questions: 5, topics: [] },
      ] },
    // ── POLÍCIA JUDICIAL CNJ (FCC/CEBRASPE) ──────────────────────────────────
    { nome: "Polícia Judicial CNJ", sigla: "PJ_CNJ", esfera: "FEDERAL", exam_type: "PJ_CNJ",
      banca: "FCC", cargo_padrao: "Analista Judiciário - Área Policial", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 10, topics: [] },
        { name: "Direito Constitucional", weight: 2, questions: 20, topics: [] },
        { name: "Direito Administrativo", weight: 2, questions: 15, topics: [] },
        { name: "Legislação Específica CNJ", weight: 2, questions: 15, topics: [] },
        { name: "Informática", weight: 1, questions: 5, topics: [] },
      ] },
    // ── ABIN (CEBRASPE) ───────────────────────────────────────────────────────
    { nome: "Agência Brasileira de Inteligência", sigla: "ABIN", esfera: "FEDERAL", exam_type: "ABIN",
      banca: "CEBRASPE", cargo_padrao: "Oficial de Inteligência", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Inglês", weight: 1, questions: 10, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 15, topics: [] },
        { name: "Direito Constitucional", weight: 1, questions: 15, topics: [] },
        { name: "Direito Administrativo", weight: 1, questions: 10, topics: [] },
        { name: "Atividade de Inteligência", weight: 3, questions: 20, topics: [] },
        { name: "Relações Internacionais", weight: 1, questions: 10, topics: [] },
        { name: "Atualidades", weight: 1, questions: 5, topics: [] },
      ] },
    // ── ANAC (CEBRASPE) ───────────────────────────────────────────────────────
    { nome: "Agência Nacional de Aviação Civil", sigla: "ANAC", esfera: "FEDERAL", exam_type: "ANAC",
      banca: "CEBRASPE", cargo_padrao: "Especialista em Regulação de Aviação Civil", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Inglês", weight: 1, questions: 10, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 15, topics: [] },
        { name: "Direito Constitucional", weight: 1, questions: 10, topics: [] },
        { name: "Direito Administrativo", weight: 1, questions: 10, topics: [] },
        { name: "Administração Pública", weight: 1, questions: 10, topics: [] },
        { name: "Legislação Aeronáutica", weight: 3, questions: 20, topics: [] },
      ] },
    // ── CPNU (CEBRASPE) ───────────────────────────────────────────────────────
    { nome: "Concurso Público Nacional Unificado", sigla: "CPNU", esfera: "FEDERAL", exam_type: "CPNU",
      banca: "CEBRASPE", cargo_padrao: "Analista de Políticas Públicas", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 2, questions: 20, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 15, topics: [] },
        { name: "Direito Constitucional", weight: 2, questions: 15, topics: [] },
        { name: "Direito Administrativo", weight: 1, questions: 10, topics: [] },
        { name: "Política e Gestão Pública", weight: 1, questions: 15, topics: [] },
        { name: "Atualidades", weight: 1, questions: 5, topics: [] },
      ] },
    // ── EXÉRCITO ──────────────────────────────────────────────────────────────
    { nome: "Exército Brasileiro - ESPCEX", sigla: "ESPCEX", esfera: "FEDERAL", exam_type: "EXERCITO",
      banca: "VUNESP", cargo_padrao: "Cadete do Exército (ESPCEX)", estado: null,
      materias: [
        { name: "Matemática", weight: 3, questions: 40, topics: [] },
        { name: "Física", weight: 2, questions: 20, topics: [] },
        { name: "Química", weight: 1, questions: 10, topics: [] },
        { name: "Biologia", weight: 1, questions: 10, topics: [] },
        { name: "Língua Portuguesa", weight: 1, questions: 10, topics: [] },
        { name: "História", weight: 1, questions: 5, topics: [] },
        { name: "Geografia", weight: 1, questions: 5, topics: [] },
      ] },
    { nome: "Instituto Militar de Engenharia", sigla: "IME", esfera: "FEDERAL", exam_type: "EXERCITO",
      banca: "IME", cargo_padrao: "Cadete de Engenharia (IME)", estado: null,
      materias: [
        { name: "Matemática", weight: 3, questions: 50, topics: [] },
        { name: "Física", weight: 2, questions: 30, topics: [] },
        { name: "Química", weight: 1, questions: 20, topics: [] },
        { name: "Língua Portuguesa", weight: 1, questions: 10, topics: [] },
        { name: "Inglês", weight: 1, questions: 10, topics: [] },
      ] },
    { nome: "Escola de Sargentos das Armas", sigla: "ESA", esfera: "FEDERAL", exam_type: "EXERCITO",
      banca: "ESPCEX", cargo_padrao: "Sargento do Exército", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 20, topics: [] },
        { name: "Matemática", weight: 2, questions: 20, topics: [] },
        { name: "Física", weight: 1, questions: 10, topics: [] },
        { name: "História do Brasil", weight: 1, questions: 10, topics: [] },
        { name: "Atualidades", weight: 1, questions: 5, topics: [] },
      ] },
    // ── MARINHA ───────────────────────────────────────────────────────────────
    { nome: "Colégio Naval - Marinha do Brasil", sigla: "CN", esfera: "FEDERAL", exam_type: "MARINHA",
      banca: "CN", cargo_padrao: "Aspirante a Guarda-Marinha", estado: null,
      materias: [
        { name: "Matemática", weight: 3, questions: 35, topics: [] },
        { name: "Física", weight: 2, questions: 15, topics: [] },
        { name: "Química", weight: 1, questions: 10, topics: [] },
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Inglês", weight: 1, questions: 10, topics: [] },
        { name: "Ciências Naturais", weight: 1, questions: 10, topics: [] },
        { name: "História", weight: 1, questions: 5, topics: [] },
      ] },
    { nome: "Escola Naval - Marinha do Brasil", sigla: "EN", esfera: "FEDERAL", exam_type: "MARINHA",
      banca: "EN", cargo_padrao: "Guarda-Marinha", estado: null,
      materias: [
        { name: "Matemática", weight: 3, questions: 40, topics: [] },
        { name: "Física", weight: 2, questions: 20, topics: [] },
        { name: "Química", weight: 1, questions: 10, topics: [] },
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Inglês", weight: 1, questions: 15, topics: [] },
      ] },
    { nome: "Fuzileiros Navais - Marinha do Brasil", sigla: "FUZNAVAIS", esfera: "FEDERAL", exam_type: "MARINHA",
      banca: "CESGRANRIO", cargo_padrao: "Recruta Fuzileiro Naval", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 2, questions: 20, topics: [] },
        { name: "Matemática", weight: 2, questions: 20, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 10, topics: [] },
        { name: "Conhecimentos Gerais", weight: 1, questions: 15, topics: [] },
        { name: "Inglês", weight: 1, questions: 5, topics: [] },
      ] },
    // ── FORÇA AÉREA ───────────────────────────────────────────────────────────
    { nome: "Instituto Tecnológico de Aeronáutica", sigla: "ITA", esfera: "FEDERAL", exam_type: "FAB",
      banca: "ITA", cargo_padrao: "Cadete do ITA", estado: null,
      materias: [
        { name: "Matemática", weight: 3, questions: 60, topics: [] },
        { name: "Física", weight: 3, questions: 40, topics: [] },
        { name: "Química", weight: 2, questions: 20, topics: [] },
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Inglês", weight: 1, questions: 15, topics: [] },
      ] },
    { nome: "Escola Preparatória de Cadetes do Ar", sigla: "EPCAR", esfera: "FEDERAL", exam_type: "FAB",
      banca: "EPCAR", cargo_padrao: "Cadete do Ar", estado: null,
      materias: [
        { name: "Matemática", weight: 3, questions: 30, topics: [] },
        { name: "Física", weight: 2, questions: 20, topics: [] },
        { name: "Química", weight: 1, questions: 10, topics: [] },
        { name: "Biologia", weight: 1, questions: 10, topics: [] },
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Inglês", weight: 1, questions: 10, topics: [] },
      ] },
    { nome: "Escola de Especialistas da Aeronáutica - Sargentos", sigla: "EAGS", esfera: "FEDERAL", exam_type: "FAB",
      banca: "EAGS", cargo_padrao: "Sargento da Aeronáutica", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 20, topics: [] },
        { name: "Matemática", weight: 2, questions: 20, topics: [] },
        { name: "Física", weight: 1, questions: 10, topics: [] },
        { name: "Inglês", weight: 1, questions: 10, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 10, topics: [] },
      ] },
    // ── POLÍCIA MILITAR ───────────────────────────────────────────────────────
    { nome: "Polícia Militar - Oficial (CFO)", sigla: "PM_CFO", esfera: "ESTADUAL", exam_type: "PM",
      banca: "VUNESP", cargo_padrao: "Oficial (Cadete PM)", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 20, topics: [] },
        { name: "Matemática", weight: 1, questions: 15, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 15, topics: [] },
        { name: "Direito Constitucional", weight: 2, questions: 15, topics: [] },
        { name: "Direito Administrativo", weight: 1, questions: 10, topics: [] },
        { name: "Legislação Militar PM", weight: 2, questions: 15, topics: [] },
      ] },
    { nome: "Polícia Militar - Soldado", sigla: "PM_SD", esfera: "ESTADUAL", exam_type: "PM",
      banca: "VUNESP", cargo_padrao: "Soldado PM", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Matemática", weight: 1, questions: 10, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 10, topics: [] },
        { name: "Direito Constitucional", weight: 1, questions: 10, topics: [] },
        { name: "Legislação Específica PM", weight: 2, questions: 15, topics: [] },
        { name: "Informática", weight: 1, questions: 5, topics: [] },
      ] },
    { nome: "Polícia Militar de São Paulo - Soldado", sigla: "PM_SP", esfera: "ESTADUAL", exam_type: "PM",
      banca: "VUNESP", cargo_padrao: "Soldado PM SP", estado: "SP",
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Matemática", weight: 1, questions: 10, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 10, topics: [] },
        { name: "Direito Constitucional", weight: 1, questions: 10, topics: [] },
        { name: "Legislação Específica PM", weight: 2, questions: 15, topics: [] },
        { name: "Informática", weight: 1, questions: 5, topics: [] },
      ] },
    // ── CORPO DE BOMBEIROS MILITAR ────────────────────────────────────────────
    { nome: "Corpo de Bombeiros Militar - Oficial (CFO)", sigla: "CBM_CFO", esfera: "ESTADUAL", exam_type: "CBM",
      banca: "VUNESP", cargo_padrao: "Oficial CBM", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Matemática", weight: 1, questions: 15, topics: [] },
        { name: "Física", weight: 1, questions: 10, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 10, topics: [] },
        { name: "Direito Constitucional", weight: 1, questions: 10, topics: [] },
        { name: "Legislação Bombeiros", weight: 2, questions: 15, topics: [] },
        { name: "Química", weight: 1, questions: 5, topics: [] },
      ] },
    { nome: "Corpo de Bombeiros Militar - Soldado", sigla: "CBM_SD", esfera: "ESTADUAL", exam_type: "CBM",
      banca: "VUNESP", cargo_padrao: "Soldado CBM", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Matemática", weight: 1, questions: 10, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 10, topics: [] },
        { name: "Direito Constitucional", weight: 1, questions: 10, topics: [] },
        { name: "Legislação Específica CBM", weight: 2, questions: 15, topics: [] },
        { name: "Noções de Primeiros Socorros", weight: 1, questions: 5, topics: [] },
      ] },
    // ── POLÍCIA CIVIL ─────────────────────────────────────────────────────────
    { nome: "Polícia Civil - Agente", sigla: "PC_AGT", esfera: "ESTADUAL", exam_type: "PC",
      banca: "VUNESP", cargo_padrao: "Agente de Polícia Civil", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Direito Penal", weight: 2, questions: 20, topics: [] },
        { name: "Direito Processual Penal", weight: 2, questions: 20, topics: [] },
        { name: "Direito Constitucional", weight: 1, questions: 10, topics: [] },
        { name: "Direito Administrativo", weight: 1, questions: 10, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 10, topics: [] },
        { name: "Informática", weight: 1, questions: 5, topics: [] },
      ] },
    { nome: "Polícia Civil - Perito Criminal", sigla: "PC_PERITO", esfera: "ESTADUAL", exam_type: "PC",
      banca: "VUNESP", cargo_padrao: "Perito Criminal", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 10, topics: [] },
        { name: "Ciências Forenses", weight: 3, questions: 30, topics: [] },
        { name: "Química", weight: 2, questions: 15, topics: [] },
        { name: "Biologia", weight: 2, questions: 10, topics: [] },
        { name: "Física", weight: 1, questions: 10, topics: [] },
        { name: "Direito Processual Penal", weight: 1, questions: 10, topics: [] },
        { name: "Direito Penal", weight: 1, questions: 5, topics: [] },
      ] },
    { nome: "Polícia Civil - Papiloscopista", sigla: "PC_PAPILO", esfera: "ESTADUAL", exam_type: "PC",
      banca: "VUNESP", cargo_padrao: "Papiloscopista", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Papiloscopia", weight: 3, questions: 25, topics: [] },
        { name: "Direito Penal", weight: 1, questions: 15, topics: [] },
        { name: "Direito Processual Penal", weight: 1, questions: 15, topics: [] },
        { name: "Criminalística", weight: 2, questions: 10, topics: [] },
        { name: "Direito Constitucional", weight: 1, questions: 10, topics: [] },
      ] },
    { nome: "Polícia Civil - Investigador", sigla: "PC_INV", esfera: "ESTADUAL", exam_type: "PC",
      banca: "VUNESP", cargo_padrao: "Investigador de Polícia", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Direito Penal", weight: 2, questions: 20, topics: [] },
        { name: "Direito Processual Penal", weight: 2, questions: 20, topics: [] },
        { name: "Direito Constitucional", weight: 1, questions: 10, topics: [] },
        { name: "Direito Administrativo", weight: 1, questions: 10, topics: [] },
        { name: "Criminologia", weight: 1, questions: 5, topics: [] },
      ] },
    { nome: "Polícia Civil SP - Investigador", sigla: "PC_SP", esfera: "ESTADUAL", exam_type: "PC",
      banca: "VUNESP", cargo_padrao: "Investigador de Polícia SP", estado: "SP",
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Direito Penal", weight: 2, questions: 15, topics: [] },
        { name: "Direito Processual Penal", weight: 2, questions: 15, topics: [] },
        { name: "Direito Constitucional", weight: 1, questions: 10, topics: [] },
        { name: "Direito Administrativo", weight: 1, questions: 10, topics: [] },
      ] },
    { nome: "Polícia Civil - Escrivão", sigla: "PC_ESC", esfera: "ESTADUAL", exam_type: "PC",
      banca: "VUNESP", cargo_padrao: "Escrivão de Polícia Civil", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 2, questions: 20, topics: [] },
        { name: "Direito Penal", weight: 1, questions: 15, topics: [] },
        { name: "Direito Processual Penal", weight: 1, questions: 15, topics: [] },
        { name: "Direito Constitucional", weight: 1, questions: 10, topics: [] },
        { name: "Direito Administrativo", weight: 1, questions: 10, topics: [] },
        { name: "Informática", weight: 1, questions: 5, topics: [] },
      ] },
    { nome: "Polícia Civil - Delegado", sigla: "PC_DEL", esfera: "ESTADUAL", exam_type: "PC",
      banca: "CEBRASPE", cargo_padrao: "Delegado de Polícia", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 5, topics: [] },
        { name: "Direito Constitucional", weight: 2, questions: 15, topics: [] },
        { name: "Direito Administrativo", weight: 1, questions: 10, topics: [] },
        { name: "Direito Penal", weight: 3, questions: 25, topics: [] },
        { name: "Direito Processual Penal", weight: 3, questions: 25, topics: [] },
        { name: "Direito Civil", weight: 1, questions: 10, topics: [] },
        { name: "Medicina Legal", weight: 1, questions: 5, topics: [] },
        { name: "Criminalística", weight: 1, questions: 5, topics: [] },
      ] },
    // ── POLÍCIA PENAL ESTADUAL ────────────────────────────────────────────────
    { nome: "Polícia Penal Estadual - Agente Penitenciário", sigla: "PPE", esfera: "ESTADUAL", exam_type: "PP_ESTADUAL",
      banca: "CEBRASPE", cargo_padrao: "Agente Penitenciário", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Direito Constitucional", weight: 1, questions: 15, topics: [] },
        { name: "Direito Penal", weight: 2, questions: 20, topics: [] },
        { name: "Direito Processual Penal", weight: 1, questions: 15, topics: [] },
        { name: "Legislação de Execução Penal", weight: 3, questions: 20, topics: [] },
        { name: "Direito Administrativo", weight: 1, questions: 10, topics: [] },
        { name: "Psicologia para Penitenciária", weight: 1, questions: 5, topics: [] },
      ] },
    { nome: "Polícia Penal Estadual - Técnico Superior", sigla: "PPE_TEC", esfera: "ESTADUAL", exam_type: "PP_ESTADUAL",
      banca: "CEBRASPE", cargo_padrao: "Técnico Superior Penitenciário", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Direito Constitucional", weight: 1, questions: 15, topics: [] },
        { name: "Direito Penal", weight: 2, questions: 20, topics: [] },
        { name: "Direito Processual Penal", weight: 1, questions: 15, topics: [] },
        { name: "Legislação de Execução Penal", weight: 3, questions: 20, topics: [] },
        { name: "Direito Administrativo", weight: 1, questions: 10, topics: [] },
        { name: "Gestão Penitenciária", weight: 1, questions: 5, topics: [] },
      ] },
    // ── POLÍCIA CIENTÍFICA ESTADUAL ───────────────────────────────────────────
    { nome: "Polícia Científica Estadual - Perito", sigla: "PC_CIENT", esfera: "ESTADUAL", exam_type: "PC_CIENTIFICA",
      banca: "VUNESP", cargo_padrao: "Perito Criminal Estadual", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 10, topics: [] },
        { name: "Ciências Forenses", weight: 3, questions: 30, topics: [] },
        { name: "Química", weight: 2, questions: 15, topics: [] },
        { name: "Biologia", weight: 2, questions: 15, topics: [] },
        { name: "Física", weight: 1, questions: 10, topics: [] },
        { name: "Direito Processual Penal", weight: 1, questions: 10, topics: [] },
      ] },
    // ── POLÍCIA LEGISLATIVA ESTADUAL ──────────────────────────────────────────
    { nome: "Polícia Legislativa Estadual", sigla: "PLE", esfera: "ESTADUAL", exam_type: "PL_ESTADUAL",
      banca: "FCC", cargo_padrao: "Agente de Polícia Legislativa", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 2, questions: 20, topics: [] },
        { name: "Direito Constitucional", weight: 2, questions: 20, topics: [] },
        { name: "Direito Administrativo", weight: 2, questions: 15, topics: [] },
        { name: "Regimento Interno", weight: 2, questions: 15, topics: [] },
        { name: "Legislação Estadual", weight: 1, questions: 10, topics: [] },
        { name: "Informática", weight: 1, questions: 5, topics: [] },
      ] },
    // ── GUARDA PORTUÁRIA ──────────────────────────────────────────────────────
    { nome: "Guarda Portuária", sigla: "GP", esfera: "ESTADUAL", exam_type: "GP",
      banca: "CEBRASPE", cargo_padrao: "Guarda Portuário", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 10, topics: [] },
        { name: "Matemática", weight: 1, questions: 5, topics: [] },
        { name: "Direito Constitucional", weight: 1, questions: 15, topics: [] },
        { name: "Direito Administrativo", weight: 1, questions: 10, topics: [] },
        { name: "Legislação Portuária", weight: 3, questions: 15, topics: [] },
        { name: "Informática", weight: 1, questions: 5, topics: [] },
      ] },
    // ── GUARDA MUNICIPAL ──────────────────────────────────────────────────────
    { nome: "Guarda Municipal", sigla: "GM", esfera: "MUNICIPAL", exam_type: "GM",
      banca: "VUNESP", cargo_padrao: "Guarda Municipal", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 1, questions: 15, topics: [] },
        { name: "Matemática", weight: 1, questions: 10, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 10, topics: [] },
        { name: "Direito Constitucional", weight: 1, questions: 10, topics: [] },
        { name: "Legislação Municipal", weight: 2, questions: 10, topics: [] },
        { name: "Estatuto das Guardas Municipais", weight: 2, questions: 10, topics: [] },
        { name: "Informática", weight: 1, questions: 5, topics: [] },
      ] },
    // ── MIN. DA DEFESA ────────────────────────────────────────────────────────
    { nome: "Ministério da Defesa", sigla: "MIN_DEF", esfera: "FEDERAL", exam_type: "MIN_DEFESA",
      banca: "NOVA CONCURSOS", cargo_padrao: "Técnico em Assuntos Educacionais", estado: null,
      materias: [
        { name: "Língua Portuguesa", weight: 2, questions: 20, topics: [] },
        { name: "Raciocínio Lógico", weight: 1, questions: 15, topics: [] },
        { name: "Direito Constitucional", weight: 1, questions: 15, topics: [] },
        { name: "Direito Administrativo", weight: 1, questions: 15, topics: [] },
        { name: "Atualidades e Defesa Nacional", weight: 1, questions: 10, topics: [] },
        { name: "Informática", weight: 1, questions: 5, topics: [] },
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

  console.log(`  ✅ Tabelas concursos + edital_vinculos OK (${seeded} concursos pré-seeded do PDF)`);
  console.log("     Incluídos: PF/PRF/PPF/PFF/PLF/CNJ, ABIN/ANAC/CPNU, Exército/Marinha/FAB, PM/PC/CBM, PP Estadual, Guardas");
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
