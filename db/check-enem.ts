import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

async function check() {
  console.log("🔍 Verificando ENEM...\n");

  const concurso = await db.execute(sql`SELECT id, sigla, nome, ordem FROM concursos WHERE sigla = 'ENEM'`) as any[];
  console.log("📋 CONCURSO ENEM:", concurso[0] ? `${concurso[0].sigla} - ${concurso[0].nome} (ordem ${concurso[0].ordem})` : "NÃO ENCONTRADO");

  if (concurso[0]) {
    const cargo = await db.execute(sql`SELECT id, codigo, nome FROM cargos WHERE codigo = 'ENEM_GERAL'`) as any[];
    console.log("📋 CARGO:", cargo[0] ? `${cargo[0].codigo} - ${cargo[0].nome}` : "NÃO ENCONTRADO");

    if (cargo[0]) {
      const materias = await db.execute(sql`SELECT nome, codigo, peso FROM cargo_materias WHERE cargo_id = ${cargo[0].id} ORDER BY ordem`) as any[];
      console.log(`\n📚 MATÉRIAS (${materias.length}):`);
      materias.forEach((m: any) => console.log(`   - ${m.nome} [${m.codigo}] peso: ${m.peso}`));
    }
  }

  const subjects = await db.execute(sql`SELECT name, "displayName" FROM "Subject" WHERE name IN ('REDACAO', 'BIOLOGIA', 'FILOSOFIA', 'SOCIOLOGIA', 'LITERATURA')`) as any[];
  console.log(`\n📚 SUBJECTS NOVOS (${subjects.length}):`);
  subjects.forEach((s: any) => console.log(`   - ${s.name}: ${s.displayName}`));

  const contents = await db.execute(sql`
    SELECT s.name, COUNT(c.id)::int as count
    FROM "Subject" s
    JOIN "Content" c ON c."subjectId" = s.id
    WHERE s.name IN ('REDACAO', 'BIOLOGIA', 'FILOSOFIA', 'SOCIOLOGIA', 'LITERATURA')
    GROUP BY s.name
  `) as any[];
  console.log(`\n📝 CONTEÚDOS POR SUBJECT:`);
  contents.forEach((c: any) => console.log(`   - ${c.name}: ${c.count} conteúdos`));

  console.log("\n✅ Verificação completa!");
}

check()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  });
