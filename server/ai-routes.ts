import type { Express } from "express";
import { db } from "../db";
import { content, admins } from "../db/schema";
import { requireAuth } from "./middleware-supabase";

export function registerAIRoutes(app: Express) {
  console.log("🤖 Registrando rotas de IA...");

  app.post("/api/admin/ai/generate-content", requireAuth, async (req, res) => {
    try {
      const { subject, examType, topic } = req.body;
      if (!subject || !examType || !topic) {
        return res.status(400).json({
          success: false,
          error: "Campos obrigatórios: subject, examType, topic",
        });
      }
      console.log("🤖 Gerando conteúdo:", { subject, examType, topic });
      const { generateContent } = await import("./ai-service");
      const generatedContent = await generateContent({
        subject,
        examType,
        topic,
      });
      console.log("✅ Conteúdo gerado:", generatedContent.title);
      return res.json({ success: true, content: generatedContent });
    } catch (error: any) {
      console.error("❌ Erro ao gerar conteúdo:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao gerar conteúdo",
        details: error.message,
      });
    }
  });

  app.post("/api/admin/ai/generate-questions", requireAuth, async (req, res) => {
    try {
      const { contentTitle, contentBody, subject } = req.body;
      if (!contentTitle || !contentBody || !subject) {
        return res.status(400).json({
          success: false,
          error: "Campos obrigatórios: contentTitle, contentBody, subject",
        });
      }
      console.log("🤖 Gerando questões para:", contentTitle);
      const { generateQuestions } = await import("./ai-service");
      const result = await generateQuestions({
        contentTitle,
        contentBody,
        subject,
      });
      console.log("✅ Questões geradas:", result.questions.length);
      return res.json({ success: true, questions: result.questions });
    } catch (error: any) {
      console.error("❌ Erro ao gerar questões:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao gerar questões",
        details: error.message,
      });
    }
  });

  app.post("/api/admin/content/save", requireAuth, async (req, res) => {
    try {
      const {
        title,
        subject,
        examType,
        definition,
        keyPoints,
        example,
        tip,
        tags,
        status,
      } = req.body;
      const adminList = await db.select().from(admins).limit(1);

      if (adminList.length === 0) {
        return res.status(500).json({
          success: false,
          error: "Nenhum admin encontrado no banco",
        });
      }
      const adminId = adminList[0].id;
      const newContent = await db
        .insert(content)
        .values({
          title,
          subject,
          examType,
          sphere: "FEDERAL",
          definition,
          keyPoints,
          example,
          tip,
          tags: tags || [],
          body: `${definition}\n\n${keyPoints}\n\n${example}\n\n${tip}`,
          status: status || "DRAFT",
          generatedByAI: true,
          createdBy: adminId,
        })
        .returning();
      console.log("✅ Conteúdo salvo:", newContent[0].id);
      return res.json({ success: true, content: newContent[0] });
    } catch (error: any) {
      console.error("❌ Erro ao salvar:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao salvar conteúdo",
        details: error.message,
      });
    }
  });

  console.log("✅ Rotas de IA registradas!");
}
