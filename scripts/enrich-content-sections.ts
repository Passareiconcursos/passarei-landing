/**
 * Enriquece conteúdos do banco que NÃO têm seções PONTOS-CHAVE/EXEMPLO/DICA.
 * Usa a API Anthropic para gerar e salvar as seções diretamente no textContent.
 * Assim o bot usa parseTextContent() e nunca precisa chamar a IA em tempo real.
 *
 * Uso: DATABASE_URL="..." ANTHROPIC_API_KEY="..." npx tsx scripts/enrich-content-sections.ts
 */
import { db } from "../db/index";
import { sql } from "drizzle-orm";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = "claude-sonnet-4-20250514";
const BATCH_SIZE = 10;
const DELAY_MS = 2000; // 2s entre chamadas para não estourar rate limit

async function enrichContentSections() {
  console.log("🔄 Buscando conteúdos sem seções estruturadas...\n");

  const contents = await db.execute(sql`
    SELECT c.id, c.title, c."textContent", s."displayName" as subject_name
    FROM "Content" c
    LEFT JOIN "Subject" s ON c."subjectId" = s.id
    WHERE c."isActive" = true
      AND (c."reviewStatus" IS NULL OR c."reviewStatus" != 'REJEITADO')
      AND c."textContent" NOT LIKE '%PONTOS-CHAVE:%'
    ORDER BY c."reviewStatus" DESC NULLS LAST
  `) as any[];

  console.log(`📊 ${contents.length} conteúdos para enriquecer\n`);

  let enriched = 0;
  let failed = 0;

  for (let i = 0; i < contents.length; i++) {
    const content = contents[i];
    const title = content.title || "Sem título";
    const text = content.textContent || "";
    const subjectName = content.subject_name || "Concursos Policiais";

    console.log(`[${i + 1}/${contents.length}] ${title}...`);

    try {
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 600,
        messages: [
          {
            role: "user",
            content: `Você é um professor especialista em ${subjectName} para concursos policiais.

TEMA: ${title}
DEFINIÇÃO: ${text}

Com base EXCLUSIVAMENTE na definição acima, gere seções educativas PRECISAS e ESPECÍFICAS (não genéricas).

Responda EXATAMENTE neste formato (sem nenhuma outra coisa):
PONTOS-CHAVE:
• [ponto específico 1 baseado no conteúdo]
• [ponto específico 2 baseado no conteúdo]
• [ponto específico 3 baseado no conteúdo]

EXEMPLO:
[situação prática real e específica baseada no conteúdo, máximo 2 linhas]

DICA:
[dica específica de como esse tema cai em provas policiais, máximo 2 linhas]`,
          },
        ],
      });

      const aiText =
        response.content[0].type === "text" ? response.content[0].text : "";

      // Verificar se a resposta tem as seções
      if (!aiText.includes("PONTOS-CHAVE:") || !aiText.includes("EXEMPLO:") || !aiText.includes("DICA:")) {
        console.log(`   ⚠️ Resposta sem formato esperado, pulando`);
        failed++;
        continue;
      }

      // Montar novo textContent: definição original + seções da IA
      const newTextContent = `${text}\n\n${aiText.trim()}`;

      await db.execute(sql`
        UPDATE "Content"
        SET "textContent" = ${newTextContent}
        WHERE id = ${content.id}
      `);

      enriched++;
      console.log(`   ✅ Enriquecido`);

      // Delay entre chamadas
      if (i < contents.length - 1) {
        await new Promise((r) => setTimeout(r, DELAY_MS));
      }
    } catch (error: any) {
      const isCredits = error?.message?.includes("credit") || error?.status === 429;
      if (isCredits) {
        console.log(`\n⛔ Créditos insuficientes após ${enriched} conteúdos. Recarregue e rode novamente.`);
        break;
      }
      console.log(`   ❌ Erro: ${error?.message || error}`);
      failed++;
    }
  }

  console.log(`\n=== RESULTADO ===`);
  console.log(`✅ Enriquecidos: ${enriched}`);
  console.log(`❌ Falhas: ${failed}`);
  console.log(`📊 Restantes: ${contents.length - enriched - failed}`);

  process.exit(0);
}

enrichContentSections().catch(console.error);
