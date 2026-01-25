// Script para executar migration de concursos
import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

async function runMigration() {
  console.log("🚀 Iniciando migration de concursos...\n");

  try {
    // 1. Criar enum concurso_sphere
    console.log("1️⃣ Criando enum concurso_sphere...");
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE concurso_sphere AS ENUM ('FEDERAL', 'ESTADUAL', 'MUNICIPAL');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log("   ✅ Enum criado/verificado\n");

    // 2. Criar tabela concursos
    console.log("2️⃣ Criando tabela concursos...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS concursos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome VARCHAR(100) NOT NULL,
        sigla VARCHAR(20) NOT NULL UNIQUE,
        descricao TEXT,
        esfera concurso_sphere NOT NULL,
        exam_type VARCHAR(50) NOT NULL,
        edital_url TEXT,
        site_oficial TEXT,
        is_active BOOLEAN NOT NULL DEFAULT true,
        ordem INTEGER DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log("   ✅ Tabela concursos criada\n");

    // 3. Criar tabela cargos
    console.log("3️⃣ Criando tabela cargos...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS cargos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        concurso_id UUID NOT NULL REFERENCES concursos(id) ON DELETE CASCADE,
        nome VARCHAR(100) NOT NULL,
        codigo VARCHAR(50) NOT NULL,
        descricao TEXT,
        escolaridade VARCHAR(50),
        requisitos TEXT,
        is_active BOOLEAN NOT NULL DEFAULT true,
        ordem INTEGER DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log("   ✅ Tabela cargos criada\n");

    // 4. Criar tabela cargo_materias
    console.log("4️⃣ Criando tabela cargo_materias...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS cargo_materias (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cargo_id UUID NOT NULL REFERENCES cargos(id) ON DELETE CASCADE,
        nome VARCHAR(100) NOT NULL,
        codigo VARCHAR(50) NOT NULL,
        descricao TEXT,
        peso REAL DEFAULT 1,
        quantidade_questoes INTEGER DEFAULT 10,
        topicos JSONB DEFAULT '[]'::jsonb,
        is_active BOOLEAN NOT NULL DEFAULT true,
        ordem INTEGER DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log("   ✅ Tabela cargo_materias criada\n");

    // 5. Criar tabela conteudo_cargos
    console.log("5️⃣ Criando tabela conteudo_cargos...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS conteudo_cargos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content_id VARCHAR(255) NOT NULL,
        cargo_id UUID NOT NULL REFERENCES cargos(id) ON DELETE CASCADE,
        cargo_materia_id UUID REFERENCES cargo_materias(id) ON DELETE SET NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log("   ✅ Tabela conteudo_cargos criada\n");

    // 6. Criar índices
    console.log("6️⃣ Criando índices...");
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_concursos_esfera ON concursos(esfera);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_concursos_is_active ON concursos(is_active);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_cargos_concurso_id ON cargos(concurso_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_cargo_materias_cargo_id ON cargo_materias(cargo_id);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_conteudo_cargos_cargo_id ON conteudo_cargos(cargo_id);`);
    console.log("   ✅ Índices criados\n");

    // 7. Inserir concursos iniciais
    console.log("7️⃣ Inserindo concursos iniciais...");

    // FEDERAIS - Segurança
    await db.execute(sql`
      INSERT INTO concursos (nome, sigla, esfera, exam_type, ordem) VALUES
      ('Polícia Federal', 'PF', 'FEDERAL', 'PF', 1),
      ('Polícia Rodoviária Federal', 'PRF', 'FEDERAL', 'PRF', 2),
      ('Polícia Penal Federal', 'PPF', 'FEDERAL', 'PP_FEDERAL', 3),
      ('Polícia Legislativa Federal', 'PLF', 'FEDERAL', 'PL_FEDERAL', 4)
      ON CONFLICT (sigla) DO NOTHING;
    `);

    // ESTADUAIS
    await db.execute(sql`
      INSERT INTO concursos (nome, sigla, esfera, exam_type, ordem) VALUES
      ('Polícia Militar', 'PM', 'ESTADUAL', 'PM', 30),
      ('Polícia Civil', 'PC', 'ESTADUAL', 'PC', 31),
      ('Corpo de Bombeiros Militar', 'CBM', 'ESTADUAL', 'CBM', 32),
      ('Polícia Penal Estadual', 'PPE', 'ESTADUAL', 'PP_ESTADUAL', 33)
      ON CONFLICT (sigla) DO NOTHING;
    `);

    // MUNICIPAIS
    await db.execute(sql`
      INSERT INTO concursos (nome, sigla, esfera, exam_type, ordem) VALUES
      ('Guarda Municipal', 'GM', 'MUNICIPAL', 'GM', 40)
      ON CONFLICT (sigla) DO NOTHING;
    `);

    console.log("   ✅ Concursos inseridos\n");

    // 8. Verificar concursos criados
    const concursos = await db.execute(sql`
      SELECT sigla, nome, esfera FROM concursos ORDER BY ordem;
    `);

    console.log("📋 Concursos cadastrados:");
    console.table(concursos);

    console.log("\n🎉 Migration executada com sucesso!");

  } catch (error: any) {
    console.error("❌ Erro na migration:", error.message);
    process.exit(1);
  }

  process.exit(0);
}

runMigration();
