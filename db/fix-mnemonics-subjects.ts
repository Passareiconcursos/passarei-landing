/**
 * db/fix-mnemonics-subjects.ts
 *
 * Corrige subject_id nulo nos mnemônicos inseridos sem vínculo.
 * Executa UPDATE direto com o UUID correto de cada Subject.
 *
 * Uso: npx tsx db/fix-mnemonics-subjects.ts
 */
import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

interface Fix {
  titleContains: string;
  subjectSearch: string;
}

// Mapeamento: fragmento do title → termo de busca no Subject.name
const FIXES: Fix[] = [
  // Processual Penal (4 mnemonics)
  { titleContains: "I.D.E.O.S.A.",          subjectSearch: "PROCESSUAL" },
  { titleContains: "Pre-Ca-La-No",           subjectSearch: "PROCESSUAL" },
  { titleContains: "G.O.P.E.",               subjectSearch: "PROCESSUAL" },
  { titleContains: "S.E.I.D.O.",             subjectSearch: "PROCESSUAL" },
  // Legislação Especial (3 mnemonics)
  { titleContains: "TRANS-INTER-HOSP",       subjectSearch: "LEGISLACAO" },
  { titleContains: "P.E.M.P.",               subjectSearch: "LEGISLACAO" },
  { titleContains: "RA-PE-DR",               subjectSearch: "LEGISLACAO" },
  // Medicina Legal (1 mnemonic)
  { titleContains: "L.I.A.R.",               subjectSearch: "MEDICINA" },
  // Legislação Institucional / Militares (4 mnemonics)
  { titleContains: "V.E.R.A.",               subjectSearch: "LEGISLACAO" },
  { titleContains: "PA-DE-CI-LE-PRO",        subjectSearch: "LEGISLACAO" },
  { titleContains: "AD-RE-DE-EX",            subjectSearch: "LEGISLACAO" },
  { titleContains: "PRO-PRO-DIS-HI-LE",      subjectSearch: "LEGISLACAO" },
];

async function main() {
  console.log("🔧 Corrigindo subject_id dos mnemônicos...\n");

  let fixed = 0;
  let notFound = 0;

  for (const fix of FIXES) {
    // Busca o subject_id
    const subjectRows = await sql`
      SELECT id, name FROM "Subject"
      WHERE name ILIKE ${"%" + fix.subjectSearch + "%"}
      LIMIT 1
    `;

    if (!subjectRows[0]) {
      console.log(`  ⚠️  Subject não encontrado para "${fix.subjectSearch}" (mnemonic: "${fix.titleContains}")`);
      notFound++;
      continue;
    }

    const subjectId = subjectRows[0].id;
    const subjectName = subjectRows[0].name;

    // Atualiza o mnemonic
    const result = await sql`
      UPDATE mnemonics
      SET subject_id = ${subjectId}
      WHERE title ILIKE ${"%" + fix.titleContains + "%"}
        AND (subject_id IS NULL OR subject_id != ${subjectId})
      RETURNING title
    `;

    if (result.length > 0) {
      console.log(`  ✅ "${result[0].title}" → ${subjectName}`);
      fixed++;
    } else {
      console.log(`  ➖ "${fix.titleContains}" — já vinculado ou não encontrado`);
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`✅ Corrigidos: ${fixed}`);
  console.log(`⚠️  Subjects ausentes: ${notFound}`);
  console.log(`${"=".repeat(50)}`);

  await sql.end();
  process.exit(0);
}

main().catch(err => {
  console.error("❌ Erro:", err.message);
  sql.end();
  process.exit(1);
});
