// Script para criar conteúdo de teste na nova estrutura
import "dotenv/config";
import postgres from "postgres";

async function createTestContent() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL não definida");
    process.exit(1);
  }

  const sql = postgres(process.env.DATABASE_URL);

  console.log("📝 Criando conteúdo de teste...\n");

  try {
    // 1. Verificar se já existe conteúdo com esse título
    const existing = await sql`
      SELECT id FROM "Content" WHERE title = 'Teoria Geral do Crime - Conceito e Elementos'
    `;

    if (existing.length > 0) {
      console.log("⚠️ Conteúdo já existe. Pulando criação.\n");
      console.log("   ID:", existing[0].id);
    } else {
      // 2. Buscar o subject de Direito Penal
      const direitoPenal = await sql`
        SELECT id FROM "Subject" WHERE name = 'DIR_PENAL' LIMIT 1
      `;

      if (direitoPenal.length === 0) {
        console.error("❌ Subject DIR_PENAL não encontrado!");
        await sql.end();
        process.exit(1);
      }

      const subjectId = direitoPenal[0].id;
      console.log("📚 Subject encontrado:", subjectId, "\n");

      // 3. Criar o conteúdo
      console.log("1️⃣ Criando conteúdo de Direito Penal...");

      const contentId = `content_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const textContent = `O crime é definido como fato típico, ilícito (antijurídico) e culpável. Este conceito tripartido é fundamental para a compreensão do Direito Penal brasileiro.

## Fato Típico
O fato típico engloba a conduta, o resultado, o nexo causal e a tipicidade. É a adequação da conduta humana a um tipo penal previsto em lei.

## Ilicitude (Antijuridicidade)
A ilicitude representa a contrariedade do fato com o ordenamento jurídico como um todo. São excludentes de ilicitude:
- Legítima defesa
- Estado de necessidade
- Estrito cumprimento do dever legal
- Exercício regular de direito

## Culpabilidade
A culpabilidade é o juízo de reprovação pessoal que recai sobre o autor do fato. Seus elementos são:
- Imputabilidade
- Potencial consciência da ilicitude
- Exigibilidade de conduta diversa

**DICA CEBRASPE:** O examinador costuma cobrar a diferença entre excludentes de ilicitude e culpabilidade. Nas excludentes de ilicitude o fato não é crime; nas excludentes de culpabilidade o fato é crime, mas o agente não é punido.`;

      const wordCount = textContent.split(/\s+/).length;
      const estimatedReadTime = Math.ceil(wordCount / 200); // ~200 palavras por minuto

      await sql`
        INSERT INTO "Content" (
          id, "subjectId", title, "textContent", difficulty,
          "wordCount", "estimatedReadTime", "isActive", version,
          "createdAt", "updatedAt"
        ) VALUES (
          ${contentId}, ${subjectId}, 'Teoria Geral do Crime - Conceito e Elementos',
          ${textContent}, 'MEDIO',
          ${wordCount}, ${estimatedReadTime}, true, 1,
          NOW(), NOW()
        )
      `;

      console.log("   ✅ Conteúdo criado com ID:", contentId, "\n");

      // 4. Criar questão vinculada ao conteúdo
      console.log("2️⃣ Criando questão de teste...");

      const questionId = `question_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const alternatives = JSON.stringify([
        { letter: "A", text: "Fato típico e antijurídico" },
        { letter: "B", text: "Fato típico, ilícito e culpável" },
        { letter: "C", text: "Conduta humana voluntária que causa resultado lesivo" },
        { letter: "D", text: "Ação ou omissão prevista em lei como infração penal" },
        { letter: "E", text: "Violação de bem jurídico penalmente tutelado" }
      ]);

      const wrongExplanations = JSON.stringify({
        "A": "A teoria bipartida define crime como fato típico e antijurídico, mas não é a teoria adotada majoritariamente no Brasil.",
        "C": "Esta definição é muito genérica e não corresponde ao conceito técnico de crime.",
        "D": "Esta é a definição legal de infração penal, não o conceito doutrinário de crime.",
        "E": "Esta é uma consequência do crime, não sua definição técnica."
      });

      await sql`
        INSERT INTO "Question" (
          id, "subjectId", statement, "questionType", alternatives,
          "correctAnswer", explanation, "wrongExplanations", difficulty,
          "examBoard", tags, "isActive", "timesUsed",
          "createdAt", "updatedAt"
        ) VALUES (
          ${questionId}, ${subjectId},
          'Segundo a teoria tripartida do crime, adotada pelo Código Penal brasileiro, crime é:',
          'MULTIPLA_ESCOLHA', ${alternatives}::jsonb,
          'B',
          'A teoria tripartida (ou finalista) define crime como fato típico, ilícito (antijurídico) e culpável. Esta é a corrente majoritária na doutrina brasileira e adotada pelo STF. A alternativa A representa a teoria bipartida, que não inclui a culpabilidade como elemento do crime.',
          ${wrongExplanations}::jsonb, 'MEDIO',
          'CEBRASPE', '["direito penal", "teoria do crime", "PF"]'::jsonb,
          true, 0,
          NOW(), NOW()
        )
      `;
      console.log("   ✅ Questão criada com ID:", questionId, "\n");

      // 5. Vincular conteúdo ao cargo de Agente PF
      console.log("3️⃣ Vinculando conteúdo ao cargo de Agente PF...");

      // Buscar o cargo AGENTE_PF
      const cargo = await sql`
        SELECT id FROM cargos WHERE codigo = 'AGENTE_PF' LIMIT 1
      `;

      if (cargo.length === 0) {
        console.log("   ⚠️ Cargo AGENTE_PF não encontrado. Pulando vinculação.");
      } else {
        const cargoId = cargo[0].id;

        // Buscar a matéria DIREITO_PENAL para este cargo
        const materia = await sql`
          SELECT id FROM cargo_materias
          WHERE cargo_id = ${cargoId} AND codigo = 'DIREITO_PENAL'
          LIMIT 1
        `;

        if (materia.length === 0) {
          console.log("   ⚠️ Matéria DIREITO_PENAL não encontrada para este cargo.");
        } else {
          // Inserir vínculo
          await sql`
            INSERT INTO conteudo_cargos (content_id, cargo_id, cargo_materia_id)
            VALUES (${contentId}, ${cargoId}, ${materia[0].id})
            ON CONFLICT DO NOTHING
          `;
          console.log("   ✅ Conteúdo vinculado ao cargo Agente PF\n");
        }
      }
    }

    // 6. Verificar resultado
    console.log("📊 Verificando conteúdo criado...\n");

    const content = await sql`
      SELECT
        c.id,
        c.title,
        s.name as subject,
        c.difficulty,
        c."wordCount",
        c."isActive"
      FROM "Content" c
      JOIN "Subject" s ON s.id = c."subjectId"
      WHERE c.title = 'Teoria Geral do Crime - Conceito e Elementos'
    `;

    if (content.length > 0) {
      console.log("📄 Conteúdo:");
      console.log(`   ID: ${content[0].id}`);
      console.log(`   Título: ${content[0].title}`);
      console.log(`   Matéria: ${content[0].subject}`);
      console.log(`   Dificuldade: ${content[0].difficulty}`);
      console.log(`   Palavras: ${content[0].wordCount}`);
      console.log(`   Ativo: ${content[0].isActive}`);
    }

    const questions = await sql`
      SELECT COUNT(*) as total
      FROM "Question"
      WHERE statement LIKE '%teoria tripartida%'
    `;
    console.log(`\n📝 Questões relacionadas: ${questions[0].total}`);

    // Verificar vinculação
    const vinculos = await sql`
      SELECT
        con.sigla as concurso,
        cg.nome as cargo,
        cm.nome as materia
      FROM conteudo_cargos cc
      JOIN cargos cg ON cg.id = cc.cargo_id
      JOIN concursos con ON con.id = cg.concurso_id
      LEFT JOIN cargo_materias cm ON cm.id = cc.cargo_materia_id
      WHERE cc.content_id = (
        SELECT id FROM "Content" WHERE title = 'Teoria Geral do Crime - Conceito e Elementos' LIMIT 1
      )
    `;

    if (vinculos.length > 0) {
      console.log("\n🔗 Vinculações:");
      vinculos.forEach(v => {
        console.log(`   ${v.concurso} > ${v.cargo} > ${v.materia}`);
      });
    }

    console.log("\n🎉 Conteúdo de teste criado com sucesso!");

    await sql.end();
  } catch (error: any) {
    console.error("❌ Erro ao criar conteúdo:", error.message);
    await sql.end();
    process.exit(1);
  }

  process.exit(0);
}

createTestContent();
