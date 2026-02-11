/**
 * CLEANUP: Deletar conteúdos irrelevantes + questões com gabarito errado
 *
 * Conteúdos irrelevantes = temas que NÃO caem em concursos policiais
 * (ENEM, Biologia, Física pura, Química pura, Literatura, etc.)
 *
 * Questões com gabarito errado = irrecuperáveis, melhor deletar
 */
import { db } from "../db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("🧹 CLEANUP: Remover conteúdos irrelevantes e questões com gabarito errado");
  console.log("=".repeat(60));

  // Stats antes
  const before = (await db.execute(sql`
    SELECT
      (SELECT COUNT(*) FROM "Content") as total_content,
      (SELECT COUNT(*) FROM "Content" WHERE "reviewStatus" = 'APROVADO') as c_ok,
      (SELECT COUNT(*) FROM "Content" WHERE "reviewStatus" = 'REJEITADO') as c_rej,
      (SELECT COUNT(*) FROM "Content" WHERE "reviewStatus" IS NULL) as c_pend,
      (SELECT COUNT(*) FROM "Question") as total_question,
      (SELECT COUNT(*) FROM "Question" WHERE "reviewStatus" = 'APROVADO') as q_ok,
      (SELECT COUNT(*) FROM "Question" WHERE "reviewStatus" = 'REJEITADO') as q_rej,
      (SELECT COUNT(*) FROM "Question" WHERE "reviewStatus" IS NULL) as q_pend
  `)) as any[];
  const b = before[0];
  console.log("\n📊 ANTES:");
  console.log("  Conteúdos: " + b.total_content + " total (" + b.c_ok + " ok, " + b.c_rej + " rej, " + b.c_pend + " pend)");
  console.log("  Questões:  " + b.total_question + " total (" + b.q_ok + " ok, " + b.q_rej + " rej, " + b.q_pend + " pend)");

  // ========================================
  // PASSO 1: Identificar conteúdos irrelevantes pelo reviewNotes
  // ========================================
  console.log("\n--- PASSO 1: Conteúdos irrelevantes por reviewNotes ---");

  const irrelevantByNotes = (await db.execute(sql`
    SELECT id, title, "reviewNotes"
    FROM "Content"
    WHERE "reviewStatus" = 'REJEITADO'
    AND (
      "reviewNotes" ILIKE '%não é relevant%'
      OR "reviewNotes" ILIKE '%baixíssima relevância%'
      OR "reviewNotes" ILIKE '%foge completamente%'
      OR "reviewNotes" ILIKE '%totalmente irrelevante%'
      OR "reviewNotes" ILIKE '%completamente inadequad%'
      OR "reviewNotes" ILIKE '%não se aplica%'
      OR "reviewNotes" ILIKE '%fora do escopo%'
      OR "reviewNotes" ILIKE '%não aparece em edita%'
    )
  `)) as any[];

  console.log("  Encontrados por notes: " + irrelevantByNotes.length);

  // ========================================
  // PASSO 2: Identificar conteúdos irrelevantes por tópico
  // Temas que NUNCA caem em concursos policiais
  // ========================================
  console.log("\n--- PASSO 2: Conteúdos irrelevantes por título/tópico ---");

  const irrelevantTopicPatterns = [
    // ENEM-specific
    "Competência 1%", "Competência 2%", "Competência 3%", "Competência 4%", "Competência 5%",
    "Temas Recorrentes ENEM%", "Erros que Zeram%", "Dicas para Nota 1000%",
    "Estrutura da Redação ENEM%", "Repertório Sociocultural%",
    // Biology
    "Genética%", "Citologia%", "Fisiologia%", "Evolução%", "Ecologia%",
    "Biotecnologia%",
    // Pure Chemistry (not forensic)
    "Funções Inorgânicas%", "Reações Químicas%", "Estequiometria%",
    "Soluções%", "Termoquímica%", "Eletroquímica%",
    "Estrutura Atômica%", "Ligações Químicas%", "Tabela Periódica%",
    // Pure Physics (not forensic/ballistic)
    "Gravitação Universal%", "Óptica Geométrica%",
    "Hidrostática%", "Eletrodinâmica%", "Eletrostática%",
    "Cinemática%", "Leis de Newton%",
    // Literature
    "Movimentos Literários%", "Modernismo%", "Análise de Texto Literário%",
    // Philosophy pure
    "Teoria do Conhecimento%",
    // ENEM-style topics
    "Crise Climática Global%", "Inteligência Artificial%",
    // English grammar (basic - not relevant for most police exams)
    "Present Perfect%", "Simple Past Tense%", "Relative Clauses%",
    "Conditional Sentences%", "Reported Speech%", "Connectors and Linking%",
    "Prepositions of Time%", "Word Formation%", "Comparatives and Superlatives%",
    "Articles: A, An%", "Future Tenses%", "Phrasal Verbs%",
    "Gerunds and Infinitives%", "Passive Voice Advanced%",
    "Text Genres in English%", "False Cognates%",
  ];

  // Build the WHERE clause
  const titleConditions = irrelevantTopicPatterns
    .map(p => `title LIKE '${p}'`)
    .join(" OR ");

  const irrelevantByTitle = (await db.execute(
    sql.raw(`
      SELECT id, title FROM "Content"
      WHERE "reviewStatus" = 'REJEITADO'
      AND (${titleConditions})
    `)
  )) as any[];

  console.log("  Encontrados por título: " + irrelevantByTitle.length);

  // Combine unique IDs
  const allIrrelevantIds = new Set<string>();
  for (const c of irrelevantByNotes) allIrrelevantIds.add(c.id);
  for (const c of irrelevantByTitle) allIrrelevantIds.add(c.id);

  console.log("  Total único para deletar: " + allIrrelevantIds.size);

  // Show what we'll delete
  const allIrrelevant = [...irrelevantByNotes, ...irrelevantByTitle];
  const seen = new Set<string>();
  console.log("\n  Conteúdos a deletar:");
  for (const c of allIrrelevant) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    console.log("    ❌ " + c.title);
  }

  // ========================================
  // PASSO 3: Deletar questões de tópicos irrelevantes (por subjectId/topicId)
  // ========================================
  console.log("\n--- PASSO 3: Deletar questões de tópicos irrelevantes ---");

  // Get subjectId/topicId from irrelevant content to find matching questions
  const idsArray = Array.from(allIrrelevantIds);
  if (idsArray.length > 0) {
    // Use sql.join for safe IN clause
    const idsSql = sql.join(idsArray.map(id => sql`${id}`), sql`, `);

    // Find questions that share subjectId+topicId with irrelevant content
    const irrelevantQuestions = (await db.execute(sql`
      DELETE FROM "Question" q
      USING "Content" c
      WHERE q."subjectId" = c."subjectId"
        AND q."topicId" = c."topicId"
        AND c.id IN (${idsSql})
      RETURNING q.id
    `)) as any[];
    console.log("  Questões de tópicos irrelevantes deletadas: " + (Array.isArray(irrelevantQuestions) ? irrelevantQuestions.length : 0));

    // Delete the content itself
    const delContent = (await db.execute(sql`
      DELETE FROM "Content" WHERE id IN (${idsSql}) RETURNING id
    `)) as any[];
    console.log("  Conteúdos deletados: " + (Array.isArray(delContent) ? delContent.length : 0));
  }

  // ========================================
  // PASSO 4: Deletar questões com gabarito errado (sem conteúdo associado)
  // ========================================
  console.log("\n--- PASSO 4: Deletar questões com gabarito errado ---");

  const wrongQuestions = (await db.execute(sql`
    SELECT id, statement
    FROM "Question"
    WHERE "reviewStatus" = 'REJEITADO'
    AND (
      "reviewNotes" ILIKE '%gabarito incorreto%'
      OR "reviewNotes" ILIKE '%gabarito errado%'
      OR "reviewNotes" ILIKE '%erro grave no gabarito%'
      OR "reviewNotes" ILIKE '%erro crítico no gabarito%'
      OR "reviewNotes" ILIKE '%erro crítico:%'
      OR "reviewNotes" ILIKE '%erro grave:%'
    )
  `)) as any[];

  console.log("  Questões com gabarito errado: " + wrongQuestions.length);

  if (wrongQuestions.length > 0) {
    const qIds = wrongQuestions.map((q: any) => q.id);
    const qIdsSql = sql.join(qIds.map((id: string) => sql`${id}`), sql`, `);
    await db.execute(sql`
      DELETE FROM "Question" WHERE id IN (${qIdsSql})
    `);
    console.log("  Deletadas: " + wrongQuestions.length);
  }

  // ========================================
  // STATS FINAIS
  // ========================================
  const after = (await db.execute(sql`
    SELECT
      (SELECT COUNT(*) FROM "Content") as total_content,
      (SELECT COUNT(*) FROM "Content" WHERE "reviewStatus" = 'APROVADO') as c_ok,
      (SELECT COUNT(*) FROM "Content" WHERE "reviewStatus" = 'REJEITADO') as c_rej,
      (SELECT COUNT(*) FROM "Content" WHERE "reviewStatus" IS NULL) as c_pend,
      (SELECT COUNT(*) FROM "Question") as total_question,
      (SELECT COUNT(*) FROM "Question" WHERE "reviewStatus" = 'APROVADO') as q_ok,
      (SELECT COUNT(*) FROM "Question" WHERE "reviewStatus" = 'REJEITADO') as q_rej,
      (SELECT COUNT(*) FROM "Question" WHERE "reviewStatus" IS NULL) as q_pend
  `)) as any[];
  const a = after[0];

  console.log("\n" + "=".repeat(60));
  console.log("📊 DEPOIS:");
  console.log("  Conteúdos: " + a.total_content + " total (" + a.c_ok + " ok, " + a.c_rej + " rej, " + a.c_pend + " pend)");
  console.log("  Questões:  " + a.total_question + " total (" + a.q_ok + " ok, " + a.q_rej + " rej, " + a.q_pend + " pend)");
  console.log("\n  Removidos:");
  console.log("    Conteúdos: " + (Number(b.total_content) - Number(a.total_content)));
  console.log("    Questões:  " + (Number(b.total_question) - Number(a.total_question)));

  // Percentage approved
  const totalContent = Number(a.total_content);
  const approvedContent = Number(a.c_ok);
  const totalQ = Number(a.total_question);
  const approvedQ = Number(a.q_ok);
  console.log("\n  Taxa de aprovação:");
  console.log("    Conteúdos: " + approvedContent + "/" + totalContent + " (" + Math.round(approvedContent / totalContent * 100) + "%)");
  console.log("    Questões:  " + approvedQ + "/" + totalQ + " (" + Math.round(approvedQ / totalQ * 100) + "%)");

  process.exit(0);
}

main().catch((e) => { console.error("❌ Erro:", e); process.exit(1); });
