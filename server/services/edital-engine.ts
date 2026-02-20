/**
 * Edital Engine — Inteligência de Editais de Concursos
 *
 * Responsável por:
 * - Buscar informações de editais de concursos no banco
 * - Quando não encontrado, usar Anthropic API (Haiku) para inferir
 *   matérias e banca com base no último edital real publicado
 * - Persistir o resultado para reutilização
 */

import Anthropic from "@anthropic-ai/sdk";
import { db } from "../../db";
import { sql } from "drizzle-orm";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ============================================
// INTERFACES
// ============================================

export interface EditalMateria {
  name: string;      // "Direito Penal"
  weight: number;    // 1-3
  questions: number; // número de questões típico no edital
  topics: string[];
}

export interface EditalInfo {
  id: string;
  nome: string;
  sigla: string;
  banca: string;
  cargo_padrao: string;
  estado: string | null;
  lista_materias_json: EditalMateria[];
}

// Mapeamento de palavras-chave → exam_type (para UPSERT)
const EXAM_TYPE_KEYWORDS: Record<string, string> = {
  "policia federal": "PF",
  " pf ": "PF",
  "prf": "PRF",
  "rodoviaria": "PRF",
  "policia militar": "PM",
  "pm ": "PM",
  "policia civil": "PC",
  "policia penal federal": "PP_FEDERAL",
  "policia penal estadual": "PP_ESTADUAL",
  "policia penal": "PP_ESTADUAL",
  "bombeiro": "CBM",
  "guarda municipal": "GM",
  "abin": "ABIN",
};

function inferExamType(nome: string, sigla: string): string {
  const lower = nome.toLowerCase();
  for (const [key, val] of Object.entries(EXAM_TYPE_KEYWORDS)) {
    if (lower.includes(key)) return val;
  }
  // Fallback: mapear sigla
  const siglaMap: Record<string, string> = {
    PF: "PF", PRF: "PRF", PM: "PM", PC: "PC",
    PPF: "PP_FEDERAL", PPE: "PP_ESTADUAL",
    CBM: "CBM", GM: "GM", ABIN: "ABIN",
  };
  return siglaMap[sigla.toUpperCase()] || "OUTRO";
}

// ============================================
// FUNÇÃO PRINCIPAL
// ============================================

/**
 * Retorna as informações do edital de um concurso.
 *
 * Fluxo:
 *  1. Busca na tabela `concursos` pelo nome (e opcionalmente estado)
 *  2. Se encontrado com matérias → retorna do banco (cache)
 *  3. Se não encontrado → chama Anthropic Haiku para inferir do último edital
 *  4. Persiste no banco e retorna
 */
export async function getOrSearchEdital(
  concursoNome: string,
  estado?: string,
): Promise<EditalInfo | null> {
  // 1. Buscar no banco
  const rows = await db.execute(sql`
    SELECT id, nome, sigla, banca, cargo_padrao, estado, lista_materias_json
    FROM concursos
    WHERE nome ILIKE ${`%${concursoNome}%`}
      ${estado ? sql`AND estado = ${estado}` : sql``}
      AND is_active = true
    ORDER BY updated_at DESC
    LIMIT 1
  `) as any[];

  if (rows.length > 0) {
    const row = rows[0];
    const materias = Array.isArray(row.lista_materias_json)
      ? row.lista_materias_json
      : (typeof row.lista_materias_json === "string"
          ? JSON.parse(row.lista_materias_json)
          : []);

    if (materias.length > 0) {
      console.log(`📋 [Edital] Encontrado no banco: ${row.nome}`);
      return {
        id: row.id,
        nome: row.nome,
        sigla: row.sigla,
        banca: row.banca || "",
        cargo_padrao: row.cargo_padrao || "",
        estado: row.estado || null,
        lista_materias_json: materias,
      };
    }
  }

  // 2. Não encontrado ou sem matérias → consultar Anthropic Haiku
  console.log(`🔍 [Edital] Consultando Anthropic para: ${concursoNome}${estado ? ` (${estado})` : ""}`);

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 900,
      messages: [{
        role: "user",
        content: `Você é especialista em concursos policiais e de segurança pública brasileiros.

Baseado no último edital publicado do concurso: "${concursoNome}"${estado ? ` do estado ${estado}` : ""}.

Liste as matérias cobradas, com peso relativo (1=baixo, 2=médio, 3=alto) e número de questões típico.
Identifique também a banca organizadora mais recente e o cargo principal.

Responda APENAS em JSON válido, sem markdown:
{
  "nome": "nome oficial completo do concurso",
  "sigla": "SIGLA_CURTA",
  "banca": "nome da banca organizadora",
  "cargo": "nome do cargo principal",
  "esfera": "FEDERAL ou ESTADUAL ou MUNICIPAL",
  "materias": [
    {"name": "Direito Penal", "weight": 2, "questions": 20, "topics": []},
    {"name": "Língua Portuguesa", "weight": 1, "questions": 15, "topics": []}
  ]
}

Use dados reais de editais publicados. Se não souber com certeza, estime com base em concursos similares.`,
      }],
    });

    const raw = response.content[0].type === "text" ? response.content[0].text : "";
    const parsed = JSON.parse(raw.trim());

    if (!parsed.materias || !Array.isArray(parsed.materias) || parsed.materias.length === 0) {
      console.warn("⚠️ [Edital] Anthropic retornou sem matérias");
      return null;
    }

    const sigla = (parsed.sigla || concursoNome.substring(0, 10).toUpperCase().replace(/\s+/g, "_")).trim();
    const examType = inferExamType(parsed.nome || concursoNome, sigla);
    const esfera = parsed.esfera || "ESTADUAL";
    const materiasJson = JSON.stringify(parsed.materias);

    // 3. Upsert no banco
    const upserted = await db.execute(sql`
      INSERT INTO concursos (nome, sigla, esfera, exam_type, estado, banca, cargo_padrao, lista_materias_json, created_at, updated_at)
      VALUES (
        ${parsed.nome || concursoNome},
        ${sigla},
        ${esfera},
        ${examType},
        ${estado || null},
        ${parsed.banca || ""},
        ${parsed.cargo || ""},
        ${materiasJson}::jsonb,
        NOW(), NOW()
      )
      ON CONFLICT (sigla) DO UPDATE SET
        banca = EXCLUDED.banca,
        cargo_padrao = EXCLUDED.cargo_padrao,
        lista_materias_json = EXCLUDED.lista_materias_json,
        estado = COALESCE(concursos.estado, EXCLUDED.estado),
        updated_at = NOW()
      RETURNING id, nome, sigla, banca, cargo_padrao, estado, lista_materias_json
    `) as any[];

    if (upserted.length === 0) return null;

    const saved = upserted[0];
    const savedMaterias = typeof saved.lista_materias_json === "string"
      ? JSON.parse(saved.lista_materias_json)
      : saved.lista_materias_json;

    console.log(`✅ [Edital] Persistido: ${saved.nome} (${savedMaterias.length} matérias)`);
    return {
      id: saved.id,
      nome: saved.nome,
      sigla: saved.sigla,
      banca: saved.banca || "",
      cargo_padrao: saved.cargo_padrao || "",
      estado: saved.estado || null,
      lista_materias_json: savedMaterias,
    };
  } catch (err: any) {
    console.error("❌ [Edital] Erro ao consultar Anthropic:", err?.message ?? err);
    return null;
  }
}
