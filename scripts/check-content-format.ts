import { db } from "../db/index";
import { sql } from "drizzle-orm";

async function checkContentFormat() {
  // Pegar 5 conteúdos aleatórios aprovados
  const approved = await db.execute(sql`
    SELECT id, title, LEFT("textContent", 200) as preview, "reviewStatus"
    FROM "Content"
    WHERE "isActive" = true
      AND ("reviewStatus" IS NULL OR "reviewStatus" != 'REJEITADO')
    ORDER BY RANDOM()
    LIMIT 5
  `) as any[];

  console.log("\n=== CONTEÚDOS APROVADOS (amostra) ===\n");
  for (const c of approved) {
    const hasStructured = c.preview?.includes("PONTOS-CHAVE:");
    console.log(`📄 ${c.title}`);
    console.log(`   Status: ${c.reviewStatus || "NULL"}`);
    console.log(`   Tem seções: ${hasStructured ? "✅ SIM" : "❌ NÃO"}`);
    console.log(`   Preview: ${c.preview?.substring(0, 100)}...`);
    console.log();
  }

  // Contar quantos TEM e NÃO TEM seções estruturadas
  const total = await db.execute(sql`
    SELECT
      COUNT(*) as total,
      COUNT(CASE WHEN "textContent" LIKE '%PONTOS-CHAVE:%' THEN 1 END) as com_secoes,
      COUNT(CASE WHEN "textContent" NOT LIKE '%PONTOS-CHAVE:%' THEN 1 END) as sem_secoes
    FROM "Content"
    WHERE "isActive" = true
      AND ("reviewStatus" IS NULL OR "reviewStatus" != 'REJEITADO')
  `) as any[];

  console.log("=== ESTATÍSTICAS ===");
  console.log(`Total disponíveis: ${total[0].total}`);
  console.log(`Com PONTOS-CHAVE: ${total[0].com_secoes} (usam parseTextContent)`);
  console.log(`Sem PONTOS-CHAVE: ${total[0].sem_secoes} (precisam de IA)`);

  process.exit(0);
}

checkContentFormat().catch(console.error);
