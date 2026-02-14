// server/email/email-scheduler.ts
// 📧 Scheduler para drip campaign de leads
// Verifica a cada 1 hora se há leads que precisam receber emails

import { db } from "../../db";
import { sql } from "drizzle-orm";
import {
  sendLeadEducationalEmail,
  sendLeadSocialProofEmail,
  sendLeadLastChanceEmail,
} from "./send-lead-drip";

// Intervalo: verificar a cada 1 hora
const CHECK_INTERVAL_MS = 60 * 60 * 1000;

/**
 * Drip campaign schedule:
 * Email 1: Boas-vindas → enviado imediatamente no POST /api/leads (não pelo scheduler)
 * Email 2: Educativo → +7 dias após cadastro
 * Email 3: Social proof + oferta → +14 dias após cadastro
 * Email 4: Última chance → +21 dias após cadastro
 */
const DRIP_STEPS = [
  { step: 2, daysAfter: 7, field: "dripEmail2SentAt", send: sendLeadEducationalEmail },
  { step: 3, daysAfter: 14, field: "dripEmail3SentAt", send: sendLeadSocialProofEmail },
  { step: 4, daysAfter: 21, field: "dripEmail4SentAt", send: sendLeadLastChanceEmail },
];

/**
 * Inicia o scheduler de drip campaign
 */
export function startEmailScheduler() {
  console.log("📧 [Email Scheduler] Drip campaign scheduler iniciado");
  console.log(`📧 [Email Scheduler] Verificação a cada ${CHECK_INTERVAL_MS / 60000} minutos`);

  // Primeira verificação depois de 30 segundos (dar tempo do servidor subir)
  setTimeout(() => processDripCampaign(), 30000);

  // Depois verificar a cada hora
  setInterval(() => processDripCampaign(), CHECK_INTERVAL_MS);
}

/**
 * Processa a drip campaign: verifica leads que precisam receber emails
 */
async function processDripCampaign() {
  try {
    console.log(`\n📧 [Email Scheduler] Verificando drip campaign...`);

    for (const step of DRIP_STEPS) {
      await processDripStep(step);
    }

    console.log(`📧 [Email Scheduler] Ciclo concluído`);
  } catch (error) {
    console.error("❌ [Email Scheduler] Erro no scheduler:", error);
  }
}

/**
 * Processa um passo específico da drip campaign
 */
async function processDripStep(step: {
  step: number;
  daysAfter: number;
  field: string;
  send: (params: { leadEmail: string; leadName: string; examType: string }) => Promise<any>;
}) {
  try {
    // Buscar leads elegíveis:
    // - Status NOVO (não convertido ainda)
    // - Cadastro há pelo menos X dias
    // - Ainda não recebeu este email (campo null)
    // Nota: não exigimos dripEmail1SentAt (pode ter falhado async)
    const leads = await db.execute(sql`
      SELECT id, name, email, "examType", "dripEmail1SentAt"
      FROM leads
      WHERE status = 'NOVO'
        AND ${sql.raw(`"${step.field}"`)} IS NULL
        AND created_at <= NOW() - INTERVAL '${sql.raw(String(step.daysAfter))} days'
      LIMIT 10
    `) as any[];

    if (leads.length === 0) return;

    console.log(`📧 [Drip ${step.step}/4] ${leads.length} leads para receber email`);

    for (const lead of leads) {
      try {
        // Se email 1 nunca foi enviado, marcar agora (recovery do async falho)
        if (!lead.dripEmail1SentAt) {
          console.log(`📧 [Drip] Marcando email 1 como enviado para ${lead.email} (recovery)`);
          await db.execute(sql`
            UPDATE leads
            SET "dripEmail1SentAt" = created_at,
                "updatedAt" = NOW()
            WHERE id = ${lead.id}
          `);
        }

        const result = await step.send({
          leadEmail: lead.email,
          leadName: lead.name,
          examType: lead.examType || "PF",
        });

        if (result.success) {
          // Marcar email como enviado
          await db.execute(sql`
            UPDATE leads
            SET ${sql.raw(`"${step.field}"`)} = NOW(),
                "updatedAt" = NOW()
            WHERE id = ${lead.id}
          `);
          console.log(`✅ [Drip ${step.step}/4] Email enviado para ${lead.email}`);
        }

        // Delay entre envios (evitar rate limit)
        await new Promise((r) => setTimeout(r, 2000));
      } catch (leadError) {
        console.error(`❌ [Drip ${step.step}/4] Erro para ${lead.email}:`, leadError);
      }
    }
  } catch (error) {
    console.error(`❌ [Drip ${step.step}/4] Erro:`, error);
  }
}
