import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "../db";
import { leads } from "../db/schema";
import { insertLeadSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/leads - Create a new lead
  app.post("/api/leads", async (req, res) => {
    try {
      // Validate request body
      const result = insertLeadSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          success: false,
          error: validationError.message,
        });
      }

      // Create lead in database
      const [lead] = await db.insert(leads).values({
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        examType: result.data.examType,
        state: result.data.state,
        acceptedWhatsApp: result.data.acceptedWhatsApp,
      }).returning();

      return res.json({
        success: true,
        leadId: lead.id,
      });
    } catch (error) {
      console.error("Error creating lead:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao processar cadastro. Tente novamente.",
      });
    }
  });

  // GET /api/leads - Get all leads (for admin use later)
  app.get("/api/leads", async (req, res) => {
    try {
      const allLeads = await db.select().from(leads);
      return res.json({
        success: true,
        leads: allLeads,
      });
    } catch (error) {
      console.error("Error fetching leads:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar leads.",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
