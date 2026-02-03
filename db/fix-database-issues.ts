/**
 * Script de Correção do Banco de Dados
 *
 * PROBLEMAS A CORRIGIR:
 * 1. 328 questões órfãs (subjectId = Content.id ao invés de Subject.id)
 * 2. 3 Subjects duplicados vazios
 *
 * EXECUÇÃO:
 * - Com --dry-run: apenas mostra o que seria feito (padrão)
 * - Com --execute: executa as correções
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

const DRY_RUN = !process.argv.includes("--execute");

async function fixDatabaseIssues() {
  console.log("=".repeat(70));
  console.log(DRY_RUN ? "🔍 MODO DRY-RUN (simulação)" : "⚡ MODO EXECUÇÃO (aplicando correções)");
  console.log("=".repeat(70));

  // ============================================
  // FASE 1: BACKUP (mostrar dados afetados)
  // ============================================
  console.log("\n📦 FASE 1: BACKUP DOS DADOS AFETADOS\n");

  // 1.1 Questões órfãs
  const orphanQuestions = await db.execute(sql`
    SELECT q.id, q."subjectId", q.statement
    FROM "Question" q
    WHERE q."subjectId" NOT IN (SELECT id FROM "Subject")
  `) as any[];

  console.log(`   Questões órfãs encontradas: ${orphanQuestions.length}`);

  // 1.2 Subjects duplicados vazios
  const duplicateSubjects = await db.execute(sql`
    SELECT s.id, s.name, s."displayName", s.category
    FROM "Subject" s
    WHERE s."displayName" IN (
      SELECT "displayName" FROM "Subject" GROUP BY "displayName" HAVING COUNT(*) > 1
    )
    AND (
      SELECT COUNT(*) FROM "Content" c WHERE c."subjectId" = s.id
    ) = 0
    AND (
      SELECT COUNT(*) FROM "Question" q WHERE q."subjectId" = s.id
    ) = 0
  `) as any[];

  console.log(`   Subjects duplicados vazios: ${duplicateSubjects.length}`);
  duplicateSubjects.forEach((s: any) => {
    console.log(`      - ${s.displayName} (ID: ${s.id})`);
  });

  // ============================================
  // FASE 2: CORRIGIR QUESTÕES ÓRFÃS
  // ============================================
  console.log("\n" + "=".repeat(70));
  console.log("🔧 FASE 2: CORRIGIR QUESTÕES ÓRFÃS");
  console.log("=".repeat(70));

  let questionsFixed = 0;
  let questionsNotFixable = 0;

  for (const q of orphanQuestions) {
    const wrongSubjectId = q.subjectId as string;

    // Se o subjectId parece ser um Content.id (começa com "content_")
    if (wrongSubjectId.startsWith("content_")) {
      // Buscar o Content para obter o subjectId correto
      const content = await db.execute(sql`
        SELECT "subjectId" FROM "Content" WHERE id = ${wrongSubjectId}
      `) as any[];

      if (content.length > 0 && content[0].subjectId) {
        const correctSubjectId = content[0].subjectId;

        if (DRY_RUN) {
          console.log(`   [DRY-RUN] Questão ${q.id.substring(0,12)}...`);
          console.log(`             ${wrongSubjectId} → ${correctSubjectId}`);
        } else {
          await db.execute(sql`
            UPDATE "Question" SET "subjectId" = ${correctSubjectId}
            WHERE id = ${q.id}
          `);
          console.log(`   ✅ Corrigido: ${q.id.substring(0,12)}... → ${correctSubjectId}`);
        }
        questionsFixed++;
      } else {
        console.log(`   ⚠️ Content não encontrado para: ${wrongSubjectId}`);
        questionsNotFixable++;
      }
    } else {
      console.log(`   ⚠️ subjectId não reconhecido: ${wrongSubjectId}`);
      questionsNotFixable++;
    }
  }

  console.log(`\n   Resumo Fase 2:`);
  console.log(`   - Questões corrigíveis: ${questionsFixed}`);
  console.log(`   - Questões não corrigíveis: ${questionsNotFixable}`);

  // ============================================
  // FASE 3: REMOVER SUBJECTS DUPLICADOS VAZIOS
  // ============================================
  console.log("\n" + "=".repeat(70));
  console.log("🗑️ FASE 3: REMOVER SUBJECTS DUPLICADOS VAZIOS");
  console.log("=".repeat(70));

  // Verificar cada duplicado novamente (pode ter mudado após fase 2)
  for (const s of duplicateSubjects) {
    // Re-verificar se ainda está vazio após correções
    const contentCount = await db.execute(sql`
      SELECT COUNT(*) as count FROM "Content" WHERE "subjectId" = ${s.id}
    `) as any[];

    const questionCount = await db.execute(sql`
      SELECT COUNT(*) as count FROM "Question" WHERE "subjectId" = ${s.id}
    `) as any[];

    const ccount = parseInt(contentCount[0]?.count) || 0;
    const qcount = parseInt(questionCount[0]?.count) || 0;

    if (ccount === 0 && qcount === 0) {
      if (DRY_RUN) {
        console.log(`   [DRY-RUN] Deletaria: ${s.displayName} (ID: ${s.id})`);
      } else {
        // Verificar se há outras referências (cargo_materias, etc)
        // Por segurança, apenas deletar se não houver referências
        await db.execute(sql`
          DELETE FROM "Subject" WHERE id = ${s.id}
        `);
        console.log(`   ✅ Deletado: ${s.displayName} (ID: ${s.id})`);
      }
    } else {
      console.log(`   ⏭️ Mantido (tem dados agora): ${s.displayName} - ${ccount} cont, ${qcount} quest`);
    }
  }

  // ============================================
  // FASE 4: VERIFICAÇÃO FINAL
  // ============================================
  console.log("\n" + "=".repeat(70));
  console.log("✅ FASE 4: VERIFICAÇÃO FINAL");
  console.log("=".repeat(70));

  // Contar questões órfãs restantes
  const remainingOrphans = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM "Question" q
    WHERE q."subjectId" NOT IN (SELECT id FROM "Subject")
  `) as any[];

  // Contar duplicados restantes
  const remainingDuplicates = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM "Subject" s
    WHERE s."displayName" IN (
      SELECT "displayName" FROM "Subject" GROUP BY "displayName" HAVING COUNT(*) > 1
    )
  `) as any[];

  // Estatísticas finais
  const totalQuestions = await db.execute(sql`
    SELECT COUNT(*) as count FROM "Question"
  `) as any[];

  const totalSubjects = await db.execute(sql`
    SELECT COUNT(*) as count FROM "Subject"
  `) as any[];

  console.log(`\n   Questões órfãs restantes: ${remainingOrphans[0]?.count || 0}`);
  console.log(`   Subjects duplicados restantes: ${remainingDuplicates[0]?.count || 0}`);
  console.log(`   Total de questões: ${totalQuestions[0]?.count || 0}`);
  console.log(`   Total de subjects: ${totalSubjects[0]?.count || 0}`);

  // ============================================
  // RESUMO
  // ============================================
  console.log("\n" + "=".repeat(70));
  if (DRY_RUN) {
    console.log("📋 RESUMO (DRY-RUN - nenhuma alteração foi feita)");
    console.log("=".repeat(70));
    console.log(`\n   Para executar as correções, rode:`);
    console.log(`   npx tsx db/fix-database-issues.ts --execute\n`);
  } else {
    console.log("✅ CORREÇÕES APLICADAS COM SUCESSO!");
    console.log("=".repeat(70));
  }

  process.exit(0);
}

fixDatabaseIssues().catch((e) => {
  console.error("Erro:", e);
  process.exit(1);
});
