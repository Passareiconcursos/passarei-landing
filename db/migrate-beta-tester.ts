import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

/**
 * Migration: Configurar usuário como Beta Tester
 *
 * Beta testers têm:
 * - Plano VETERANO permanente (até 2099)
 * - Sem limites de questões/redações
 */
async function migrate() {
  const EMAIL = "oficialpassarei@gmail.com";

  console.log("🔄 Configurando Beta Tester...\n");
  console.log(`📧 Email: ${EMAIL}\n`);

  try {
    // Verificar se usuário existe
    const userResult = await db.execute(sql`
      SELECT id, email, name, plan, "planStatus", "planEndDate", "telegramId"
      FROM "User"
      WHERE email = ${EMAIL}
      LIMIT 1
    `) as any[];

    if (!userResult || userResult.length === 0) {
      console.log("❌ Usuário não encontrado com esse email.");
      console.log("\n🔍 Buscando por telegramId que contenha 'oficial'...");

      const altResult = await db.execute(sql`
        SELECT id, email, name, plan, "planStatus", "planEndDate", "telegramId"
        FROM "User"
        WHERE "telegramId" IS NOT NULL
        ORDER BY created_at DESC
        LIMIT 10
      `) as any[];

      console.log("\n📋 Últimos 10 usuários com telegramId:");
      for (const u of altResult) {
        console.log(`  - ${u.telegramId} | ${u.email || 'sem email'} | ${u.name} | ${u.plan}`);
      }

      process.exit(1);
    }

    const user = userResult[0];
    console.log("✅ Usuário encontrado:");
    console.log(`  - ID: ${user.id}`);
    console.log(`  - Nome: ${user.name}`);
    console.log(`  - Telegram: ${user.telegramId || 'não vinculado'}`);
    console.log(`  - Plano atual: ${user.plan}`);
    console.log(`  - Status: ${user.planStatus || 'N/A'}`);
    console.log(`  - Expira: ${user.planEndDate || 'N/A'}`);

    // Atualizar para VETERANO permanente
    console.log("\n🔄 Atualizando para VETERANO permanente...");

    await db.execute(sql`
      UPDATE "User"
      SET
        plan = 'VETERANO',
        "planStatus" = 'active',
        "planEndDate" = '2099-12-31'::timestamp,
        "updatedAt" = NOW()
      WHERE id = ${user.id}
    `);

    // Verificar atualização
    const updatedResult = await db.execute(sql`
      SELECT plan, "planStatus", "planEndDate"
      FROM "User"
      WHERE id = ${user.id}
    `) as any[];

    const updated = updatedResult[0];
    console.log("\n✅ Usuário atualizado:");
    console.log(`  - Plano: ${updated.plan}`);
    console.log(`  - Status: ${updated.planStatus}`);
    console.log(`  - Expira: ${updated.planEndDate}`);

    console.log("\n🎉 Beta Tester configurado com sucesso!");
    console.log("   O usuário agora tem acesso VETERANO ilimitado.");

  } catch (error) {
    console.error("❌ Erro:", error);
  }

  process.exit(0);
}

migrate();
