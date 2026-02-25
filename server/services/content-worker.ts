/**
 * Content Worker — Worker de Background para pré-popular conteúdo e questões
 *
 * Responsável por:
 * - Para editais prioritários (PF, PRF, PM_SP), garantir ao menos
 *   MIN_CONTENT_PER_SUBJECT itens de Content por matéria do edital
 * - Para cada Content sem questão, gerar Question via Anthropic Haiku
 *
 * Roda em background (fire-and-forget) no startup do servidor Railway.
 * Também pode ser chamado on-demand via prepareEdital(sigla) quando
 * o aluno seleciona um concurso.
 */

import { db } from "../../db";
import { sql } from "drizzle-orm";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MIN_CONTENT_PER_SUBJECT = 5;
const STARTUP_SIGLAS = ["PF", "PRF", "PM_SP"];
const THROTTLE_MS = 2500;

// ============================================
// EXPORTS PÚBLICOS
// ============================================

/**
 * Roda na startup do servidor (após delay de 60s para aguardar DB).
 * Processa os 3 editais prioritários em sequência.
 */
export async function startContentWorker(): Promise<void> {
  // Aguardar DB e demais serviços ficarem prontos
  await new Promise(r => setTimeout(r, 60_000));
  console.log("🔄 [ContentWorker] Iniciando ciclo de startup...");

  for (const sigla of STARTUP_SIGLAS) {
    await processEdital(sigla).catch(e =>
      console.error(`❌ [ContentWorker] Erro no edital ${sigla}:`, e?.message ?? e),
    );
  }
  console.log("✅ [ContentWorker] Ciclo de startup concluído");
}

/**
 * Processa um edital específico por sigla (chamado on-demand ao selecionar concurso).
 * Não tem delay — roda imediatamente.
 */
export async function prepareEdital(sigla: string): Promise<void> {
  console.log(`🔄 [ContentWorker] Preparando edital: ${sigla}`);
  await processEdital(sigla).catch(e =>
    console.error(`❌ [ContentWorker] Erro ao preparar ${sigla}:`, e?.message ?? e),
  );
  console.log(`✅ [ContentWorker] Edital ${sigla} preparado`);
}

// ============================================
// LÓGICA INTERNA
// ============================================

async function processEdital(sigla: string): Promise<void> {
  // 1. Buscar concurso e suas matérias
  const concursoRows = await db.execute(sql`
    SELECT id, nome, banca, cargo_padrao, exam_type, lista_materias_json
    FROM concursos
    WHERE sigla = ${sigla} AND is_active = true
    LIMIT 1
  `) as any[];

  if (!concursoRows[0]) {
    console.warn(`⚠️ [ContentWorker] Concurso ${sigla} não encontrado no banco`);
    return;
  }

  const concurso = concursoRows[0];
  const materias: any[] = Array.isArray(concurso.lista_materias_json)
    ? concurso.lista_materias_json
    : (typeof concurso.lista_materias_json === "string"
      ? JSON.parse(concurso.lista_materias_json)
      : []);

  if (materias.length === 0) {
    console.warn(`⚠️ [ContentWorker] Concurso ${sigla} sem matérias definidas`);
    return;
  }

  console.log(`📚 [ContentWorker] ${sigla}: processando ${materias.length} matérias...`);

  for (const materia of materias) {
    try {
      await processMateria(materia, concurso);
    } catch (err: any) {
      console.error(`❌ [ContentWorker] Erro na matéria ${materia.name}:`, err?.message ?? err);
    }
  }
}

async function processMateria(materia: any, concurso: any): Promise<void> {
  const materiaName: string = materia.name || "";
  if (!materiaName) return;

  // Buscar Subject correspondente no banco
  const subjectRows = await db.execute(sql`
    SELECT id FROM "Subject"
    WHERE name ILIKE ${"%" + materiaName + "%"}
    LIMIT 1
  `) as any[];

  if (!subjectRows[0]) {
    // Subject não existe — não criar automaticamente (evitar poluição)
    return;
  }
  const subjectId: string = subjectRows[0].id;

  // Contar Content existentes
  const countRows = await db.execute(sql`
    SELECT COUNT(*)::int AS cnt FROM "Content"
    WHERE "subjectId" = ${subjectId} AND "isActive" = true
  `) as any[];
  const existingCount: number = parseInt(countRows[0]?.cnt ?? "0", 10);

  // Gerar Content faltante
  const toGenerate = Math.max(0, MIN_CONTENT_PER_SUBJECT - existingCount);
  if (toGenerate > 0) {
    console.log(`  📝 [ContentWorker] ${materiaName}: ${existingCount} existentes, gerando ${toGenerate} novos...`);
    for (let i = 0; i < toGenerate; i++) {
      const contentId = await generateAndInsertContent(subjectId, materiaName, concurso);
      if (contentId) {
        await generateAndInsertQuestion(contentId, materiaName, concurso);
      }
      await throttle();
    }
  }

  // Gerar questões para Content sem questão AI (até 5 por vez)
  // Usa Drizzle `questions` (snake_case) pois "Question" Prisma não tem contentId
  const withoutQuestion = await db.execute(sql`
    SELECT c.id, c.title, c."textContent" AS body FROM "Content" c
    LEFT JOIN questions q ON q.content_id = c.id
    WHERE c."subjectId" = ${subjectId} AND c."isActive" = true AND q.id IS NULL
    LIMIT 5
  `) as any[];

  for (const content of withoutQuestion) {
    await generateAndInsertQuestion(content.id, content.title, concurso, content.body);
    await throttle();
  }
}

async function generateAndInsertContent(
  subjectId: string,
  materiaName: string,
  concurso: any,
): Promise<string | null> {
  try {
    const resp = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 700,
      messages: [{
        role: "user",
        content: `Você é professor especialista em concursos policiais.
Gere um tópico educacional objetivo sobre "${materiaName}" para o concurso "${concurso.nome}" (banca: ${concurso.banca}, cargo: ${concurso.cargo_padrao}).

Responda APENAS em JSON válido, sem markdown:
{"titulo": "título específico do tópico", "conteudo": "Explicação em 2-4 parágrafos. PONTOS-CHAVE:\\n• ponto 1\\n• ponto 2\\n• ponto 3\\n\\nEXEMPLO:\\nDescrição de um caso real ou situação prática.\\n\\nDICA:\\nComo esse tema costuma cair em provas da banca ${concurso.banca}."}`,
      }],
    });

    const raw = resp.content[0].type === "text" ? resp.content[0].text.trim() : "";
    if (!raw) return null;

    // Limpar possível markdown wrapper
    const cleaned = raw.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed.titulo || !parsed.conteudo) return null;

    const inserted = await db.execute(sql`
      INSERT INTO "Content" (title, "textContent", "subjectId", "isActive", "createdAt", "updatedAt")
      VALUES (
        ${parsed.titulo},
        ${parsed.conteudo},
        ${subjectId},
        true,
        NOW(), NOW()
      )
      RETURNING id
    `) as any[];

    const contentId = inserted[0]?.id;
    if (contentId) {
      console.log(`    ✅ [ContentWorker] Content criado: "${parsed.titulo}"`);
    }
    return contentId || null;
  } catch (err: any) {
    console.error(`    ❌ [ContentWorker] Erro ao gerar content para ${materiaName}:`, err?.message ?? err);
    return null;
  }
}

async function generateAndInsertQuestion(
  contentId: string,
  title: string,
  concurso: any,
  bodyOverride?: string,
): Promise<void> {
  try {
    // Buscar body se não foi passado
    let body = bodyOverride;
    if (!body) {
      const contentRows = await db.execute(sql`
        SELECT "textContent" AS body FROM "Content" WHERE id = ${contentId} LIMIT 1
      `) as any[];
      body = contentRows[0]?.body || title;
    }

    const bodyExcerpt = (body || "").substring(0, 500);

    const resp = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [{
        role: "user",
        content: `Crie UMA questão de múltipla escolha estilo banca ${concurso.banca} sobre:
TEMA: ${title}
CONTEÚDO: ${bodyExcerpt}

Responda APENAS em JSON válido:
{"pergunta": "enunciado da questão", "opcoes": ["A) texto", "B) texto", "C) texto", "D) texto"], "correta": 0, "explicacao": "Por que a alternativa correta está certa."}`,
      }],
    });

    const raw = resp.content[0].type === "text" ? resp.content[0].text.trim() : "";
    if (!raw) return;

    const cleaned = raw.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();
    const q = JSON.parse(cleaned);

    if (!q.pergunta || !Array.isArray(q.opcoes) || q.opcoes.length < 2) return;

    // Normalizar opções (garantir A) B) C) D) prefix)
    const opts = q.opcoes.slice(0, 4).map((o: string, i: number) => {
      const prefix = String.fromCharCode(65 + i) + ") ";
      return String(o).startsWith(prefix) ? String(o) : prefix + String(o);
    });

    // Persistir na tabela Drizzle `questions` (snake_case) — alinhado com question-engine T4
    const correctLetter = ["A", "B", "C", "D"][typeof q.correta === "number" ? q.correta : 0] ?? "A";
    await db.execute(sql`
      INSERT INTO questions (
        content_id, question_text,
        option_a, option_b, option_c, option_d,
        correct_answer, explanation, generated_by_ai,
        created_at, updated_at
      ) VALUES (
        ${contentId}, ${q.pergunta},
        ${opts[0] || ""}, ${opts[1] || ""}, ${opts[2] || ""}, ${opts[3] || ""},
        ${correctLetter},
        ${q.explicacao || ""},
        true, NOW(), NOW()
      )
      ON CONFLICT DO NOTHING
    `);
  } catch (err: any) {
    console.error(`    ❌ [ContentWorker] Erro ao gerar questão para ${title}:`, err?.message ?? err);
  }
}

function throttle(): Promise<void> {
  return new Promise(r => setTimeout(r, THROTTLE_MS));
}
