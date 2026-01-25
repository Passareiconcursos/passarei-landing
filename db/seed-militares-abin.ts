// Script para adicionar ABIN e Forças Armadas
import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function seedMilitaresAbin() {
  console.log("🎖️ Adicionando ABIN e Forças Armadas...\n");

  try {
    // ============ ABIN ============
    console.log("1️⃣ Criando ABIN...");
    const abinResult = await sql`
      INSERT INTO concursos (nome, sigla, descricao, esfera, exam_type, is_active, ordem)
      VALUES (
        'Agência Brasileira de Inteligência',
        'ABIN',
        'Órgão de inteligência do Brasil, responsável por fornecer informações estratégicas ao Presidente da República',
        'FEDERAL',
        'ABIN',
        true,
        10
      )
      ON CONFLICT (sigla) DO NOTHING
      RETURNING id
    `;

    if (abinResult.length > 0) {
      const abinId = abinResult[0].id;
      console.log("   ✅ ABIN criada");

      // Cargos da ABIN
      await sql`
        INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, is_active, ordem)
        VALUES
          (${abinId}, 'Oficial de Inteligência', 'OFICIAL_INTELIGENCIA', 'SUPERIOR', true, 1),
          (${abinId}, 'Oficial Técnico de Inteligência', 'OFICIAL_TECNICO', 'SUPERIOR', true, 2),
          (${abinId}, 'Agente de Inteligência', 'AGENTE_ABIN', 'SUPERIOR', true, 3),
          (${abinId}, 'Agente Técnico de Inteligência', 'AGENTE_TECNICO', 'MEDIO', true, 4)
        ON CONFLICT DO NOTHING
      `;
      console.log("   ✅ Cargos da ABIN criados");
    } else {
      console.log("   ⚠️ ABIN já existe");
    }

    // ============ EXÉRCITO ============
    console.log("\n2️⃣ Criando Exército Brasileiro...");
    const exercitoResult = await sql`
      INSERT INTO concursos (nome, sigla, descricao, esfera, exam_type, is_active, ordem)
      VALUES (
        'Exército Brasileiro',
        'EXERCITO',
        'Força Armada terrestre do Brasil - inclui EsPCEx, ESA, IME e outros',
        'FEDERAL',
        'EXERCITO',
        true,
        11
      )
      ON CONFLICT (sigla) DO NOTHING
      RETURNING id
    `;

    if (exercitoResult.length > 0) {
      const exercitoId = exercitoResult[0].id;
      console.log("   ✅ Exército criado");

      // Cargos/Escolas do Exército
      await sql`
        INSERT INTO cargos (concurso_id, nome, codigo, descricao, escolaridade, is_active, ordem)
        VALUES
          (${exercitoId}, 'EsPCEx - Cadete', 'ESPCEX', 'Escola Preparatória de Cadetes do Exército', 'MEDIO', true, 1),
          (${exercitoId}, 'ESA - Sargento', 'ESA', 'Escola de Sargentos das Armas', 'MEDIO', true, 2),
          (${exercitoId}, 'IME - Engenheiro Militar', 'IME', 'Instituto Militar de Engenharia', 'MEDIO', true, 3),
          (${exercitoId}, 'EsFCEx - Oficial', 'ESFCEX', 'Escola de Formação Complementar do Exército', 'SUPERIOR', true, 4),
          (${exercitoId}, 'Oficial Temporário', 'OFICIAL_TEMP_EB', 'Processo seletivo para oficiais temporários', 'SUPERIOR', true, 5)
        ON CONFLICT DO NOTHING
      `;
      console.log("   ✅ Cargos do Exército criados");
    } else {
      console.log("   ⚠️ Exército já existe");
    }

    // ============ MARINHA ============
    console.log("\n3️⃣ Criando Marinha do Brasil...");
    const marinhaResult = await sql`
      INSERT INTO concursos (nome, sigla, descricao, esfera, exam_type, is_active, ordem)
      VALUES (
        'Marinha do Brasil',
        'MARINHA',
        'Força Armada naval do Brasil - inclui Colégio Naval, Escola Naval, Fuzileiros Navais',
        'FEDERAL',
        'MARINHA',
        true,
        12
      )
      ON CONFLICT (sigla) DO NOTHING
      RETURNING id
    `;

    if (marinhaResult.length > 0) {
      const marinhaId = marinhaResult[0].id;
      console.log("   ✅ Marinha criada");

      await sql`
        INSERT INTO cargos (concurso_id, nome, codigo, descricao, escolaridade, is_active, ordem)
        VALUES
          (${marinhaId}, 'Colégio Naval', 'COLEGIO_NAVAL', 'Formação de oficiais desde o ensino médio', 'FUNDAMENTAL', true, 1),
          (${marinhaId}, 'Escola Naval - Aspirante', 'ESCOLA_NAVAL', 'Formação de oficiais de carreira', 'MEDIO', true, 2),
          (${marinhaId}, 'Fuzileiro Naval', 'FUZILEIRO_NAVAL', 'Tropa de elite anfíbia da Marinha', 'MEDIO', true, 3),
          (${marinhaId}, 'Aprendiz de Marinheiro', 'APRENDIZ_MARINHEIRO', 'Formação de praças da Marinha', 'FUNDAMENTAL', true, 4),
          (${marinhaId}, 'Quadro Técnico', 'QT_MARINHA', 'Oficiais técnicos com formação superior', 'SUPERIOR', true, 5)
        ON CONFLICT DO NOTHING
      `;
      console.log("   ✅ Cargos da Marinha criados");
    } else {
      console.log("   ⚠️ Marinha já existe");
    }

    // ============ FORÇA AÉREA ============
    console.log("\n4️⃣ Criando Força Aérea Brasileira...");
    const fabResult = await sql`
      INSERT INTO concursos (nome, sigla, descricao, esfera, exam_type, is_active, ordem)
      VALUES (
        'Força Aérea Brasileira',
        'FAB',
        'Força Armada aérea do Brasil - inclui ITA, EPCAR, EEAR',
        'FEDERAL',
        'FAB',
        true,
        13
      )
      ON CONFLICT (sigla) DO NOTHING
      RETURNING id
    `;

    if (fabResult.length > 0) {
      const fabId = fabResult[0].id;
      console.log("   ✅ FAB criada");

      await sql`
        INSERT INTO cargos (concurso_id, nome, codigo, descricao, escolaridade, is_active, ordem)
        VALUES
          (${fabId}, 'ITA - Engenheiro', 'ITA', 'Instituto Tecnológico de Aeronáutica', 'MEDIO', true, 1),
          (${fabId}, 'AFA - Cadete Aviador', 'AFA', 'Academia da Força Aérea', 'MEDIO', true, 2),
          (${fabId}, 'EPCAR - Cadete', 'EPCAR', 'Escola Preparatória de Cadetes do Ar', 'FUNDAMENTAL', true, 3),
          (${fabId}, 'EEAR - Sargento', 'EEAR', 'Escola de Especialistas de Aeronáutica', 'MEDIO', true, 4),
          (${fabId}, 'Oficial Temporário', 'OFICIAL_TEMP_FAB', 'Processo seletivo para oficiais temporários', 'SUPERIOR', true, 5)
        ON CONFLICT DO NOTHING
      `;
      console.log("   ✅ Cargos da FAB criados");
    } else {
      console.log("   ⚠️ FAB já existe");
    }

    // ============ RESUMO ============
    console.log("\n📊 RESUMO FINAL:");
    const concursos = await sql`
      SELECT c.sigla, c.nome, c.esfera, COUNT(cg.id) as total_cargos
      FROM concursos c
      LEFT JOIN cargos cg ON cg.concurso_id = c.id
      WHERE c.sigla IN ('ABIN', 'EXERCITO', 'MARINHA', 'FAB')
      GROUP BY c.id, c.sigla, c.nome, c.esfera
      ORDER BY c.ordem
    `;

    console.log("\n┌────────────┬─────────────────────────────────────┬──────────┬────────┐");
    console.log("│ Sigla      │ Nome                                │ Esfera   │ Cargos │");
    console.log("├────────────┼─────────────────────────────────────┼──────────┼────────┤");
    concursos.forEach((c) => {
      const sigla = c.sigla.padEnd(10);
      const nome = c.nome.substring(0, 35).padEnd(35);
      const esfera = c.esfera.padEnd(8);
      const cargos = String(c.total_cargos).padStart(6);
      console.log(`│ ${sigla} │ ${nome} │ ${esfera} │ ${cargos} │`);
    });
    console.log("└────────────┴─────────────────────────────────────┴──────────┴────────┘");

    await sql.end();
    console.log("\n🎉 Concluído!");
  } catch (error: any) {
    console.error("❌ Erro:", error.message);
    await sql.end();
    process.exit(1);
  }

  process.exit(0);
}

seedMilitaresAbin();
