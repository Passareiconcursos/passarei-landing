/**
 * Admin Content Routes — CRUD de conteúdos, matérias e materiais
 *
 * Rotas: /api/admin/content/*, /api/admin/subjects, /api/admin/materials, /api/admin/logo
 */

import type { Express } from "express";
import { db } from "../../db";
import { content, subjects, materials } from "../../db/schema";
import {
  insertContentSchema,
  insertMaterialSchema,
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { eq, and, count, desc, asc, like, or, sql } from "drizzle-orm";
import { logAuditAction } from "../auth";
import { requireAuth } from "../middleware-supabase";

export function registerContentRoutes(app: Express) {
  // GET /api/admin/content - List content with advanced filters
  app.get("/api/admin/content", requireAuth, async (req, res) => {
    try {
      const admin = (req as any).admin;

      // Parse query parameters for filters
      const {
        search,
        subject,
        examType,
        sphere,
        state,
        status,
        generatedByAI,
        page = "1",
        limit = "20",
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      // Build WHERE conditions
      const conditions = [];

      if (search) {
        conditions.push(
          or(
            like(content.title, `%${search}%`),
            like(content.body, `%${search}%`),
          ),
        );
      }

      if (subject) {
        conditions.push(eq(content.subject, subject as any));
      }

      if (examType) {
        conditions.push(eq(content.examType, examType as any));
      }

      if (sphere) {
        conditions.push(eq(content.sphere, sphere as any));
      }

      if (state) {
        conditions.push(eq(content.state, state as string));
      }

      if (status) {
        conditions.push(eq(content.status, status as any));
      }

      if (generatedByAI !== undefined) {
        conditions.push(eq(content.generatedByAI, generatedByAI === "true"));
      }

      // Build query
      let query = db.select().from(content);

      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }

      // Apply sorting - map sortBy to actual column
      const sortColumnMap: Record<string, any> = {
        createdAt: content.createdAt,
        updatedAt: content.updatedAt,
        title: content.title,
        subject: content.subject,
        status: content.status,
      };
      const sortColumn = sortColumnMap[sortBy as string] || content.createdAt;
      query = query.orderBy(
        sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn),
      ) as any;

      // Apply pagination
      const results = await query.limit(limitNum).offset(offset);

      // Get total count
      let countQuery = db.select({ count: count() }).from(content);
      if (conditions.length > 0) {
        countQuery = countQuery.where(and(...conditions)) as any;
      }
      const [{ count: total }] = await countQuery;

      return res.json({
        success: true,
        content: results,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      console.error("Error fetching content:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar conteúdos.",
      });
    }
  });

  // GET /api/admin/content/list - Alias para listar (compatibilidade frontend)
  app.get("/api/admin/content/list", requireAuth, async (req, res) => {
    try {
      const {
        search = "",
        subject = "",
        examType = "",
        status = "",
        page = "1",
        limit = "10",
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      // Build conditions before query (Drizzle requires where before limit/offset)
      const conditions = [];
      if (search) {
        conditions.push(like(content.title, `%${search}%`));
      }
      if (subject) {
        conditions.push(eq(content.subject, subject as any));
      }
      if (examType) {
        conditions.push(eq(content.examType, examType as any));
      }
      if (status) {
        conditions.push(eq(content.status, status as any));
      }

      let query = db.select().from(content);
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }
      const contents = await query
        .orderBy(desc(content.createdAt))
        .limit(limitNum)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(content);

      res.json({
        success: true,
        contents,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: count,
          totalPages: Math.ceil(count / limitNum),
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: "Erro ao listar conteúdos",
      });
    }
  });

  // GET /api/admin/content/:id - Get single content by ID
  app.get("/api/admin/content/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;

      const [contentItem] = await db
        .select()
        .from(content)
        .where(eq(content.id, id))
        .limit(1);

      if (!contentItem) {
        return res.status(404).json({
          success: false,
          error: "Conteúdo não encontrado.",
        });
      }

      return res.json({
        success: true,
        content: contentItem,
      });
    } catch (error) {
      console.error("Error fetching content:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar conteúdo.",
      });
    }
  });

  // POST /api/admin/content - Create educational content
  app.post("/api/admin/content", requireAuth, async (req, res) => {
    try {
      const admin = (req as any).admin;

      // Validate request body
      const result = insertContentSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          success: false,
          error: validationError.message,
        });
      }

      const data = result.data;

      // Prepare data, converting empty strings to null for FK fields
      const contentData = {
        ...data,
        materialId: data.materialId || null,
        state: data.state || null,
        sphere: data.sphere || null,
        createdBy: admin.id,
        generatedByAI: false,
      };

      // Create content with admin as creator
      const [newContent] = await db
        .insert(content)
        .values(contentData)
        .returning();

      // Log audit
      await logAuditAction(
        admin.id,
        "CREATE",
        "content",
        newContent.id,
        null,
        req,
      );

      return res.json({
        success: true,
        content: newContent,
      });
    } catch (error) {
      console.error("Error creating content:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao criar conteúdo.",
      });
    }
  });

  // PUT /api/admin/content/:id - Update content
  app.put("/api/admin/content/:id", requireAuth, async (req, res) => {
    try {
      const admin = (req as any).admin;
      const { id } = req.params;

      // Check if content exists
      const [existingContent] = await db
        .select()
        .from(content)
        .where(eq(content.id, id))
        .limit(1);

      if (!existingContent) {
        return res.status(404).json({
          success: false,
          error: "Conteúdo não encontrado.",
        });
      }

      // Validate request body
      const result = insertContentSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          success: false,
          error: validationError.message,
        });
      }

      // Prepare data, converting empty strings to null for FK fields
      const updateData = {
        ...result.data,
        materialId: result.data.materialId || null,
        state: result.data.state || null,
        sphere: result.data.sphere || null,
        updatedAt: new Date(),
      };

      // Update content
      const [updatedContent] = await db
        .update(content)
        .set(updateData)
        .where(eq(content.id, id))
        .returning();

      // Log audit
      await logAuditAction(
        admin.id,
        "UPDATE",
        "content",
        id,
        { before: existingContent, after: updatedContent },
        req,
      );

      return res.json({
        success: true,
        content: updatedContent,
      });
    } catch (error) {
      console.error("Error updating content:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao atualizar conteúdo.",
      });
    }
  });

  // DELETE /api/admin/content/:id - Delete content
  app.delete("/api/admin/content/:id", requireAuth, async (req, res) => {
    try {
      const admin = (req as any).admin;
      const { id } = req.params;

      // Check if content exists
      const [existingContent] = await db
        .select()
        .from(content)
        .where(eq(content.id, id))
        .limit(1);

      if (!existingContent) {
        return res.status(404).json({
          success: false,
          error: "Conteúdo não encontrado.",
        });
      }

      // Delete content (cascade will delete questions)
      await db.delete(content).where(eq(content.id, id));

      // Log audit
      await logAuditAction(
        admin.id,
        "DELETE",
        "content",
        id,
        { deleted: existingContent },
        req,
      );

      return res.json({
        success: true,
      });
    } catch (error) {
      console.error("Error deleting content:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao deletar conteúdo.",
      });
    }
  });

  // GET /api/admin/subjects - Get all subjects
  app.get("/api/admin/subjects", requireAuth, async (req, res) => {
    try {
      const allSubjects = await db
        .select()
        .from(subjects)
        .orderBy(asc(subjects.name));

      return res.json({
        success: true,
        subjects: allSubjects,
      });
    } catch (error) {
      console.error("Error fetching subjects:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar matérias.",
      });
    }
  });

  // GET /api/admin/materials - Get all materials
  app.get("/api/admin/materials", requireAuth, async (req, res) => {
    try {
      const allMaterials = await db
        .select()
        .from(materials)
        .orderBy(desc(materials.uploadedAt));

      return res.json({
        success: true,
        materials: allMaterials,
      });
    } catch (error) {
      console.error("Error fetching materials:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar materiais.",
      });
    }
  });

  // POST /api/admin/materials - Upload material
  app.post("/api/admin/materials", requireAuth, async (req, res) => {
    try {
      const admin = (req as any).admin;

      // Validate request body
      const result = insertMaterialSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({
          success: false,
          error: validationError.message,
        });
      }

      // Create material with admin as uploader
      const [newMaterial] = await db
        .insert(materials)
        .values({
          ...result.data,
          uploadedBy: admin.id,
        })
        .returning();

      // Log audit
      await logAuditAction(
        admin.id,
        "CREATE",
        "material",
        newMaterial.id,
        null,
        req,
      );

      return res.json({
        success: true,
        material: newMaterial,
      });
    } catch (error) {
      console.error("Error creating material:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao criar material.",
      });
    }
  });

  // POST /api/admin/logo - Upload logo (placeholder for future implementation)
  app.post("/api/admin/logo", requireAuth, async (req, res) => {
    try {
      // TODO: Implement file upload with multer or similar
      return res.status(501).json({
        success: false,
        error: "Funcionalidade de upload de logo será implementada em breve.",
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao fazer upload do logo.",
      });
    }
  });
}
