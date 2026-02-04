import type { Express } from "express";
import { db } from "../db";
import { sql, eq, and, desc } from "drizzle-orm";
import { promoCodes, promoRedemptions } from "../db/schema";
import { requireAuth } from "./middleware-supabase";

export function registerPromoRoutes(app: Express) {
  console.log("🎟️ Registrando rotas de códigos promocionais...");

  // ============================================
  // ROTAS ADMIN (protegidas)
  // ============================================

  // Listar códigos promocionais
  app.get("/api/admin/promo-codes", requireAuth, async (req, res) => {
    try {
      const codes = await db.execute(sql`
        SELECT
          pc.*,
          a.name as created_by_name,
          (SELECT COUNT(*) FROM promo_redemptions pr WHERE pr.promo_code_id = pc.id) as redemption_count
        FROM promo_codes pc
        LEFT JOIN "Admin" a ON pc.created_by = a.id
        ORDER BY pc.created_at DESC
      `);

      return res.json({
        success: true,
        promoCodes: codes,
      });
    } catch (error: any) {
      console.error("❌ Erro ao listar códigos:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao carregar códigos promocionais",
      });
    }
  });

  // Criar código promocional
  app.post("/api/admin/promo-codes", requireAuth, async (req, res) => {
    try {
      const {
        code,
        description,
        type,
        discountPercent,
        grantedPlan,
        grantedDays,
        maxUses,
        expiresAt,
      } = req.body;
      const admin = (req as any).admin;

      if (!code || !type) {
        return res.status(400).json({
          success: false,
          error: "Código e tipo são obrigatórios",
        });
      }

      // Validar tipo
      if (type === "DISCOUNT" && !discountPercent) {
        return res.status(400).json({
          success: false,
          error: "Percentual de desconto é obrigatório para tipo DISCOUNT",
        });
      }

      if (type === "GRATUITY" && (!grantedPlan || !grantedDays)) {
        return res.status(400).json({
          success: false,
          error: "Plano e dias são obrigatórios para tipo GRATUITY",
        });
      }

      // Verificar se código já existe
      const existing = await db.execute(sql`
        SELECT id FROM promo_codes WHERE UPPER(code) = ${code.toUpperCase()} LIMIT 1
      `);

      if (existing && existing.length > 0) {
        return res.status(400).json({
          success: false,
          error: "Este código já existe",
        });
      }

      // Criar código
      const result = await db.execute(sql`
        INSERT INTO promo_codes (
          code, description, type, discount_percent, granted_plan, granted_days,
          max_uses, expires_at, created_by, is_active, current_uses
        ) VALUES (
          ${code.toUpperCase()},
          ${description || null},
          ${type},
          ${type === "DISCOUNT" ? discountPercent : null},
          ${type === "GRATUITY" ? grantedPlan : null},
          ${type === "GRATUITY" ? grantedDays : null},
          ${maxUses || 100},
          ${expiresAt ? new Date(expiresAt) : null},
          ${admin.id},
          true,
          0
        )
        RETURNING *
      `);

      return res.json({
        success: true,
        promoCode: result[0],
      });
    } catch (error: any) {
      console.error("❌ Erro ao criar código:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Erro ao criar código",
      });
    }
  });

  // Ativar/desativar código
  app.patch("/api/admin/promo-codes/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      await db.execute(sql`
        UPDATE promo_codes
        SET is_active = ${isActive}, updated_at = NOW()
        WHERE id = ${id}::uuid
      `);

      return res.json({ success: true });
    } catch (error: any) {
      console.error("❌ Erro ao atualizar código:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao atualizar código",
      });
    }
  });

  // Deletar código
  app.delete("/api/admin/promo-codes/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;

      await db.execute(sql`
        DELETE FROM promo_codes WHERE id = ${id}::uuid
      `);

      return res.json({ success: true });
    } catch (error: any) {
      console.error("❌ Erro ao deletar código:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao deletar código",
      });
    }
  });

  // Listar resgates de um código
  app.get("/api/admin/promo-codes/:id/redemptions", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;

      const redemptions = await db.execute(sql`
        SELECT
          pr.*,
          u."name" as user_name,
          u."email" as user_email
        FROM promo_redemptions pr
        LEFT JOIN "User" u ON pr.user_id = u.id
        WHERE pr.promo_code_id = ${id}::uuid
        ORDER BY pr.redeemed_at DESC
      `);

      return res.json({
        success: true,
        redemptions,
      });
    } catch (error: any) {
      console.error("❌ Erro ao listar resgates:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao carregar resgates",
      });
    }
  });

  // ============================================
  // ROTAS PÚBLICAS (para Telegram Bot)
  // ============================================

  // Validar código
  app.get("/api/promo-codes/validate/:code", async (req, res) => {
    try {
      const { code } = req.params;

      const result = await db.execute(sql`
        SELECT * FROM promo_codes
        WHERE UPPER(code) = ${code.toUpperCase()}
          AND is_active = true
        LIMIT 1
      `);

      if (!result || result.length === 0) {
        return res.json({ valid: false, error: "Código inválido" });
      }

      const promoCode = result[0] as any;

      // Verificar expiração
      if (promoCode.expires_at && new Date(promoCode.expires_at) < new Date()) {
        return res.json({ valid: false, error: "Código expirado" });
      }

      // Verificar limite de usos
      if (promoCode.current_uses >= promoCode.max_uses) {
        return res.json({ valid: false, error: "Código esgotado" });
      }

      return res.json({
        valid: true,
        type: promoCode.type,
        discountPercent: promoCode.discount_percent,
        grantedPlan: promoCode.granted_plan,
        grantedDays: promoCode.granted_days,
        description: promoCode.description,
      });
    } catch (error: any) {
      console.error("❌ Erro ao validar código:", error);
      return res.status(500).json({
        valid: false,
        error: "Erro ao validar código",
      });
    }
  });

  // Resgatar código
  app.post("/api/promo-codes/redeem", async (req, res) => {
    try {
      const { code, telegramId } = req.body;

      if (!code || !telegramId) {
        return res.json({
          success: false,
          error: "Código e telegramId são obrigatórios",
        });
      }

      // Buscar código
      const codeResult = await db.execute(sql`
        SELECT * FROM promo_codes
        WHERE UPPER(code) = ${code.toUpperCase()}
          AND is_active = true
        LIMIT 1
      `);

      if (!codeResult || codeResult.length === 0) {
        return res.json({ success: false, error: "Código inválido" });
      }

      const promoCode = codeResult[0] as any;

      // Verificar expiração
      if (promoCode.expires_at && new Date(promoCode.expires_at) < new Date()) {
        return res.json({ success: false, error: "Código expirado" });
      }

      // Verificar limite de usos
      if (promoCode.current_uses >= promoCode.max_uses) {
        return res.json({ success: false, error: "Código esgotado" });
      }

      // Verificar se já resgatou
      const existingRedemption = await db.execute(sql`
        SELECT id FROM promo_redemptions
        WHERE promo_code_id = ${promoCode.id}::uuid
          AND telegram_id = ${telegramId}
        LIMIT 1
      `);

      if (existingRedemption && existingRedemption.length > 0) {
        return res.json({ success: false, error: "Você já usou este código" });
      }

      // Buscar usuário
      const userResult = await db.execute(sql`
        SELECT id, plan FROM "User" WHERE "telegramId" = ${telegramId} LIMIT 1
      `);

      let userId = null;
      if (userResult && userResult.length > 0) {
        userId = (userResult[0] as any).id;
      }

      // Aplicar benefício baseado no tipo
      let message = "";

      if (promoCode.type === "GRATUITY") {
        // Calcular data de expiração do plano
        const planEndDate = new Date();
        planEndDate.setDate(planEndDate.getDate() + promoCode.granted_days);
        const planEndDateStr = planEndDate.toISOString();

        // Atualizar ou criar usuário
        if (userId) {
          await db.execute(sql`
            UPDATE "User"
            SET
              plan = ${promoCode.granted_plan},
              "planStatus" = 'active',
              "planStartDate" = NOW(),
              "planEndDate" = ${planEndDateStr},
              "updatedAt" = NOW()
            WHERE id = ${userId}
          `);
        } else {
          // Criar usuário básico se não existir
          const newUser = await db.execute(sql`
            INSERT INTO "User" (
              id, "telegramId", name, email, phone, plan, "planStatus",
              "planStartDate", "planEndDate", "examType", state, "isActive",
              "createdAt", "updatedAt"
            ) VALUES (
              gen_random_uuid()::text,
              ${telegramId},
              'Usuário Promo',
              ${telegramId + '@promo.passarei.com.br'},
              '',
              ${promoCode.granted_plan},
              'active',
              NOW(),
              ${planEndDateStr},
              'OUTRO',
              'SP',
              true,
              NOW(),
              NOW()
            )
            RETURNING id
          `);
          userId = (newUser[0] as any).id;
        }

        message = `Plano ${promoCode.granted_plan} ativado por ${promoCode.granted_days} dias!`;
      } else if (promoCode.type === "DISCOUNT") {
        message = `Desconto de ${promoCode.discount_percent}% aplicado! Use ao fazer sua assinatura.`;
      }

      // Registrar resgate
      await db.execute(sql`
        INSERT INTO promo_redemptions (
          promo_code_id, user_id, telegram_id, redeemed_at, benefit_applied
        ) VALUES (
          ${promoCode.id}::uuid,
          ${userId},
          ${telegramId},
          NOW(),
          ${JSON.stringify({
            type: promoCode.type,
            plan: promoCode.granted_plan,
            days: promoCode.granted_days,
            discount: promoCode.discount_percent,
          })}
        )
      `);

      // Incrementar contador de usos
      await db.execute(sql`
        UPDATE promo_codes
        SET current_uses = current_uses + 1, updated_at = NOW()
        WHERE id = ${promoCode.id}::uuid
      `);

      return res.json({
        success: true,
        message,
        type: promoCode.type,
        grantedPlan: promoCode.granted_plan,
        grantedDays: promoCode.granted_days,
        discountPercent: promoCode.discount_percent,
      });
    } catch (error: any) {
      console.error("❌ Erro ao resgatar código:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao resgatar código",
      });
    }
  });

  console.log("✅ Rotas de códigos promocionais registradas!");
}
