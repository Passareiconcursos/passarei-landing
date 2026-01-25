/**
 * Add missing materias to cargo_materias table
 * This script adds ETICA_SERVICO_PUBLICO and LEGISLACAO_TRANSITO
 */

import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

// New materias to add for Agente PF (and potentially other cargos)
const NEW_MATERIAS = [
  {
    nome: "Ética no Serviço Público",
    codigo: "ETICA_SERVICO_PUBLICO",
    cargos: ["AGENTE_PF", "ESCRIVAO_PF", "DELEGADO_PF", "PAPILOSCOPISTA_PF", "POLICIAL_PRF"],
    ordem: 8,
  },
  {
    nome: "Legislação de Trânsito",
    codigo: "LEGISLACAO_TRANSITO",
    cargos: ["POLICIAL_PRF"], // Only PRF needs transit legislation
    ordem: 9,
  },
  {
    nome: "Matemática",
    codigo: "MATEMATICA",
    cargos: ["AGENTE_PF", "ESCRIVAO_PF", "POLICIAL_PRF"],
    ordem: 10,
  },
];

async function addMissingMaterias() {
  console.log("📚 Adding missing materias to cargo_materias...\n");

  try {
    let added = 0;

    for (const materia of NEW_MATERIAS) {
      console.log(`\n📋 Processing: ${materia.nome} (${materia.codigo})`);

      for (const cargoCodigo of materia.cargos) {
        // Find the cargo
        const cargoResult = await db.execute(sql`
          SELECT cg.id, cg.nome, c.sigla as concurso_sigla
          FROM cargos cg
          JOIN concursos c ON c.id = cg.concurso_id
          WHERE cg.codigo = ${cargoCodigo}
          LIMIT 1
        `);

        if (cargoResult.length === 0) {
          console.log(`   ⚠️ Cargo not found: ${cargoCodigo}`);
          continue;
        }

        const cargo = cargoResult[0] as any;

        // Check if materia already exists for this cargo
        const existingMateria = await db.execute(sql`
          SELECT id FROM cargo_materias
          WHERE cargo_id = ${cargo.id} AND codigo = ${materia.codigo}
        `);

        if (existingMateria.length > 0) {
          console.log(`   ⏭️ Already exists: ${cargo.concurso_sigla} > ${cargo.nome}`);
          continue;
        }

        // Insert the materia
        await db.execute(sql`
          INSERT INTO cargo_materias (cargo_id, nome, codigo, ordem)
          VALUES (${cargo.id}, ${materia.nome}, ${materia.codigo}, ${materia.ordem})
        `);

        console.log(`   ✅ Added to: ${cargo.concurso_sigla} > ${cargo.nome}`);
        added++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`📊 Total materias added: ${added}`);
    console.log("=".repeat(50));

    // Now show all materias
    const allMaterias = await db.execute(sql`
      SELECT cm.nome, cm.codigo, cg.nome as cargo_nome, c.sigla as concurso_sigla
      FROM cargo_materias cm
      JOIN cargos cg ON cg.id = cm.cargo_id
      JOIN concursos c ON c.id = cg.concurso_id
      ORDER BY c.sigla, cg.nome, cm.ordem
    `);

    console.log("\n📋 All cargo_materias:");
    let currentCargo = "";
    for (const m of allMaterias as any[]) {
      const cargoKey = `${m.concurso_sigla} > ${m.cargo_nome}`;
      if (cargoKey !== currentCargo) {
        currentCargo = cargoKey;
        console.log(`\n   ${cargoKey}:`);
      }
      console.log(`      - ${m.codigo}: ${m.nome}`);
    }

  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

// Run
addMissingMaterias()
  .then(() => {
    console.log("\n✅ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Failed:", error);
    process.exit(1);
  });
