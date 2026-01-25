// Script para inserir cargos e matérias dos concursos
import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

async function seedCargos() {
  console.log("🚀 Inserindo cargos e matérias...\n");

  try {
    // =============================================
    // POLÍCIA FEDERAL - Cargos
    // =============================================
    console.log("📋 Inserindo cargos da Polícia Federal...");
    await db.execute(sql`
      INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, ordem)
      SELECT c.id, 'Agente de Polícia Federal', 'AGENTE_PF', 'SUPERIOR', 1
      FROM concursos c WHERE c.sigla = 'PF'
      ON CONFLICT DO NOTHING;
    `);
    await db.execute(sql`
      INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, ordem)
      SELECT c.id, 'Escrivão de Polícia Federal', 'ESCRIVAO_PF', 'SUPERIOR', 2
      FROM concursos c WHERE c.sigla = 'PF'
      ON CONFLICT DO NOTHING;
    `);
    await db.execute(sql`
      INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, ordem)
      SELECT c.id, 'Papiloscopista Policial Federal', 'PAPILOSCOPISTA_PF', 'SUPERIOR', 3
      FROM concursos c WHERE c.sigla = 'PF'
      ON CONFLICT DO NOTHING;
    `);
    await db.execute(sql`
      INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, ordem)
      SELECT c.id, 'Delegado de Polícia Federal', 'DELEGADO_PF', 'SUPERIOR', 4
      FROM concursos c WHERE c.sigla = 'PF'
      ON CONFLICT DO NOTHING;
    `);
    console.log("   ✅ Cargos PF inseridos\n");

    // =============================================
    // PRF - Cargo
    // =============================================
    console.log("📋 Inserindo cargo da PRF...");
    await db.execute(sql`
      INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, ordem)
      SELECT c.id, 'Policial Rodoviário Federal', 'POLICIAL_PRF', 'SUPERIOR', 1
      FROM concursos c WHERE c.sigla = 'PRF'
      ON CONFLICT DO NOTHING;
    `);
    console.log("   ✅ Cargo PRF inserido\n");

    // =============================================
    // POLÍCIA CIVIL - Cargos
    // =============================================
    console.log("📋 Inserindo cargos da Polícia Civil...");
    await db.execute(sql`
      INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, ordem)
      SELECT c.id, 'Delegado de Polícia', 'DELEGADO_PC', 'SUPERIOR', 1
      FROM concursos c WHERE c.sigla = 'PC'
      ON CONFLICT DO NOTHING;
    `);
    await db.execute(sql`
      INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, ordem)
      SELECT c.id, 'Investigador de Polícia', 'INVESTIGADOR', 'MEDIO', 2
      FROM concursos c WHERE c.sigla = 'PC'
      ON CONFLICT DO NOTHING;
    `);
    await db.execute(sql`
      INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, ordem)
      SELECT c.id, 'Escrivão de Polícia', 'ESCRIVAO_PC', 'MEDIO', 3
      FROM concursos c WHERE c.sigla = 'PC'
      ON CONFLICT DO NOTHING;
    `);
    await db.execute(sql`
      INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, ordem)
      SELECT c.id, 'Agente de Polícia', 'AGENTE_PC', 'MEDIO', 4
      FROM concursos c WHERE c.sigla = 'PC'
      ON CONFLICT DO NOTHING;
    `);
    await db.execute(sql`
      INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, ordem)
      SELECT c.id, 'Perito Criminal', 'PERITO_PC', 'SUPERIOR', 5
      FROM concursos c WHERE c.sigla = 'PC'
      ON CONFLICT DO NOTHING;
    `);
    await db.execute(sql`
      INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, ordem)
      SELECT c.id, 'Papiloscopista', 'PAPILOSCOPISTA_PC', 'MEDIO', 6
      FROM concursos c WHERE c.sigla = 'PC'
      ON CONFLICT DO NOTHING;
    `);
    console.log("   ✅ Cargos PC inseridos\n");

    // =============================================
    // POLÍCIA MILITAR - Cargos
    // =============================================
    console.log("📋 Inserindo cargos da Polícia Militar...");
    await db.execute(sql`
      INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, ordem)
      SELECT c.id, 'Soldado PM', 'SOLDADO_PM', 'MEDIO', 1
      FROM concursos c WHERE c.sigla = 'PM'
      ON CONFLICT DO NOTHING;
    `);
    await db.execute(sql`
      INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, ordem)
      SELECT c.id, 'Oficial PM (CFO)', 'CFO_PM', 'SUPERIOR', 2
      FROM concursos c WHERE c.sigla = 'PM'
      ON CONFLICT DO NOTHING;
    `);
    console.log("   ✅ Cargos PM inseridos\n");

    // =============================================
    // CORPO DE BOMBEIROS - Cargos
    // =============================================
    console.log("📋 Inserindo cargos do Corpo de Bombeiros...");
    await db.execute(sql`
      INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, ordem)
      SELECT c.id, 'Soldado Bombeiro', 'SOLDADO_CBM', 'MEDIO', 1
      FROM concursos c WHERE c.sigla = 'CBM'
      ON CONFLICT DO NOTHING;
    `);
    await db.execute(sql`
      INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, ordem)
      SELECT c.id, 'Oficial Bombeiro (CFO)', 'CFO_CBM', 'SUPERIOR', 2
      FROM concursos c WHERE c.sigla = 'CBM'
      ON CONFLICT DO NOTHING;
    `);
    console.log("   ✅ Cargos CBM inseridos\n");

    // =============================================
    // GUARDA MUNICIPAL - Cargo
    // =============================================
    console.log("📋 Inserindo cargo da Guarda Municipal...");
    await db.execute(sql`
      INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, ordem)
      SELECT c.id, 'Guarda Municipal', 'GUARDA_GM', 'MEDIO', 1
      FROM concursos c WHERE c.sigla = 'GM'
      ON CONFLICT DO NOTHING;
    `);
    console.log("   ✅ Cargo GM inserido\n");

    // =============================================
    // POLÍCIA PENAL FEDERAL - Cargo
    // =============================================
    console.log("📋 Inserindo cargo da Polícia Penal Federal...");
    await db.execute(sql`
      INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, ordem)
      SELECT c.id, 'Policial Penal Federal', 'POLICIAL_PPF', 'SUPERIOR', 1
      FROM concursos c WHERE c.sigla = 'PPF'
      ON CONFLICT DO NOTHING;
    `);
    console.log("   ✅ Cargo PPF inserido\n");

    // =============================================
    // POLÍCIA PENAL ESTADUAL - Cargos
    // =============================================
    console.log("📋 Inserindo cargos da Polícia Penal Estadual...");
    await db.execute(sql`
      INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, ordem)
      SELECT c.id, 'Agente Penitenciário', 'AGENTE_PPE', 'MEDIO', 1
      FROM concursos c WHERE c.sigla = 'PPE'
      ON CONFLICT DO NOTHING;
    `);
    await db.execute(sql`
      INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, ordem)
      SELECT c.id, 'Técnico Penitenciário', 'TECNICO_PPE', 'MEDIO', 2
      FROM concursos c WHERE c.sigla = 'PPE'
      ON CONFLICT DO NOTHING;
    `);
    console.log("   ✅ Cargos PPE inseridos\n");

    // =============================================
    // POLÍCIA LEGISLATIVA FEDERAL - Cargo
    // =============================================
    console.log("📋 Inserindo cargo da Polícia Legislativa Federal...");
    await db.execute(sql`
      INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, ordem)
      SELECT c.id, 'Policial Legislativo', 'POLICIAL_PLF', 'SUPERIOR', 1
      FROM concursos c WHERE c.sigla = 'PLF'
      ON CONFLICT DO NOTHING;
    `);
    console.log("   ✅ Cargo PLF inserido\n");

    // =============================================
    // INSERIR MATÉRIAS PARA CARGO DE AGENTE PF
    // =============================================
    console.log("📚 Inserindo matérias do Agente PF (exemplo)...");

    await db.execute(sql`
      INSERT INTO cargo_materias (cargo_id, nome, codigo, peso, quantidade_questoes, topicos, ordem)
      SELECT cg.id, 'Direito Penal', 'DIREITO_PENAL', 2.0, 15,
        '["Teoria Geral do Crime", "Crimes contra a Pessoa", "Crimes contra o Patrimônio", "Lei de Drogas", "Crimes contra a Administração Pública"]'::jsonb,
        1
      FROM cargos cg WHERE cg.codigo = 'AGENTE_PF'
      ON CONFLICT DO NOTHING;
    `);

    await db.execute(sql`
      INSERT INTO cargo_materias (cargo_id, nome, codigo, peso, quantidade_questoes, topicos, ordem)
      SELECT cg.id, 'Direito Constitucional', 'DIREITO_CONSTITUCIONAL', 2.0, 15,
        '["Direitos e Garantias Fundamentais", "Organização do Estado", "Segurança Pública", "Remédios Constitucionais"]'::jsonb,
        2
      FROM cargos cg WHERE cg.codigo = 'AGENTE_PF'
      ON CONFLICT DO NOTHING;
    `);

    await db.execute(sql`
      INSERT INTO cargo_materias (cargo_id, nome, codigo, peso, quantidade_questoes, topicos, ordem)
      SELECT cg.id, 'Direito Administrativo', 'DIREITO_ADMINISTRATIVO', 1.5, 10,
        '["Atos Administrativos", "Licitações e Contratos", "Servidores Públicos", "Responsabilidade Civil"]'::jsonb,
        3
      FROM cargos cg WHERE cg.codigo = 'AGENTE_PF'
      ON CONFLICT DO NOTHING;
    `);

    await db.execute(sql`
      INSERT INTO cargo_materias (cargo_id, nome, codigo, peso, quantidade_questoes, topicos, ordem)
      SELECT cg.id, 'Direito Processual Penal', 'DIREITO_PROCESSUAL_PENAL', 1.5, 10,
        '["Inquérito Policial", "Prisões", "Provas", "Competência"]'::jsonb,
        4
      FROM cargos cg WHERE cg.codigo = 'AGENTE_PF'
      ON CONFLICT DO NOTHING;
    `);

    await db.execute(sql`
      INSERT INTO cargo_materias (cargo_id, nome, codigo, peso, quantidade_questoes, topicos, ordem)
      SELECT cg.id, 'Língua Portuguesa', 'PORTUGUES', 1.0, 10,
        '["Interpretação de Texto", "Gramática", "Redação Oficial"]'::jsonb,
        5
      FROM cargos cg WHERE cg.codigo = 'AGENTE_PF'
      ON CONFLICT DO NOTHING;
    `);

    await db.execute(sql`
      INSERT INTO cargo_materias (cargo_id, nome, codigo, peso, quantidade_questoes, topicos, ordem)
      SELECT cg.id, 'Raciocínio Lógico', 'RACIOCINIO_LOGICO', 1.0, 10,
        '["Lógica Proposicional", "Raciocínio Sequencial", "Análise Combinatória"]'::jsonb,
        6
      FROM cargos cg WHERE cg.codigo = 'AGENTE_PF'
      ON CONFLICT DO NOTHING;
    `);

    await db.execute(sql`
      INSERT INTO cargo_materias (cargo_id, nome, codigo, peso, quantidade_questoes, topicos, ordem)
      SELECT cg.id, 'Informática', 'INFORMATICA', 1.0, 5,
        '["Segurança da Informação", "Redes de Computadores", "Sistemas Operacionais"]'::jsonb,
        7
      FROM cargos cg WHERE cg.codigo = 'AGENTE_PF'
      ON CONFLICT DO NOTHING;
    `);

    console.log("   ✅ Matérias do Agente PF inseridas\n");

    // =============================================
    // VERIFICAR RESULTADO
    // =============================================
    console.log("📊 Verificando cargos cadastrados...");
    const cargos = await db.execute(sql`
      SELECT c.sigla as concurso, cg.nome as cargo, cg.escolaridade
      FROM cargos cg
      JOIN concursos c ON c.id = cg.concurso_id
      ORDER BY c.ordem, cg.ordem;
    `);
    console.table(cargos);

    console.log("\n📊 Matérias do Agente PF:");
    const materias = await db.execute(sql`
      SELECT cm.nome, cm.peso, cm.quantidade_questoes
      FROM cargo_materias cm
      JOIN cargos cg ON cg.id = cm.cargo_id
      WHERE cg.codigo = 'AGENTE_PF'
      ORDER BY cm.ordem;
    `);
    console.table(materias);

    console.log("\n🎉 Seed executado com sucesso!");

  } catch (error: any) {
    console.error("❌ Erro no seed:", error.message);
    process.exit(1);
  }

  process.exit(0);
}

seedCargos();
