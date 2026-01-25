// Script para adicionar outros concursos federais
import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function seedOutrosFederais() {
  console.log("🏛️ Adicionando outros concursos federais...\n");

  try {
    // ============ POLÍCIA FERROVIÁRIA FEDERAL ============
    console.log("1️⃣ Criando Polícia Ferroviária Federal...");
    const pffResult = await sql`
      INSERT INTO concursos (nome, sigla, descricao, esfera, exam_type, is_active, ordem)
      VALUES (
        'Polícia Ferroviária Federal',
        'PFF',
        'Polícia responsável pelo patrulhamento ostensivo das ferrovias federais',
        'FEDERAL',
        'PF_FERROVIARIA',
        true,
        14
      )
      ON CONFLICT (sigla) DO NOTHING
      RETURNING id
    `;

    if (pffResult.length > 0) {
      const pffId = pffResult[0].id;
      console.log("   ✅ PFF criada");

      await sql`
        INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, is_active, ordem)
        VALUES
          (${pffId}, 'Policial Ferroviário Federal', 'POLICIAL_FERROVIARIO', 'MEDIO', true, 1)
        ON CONFLICT DO NOTHING
      `;
      console.log("   ✅ Cargo da PFF criado");
    } else {
      console.log("   ⚠️ PFF já existe");
    }

    // ============ POLÍCIA JUDICIAL (CNJ) ============
    console.log("\n2️⃣ Criando Polícia Judicial do CNJ...");
    const pjResult = await sql`
      INSERT INTO concursos (nome, sigla, descricao, esfera, exam_type, is_active, ordem)
      VALUES (
        'Polícia Judicial do CNJ',
        'PJ_CNJ',
        'Polícia responsável pela segurança do Conselho Nacional de Justiça',
        'FEDERAL',
        'PJ_CNJ',
        true,
        15
      )
      ON CONFLICT (sigla) DO NOTHING
      RETURNING id
    `;

    if (pjResult.length > 0) {
      const pjId = pjResult[0].id;
      console.log("   ✅ PJ/CNJ criada");

      await sql`
        INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, is_active, ordem)
        VALUES
          (${pjId}, 'Policial Judicial', 'POLICIAL_JUDICIAL', 'SUPERIOR', true, 1),
          (${pjId}, 'Inspetor de Polícia Judicial', 'INSPETOR_PJ', 'SUPERIOR', true, 2)
        ON CONFLICT DO NOTHING
      `;
      console.log("   ✅ Cargos da PJ/CNJ criados");
    } else {
      console.log("   ⚠️ PJ/CNJ já existe");
    }

    // ============ ANAC ============
    console.log("\n3️⃣ Criando ANAC...");
    const anacResult = await sql`
      INSERT INTO concursos (nome, sigla, descricao, esfera, exam_type, is_active, ordem)
      VALUES (
        'Agência Nacional de Aviação Civil',
        'ANAC',
        'Agência reguladora da aviação civil no Brasil',
        'FEDERAL',
        'ANAC',
        true,
        16
      )
      ON CONFLICT (sigla) DO NOTHING
      RETURNING id
    `;

    if (anacResult.length > 0) {
      const anacId = anacResult[0].id;
      console.log("   ✅ ANAC criada");

      await sql`
        INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, is_active, ordem)
        VALUES
          (${anacId}, 'Especialista em Regulação de Aviação Civil', 'ESPECIALISTA_ANAC', 'SUPERIOR', true, 1),
          (${anacId}, 'Técnico em Regulação de Aviação Civil', 'TECNICO_ANAC', 'MEDIO', true, 2),
          (${anacId}, 'Analista Administrativo', 'ANALISTA_ANAC', 'SUPERIOR', true, 3)
        ON CONFLICT DO NOTHING
      `;
      console.log("   ✅ Cargos da ANAC criados");
    } else {
      console.log("   ⚠️ ANAC já existe");
    }

    // ============ MINISTÉRIO DA DEFESA ============
    console.log("\n4️⃣ Criando Ministério da Defesa...");
    const mdResult = await sql`
      INSERT INTO concursos (nome, sigla, descricao, esfera, exam_type, is_active, ordem)
      VALUES (
        'Ministério da Defesa',
        'MD',
        'Órgão do Governo Federal responsável pela política de defesa nacional',
        'FEDERAL',
        'MIN_DEFESA',
        true,
        17
      )
      ON CONFLICT (sigla) DO NOTHING
      RETURNING id
    `;

    if (mdResult.length > 0) {
      const mdId = mdResult[0].id;
      console.log("   ✅ Ministério da Defesa criado");

      await sql`
        INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, is_active, ordem)
        VALUES
          (${mdId}, 'Analista de Defesa', 'ANALISTA_DEFESA', 'SUPERIOR', true, 1),
          (${mdId}, 'Técnico de Defesa', 'TECNICO_DEFESA', 'MEDIO', true, 2)
        ON CONFLICT DO NOTHING
      `;
      console.log("   ✅ Cargos do Ministério da Defesa criados");
    } else {
      console.log("   ⚠️ Ministério da Defesa já existe");
    }

    // ============ CPNU (CNU) ============
    console.log("\n5️⃣ Criando CPNU (Concurso Nacional Unificado)...");
    const cpnuResult = await sql`
      INSERT INTO concursos (nome, sigla, descricao, esfera, exam_type, is_active, ordem)
      VALUES (
        'Concurso Público Nacional Unificado',
        'CPNU',
        'Concurso unificado para diversos órgãos federais (Enem dos Concursos)',
        'FEDERAL',
        'CPNU',
        true,
        18
      )
      ON CONFLICT (sigla) DO NOTHING
      RETURNING id
    `;

    if (cpnuResult.length > 0) {
      const cpnuId = cpnuResult[0].id;
      console.log("   ✅ CPNU criado");

      await sql`
        INSERT INTO cargos (concurso_id, nome, codigo, descricao, escolaridade, is_active, ordem)
        VALUES
          (${cpnuId}, 'Bloco 1 - Infraestrutura', 'CPNU_BLOCO1', 'Analista de Infraestrutura, Engenheiro', 'SUPERIOR', true, 1),
          (${cpnuId}, 'Bloco 2 - Tecnologia', 'CPNU_BLOCO2', 'Analista de TI, Desenvolvedor', 'SUPERIOR', true, 2),
          (${cpnuId}, 'Bloco 3 - Ambiental', 'CPNU_BLOCO3', 'Analista Ambiental, IBAMA, ICMBio', 'SUPERIOR', true, 3),
          (${cpnuId}, 'Bloco 4 - Trabalho e Saúde', 'CPNU_BLOCO4', 'Auditor do Trabalho, Anvisa', 'SUPERIOR', true, 4),
          (${cpnuId}, 'Bloco 5 - Educação e Cultura', 'CPNU_BLOCO5', 'Técnico e Analista em Educação', 'SUPERIOR', true, 5),
          (${cpnuId}, 'Bloco 6 - Segurança e Fronteiras', 'CPNU_BLOCO6', 'Funai, MJSP', 'SUPERIOR', true, 6),
          (${cpnuId}, 'Bloco 7 - Gestão Governamental', 'CPNU_BLOCO7', 'ENAP, Planejamento', 'SUPERIOR', true, 7),
          (${cpnuId}, 'Bloco 8 - Nível Médio', 'CPNU_BLOCO8', 'Diversos órgãos - nível médio', 'MEDIO', true, 8)
        ON CONFLICT DO NOTHING
      `;
      console.log("   ✅ Blocos do CPNU criados");
    } else {
      console.log("   ⚠️ CPNU já existe");
    }

    // ============ POLÍCIA CIENTÍFICA ============
    console.log("\n6️⃣ Criando Polícia Científica...");
    const pcResult = await sql`
      INSERT INTO concursos (nome, sigla, descricao, esfera, exam_type, is_active, ordem)
      VALUES (
        'Polícia Científica',
        'PC_CIENT',
        'Polícia Técnico-Científica estadual (Peritos, Papiloscopistas)',
        'ESTADUAL',
        'PC_CIENTIFICA',
        true,
        19
      )
      ON CONFLICT (sigla) DO NOTHING
      RETURNING id
    `;

    if (pcResult.length > 0) {
      const pcId = pcResult[0].id;
      console.log("   ✅ Polícia Científica criada");

      await sql`
        INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, is_active, ordem)
        VALUES
          (${pcId}, 'Perito Criminal', 'PERITO_CRIMINAL', 'SUPERIOR', true, 1),
          (${pcId}, 'Perito Médico-Legista', 'PERITO_LEGISTA', 'SUPERIOR', true, 2),
          (${pcId}, 'Perito Odonto-Legista', 'PERITO_ODONTO', 'SUPERIOR', true, 3),
          (${pcId}, 'Papiloscopista', 'PAPILOSCOPISTA', 'SUPERIOR', true, 4),
          (${pcId}, 'Técnico de Necropsia', 'TEC_NECROPSIA', 'MEDIO', true, 5),
          (${pcId}, 'Auxiliar de Perícia', 'AUX_PERICIA', 'MEDIO', true, 6)
        ON CONFLICT DO NOTHING
      `;
      console.log("   ✅ Cargos da Polícia Científica criados");
    } else {
      console.log("   ⚠️ Polícia Científica já existe");
    }

    // ============ GUARDA PORTUÁRIA ============
    console.log("\n7️⃣ Criando Guarda Portuária...");
    const gpResult = await sql`
      INSERT INTO concursos (nome, sigla, descricao, esfera, exam_type, is_active, ordem)
      VALUES (
        'Guarda Portuária',
        'GP',
        'Segurança dos portos brasileiros',
        'MUNICIPAL',
        'GP',
        true,
        20
      )
      ON CONFLICT (sigla) DO NOTHING
      RETURNING id
    `;

    if (gpResult.length > 0) {
      const gpId = gpResult[0].id;
      console.log("   ✅ Guarda Portuária criada");

      await sql`
        INSERT INTO cargos (concurso_id, nome, codigo, escolaridade, is_active, ordem)
        VALUES
          (${gpId}, 'Guarda Portuário', 'GUARDA_PORTUARIO', 'MEDIO', true, 1)
        ON CONFLICT DO NOTHING
      `;
      console.log("   ✅ Cargo da Guarda Portuária criado");
    } else {
      console.log("   ⚠️ Guarda Portuária já existe");
    }

    // ============ RESUMO FINAL ============
    console.log("\n" + "=".repeat(70));
    console.log("📊 TODOS OS CONCURSOS CADASTRADOS:");
    console.log("=".repeat(70));

    const todos = await sql`
      SELECT c.sigla, c.nome, c.esfera, COUNT(cg.id) as total_cargos
      FROM concursos c
      LEFT JOIN cargos cg ON cg.concurso_id = c.id
      GROUP BY c.id, c.sigla, c.nome, c.esfera, c.ordem
      ORDER BY c.esfera, c.ordem
    `;

    let currentEsfera = "";
    todos.forEach((c) => {
      if (c.esfera !== currentEsfera) {
        currentEsfera = c.esfera;
        console.log(`\n[${currentEsfera}]`);
      }
      console.log(`  ${c.sigla.padEnd(10)} ${c.nome.padEnd(40)} (${c.total_cargos} cargos)`);
    });

    const totalConcursos = todos.length;
    const totalCargos = todos.reduce((acc, c) => acc + Number(c.total_cargos), 0);
    console.log(`\n${"=".repeat(70)}`);
    console.log(`📈 TOTAL: ${totalConcursos} concursos, ${totalCargos} cargos`);
    console.log("=".repeat(70));

    await sql.end();
    console.log("\n🎉 Concluído!");
  } catch (error: any) {
    console.error("❌ Erro:", error.message);
    await sql.end();
    process.exit(1);
  }

  process.exit(0);
}

seedOutrosFederais();
