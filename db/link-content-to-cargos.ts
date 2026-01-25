/**
 * Phase 3.5: Link existing content to cargos
 *
 * This script analyzes existing Content entries and links them to the appropriate
 * cargos in the `conteudo_cargos` table based on:
 * - Content.subjectId -> Subject.name
 * - Subject.name matches cargo_materias.codigo
 * - cargo_materias -> cargos
 */

import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

// Mapping from Subject.name to cargo_materias.codigo (for cases where they differ)
const SUBJECT_TO_MATERIA: Record<string, string[]> = {
  // Direct matches
  "PORTUGUES": ["PORTUGUES"],
  "MATEMATICA": ["MATEMATICA", "RACIOCINIO_LOGICO"],
  "RACIOCINIO_LOGICO": ["RACIOCINIO_LOGICO"],
  "INFORMATICA": ["INFORMATICA"],
  "DIREITO_PENAL": ["DIREITO_PENAL"],
  "DIREITO_ADMINISTRATIVO": ["DIREITO_ADMINISTRATIVO"],
  "ETICA_SERVICO_PUBLICO": ["ETICA_SERVICO_PUBLICO"],
  "LEGISLACAO_TRANSITO": ["LEGISLACAO_TRANSITO"],

  // Short/alternate names mapping to full names
  "DIR_CONSTITUCIONAL": ["DIREITO_CONSTITUCIONAL"],
  "DIR_ADMINISTRATIVO": ["DIREITO_ADMINISTRATIVO"],
  "DIR_PENAL": ["DIREITO_PENAL"],
  "DIR_PROCESSUAL_PENAL": ["DIREITO_PROCESSUAL_PENAL"],

  // Novos subjects adicionados na Fase 4
  "DIREITO_PROCESSUAL_PENAL": ["DIREITO_PROCESSUAL_PENAL"],
  "DIREITO_CONSTITUCIONAL": ["DIREITO_CONSTITUCIONAL"],
  "INGLES": ["INGLES"],
  "FISICA": ["FISICA"],
  "GEOGRAFIA": ["GEOGRAFIA"],
  "HISTORIA": ["HISTORIA"],
  "QUIMICA": ["QUIMICA"],
  "ATUALIDADES": ["ATUALIDADES"],
  "LEGISLACAO_ESPECIAL": ["LEGISLACAO_ESPECIAL"],
  "ADMINISTRACAO": ["ADMINISTRACAO"],
  "NOCOES_AVIACAO": ["NOCOES_AVIACAO"],
};

interface ContentItem {
  id: string;
  title: string;
  subjectId: string;
  subject_name: string;
}

interface CargoMateria {
  cargo_id: string;
  cargo_nome: string;
  cargo_materia_id: string;
  materia_codigo: string;
  concurso_sigla: string;
}

async function linkContentToCargos() {
  console.log("🔗 Phase 3.5: Linking existing content to cargos...\n");

  try {
    // 1. Get all existing Content with their Subject
    const contents = (await db.execute(sql`
      SELECT c.id, c.title, c."subjectId", s.name as subject_name
      FROM "Content" c
      JOIN "Subject" s ON s.id = c."subjectId"
      WHERE c."isActive" = true
      ORDER BY s.name, c.title
    `)) as unknown as ContentItem[];

    console.log(`📚 Found ${contents.length} content items to process\n`);

    if (contents.length === 0) {
      console.log("⚠️ No content found to link.");
      return;
    }

    // 2. Get all cargo_materias with their cargo and concurso info
    const cargoMaterias = (await db.execute(sql`
      SELECT
        cm.id as cargo_materia_id,
        cm.codigo as materia_codigo,
        cm.cargo_id,
        cg.nome as cargo_nome,
        c.sigla as concurso_sigla
      FROM cargo_materias cm
      JOIN cargos cg ON cg.id = cm.cargo_id
      JOIN concursos c ON c.id = cg.concurso_id
      WHERE cm.is_active = true AND cg.is_active = true AND c.is_active = true
    `)) as unknown as CargoMateria[];

    console.log(`👔 Found ${cargoMaterias.length} cargo_materias\n`);

    // Build lookup: materia_codigo -> list of cargos
    const materiaToCargoMap = new Map<string, CargoMateria[]>();
    for (const cm of cargoMaterias) {
      if (!materiaToCargoMap.has(cm.materia_codigo)) {
        materiaToCargoMap.set(cm.materia_codigo, []);
      }
      materiaToCargoMap.get(cm.materia_codigo)!.push(cm);
    }

    console.log("📋 Materia codes available:");
    for (const [codigo, list] of materiaToCargoMap.entries()) {
      console.log(`   - ${codigo}: ${list.length} cargo(s)`);
    }
    console.log("");

    // 3. Check existing links to avoid duplicates
    const existingLinks = (await db.execute(sql`
      SELECT content_id, cargo_id FROM conteudo_cargos
    `)) as unknown as { content_id: string; cargo_id: string }[];

    const existingLinksSet = new Set(
      existingLinks.map((l) => `${l.content_id}_${l.cargo_id}`)
    );

    console.log(`📎 Found ${existingLinks.length} existing links\n`);

    // 4. Process each content and create links
    let linksCreated = 0;
    let contentLinked = 0;
    let contentSkipped = 0;

    const subjectStats = new Map<string, { linked: number; skipped: number }>();

    for (const content of contents) {
      // Find matching materia codes
      const materiaCodes = SUBJECT_TO_MATERIA[content.subject_name] || [content.subject_name];

      const matchedCargos: CargoMateria[] = [];

      for (const code of materiaCodes) {
        const cargos = materiaToCargoMap.get(code) || [];
        matchedCargos.push(...cargos);
      }

      // Track stats
      if (!subjectStats.has(content.subject_name)) {
        subjectStats.set(content.subject_name, { linked: 0, skipped: 0 });
      }

      if (matchedCargos.length === 0) {
        contentSkipped++;
        subjectStats.get(content.subject_name)!.skipped++;
        continue;
      }

      // Remove duplicates (same cargo_id)
      const uniqueCargos = [...new Map(matchedCargos.map(c => [c.cargo_id, c])).values()];

      let linkedThisContent = false;

      for (const cargo of uniqueCargos) {
        const linkKey = `${content.id}_${cargo.cargo_id}`;

        if (existingLinksSet.has(linkKey)) {
          continue; // Skip existing link
        }

        // Create the link with cargo_materia_id
        await db.execute(sql`
          INSERT INTO conteudo_cargos (content_id, cargo_id, cargo_materia_id)
          VALUES (${content.id}, ${cargo.cargo_id}, ${cargo.cargo_materia_id})
        `);

        existingLinksSet.add(linkKey);
        linksCreated++;
        linkedThisContent = true;
      }

      if (linkedThisContent) {
        contentLinked++;
        subjectStats.get(content.subject_name)!.linked++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("📊 SUMMARY");
    console.log("=".repeat(50));
    console.log(`📚 Total content processed: ${contents.length}`);
    console.log(`✅ Content newly linked: ${contentLinked}`);
    console.log(`⚠️ Content skipped (no matching materias): ${contentSkipped}`);
    console.log(`🔗 New links created: ${linksCreated}`);
    console.log(`📎 Total links now: ${existingLinksSet.size}`);
    console.log("\n📋 By Subject:");
    for (const [subject, stats] of subjectStats.entries()) {
      console.log(`   - ${subject}: ${stats.linked} linked, ${stats.skipped} skipped`);
    }
    console.log("=".repeat(50));

  } catch (error) {
    console.error("❌ Error linking content to cargos:", error);
    throw error;
  }
}

// Run
linkContentToCargos()
  .then(() => {
    console.log("\n✅ Phase 3.5 completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Phase 3.5 failed:", error);
    process.exit(1);
  });
