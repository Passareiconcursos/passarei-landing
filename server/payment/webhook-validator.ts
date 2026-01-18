// server/payment/webhook-validator.ts
// 🔐 Validação de assinatura dos webhooks do Mercado Pago
// Documentação: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks

import crypto from "crypto";
import type { Request } from "express";

/**
 * Valida a assinatura do webhook do Mercado Pago
 *
 * O Mercado Pago envia headers de segurança para validar que a requisição é legítima:
 * - x-signature: Assinatura HMAC-SHA256
 * - x-request-id: ID único da requisição
 *
 * @param req - Request do Express
 * @param secret - Chave secreta configurada no painel MP
 * @returns true se assinatura é válida, false caso contrário
 */
export function validateMercadoPagoSignature(
  req: Request,
  secret: string
): boolean {
  try {
    // Extrair headers de segurança
    const xSignature = req.headers["x-signature"] as string;
    const xRequestId = req.headers["x-request-id"] as string;

    if (!xSignature || !xRequestId) {
      console.error("❌ [Webhook Security] Headers de segurança não encontrados");
      console.error("❌ [Webhook Security] x-signature:", xSignature);
      console.error("❌ [Webhook Security] x-request-id:", xRequestId);
      return false;
    }

    // Extrair partes da assinatura
    // Formato: ts=1234567890,v1=abc123def456...
    const parts = xSignature.split(",");
    const tsPart = parts.find((p) => p.startsWith("ts="));
    const v1Part = parts.find((p) => p.startsWith("v1="));

    if (!tsPart || !v1Part) {
      console.error("❌ [Webhook Security] Formato de assinatura inválido");
      return false;
    }

    const ts = tsPart.replace("ts=", "");
    const hash = v1Part.replace("v1=", "");

    // Construir string para validação
    // Formato: id:<request-id>;request-id:<request-id>;ts:<timestamp>;
    const dataId = req.body?.data?.id || "";
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

    console.log("🔍 [Webhook Security] Validando assinatura...");
    console.log("🔍 [Webhook Security] Manifest:", manifest);
    console.log("🔍 [Webhook Security] Hash recebido:", hash.substring(0, 20) + "...");

    // Gerar HMAC-SHA256
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(manifest);
    const computedHash = hmac.digest("hex");

    console.log("🔍 [Webhook Security] Hash calculado:", computedHash.substring(0, 20) + "...");

    // Comparar hashes (timing-safe)
    const isValid = crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(computedHash, "hex")
    );

    if (isValid) {
      console.log("✅ [Webhook Security] Assinatura válida!");
    } else {
      console.error("❌ [Webhook Security] Assinatura inválida!");
    }

    return isValid;
  } catch (error: any) {
    console.error("❌ [Webhook Security] Erro ao validar assinatura:", error.message);
    return false;
  }
}

/**
 * Middleware para validar webhooks do Mercado Pago
 * Rejeita requisições com assinatura inválida
 *
 * @param secretEnvVar - Nome da variável de ambiente com o secret
 */
export function createWebhookValidator(secretEnvVar: string) {
  return (req: Request, res: any, next: any) => {
    const secret = process.env[secretEnvVar];

    if (!secret) {
      console.error(
        `❌ [Webhook Security] ${secretEnvVar} não configurado no .env`
      );
      return res.status(500).json({
        success: false,
        error: "Webhook secret não configurado",
      });
    }

    const isValid = validateMercadoPagoSignature(req, secret);

    if (!isValid) {
      console.error("🚨 [Webhook Security] TENTATIVA DE WEBHOOK FALSO DETECTADA!");
      console.error("🚨 [Webhook Security] IP:", req.ip);
      console.error("🚨 [Webhook Security] Headers:", req.headers);

      return res.status(401).json({
        success: false,
        error: "Assinatura inválida",
      });
    }

    // Assinatura válida, continuar
    next();
  };
}
