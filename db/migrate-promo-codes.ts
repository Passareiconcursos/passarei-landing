import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "./index";

async function migratePromoCodes() {
  console.log("🔄 Criando tabelas de códigos promocionais...\n");

  try {
    // Criar tabela promo_codes
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
      );
    `);

    console.log("✅ Tabela promo_codes criada");

    // Criar tabela promo_redemptions
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS promo_redemptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        promo_code_id UUID REFERENCES promo_codes(id) ON DELETE CASCADE,
        user_id TEXT,
        telegram_id VARCHAR(50),

        redeemed_at TIMESTAMP DEFAULT NOW() NOT NULL,

        benefit_applied JSONB
      );
    `);

    console.log("✅ Tabela promo_redemptions criada");

    // Criar índices
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(is_active);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_promo_redemptions_user ON promo_redemptions(user_id);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_promo_redemptions_telegram ON promo_redemptions(telegram_id);
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_promo_redemptions_code ON promo_redemptions(promo_code_id);
    `);

    console.log("✅ Índices criados");

    console.log("\n🎉 Migração concluída com sucesso!");
  } catch (error: any) {
    if (error.message?.includes("already exists")) {
      console.log("ℹ️ Tabelas já existem");
    } else {
      console.error("❌ Erro na migração:", error);
      throw error;
    }
  }
}

migratePromoCodes()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
