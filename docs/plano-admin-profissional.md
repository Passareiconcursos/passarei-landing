# Plano de Profissionalização do Admin - Passarei

**Data:** 03/02/2026
**Objetivo:** Back office limpo, leve, seguro e focado em dados para gestão

---

## Visão Geral: 5 Telas Finais

| Tela | Rota | Propósito |
|------|------|-----------|
| Painel | `/educ/dashboard` | Bússola do negócio - métricas e funil |
| Leads | `/educ/leads` | Pipeline CRM de conversão |
| Alunos | `/educ/users` | Engajamento e gestão de usuários |
| Financeiro | `/educ/revenue` | MRR, estornos, códigos promo |
| Config | `/educ/settings` | Conta do admin |

---

## FASE 1: Limpeza e Segurança

### 1.1 Arquivos a DELETAR

| Arquivo | Motivo | Linhas |
|---------|--------|--------|
| `client/src/pages/educ-content.tsx` | Conteúdo gerenciado via código | ~760 |
| `client/src/pages/educ-notifications.tsx` | Placeholder sem uso | ~50 |
| `client/src/components/admin/AIGenerationModal.tsx` | Sem uso, complexidade | ~579 |

### 1.2 Arquivos a MODIFICAR (Segurança)

**server/ai-routes.ts** - Adicionar autenticação:
```typescript
import { requireAuth } from "./middleware-supabase";

// Linha ~8: Adicionar middleware em TODAS as rotas
app.post("/api/admin/ai/generate-content", requireAuth, async (req, res) => ...
app.post("/api/admin/ai/generate-questions", requireAuth, async (req, res) => ...
app.post("/api/admin/content/save", requireAuth, async (req, res) => ...
```

**server/edital-routes.ts** - Adicionar autenticação:
```typescript
import { requireAuth } from "./middleware-supabase";

app.get("/api/admin/editals", requireAuth, async (req, res) => ...
app.get("/api/admin/content/generated-topics", requireAuth, async (req, res) => ...
app.post("/api/admin/content/log-generation", requireAuth, async (req, res) => ...
```

**server/routes.ts** - Limpar código morto:
- Remover linhas 37-268 (código comentado de rotas antigas)
- Remover console.logs de debug excessivos
- Total: ~230 linhas removidas

### 1.3 Atualizar Sidebar

**client/src/components/admin/AdminSidebar.tsx** - Remover itens:
```typescript
// REMOVER:
{ icon: FileText, label: "Conteúdo", href: "/educ/content" },
{ icon: Bell, label: "Notificações", href: "/educ/notifications" },

// Menu final (5 itens):
{ icon: LayoutDashboard, label: "Painel", href: "/educ/dashboard" },
{ icon: Users, label: "Leads", href: "/educ/leads" },
{ icon: GraduationCap, label: "Alunos", href: "/educ/users" },
{ icon: DollarSign, label: "Financeiro", href: "/educ/revenue" },
{ icon: Settings, label: "Configurações", href: "/educ/settings" },
```

### 1.4 Atualizar Router

**client/src/App.tsx** - Remover rotas:
```typescript
// REMOVER:
<Route path="/educ/content" component={EducContent} />
<Route path="/educ/notifications" component={EducNotifications} />
```

**Complexidade Fase 1:** Simples
**Estimativa:** Deletar 3 arquivos, modificar 5 arquivos

---

## FASE 2: Dashboard + Tela de Alunos

### 2.1 Dashboard Renovado

**Arquivo:** `client/src/pages/educ-dashboard.tsx` (reescrever)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  PAINEL PASSAREI                               Fevereiro    │
├─────────────┬──────────────┬──────────────┬─────────────────┤
│  LEADS      │  ALUNOS      │  MRR         │  CONVERSÃO      │
│  127        │  43 ativos   │  R$ 2.847    │  12.3%          │
│  +18 semana │  +5 semana   │  +R$449 mes  │  Lead→Pago      │
├─────────────┴──────────────┴──────────────┴─────────────────┤
│  FUNIL DO MÊS                                               │
│  Leads: 72 → Free: 34 (47%) → Pagos: 6 (17%)               │
│  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
├─────────────────────────────┬───────────────────────────────┤
│  ALERTAS                    │  AÇÕES RÁPIDAS                │
│  ⚠ 8 leads sem email 2     │  → Ver leads parados          │
│  ⚠ 3 users inativos 7d     │  → Ver alunos em risco        │
│  ✅ Sistema operacional     │  → Expandir conteúdos         │
└─────────────────────────────┴───────────────────────────────┘
```

**Nova rota backend:** `GET /api/admin/dashboard-stats`

**server/routes.ts** - Adicionar:
```typescript
app.get("/api/admin/dashboard-stats", requireAuth, async (req, res) => {
  // Leads total e semana
  const totalLeads = await db.select({ count: count() }).from(leads);
  const weekLeads = await db.select({ count: count() }).from(leads)
    .where(gte(leads.createdAt, subDays(new Date(), 7)));

  // Alunos ativos (usaram nos últimos 7 dias)
  const activeUsers = await db.select({ count: count() }).from(users)
    .where(and(
      ne(users.plan, "FREE"),
      gte(users.lastActiveAt, subDays(new Date(), 7))
    ));

  // MRR (soma das assinaturas ativas)
  const mrr = await db.select({ sum: sum(subscriptions.amount) })
    .from(subscriptions)
    .where(eq(subscriptions.status, "ACTIVE"));

  // Conversão Lead → Pago (mês atual)
  const monthStart = startOfMonth(new Date());
  const paidThisMonth = await db.select({ count: count() }).from(transactions)
    .where(and(
      eq(transactions.status, "APPROVED"),
      gte(transactions.createdAt, monthStart)
    ));
  const leadsThisMonth = await db.select({ count: count() }).from(leads)
    .where(gte(leads.createdAt, monthStart));

  // Funil
  const freeUsers = await db.select({ count: count() }).from(users)
    .where(eq(users.plan, "FREE"));
  const paidUsers = await db.select({ count: count() }).from(users)
    .where(ne(users.plan, "FREE"));

  // Alertas
  const stalledLeads = await db.select({ count: count() }).from(leads)
    .where(and(
      eq(leads.status, "NOVO"),
      isNull(leads.dripEmail2SentAt),
      lte(leads.createdAt, subDays(new Date(), 7))
    ));
  const inactiveUsers = await db.select({ count: count() }).from(users)
    .where(and(
      ne(users.plan, "FREE"),
      lte(users.lastActiveAt, subDays(new Date(), 7))
    ));

  return res.json({
    leads: { total: totalLeads, week: weekLeads },
    users: { active: activeUsers, free: freeUsers, paid: paidUsers },
    mrr: mrr,
    conversion: (paidThisMonth / leadsThisMonth * 100).toFixed(1),
    alerts: {
      stalledLeads,
      inactiveUsers
    }
  });
});
```

### 2.2 Tela de Alunos (Nova)

**Arquivo:** `client/src/pages/educ-users.tsx` (reescrever)

**Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│  ALUNOS                              Buscar... │ Filtros ▼   │
├──────────┬───────┬────────┬──────────┬──────────┬───────────┤
│  Usuário │ Plano │ Quest. │ Acertos  │ Último   │ Ações     │
│          │       │  /mês  │          │ acesso   │           │
├──────────┼───────┼────────┼──────────┼──────────┼───────────┤
│  @joao   │ VET   │ 234    │ 71%      │ Hoje     │ 👁 📝     │
│  @maria  │ CAL   │ 89     │ 65%      │ Ontem    │ 👁 📝     │
│  @pedro  │ FREE  │ 21     │ 52%      │ 5 dias   │ 👁 📝     │
└──────────┴───────┴────────┴──────────┴──────────┴───────────┘
                                        Página 1 de 5  < >
```

**Ações por usuário:**
- 👁 Ver detalhes (dialog com histórico)
- 📝 Gerenciar (aplicar desconto, estorno, mudar plano)

**Nova rota backend:** `GET /api/admin/users`

```typescript
app.get("/api/admin/users", requireAuth, async (req, res) => {
  const { page = 1, limit = 20, plan, status, search } = req.query;

  // Query users com estatísticas agregadas
  const usersData = await db.execute(sql`
    SELECT
      u.id,
      u."telegramId",
      u.email,
      u.plan,
      u."planStatus",
      u."planEndDate",
      u."lastActiveAt",
      u."totalQuestionsAnswered",
      u."createdAt",
      COALESCE(
        (SELECT COUNT(*) FROM user_answers ua WHERE ua."userId" = u.id
         AND ua."answeredAt" >= NOW() - INTERVAL '30 days'), 0
      ) as "questionsThisMonth",
      COALESCE(
        (SELECT AVG(CASE WHEN ua.correct THEN 1.0 ELSE 0.0 END) * 100
         FROM user_answers ua WHERE ua."userId" = u.id), 0
      ) as "accuracyRate"
    FROM "User" u
    WHERE u."telegramId" IS NOT NULL
    ORDER BY u."lastActiveAt" DESC NULLS LAST
    LIMIT ${limit} OFFSET ${(page - 1) * limit}
  `);

  return res.json({ users: usersData, page, totalPages });
});
```

**Complexidade Fase 2:** Média
**Estimativa:** 2 arquivos frontend reescritos, 2 novas rotas backend

---

## FASE 3: Financeiro + Sistema de Estorno

### 3.1 Nova Tabela: refunds

**Arquivo:** `db/migrate-refunds.ts` (criar)

```typescript
// Nova tabela para tracking de estornos
await db.execute(sql`
  CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id),
    mp_refund_id VARCHAR(50),
    user_id UUID REFERENCES "User"(id),

    amount REAL NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED

    processed_by UUID REFERENCES admins(id),
    processed_at TIMESTAMP,

    mp_response JSONB,
    notes TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX idx_refunds_user ON refunds(user_id);
  CREATE INDEX idx_refunds_transaction ON refunds(transaction_id);
`);
```

### 3.2 Tela Financeiro (Nova)

**Arquivo:** `client/src/pages/educ-revenue.tsx` (reescrever)

**Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│  FINANCEIRO                                    Fevereiro     │
├──────────────┬──────────────┬──────────────┬─────────────────┤
│  MRR         │  CALOURO     │  VETERANO    │  ESTORNOS       │
│  R$ 2.847    │  22 assin.   │  8 assin.    │  R$ 89 (1)      │
├──────────────┴──────────────┴──────────────┴─────────────────┤
│                                                              │
│  TRANSAÇÕES RECENTES                        [+ Novo Promo]   │
├──────────┬──────────┬─────────┬─────────────┬────────────────┤
│  Data    │ Usuário  │ Valor   │ Status      │ Ações          │
├──────────┼──────────┼─────────┼─────────────┼────────────────┤
│  02/02   │ @joao    │ R$89,90 │ ✅ Aprovado │ [Estornar]     │
│  01/02   │ @maria   │ R$538,80│ ✅ Aprovado │ [Estornar]     │
│  31/01   │ @pedro   │ R$89,90 │ 🔄 Pendente │ -              │
└──────────┴──────────┴─────────┴─────────────┴────────────────┘

│  CÓDIGOS PROMOCIONAIS                                        │
├──────────┬───────────┬─────────┬──────────┬─────────┬────────┤
│  Código  │ Tipo      │ Valor   │ Usos     │ Expira  │ Status │
├──────────┼───────────┼─────────┼──────────┼─────────┼────────┤
│  BETA26  │ Gratuidade│ VET 30d │ 5/10     │ 28/02   │ Ativo  │
│  PROMO10 │ Desconto  │ 10%     │ 12/50    │ 15/02   │ Ativo  │
└──────────┴───────────┴─────────┴──────────┴─────────┴────────┘
```

### 3.3 Rotas de Estorno

**Arquivo:** `server/payment/refund-routes.ts` (criar)

```typescript
import { requireAuth } from "../middleware-supabase";

export function registerRefundRoutes(app: Express) {

  // Listar transações com opção de estorno
  app.get("/api/admin/transactions", requireAuth, async (req, res) => {
    const transactions = await db.execute(sql`
      SELECT
        t.*,
        u."telegramId",
        u.email,
        r.id as refund_id,
        r.status as refund_status
      FROM transactions t
      LEFT JOIN "User" u ON t."userId" = u.id
      LEFT JOIN refunds r ON r.transaction_id = t.id
      WHERE t.status = 'APPROVED'
      ORDER BY t.created_at DESC
      LIMIT 50
    `);
    return res.json({ transactions });
  });

  // Processar estorno
  app.post("/api/admin/refunds", requireAuth, async (req, res) => {
    const { transactionId, amount, reason } = req.body;
    const adminId = req.admin.id;

    // Buscar transação
    const [transaction] = await db.select().from(transactions)
      .where(eq(transactions.id, transactionId));

    if (!transaction) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }

    // Chamar API MercadoPago para estorno
    const mpRefund = await fetch(
      `https://api.mercadopago.com/v1/payments/${transaction.mpPaymentId}/refunds`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount: amount || transaction.amount })
      }
    );

    const mpResponse = await mpRefund.json();

    // Registrar estorno
    const [refund] = await db.insert(refunds).values({
      transactionId,
      mpRefundId: mpResponse.id?.toString(),
      userId: transaction.userId,
      amount: amount || transaction.amount,
      reason,
      status: mpResponse.status === "approved" ? "APPROVED" : "PENDING",
      processedBy: adminId,
      processedAt: new Date(),
      mpResponse: mpResponse
    }).returning();

    // Se estorno total aprovado, desativar plano do usuário
    if (mpResponse.status === "approved" && amount >= transaction.amount) {
      await db.update(users)
        .set({ plan: "FREE", planStatus: "canceled" })
        .where(eq(users.id, transaction.userId));
    }

    return res.json({ success: true, refund });
  });

  // Histórico de estornos
  app.get("/api/admin/refunds", requireAuth, async (req, res) => {
    const refundsList = await db.select().from(refunds)
      .orderBy(desc(refunds.createdAt))
      .limit(50);
    return res.json({ refunds: refundsList });
  });
}
```

**Complexidade Fase 3:** Complexa
**Estimativa:** 1 migração, 1 arquivo de rotas novo, 1 frontend reescrito

---

## FASE 4: Sistema de Códigos Promocionais

### 4.1 Nova Tabela: promo_codes

**Arquivo:** `db/migrate-promo-codes.ts` (criar)

```typescript
await db.execute(sql`
  CREATE TABLE IF NOT EXISTS promo_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,

    type VARCHAR(20) NOT NULL, -- 'DISCOUNT' ou 'GRATUITY'

    -- Se DISCOUNT:
    discount_percent INTEGER, -- 10, 20, 50...

    -- Se GRATUITY:
    granted_plan VARCHAR(20), -- 'CALOURO' ou 'VETERANO'
    granted_days INTEGER, -- duração em dias

    max_uses INTEGER DEFAULT 100,
    current_uses INTEGER DEFAULT 0,

    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,

    created_by UUID REFERENCES admins(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS promo_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promo_code_id UUID REFERENCES promo_codes(id),
    user_id UUID REFERENCES "User"(id),
    telegram_id VARCHAR(50),

    redeemed_at TIMESTAMP DEFAULT NOW(),

    -- Snapshot do benefício aplicado
    benefit_applied JSONB
  );

  CREATE INDEX idx_promo_codes_code ON promo_codes(code);
  CREATE INDEX idx_promo_redemptions_user ON promo_redemptions(user_id);
`);
```

### 4.2 Rotas de Promo Codes

**Arquivo:** `server/promo-routes.ts` (criar)

```typescript
export function registerPromoRoutes(app: Express) {

  // Admin: Criar código
  app.post("/api/admin/promo-codes", requireAuth, async (req, res) => {
    const { code, type, discountPercent, grantedPlan, grantedDays, maxUses, expiresAt, description } = req.body;

    const [promoCode] = await db.insert(promoCodes).values({
      code: code.toUpperCase(),
      description,
      type,
      discountPercent: type === "DISCOUNT" ? discountPercent : null,
      grantedPlan: type === "GRATUITY" ? grantedPlan : null,
      grantedDays: type === "GRATUITY" ? grantedDays : null,
      maxUses,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdBy: req.admin.id
    }).returning();

    return res.json({ success: true, promoCode });
  });

  // Admin: Listar códigos
  app.get("/api/admin/promo-codes", requireAuth, async (req, res) => {
    const codes = await db.select().from(promoCodes)
      .orderBy(desc(promoCodes.createdAt));
    return res.json({ promoCodes: codes });
  });

  // Admin: Desativar código
  app.patch("/api/admin/promo-codes/:id", requireAuth, async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;

    await db.update(promoCodes)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(promoCodes.id, id));

    return res.json({ success: true });
  });

  // PÚBLICO: Validar código (usado pelo Telegram bot)
  app.get("/api/promo-codes/validate/:code", async (req, res) => {
    const { code } = req.params;

    const [promoCode] = await db.select().from(promoCodes)
      .where(and(
        eq(promoCodes.code, code.toUpperCase()),
        eq(promoCodes.isActive, true)
      ));

    if (!promoCode) {
      return res.json({ valid: false, error: "Código inválido" });
    }

    if (promoCode.expiresAt && promoCode.expiresAt < new Date()) {
      return res.json({ valid: false, error: "Código expirado" });
    }

    if (promoCode.currentUses >= promoCode.maxUses) {
      return res.json({ valid: false, error: "Código esgotado" });
    }

    return res.json({
      valid: true,
      type: promoCode.type,
      discountPercent: promoCode.discountPercent,
      grantedPlan: promoCode.grantedPlan,
      grantedDays: promoCode.grantedDays
    });
  });

  // PÚBLICO: Resgatar código (usado pelo Telegram bot)
  app.post("/api/promo-codes/redeem", async (req, res) => {
    const { code, telegramId } = req.body;

    // Validar código
    const [promoCode] = await db.select().from(promoCodes)
      .where(and(
        eq(promoCodes.code, code.toUpperCase()),
        eq(promoCodes.isActive, true)
      ));

    if (!promoCode || promoCode.currentUses >= promoCode.maxUses) {
      return res.json({ success: false, error: "Código inválido ou esgotado" });
    }

    // Verificar se já resgatou
    const [existing] = await db.select().from(promoRedemptions)
      .where(and(
        eq(promoRedemptions.promoCodeId, promoCode.id),
        eq(promoRedemptions.telegramId, telegramId)
      ));

    if (existing) {
      return res.json({ success: false, error: "Você já usou este código" });
    }

    // Buscar ou criar usuário
    let [user] = await db.select().from(users)
      .where(eq(users.telegramId, telegramId));

    if (!user) {
      [user] = await db.insert(users).values({
        telegramId,
        plan: "FREE"
      }).returning();
    }

    // Aplicar benefício
    if (promoCode.type === "GRATUITY") {
      const planEndDate = new Date();
      planEndDate.setDate(planEndDate.getDate() + promoCode.grantedDays);

      await db.update(users).set({
        plan: promoCode.grantedPlan,
        planStatus: "active",
        planStartDate: new Date(),
        planEndDate
      }).where(eq(users.id, user.id));
    }

    // Registrar resgate
    await db.insert(promoRedemptions).values({
      promoCodeId: promoCode.id,
      userId: user.id,
      telegramId,
      benefitApplied: {
        type: promoCode.type,
        plan: promoCode.grantedPlan,
        days: promoCode.grantedDays,
        discount: promoCode.discountPercent
      }
    });

    // Incrementar uso
    await db.update(promoCodes)
      .set({ currentUses: promoCode.currentUses + 1 })
      .where(eq(promoCodes.id, promoCode.id));

    return res.json({
      success: true,
      message: promoCode.type === "GRATUITY"
        ? `Plano ${promoCode.grantedPlan} ativado por ${promoCode.grantedDays} dias!`
        : `Desconto de ${promoCode.discountPercent}% aplicado!`
    });
  });
}
```

### 4.3 Integração Telegram Bot

**Arquivo:** `server/telegram/bot.ts` - Adicionar comando:

```typescript
// Comando /codigo XXXXX
bot.onText(/\/codigo (.+)/, async (msg, match) => {
  const telegramId = String(msg.from.id);
  const chatId = msg.chat.id;
  const code = match[1].trim().toUpperCase();

  const response = await fetch(`${APP_URL}/api/promo-codes/redeem`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, telegramId })
  });

  const result = await response.json();

  if (result.success) {
    await bot.sendMessage(chatId, `✅ *${result.message}*\n\nDigite /estudar para começar!`, {
      parse_mode: "Markdown"
    });
  } else {
    await bot.sendMessage(chatId, `❌ ${result.error}`, {
      parse_mode: "Markdown"
    });
  }
});
```

**Complexidade Fase 4:** Complexa
**Estimativa:** 1 migração (2 tabelas), 1 arquivo de rotas, modificar bot.ts

---

## FASE 5: Melhorias nos Leads

### 5.1 Adicionar indicadores visuais

**Arquivo:** `client/src/pages/educ-leads.tsx` (modificar)

Adicionar colunas:
- Drip Progress: "1/4", "2/4", "3/4", "4/4" com badge colorido
- Dias desde cadastro: "há 2 dias", "há 15 dias"
- Source badge: "MiniChat" ou "Landing"

```typescript
// Calcular progresso do drip
const getDripProgress = (lead) => {
  if (lead.dripEmail4SentAt) return { step: 4, label: "4/4", color: "green" };
  if (lead.dripEmail3SentAt) return { step: 3, label: "3/4", color: "blue" };
  if (lead.dripEmail2SentAt) return { step: 2, label: "2/4", color: "yellow" };
  if (lead.dripEmail1SentAt) return { step: 1, label: "1/4", color: "gray" };
  return { step: 0, label: "0/4", color: "red" };
};

// Calcular dias desde cadastro
const getDaysSince = (date) => {
  const days = Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));
  if (days === 0) return "Hoje";
  if (days === 1) return "Ontem";
  return `há ${days} dias`;
};
```

**Complexidade Fase 5:** Simples
**Estimativa:** Modificar 1 arquivo frontend

---

## Cronograma de Execução

| Fase | Descrição | Complexidade | Arquivos |
|------|-----------|--------------|----------|
| 1 | Limpeza e Segurança | Simples | -3 deletados, +5 modificados |
| 2 | Dashboard + Alunos | Média | 2 reescritos, 2 rotas novas |
| 3 | Financeiro + Estorno | Complexa | 1 migração, 2 arquivos novos |
| 4 | Sistema Promo | Complexa | 1 migração, 2 arquivos novos |
| 5 | Melhorias Leads | Simples | 1 modificado |

---

## Schema Final de Tabelas Novas

```sql
-- Fase 3
refunds (id, transaction_id, mp_refund_id, user_id, amount, reason, status, processed_by, processed_at, mp_response, notes, created_at, updated_at)

-- Fase 4
promo_codes (id, code, description, type, discount_percent, granted_plan, granted_days, max_uses, current_uses, expires_at, is_active, created_by, created_at, updated_at)

promo_redemptions (id, promo_code_id, user_id, telegram_id, redeemed_at, benefit_applied)
```

---

## Resultado Final

**Menu Admin (5 itens):**
1. Painel - Métricas, funil, alertas
2. Leads - Pipeline CRM com drip tracking
3. Alunos - Engajamento e gestão
4. Financeiro - MRR, transações, estornos, promos
5. Configurações - Conta admin

**Funcionalidades Novas:**
- Dashboard com funil de conversão e alertas
- Lista de alunos com métricas de engajamento
- Sistema de estorno integrado com MercadoPago
- Sistema de códigos promocionais (desconto + gratuidade)
- Comando /codigo no Telegram para beta testers

**Removido:**
- Tela de Conteúdo (gerenciado via código)
- Tela de Notificações (automático)
- Modal de geração IA (579 linhas)
- ~230 linhas de código morto
