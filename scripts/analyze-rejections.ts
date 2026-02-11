/**
 * Analyze rejection categories to understand what's happening
 */
import { db } from "../db";
import { sql } from "drizzle-orm";

function classifyRejection(notes: string): string {
  const n = (notes || "").toLowerCase();
  if (
    n.includes("não é relevant") ||
    n.includes("irrelevant") ||
    n.includes("foge") ||
    n.includes("não consta") ||
    n.includes("baixa relevância") ||
    n.includes("baixíssima relevância") ||
    n.includes("inadequad") ||
    n.includes("não aparece em edita") ||
    n.includes("raramente aparece") ||
    n.includes("não se aplica") ||
    n.includes("fora do escopo") ||
    n.includes("não é matéria") ||
    n.includes("não é tópico") ||
    n.includes("não é tema") ||
    n.includes("totalmente irrelevante") ||
    n.includes("completamente inadequad")
  ) {
    return "IRRELEVANTE";
  }
  if (
    n.includes("incorret") ||
    n.includes("erro grave") ||
    n.includes("errad") ||
    n.includes("imprecis") ||
    n.includes("informação incorreta")
  ) {
    return "INCORRETO";
  }
  if (
    n.includes("superficial") ||
    n.includes("incompleto") ||
    n.includes("insuficiente") ||
    n.includes("muito resumido") ||
    n.includes("telegráfic") ||
    n.includes("falta") ||
    n.includes("extremamente") ||
    n.includes("muito básic")
  ) {
    return "SUPERFICIAL";
  }
  return "OUTRO";
}

async function main() {
  // 1. All rejected content by category
  const allRejected = (await db.execute(sql`
    SELECT title, "reviewScore", "reviewNotes", "wordCount"
    FROM "Content"
    WHERE "reviewStatus" = 'REJEITADO'
    ORDER BY "reviewScore" ASC
  `)) as any[];

  const categories: Record<string, any[]> = {
    IRRELEVANTE: [],
    SUPERFICIAL: [],
    INCORRETO: [],
    OUTRO: [],
  };

  for (const c of allRejected) {
    const cat = classifyRejection(c.reviewNotes);
    categories[cat].push(c);
  }

  console.log("=== ANALISE DOS " + allRejected.length + " CONTEUDOS REJEITADOS ===\n");
  for (const [cat, items] of Object.entries(categories)) {
    console.log("  " + cat + ": " + items.length + " conteudos");
  }

  // Show examples of each category
  console.log("\n--- IRRELEVANTES (amostra) ---");
  for (const c of categories.IRRELEVANTE.slice(0, 10)) {
    console.log("  [" + c.reviewScore + "/10] " + c.title);
  }

  console.log("\n--- SUPERFICIAIS (amostra) ---");
  for (const c of categories.SUPERFICIAL.slice(0, 10)) {
    console.log("  [" + c.reviewScore + "/10] " + (c.wordCount || "?") + "w | " + c.title);
  }

  console.log("\n--- INCORRETOS (amostra) ---");
  for (const c of categories.INCORRETO.slice(0, 10)) {
    console.log("  [" + c.reviewScore + "/10] " + c.title + " - " + (c.reviewNotes || "").substring(0, 100));
  }

  console.log("\n--- OUTROS (amostra) ---");
  for (const c of categories.OUTRO.slice(0, 10)) {
    console.log("  [" + c.reviewScore + "/10] " + c.title + " - " + (c.reviewNotes || "").substring(0, 100));
  }

  // 2. Check regenerated content that was re-reviewed
  const regenReviewed = (await db.execute(sql`
    SELECT title, "reviewStatus", "reviewScore", "wordCount", "reviewNotes"
    FROM "Content"
    WHERE "wordCount" > 400
    AND "reviewStatus" = 'REJEITADO'
    ORDER BY "reviewScore" ASC
    LIMIT 15
  `)) as any[];

  console.log("\n=== CONTEUDOS COM 400+ PALAVRAS REJEITADOS (regenerados?) ===");
  for (const c of regenReviewed) {
    console.log("  " + c.reviewScore + "/10 | " + c.wordCount + "w | " + c.title);
    console.log("    -> " + (c.reviewNotes || "").substring(0, 120));
  }

  // 3. Questions rejected - categories
  const rejQuestions = (await db.execute(sql`
    SELECT statement, "reviewScore", "reviewNotes"
    FROM "Question"
    WHERE "reviewStatus" = 'REJEITADO'
  `)) as any[];

  let qGabarito = 0;
  let qIrrelevant = 0;
  let qOther = 0;
  for (const q of rejQuestions) {
    const n = (q.reviewNotes || "").toLowerCase();
    if (n.includes("gabarito") || n.includes("erro grave") || n.includes("erro crítico")) {
      qGabarito++;
    } else if (n.includes("relevân") || n.includes("inadequa")) {
      qIrrelevant++;
    } else {
      qOther++;
    }
  }

  console.log("\n=== " + rejQuestions.length + " QUESTOES REJEITADAS ===");
  console.log("  GABARITO ERRADO: " + qGabarito);
  console.log("  IRRELEVANTE: " + qIrrelevant);
  console.log("  OUTRO: " + qOther);

  // 4. Show question samples
  console.log("\n--- Amostra questoes rejeitadas ---");
  for (const q of rejQuestions.slice(0, 5)) {
    console.log("  [" + q.reviewScore + "/10] " + (q.statement || "").substring(0, 60));
    console.log("    -> " + (q.reviewNotes || "").substring(0, 150));
  }

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
