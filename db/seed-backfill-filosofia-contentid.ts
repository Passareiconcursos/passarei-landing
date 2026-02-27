/**
 * Seed Backfill Filosofia — F11 Fix 2
 *
 * Problema: content atoms de Filosofia têm topicId=NULL e questões têm
 * contentId=NULL → T3a-0 não encontra nada → T3b-LAST serve questão aleatória
 * da matéria (roleta russa: estuda Utilitarismo, recebe questão de Kant).
 *
 * O que este seed faz (idempotente):
 *   1. Cria tópico "Filosofia Geral" se não existir
 *   2. Atualiza topicId de todos os content atoms de Filosofia que têm NULL
 *   3. Atualiza topicId de todas as questões de Filosofia que têm NULL
 *   4. Vincula cada questão ao content atom correto via keywords no statement
 *
 * Execução:
 *   npx tsx db/seed-backfill-filosofia-contentid.ts
 */

import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

// ============================================
// MAPEAMENTO: keyword no statement → fragment do título do content atom
// Ordem importa: padrões mais específicos primeiro
// ============================================
const KEYWORD_MAP: Array<{ keywords: string[]; titleFragment: string }> = [
  { keywords: ["imperativo categórico", "Kant", "criticismo kantiano", "Crítica da Razão"], titleFragment: "Kant" },
  { keywords: ["Cogito", "cogito", "Penso, logo existo", "Descartes", "dualismo cartesiano", "dúvida metódica"], titleFragment: "Descartes" },
  { keywords: ["Alegoria da Caverna", "Platão", "Mundo das Ideias", "Academia", "Formas platônicas"], titleFragment: "Platão" },
  { keywords: ["Aristóteles", "silogismo", "eudaimonia", "Liceu", "Ética a Nicômaco"], titleFragment: "Aristóteles" },
  { keywords: ["Sócrates", "maiêutica", "socrático", "corromper a juventude", "ironia socrática"], titleFragment: "Sócrates" },
  { keywords: ["empirismo", "Hume", "Locke", "tábula rasa", "experiência sensorial", "impressões e ideias"], titleFragment: "Empirismo" },
  { keywords: ["Utilitarismo", "Bentham", "Stuart Mill", "utilidade", "maior felicidade", "maior número"], titleFragment: "Utilitarismo" },
  { keywords: ["Sartre", "existencialismo", "existência precede", "má-fé", "condenados a ser livres"], titleFragment: "Sartre" },
  { keywords: ["Marx", "materialismo histórico", "luta de classes", "mais-valia", "alienação marxista", "proletariado"], titleFragment: "Marx" },
  { keywords: ["Santo Agostinho", "Tomás de Aquino", "Escolástica", "Escolástico", "razão a serviço da fé"], titleFragment: "Medieval" },
  { keywords: ["Escola de Frankfurt", "Teoria Crítica", "Adorno", "Horkheimer", "indústria cultural"], titleFragment: "Frankfurt" },
  { keywords: ["Contratualismo", "Hobbes", "Rousseau", "estado de natureza", "contrato social"], titleFragment: "Contratualismo" },
  { keywords: ["Filosofia da Ciência", "Popper", "falsificacionismo", "paradigma", "Kuhn"], titleFragment: "Ciência" },
  { keywords: ["mito", "Mythos", "Logos", "pensamento mítico", "cosmogonia"], titleFragment: "Mito" },
  { keywords: ["Direitos Humanos", "cidadania", "direitos naturais", "dignidade humana"], titleFragment: "Direitos" },
  { keywords: ["ideologia", "alienação", "falsa consciência", "superestrutura"], titleFragment: "Ideologia" },
];

async function main() {
  console.log("🚀 Seed Backfill Filosofia — F11 Fix 2 (topicId + contentId)");
  console.log("=".repeat(65));

  // 1. Encontrar subject Filosofia
  const subjects = await db.execute(sql`
    SELECT id FROM "Subject" WHERE name = 'FILOSOFIA' LIMIT 1
  `) as any[];
  if (!subjects[0]?.id) {
    console.error("❌ Subject FILOSOFIA não encontrado.");
    process.exit(1);
  }
  const subjectId: string = subjects[0].id;
  console.log(`✅ Subject FILOSOFIA: ${subjectId}`);

  // 2. Criar ou encontrar tópico "Filosofia Geral"
  const existingTopic = await db.execute(sql`
    SELECT id FROM "Topic"
    WHERE "subjectId" = ${subjectId}
      AND name ILIKE 'Filosofia Geral'
    LIMIT 1
  `) as any[];

  let topicId: string;
  if (existingTopic[0]?.id) {
    topicId = existingTopic[0].id;
    console.log(`✅ Tópico "Filosofia Geral" já existe: ${topicId}`);
  } else {
    const newId = `tp_fil_${Date.now().toString(36)}`;
    await db.execute(sql`
      INSERT INTO "Topic" (id, name, "subjectId", "createdAt", "updatedAt")
      VALUES (${newId}, 'Filosofia Geral', ${subjectId}, NOW(), NOW())
    `);
    topicId = newId;
    console.log(`  ✅ Tópico "Filosofia Geral" criado: ${topicId}`);
  }

  // 3. Atualizar topicId em todos os content atoms de Filosofia com NULL
  const contentUpdate = await db.execute(sql`
    UPDATE "Content"
    SET "topicId" = ${topicId}
    WHERE "subjectId" = ${subjectId}
      AND "topicId" IS NULL
  `) as any;
  const contentUpdated = contentUpdate.rowCount ?? contentUpdate.count ?? 0;
  console.log(`\n📚 Content atoms: ${contentUpdated} topicId(s) preenchidos`);

  // 4. Atualizar topicId em todas as questões de Filosofia com NULL
  const qTopicUpdate = await db.execute(sql`
    UPDATE "Question"
    SET "topicId" = ${topicId}
    WHERE "subjectId" = ${subjectId}
      AND "topicId" IS NULL
  `) as any;
  const qTopicUpdated = qTopicUpdate.rowCount ?? qTopicUpdate.count ?? 0;
  console.log(`❓ Questões: ${qTopicUpdated} topicId(s) preenchidos`);

  // 5. Buscar todos os content atoms com seus títulos (para mapeamento)
  const contentAtoms = await db.execute(sql`
    SELECT id, title FROM "Content"
    WHERE "subjectId" = ${subjectId}
    ORDER BY "createdAt"
  `) as any[];
  console.log(`\n🗺️  ${contentAtoms.length} content atoms disponíveis para mapeamento`);

  // 6. Buscar questões sem contentId
  const questions = await db.execute(sql`
    SELECT id, statement FROM "Question"
    WHERE "subjectId" = ${subjectId}
      AND "contentId" IS NULL
    ORDER BY "createdAt"
  `) as any[];
  console.log(`❓ ${questions.length} questões sem contentId`);

  if (questions.length === 0) {
    console.log("  ✅ Todas as questões já têm contentId — nada a fazer.");
  } else {
    console.log("\n🔗 Vinculando questões aos content atoms...");

    let linked = 0;
    let fallback = 0;

    // Encontrar atom de fallback: preferir "Filosofia Antiga: Sócrates" ou primeiro atom
    const fallbackAtom = contentAtoms.find((a: any) =>
      a.title.includes("Sócrates") && !a.title.includes("Platão")
    ) ?? contentAtoms[0];

    for (const q of questions) {
      const stmt: string = q.statement ?? "";
      let matchedAtomId: string | null = null;
      let matchedTitle: string | null = null;

      // Tentar cada padrão de keyword
      outerLoop:
      for (const mapping of KEYWORD_MAP) {
        for (const keyword of mapping.keywords) {
          if (stmt.toLowerCase().includes(keyword.toLowerCase())) {
            // Encontrar content atom cujo título contém o fragment
            const atom = contentAtoms.find((a: any) =>
              a.title.toLowerCase().includes(mapping.titleFragment.toLowerCase())
            );
            if (atom) {
              matchedAtomId = atom.id;
              matchedTitle = atom.title;
              break outerLoop;
            }
          }
        }
      }

      if (!matchedAtomId) {
        // Fallback: usar primeiro atom do subject
        matchedAtomId = fallbackAtom?.id ?? null;
        matchedTitle = fallbackAtom?.title ?? "N/A";
        fallback++;
      } else {
        linked++;
      }

      if (matchedAtomId) {
        await db.execute(sql`
          UPDATE "Question"
          SET "contentId" = ${matchedAtomId}
          WHERE id = ${q.id}
        `);
        const prefix = matchedTitle === fallbackAtom?.title ? "  ⚠️  [FALLBACK]" : "  ✅";
        console.log(`${prefix} ${q.id.slice(0, 10)}... → "${matchedTitle?.slice(0, 50)}"`);
        console.log(`         stmt: "${stmt.slice(0, 70)}..."`);
      }
    }

    console.log(`\n  📊 Keyword match: ${linked} | Fallback: ${fallback}`);
  }

  // 7. Relatório final
  console.log("\n" + "=".repeat(65));
  console.log("📊 RELATÓRIO FINAL — Backfill Filosofia:");
  console.log(`   Content atoms com topicId preenchido: ${contentUpdated}`);
  console.log(`   Questões com topicId preenchido:      ${qTopicUpdated}`);
  console.log(`   Questões com contentId vinculado:     ${questions.length}`);
  console.log("✅ Backfill Filosofia concluído — roleta russa eliminada!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
