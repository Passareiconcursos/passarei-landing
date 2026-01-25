/**
 * API de Concursos, Cargos e Matérias
 *
 * Endpoints:
 * - GET /api/concursos - Lista todos os concursos ativos
 * - GET /api/concursos/:sigla - Detalhes de um concurso
 * - GET /api/concursos/:sigla/cargos - Lista cargos de um concurso
 * - GET /api/cargos/:id/materias - Lista matérias de um cargo
 */

import { Express } from "express";
import { db } from "../db";
import { sql } from "drizzle-orm";

// Cache simples para performance
let concursosCache: any[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

async function getConcursosFromDB() {
  const now = Date.now();

  // Retorna cache se ainda válido
  if (concursosCache && (now - cacheTimestamp) < CACHE_TTL) {
    return concursosCache;
  }

  const result = await db.execute(sql`
    SELECT
      id,
      nome,
      sigla,
      descricao,
      esfera,
      exam_type as "examType",
      edital_url as "editalUrl",
      site_oficial as "siteOficial",
      is_active as "isActive",
      ordem
    FROM concursos
    WHERE is_active = true
    ORDER BY ordem, esfera, nome
  `);

  concursosCache = result as any[];
  cacheTimestamp = now;

  return concursosCache;
}

async function getCargosFromDB(concursoSigla: string) {
  const result = await db.execute(sql`
    SELECT
      cg.id,
      cg.nome,
      cg.codigo,
      cg.descricao,
      cg.escolaridade,
      cg.requisitos,
      cg.is_active as "isActive",
      cg.ordem,
      c.sigla as "concursoSigla",
      c.nome as "concursoNome"
    FROM cargos cg
    JOIN concursos c ON c.id = cg.concurso_id
    WHERE c.sigla = ${concursoSigla}
      AND cg.is_active = true
      AND c.is_active = true
    ORDER BY cg.ordem, cg.nome
  `);

  return result;
}

async function getMateriasFromDB(cargoId: string) {
  const result = await db.execute(sql`
    SELECT
      cm.id,
      cm.nome,
      cm.codigo,
      cm.descricao,
      cm.peso,
      cm.quantidade_questoes as "quantidadeQuestoes",
      cm.topicos,
      cm.is_active as "isActive",
      cm.ordem,
      cg.nome as "cargoNome",
      cg.codigo as "cargoCodigo",
      c.sigla as "concursoSigla"
    FROM cargo_materias cm
    JOIN cargos cg ON cg.id = cm.cargo_id
    JOIN concursos c ON c.id = cg.concurso_id
    WHERE cm.cargo_id = ${cargoId}
      AND cm.is_active = true
    ORDER BY cm.ordem, cm.nome
  `);

  return result;
}

async function getConcursoBySlug(sigla: string) {
  const result = await db.execute(sql`
    SELECT
      c.id,
      c.nome,
      c.sigla,
      c.descricao,
      c.esfera,
      c.exam_type as "examType",
      c.edital_url as "editalUrl",
      c.site_oficial as "siteOficial",
      c.is_active as "isActive",
      (SELECT COUNT(*) FROM cargos WHERE concurso_id = c.id AND is_active = true) as "totalCargos"
    FROM concursos c
    WHERE c.sigla = ${sigla}
      AND c.is_active = true
    LIMIT 1
  `);

  return result[0] || null;
}

// Limpar cache (útil após atualizações)
export function clearConcursosCache() {
  concursosCache = null;
  cacheTimestamp = 0;
}

export function registerConcursosRoutes(app: Express) {
  /**
   * GET /api/concursos
   * Lista todos os concursos ativos, agrupados por esfera
   */
  app.get("/api/concursos", async (req, res) => {
    try {
      const concursos = await getConcursosFromDB();

      // Agrupar por esfera para facilitar no frontend
      const grouped = {
        FEDERAL: concursos.filter((c: any) => c.esfera === "FEDERAL"),
        ESTADUAL: concursos.filter((c: any) => c.esfera === "ESTADUAL"),
        MUNICIPAL: concursos.filter((c: any) => c.esfera === "MUNICIPAL"),
      };

      res.json({
        success: true,
        data: concursos,
        grouped,
        total: concursos.length,
      });
    } catch (error: any) {
      console.error("[concursos-routes] Erro ao listar concursos:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao buscar concursos",
        message: error.message,
      });
    }
  });

  /**
   * GET /api/concursos/:sigla
   * Detalhes de um concurso específico
   */
  app.get("/api/concursos/:sigla", async (req, res) => {
    try {
      const { sigla } = req.params;
      const concurso = await getConcursoBySlug(sigla.toUpperCase());

      if (!concurso) {
        return res.status(404).json({
          success: false,
          error: "Concurso não encontrado",
        });
      }

      res.json({
        success: true,
        data: concurso,
      });
    } catch (error: any) {
      console.error("[concursos-routes] Erro ao buscar concurso:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao buscar concurso",
        message: error.message,
      });
    }
  });

  /**
   * GET /api/concursos/:sigla/cargos
   * Lista cargos de um concurso
   */
  app.get("/api/concursos/:sigla/cargos", async (req, res) => {
    try {
      const { sigla } = req.params;
      const cargos = await getCargosFromDB(sigla.toUpperCase());

      res.json({
        success: true,
        data: cargos,
        total: (cargos as any[]).length,
        concurso: sigla.toUpperCase(),
      });
    } catch (error: any) {
      console.error("[concursos-routes] Erro ao listar cargos:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao buscar cargos",
        message: error.message,
      });
    }
  });

  /**
   * GET /api/cargos/:id/materias
   * Lista matérias de um cargo
   */
  app.get("/api/cargos/:id/materias", async (req, res) => {
    try {
      const { id } = req.params;
      const materias = await getMateriasFromDB(id);

      res.json({
        success: true,
        data: materias,
        total: (materias as any[]).length,
        cargoId: id,
      });
    } catch (error: any) {
      console.error("[concursos-routes] Erro ao listar matérias:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao buscar matérias",
        message: error.message,
      });
    }
  });

  /**
   * GET /api/concursos-stats
   * Estatísticas gerais (para dashboard admin)
   */
  app.get("/api/concursos-stats", async (req, res) => {
    try {
      const stats = await db.execute(sql`
        SELECT
          (SELECT COUNT(*) FROM concursos WHERE is_active = true) as "totalConcursos",
          (SELECT COUNT(*) FROM cargos WHERE is_active = true) as "totalCargos",
          (SELECT COUNT(*) FROM cargo_materias WHERE is_active = true) as "totalMaterias",
          (SELECT COUNT(*) FROM conteudo_cargos) as "totalVinculos",
          (SELECT COUNT(*) FROM "Content" WHERE "isActive" = true) as "totalConteudos",
          (SELECT COUNT(*) FROM "Question") as "totalQuestoes"
      `);

      res.json({
        success: true,
        data: stats[0],
      });
    } catch (error: any) {
      console.error("[concursos-routes] Erro ao buscar stats:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao buscar estatísticas",
        message: error.message,
      });
    }
  });

  console.log("✅ Rotas de Concursos registradas");
}

// Exportar funções para uso no Telegram bot
export { getConcursosFromDB, getCargosFromDB, getMateriasFromDB };
