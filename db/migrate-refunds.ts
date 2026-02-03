import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "./index";

async function migrateRefunds() {
  console.log("🔄 Criando tabela refunds...\n");

  try {
    // Criar tabela refunds
    // Não usar foreign keys para evitar conflitos entre Prisma e Drizzle schemas
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS refunds (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        transaction_id UUID,
        mp_payment_id VARCHAR(50),
        mp_refund_id VARCHAR(50),
        user_id TEXT,
        telegram_id VARCHAR(50),

        amount REAL NOT NULL,
        reason TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'PENDING',

        processed_by TEXT,
        processed_at TIMESTAMP,

        mp_response JSONB,
        notes TEXT,

        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log("✅ Tabela refunds criada");

    // Criar índices
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_refunds_user ON refunds(user_id);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_refunds_transaction ON refunds(transaction_id);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);
    `);

    console.log("✅ Índices criados");

    console.log("\n🎉 Migração concluída com sucesso!");
  } catch (error: any) {
    if (error.message?.includes("already exists")) {
      console.log("ℹ️ Tabela refunds já existe");
    } else {
      console.error("❌ Erro na migração:", error);
      throw error;
    }
  }
}

migrateRefunds()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
