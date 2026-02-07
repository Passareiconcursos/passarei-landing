/**
 * PROFESSOR REVISOR - Pipeline de revisão IA
 * Fase D do SETUP_EXECUCAO
 *
 * Revisa conteúdos e questões do banco usando IA especializada.
 * Status: PENDENTE → APROVADO / REJEITADO
 * Score: 0-10
 *
 * Uso: npx tsx scripts/professor-revisor.ts [--limit N] [--type content|question|all]
 */

import Anthropic from "@anthropic-ai/sdk";
import { db } from "../db";
import { sql } from "drizzle-orm";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-sonnet-4-20250514";

// ============================================
// PROMPT DO PROFESSOR REVISOR
// ============================================
const REVIEW_CONTENT_PROMPT = `Você é um PROFESSOR REVISOR especialista em concursos de SEGURANÇA PÚBLICA (PF, PRF, PM, PC, CBM, PP).

Sua função é avaliar conteúdos didáticos para estudo de concursos. Avalie o conteúdo abaixo seguindo estes critérios:

1. CORREÇÃO: A informação está correta e atualizada? (0-2 pontos)
2. RELEVÂNCIA: É relevante para concursos de segurança pública? (0-2 pontos)
3. CLAREZA: A explicação é clara e didática? (0-2 pontos)
4. COMPLETUDE: Cobre os pontos essenciais do tema? (0-2 pontos)
5. APLICABILIDADE: É útil para questões de prova? (0-2 pontos)

Responda EXATAMENTE neste formato JSON:
{
  "score": <número 0-10>,
  "status": "<APROVADO ou REJEITADO>",
  "notes": "<observações breves sobre problemas encontrados ou elogios>"
}

Regras:
- Score >= 6: APROVADO
- Score < 6: REJEITADO
- Se contiver informação ERRADA: REJEITADO automaticamente (score máximo 3)
- Se mencionar ENEM como concurso alvo: REJEITADO
- Foco: bancas CESPE/CEBRASPE, FCC, Vunesp, IBFC`;

const REVIEW_QUESTION_PROMPT = `Você é um PROFESSOR REVISOR especialista em concursos de SEGURANÇA PÚBLICA (PF, PRF, PM, PC, CBM, PP).

Sua função é avaliar QUESTÕES de concurso. Avalie a questão abaixo seguindo estes critérios:

1. GABARITO: A resposta correta está de fato correta? (0-3 pontos) - MAIS IMPORTANTE
2. ENUNCIADO: O enunciado é claro e sem ambiguidade? (0-2 pontos)
3. ALTERNATIVAS: As alternativas são plausíveis e distinguíveis? (0-2 pontos)
4. EXPLICAÇÃO: A explicação é correta e didática? (0-2 pontos)
5. FORMATO: Segue padrão de banca (CESPE, FCC)? (0-1 ponto)

Responda EXATAMENTE neste formato JSON:
{
  "score": <número 0-10>,
  "status": "<APROVADO ou REJEITADO>",
  "notes": "<observações sobre o gabarito, alternativas ou problemas encontrados>"
}

Regras:
- Score >= 6: APROVADO
- Score < 6: REJEITADO
- Se o GABARITO estiver ERRADO: REJEITADO automaticamente (score = 0)
- Se mencionar ENEM como concurso alvo: REJEITADO
- Questão Certo/Errado: verificar se o gabarito bate com a afirmação`;

// ============================================
// FUNÇÕES DE REVISÃO
// ============================================

interface ReviewResult {
  score: number;
  status: "APROVADO" | "REJEITADO";
  notes: string;
}

async function reviewContent(content: any): Promise<ReviewResult> {
  const prompt = `CONTEÚDO PARA REVISÃO:
Título: ${content.title}
Matéria: ${content.subjectId || "N/A"}
Tópico: ${content.topicId || "N/A"}
Texto: ${content.textContent || content.definition || "N/A"}

Definição: ${content.definition || "N/A"}
Pontos-chave: ${content.keyPoints || "N/A"}
Exemplo: ${content.example || "N/A"}
Dica: ${content.tip || "N/A"}`;

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 300,
      messages: [
        { role: "user", content: REVIEW_CONTENT_PROMPT + "\n\n" + prompt },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        score: Math.min(10, Math.max(0, result.score)),
        status: result.score >= 6 ? "APROVADO" : "REJEITADO",
        notes: result.notes || "",
      };
    }
    return { score: 0, status: "REJEITADO", notes: "Erro ao parsear resposta da IA" };
  } catch (error: any) {
    console.error(`❌ Erro ao revisar conteúdo ${content.id}:`, error.message);
    return { score: 0, status: "REJEITADO", notes: `Erro: ${error.message}` };
  }
}

async function reviewQuestion(question: any): Promise<ReviewResult> {
  const alts = typeof question.alternatives === "string"
    ? JSON.parse(question.alternatives)
    : question.alternatives;

  const altsFormatted = Array.isArray(alts)
    ? alts.map((a: any) => typeof a === "string" ? a : `${a.letter}) ${a.text}`).join("\n")
    : "N/A";

  const prompt = `QUESTÃO PARA REVISÃO:
Tipo: ${question.questionType || "MULTIPLA_ESCOLHA"}
Enunciado: ${question.statement}
Alternativas:
${altsFormatted}
Gabarito: ${question.correctAnswer}
Explicação: ${question.explanation || "N/A"}
Matéria: ${question.subjectId || "N/A"}`;

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 300,
      messages: [
        { role: "user", content: REVIEW_QUESTION_PROMPT + "\n\n" + prompt },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        score: Math.min(10, Math.max(0, result.score)),
        status: result.score >= 6 ? "APROVADO" : "REJEITADO",
        notes: result.notes || "",
      };
    }
    return { score: 0, status: "REJEITADO", notes: "Erro ao parsear resposta da IA" };
  } catch (error: any) {
    console.error(`❌ Erro ao revisar questão ${question.id}:`, error.message);
    return { score: 0, status: "REJEITADO", notes: `Erro: ${error.message}` };
  }
}

// ============================================
// BATCH PROCESSING
// ============================================

async function batchReviewContents(limit: number) {
  console.log(`\n📚 Buscando conteúdos PENDENTES (limit: ${limit})...`);

  const contents = await db.execute(sql`
    SELECT * FROM "Content"
    WHERE "reviewStatus" IS NULL OR "reviewStatus" = 'PENDENTE'
    ORDER BY "createdAt" ASC
    LIMIT ${limit}
  `) as any[];

  console.log(`📚 ${contents.length} conteúdos para revisar\n`);

  let approved = 0;
  let rejected = 0;

  for (const content of contents) {
    process.stdout.write(`  📝 "${content.title}" ... `);

    const result = await reviewContent(content);

    await db.execute(sql`
      UPDATE "Content"
      SET "reviewStatus" = ${result.status},
          "reviewScore" = ${result.score},
          "reviewNotes" = ${result.notes},
          "reviewedAt" = NOW()
      WHERE "id" = ${content.id}
    `);

    if (result.status === "APROVADO") {
      approved++;
      console.log(`✅ ${result.score}/10`);
    } else {
      rejected++;
      console.log(`❌ ${result.score}/10 - ${result.notes}`);
    }

    // Rate limiting
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`\n📊 Conteúdos: ${approved} aprovados, ${rejected} rejeitados (de ${contents.length})`);
}

async function batchReviewQuestions(limit: number) {
  console.log(`\n❓ Buscando questões PENDENTES (limit: ${limit})...`);

  const questions = await db.execute(sql`
    SELECT * FROM "Question"
    WHERE "reviewStatus" IS NULL OR "reviewStatus" = 'PENDENTE'
    ORDER BY "createdAt" ASC
    LIMIT ${limit}
  `) as any[];

  console.log(`❓ ${questions.length} questões para revisar\n`);

  let approved = 0;
  let rejected = 0;

  for (const question of questions) {
    process.stdout.write(`  ✍️ "${(question.statement || "").substring(0, 50)}..." ... `);

    const result = await reviewQuestion(question);

    await db.execute(sql`
      UPDATE "Question"
      SET "reviewStatus" = ${result.status},
          "reviewScore" = ${result.score},
          "reviewNotes" = ${result.notes},
          "reviewedAt" = NOW()
      WHERE "id" = ${question.id}
    `);

    if (result.status === "APROVADO") {
      approved++;
      console.log(`✅ ${result.score}/10`);
    } else {
      rejected++;
      console.log(`❌ ${result.score}/10 - ${result.notes}`);
    }

    // Rate limiting
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`\n📊 Questões: ${approved} aprovadas, ${rejected} rejeitadas (de ${questions.length})`);
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("🎓 PROFESSOR REVISOR - Pipeline de Revisão IA");
  console.log("=".repeat(50));

  // Parse args
  const args = process.argv.slice(2);
  let limit = 20;
  let type = "all";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit" && args[i + 1]) limit = parseInt(args[i + 1]);
    if (args[i] === "--type" && args[i + 1]) type = args[i + 1];
  }

  console.log(`📋 Config: limit=${limit}, type=${type}`);

  if (type === "content" || type === "all") {
    await batchReviewContents(limit);
  }

  if (type === "question" || type === "all") {
    await batchReviewQuestions(limit);
  }

  // Resumo final
  const stats = await db.execute(sql`
    SELECT
      (SELECT COUNT(*) FROM "Content" WHERE "reviewStatus" = 'APROVADO') as content_approved,
      (SELECT COUNT(*) FROM "Content" WHERE "reviewStatus" = 'REJEITADO') as content_rejected,
      (SELECT COUNT(*) FROM "Content" WHERE "reviewStatus" IS NULL OR "reviewStatus" = 'PENDENTE') as content_pending,
      (SELECT COUNT(*) FROM "Question" WHERE "reviewStatus" = 'APROVADO') as question_approved,
      (SELECT COUNT(*) FROM "Question" WHERE "reviewStatus" = 'REJEITADO') as question_rejected,
      (SELECT COUNT(*) FROM "Question" WHERE "reviewStatus" IS NULL OR "reviewStatus" = 'PENDENTE') as question_pending
  `) as any[];

  const s = stats[0];
  console.log(`\n${"=".repeat(50)}`);
  console.log(`📊 RESUMO GERAL:`);
  console.log(`  Conteúdos: ✅ ${s.content_approved} | ❌ ${s.content_rejected} | ⏳ ${s.content_pending}`);
  console.log(`  Questões:  ✅ ${s.question_approved} | ❌ ${s.question_rejected} | ⏳ ${s.question_pending}`);

  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Erro fatal:", error);
  process.exit(1);
});
