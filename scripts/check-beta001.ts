/**
 * Verifica status do código BETA001 e outros códigos promo
 * Uso: DATABASE_URL="..." npx tsx scripts/check-beta001.ts
 */
import { db } from "../db/index";
import { sql } from "drizzle-orm";

async function checkPromoCodes() {
  console.log("=== CÓDIGOS PROMOCIONAIS ===\n");

  // Listar todos os códigos (colunas conforme auto-migrate.ts)
  const codes = await db.execute(sql`
    SELECT code, description, type, granted_plan, granted_days, max_uses, current_uses, is_active, created_at
    FROM promo_codes
    ORDER BY created_at
  `) as any[];

  for (const c of codes) {
    console.log(`📋 ${c.code}`);
    console.log(`   ${c.description}`);
    console.log(`   Tipo: ${c.type} | Plano: ${c.granted_plan} | Duração: ${c.granted_days} dias`);
    console.log(`   Usos: ${c.current_uses}/${c.max_uses} | Ativo: ${c.is_active}`);
    console.log();
  }

  // Verificar resgates
  console.log("\n=== RESGATES ===\n");
  const redemptions = await db.execute(sql`
    SELECT pr.*, pc.code, u."telegramId", u.name
    FROM promo_redemptions pr
    JOIN promo_codes pc ON pr.promo_code_id = pc.id
    LEFT JOIN "User" u ON pr.user_id::text = u.id::text
    ORDER BY pr.redeemed_at DESC
  `) as any[];

  if (redemptions.length === 0) {
    console.log("Nenhum resgate registrado.");
  } else {
    for (const r of redemptions) {
      console.log(`🎫 ${r.code} → User ${r.name || r.user_id} (TG: ${r.telegramId || "?"})`);
      console.log(`   Resgatado em: ${r.redeemed_at}`);
    }
  }

  console.log(`\n📊 Total resgates: ${redemptions.length}`);
  process.exit(0);
}

checkPromoCodes().catch(console.error);
