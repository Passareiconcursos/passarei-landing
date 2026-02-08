/**
 * REGENERAR CONTEÚDOS REJEITADOS
 *
 * Busca conteúdos com reviewStatus='REJEITADO', regenera com mais profundidade
 * e atualiza no banco. Também gera novas questões se necessário.
 *
 * Uso: npx tsx -r dotenv/config scripts/regenerate-rejected.ts [--limit N] [--dry-run]
 */

import Anthropic from "@anthropic-ai/sdk";
import { db } from "../db";
import { sql } from "drizzle-orm";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-sonnet-4-20250514";

function mapDifficulty(difficulty: string): string {
  const map: Record<string, string> = {
    easy: "FACIL", medium: "MEDIO", hard: "DIFICIL",
    FACIL: "FACIL", MEDIO: "MEDIO", DIFICIL: "DIFICIL",
  };
  return map[difficulty] || "MEDIO";
}

async function regenerateContent(content: any): Promise<{
  textContent: string;
  wordCount: number;
} | null> {
  const prompt = `Você é um especialista em concursos públicos de SEGURANÇA PÚBLICA (PF, PRF, PM, PC, CBM).

Reescreva o conteúdo de estudo sobre "${content.title}" com MUITO MAIS PROFUNDIDADE e DETALHAMENTO.

O conteúdo anterior foi REJEITADO por ser superficial. A nova versão deve ter:

1. DEFINIÇÃO COMPLETA (300-400 palavras): conceito legal/doutrinário, base constitucional/legal com artigos específicos
2. PONTOS-CHAVE (5-7 itens): cada um com explicação de 2-3 frases, não apenas tópicos soltos
3. EXEMPLO PRÁTICO (150 palavras): caso concreto aplicável a concursos, com citação de banca quando possível
4. DICA DE PROVA (100 palavras): como o tema é cobrado em provas CESPE/FCC, pegadinhas comuns
5. JURISPRUDÊNCIA/DOUTRINA: mencionar posições do STF/STJ quando relevante

IMPORTANTE:
- Cite artigos de lei específicos (CF/88, CP, CPP, Lei 8.666, etc.)
- Use linguagem técnica mas acessível
- Foco em bancas CESPE/CEBRASPE, FCC, Vunesp
- NÃO mencionar ENEM
- Nível de detalhe que realmente prepare para concurso

Responda APENAS com JSON válido:
{
  "definition": "definição completa e detalhada (300-400 palavras)",
  "keyPoints": [
    "ponto-chave 1 com explicação completa",
    "ponto-chave 2 com explicação completa",
    "ponto-chave 3 com explicação completa",
    "ponto-chave 4 com explicação completa",
    "ponto-chave 5 com explicação completa"
  ],
  "example": "exemplo prático detalhado (150 palavras)",
  "tip": "dica específica para prova (100 palavras)"
}`;

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 3000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const cleanJson = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON não encontrado na resposta");

    const result = JSON.parse(jsonMatch[0]);

    const fullText =
      `${result.definition}\n\n` +
      `PONTOS-CHAVE:\n${result.keyPoints.map((p: string, i: number) => `${i + 1}. ${p}`).join("\n")}\n\n` +
      `EXEMPLO:\n${result.example}\n\n` +
      `DICA:\n${result.tip}`;

    return {
      textContent: fullText,
      wordCount: fullText.split(/\s+/).length,
    };
  } catch (error: any) {
    console.error(`  ❌ Erro ao regenerar: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log("🔄 REGENERAR CONTEÚDOS REJEITADOS");
  console.log("=".repeat(50));

  const args = process.argv.slice(2);
  let limit = 30;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit" && args[i + 1]) limit = parseInt(args[i + 1]);
    if (args[i] === "--dry-run") dryRun = true;
  }

  console.log(`📋 Config: limit=${limit}, dryRun=${dryRun}`);

  // Buscar conteúdos rejeitados
  const rejected = await db.execute(sql`
    SELECT id, title, "subjectId", "topicId", "textContent", difficulty, "reviewNotes"
    FROM "Content"
    WHERE "reviewStatus" = 'REJEITADO'
    ORDER BY "reviewScore" ASC
    LIMIT ${limit}
  `) as any[];

  console.log(`\n📚 ${rejected.length} conteúdos rejeitados para regenerar\n`);

  if (rejected.length === 0) {
    console.log("✅ Nenhum conteúdo rejeitado!");
    process.exit(0);
  }

  let regenerated = 0;
  let failed = 0;

  for (const content of rejected) {
    process.stdout.write(`  📝 "${content.title}" ... `);

    if (dryRun) {
      console.log(`⏭️ (dry-run) Motivo: ${content.reviewNotes?.substring(0, 80)}`);
      continue;
    }

    const result = await regenerateContent(content);

    if (result) {
      // Atualizar conteúdo no banco
      await db.execute(sql`
        UPDATE "Content"
        SET
          "textContent" = ${result.textContent},
          "wordCount" = ${result.wordCount},
          "estimatedReadTime" = ${Math.ceil(result.wordCount / 200)},
          "reviewStatus" = NULL,
          "reviewScore" = NULL,
          "reviewNotes" = NULL,
          "reviewedAt" = NULL,
          "updatedAt" = NOW()
        WHERE "id" = ${content.id}
      `);

      regenerated++;
      console.log(`✅ ${result.wordCount} palavras`);
    } else {
      failed++;
      console.log(`❌ falhou`);
    }

    // Rate limiting
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log(`\n📊 Resultado: ${regenerated} regenerados, ${failed} falharam (de ${rejected.length})`);

  // Stats finais
  const stats = await db.execute(sql`
    SELECT
      (SELECT COUNT(*) FROM "Content" WHERE "reviewStatus" = 'APROVADO') as c_ok,
      (SELECT COUNT(*) FROM "Content" WHERE "reviewStatus" = 'REJEITADO') as c_rej,
      (SELECT COUNT(*) FROM "Content" WHERE "reviewStatus" IS NULL OR "reviewStatus" = 'PENDENTE') as c_pend
  `) as any[];

  const s = stats[0];
  console.log(`\n📊 Status conteúdos: ✅ ${s.c_ok} | ❌ ${s.c_rej} | ⏳ ${s.c_pend}`);

  process.exit(0);
}

main().catch((e) => { console.error("❌ Erro fatal:", e); process.exit(1); });
