import type { Express } from "express";
import { db } from "../db";
import { editals, contentGenerationLog } from "../db/schema";
import { eq, and } from "drizzle-orm";

export function registerEditalRoutes(app: Express) {
  console.log("📚 Registrando rotas de editais...");

  // GET /api/admin/editals - Listar todos editais ativos
  app.get("/api/admin/editals", async (req, res) => {
    try {
      const allEditals = await db
        .select()
        .from(editals)
        .where(eq(editals.status, "active"));

      return res.json({
        success: true,
        editals: allEditals
      });
    } catch (error: any) {
      console.error("❌ Erro ao listar editais:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao carregar editais"
      });
    }
  });

  // GET /api/admin/content/generated-topics - Listar tópicos já gerados
  app.get("/api/admin/content/generated-topics", async (req, res) => {
    try {
      const logs = await db
        .select()
        .from(contentGenerationLog)
        .where(eq(contentGenerationLog.status, "used"));

      const topics = logs.map(log => 
        `${log.examType}-${log.subject}-${log.topic}`
      );

      return res.json({
        success: true,
        topics
      });
    } catch (error: any) {
      console.error("❌ Erro ao listar tópicos gerados:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao carregar tópicos"
      });
    }
  });

  // POST /api/admin/content/log-generation - Registrar geração
  app.post("/api/admin/content/log-generation", async (req, res) => {
    try {
      const { examType, subject, topic, contentId } = req.body;

      if (!examType || !subject || !topic) {
        return res.status(400).json({
          success: false,
          error: "Dados incompletos"
        });
      }

      await db.insert(contentGenerationLog).values({
        examType,
        subject,
        topic,
        contentId: contentId || null,
        status: "used"
      });

      return res.json({
        success: true
      });
    } catch (error: any) {
      console.error("❌ Erro ao registrar geração:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao registrar"
      });
    }
  });

  console.log("✅ Rotas de editais registradas!");
}
