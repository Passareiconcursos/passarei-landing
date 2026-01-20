# ROADMAP DE TAREFAS - PASSAREI.COM.BR

**Última atualização:** 19/01/2026
**Responsável:** CTO
**Status geral:** MVP Liberado - Em expansão

---

## LEGENDA DE STATUS

- [ ] Pendente
- [x] Concluído
- [!] Em andamento
- [?] Requer análise/decisão

---

## FASE 1: CORREÇÕES CRÍTICAS (PÓS-MVP)

### 1.1 MiniChat - Inteligência e UX

| # | Tarefa | Prioridade | Status | Observações |
|---|--------|------------|--------|-------------|
| 1.1.1 | Atualizar MiniChat para ter mesma inteligência do Bot Telegram | ALTA | [ ] | Lead chega no site e precisa se encantar usando o produto. MiniChat atual é inferior ao bot. |
| 1.1.2 | Corrigir scroll do MiniChat no Desktop | ALTA | [ ] | Quando envia mensagens, usuário perde visão do chat. Mobile funciona (sobretela). |
| 1.1.3 | Avaliar implementar MiniChat como sobretela no Desktop | MÉDIA | [?] | Alternativa ao problema de scroll. Decidir melhor abordagem. |

### 1.2 Mercado Pago - Score de Qualidade

| # | Tarefa | Prioridade | Status | Observações |
|---|--------|------------|--------|-------------|
| 1.2.1 | Configurar webhook de assinaturas Veterano | ALTA | [ ] | Notificar cobranças mensais aprovadas/canceladas |
| 1.2.2 | Implementar página de confirmação para Veterano | ALTA | [ ] | Tratar redirecionamento pós-assinatura |
| 1.2.3 | Aumentar score MP: Notificação Webhook | ALTA | [ ] | Painel qualidade MP - Ação obrigatória (amarelo) |
| 1.2.4 | Aumentar score MP: Certificado SSL/TLS | ALTA | [ ] | Painel qualidade MP - Ação obrigatória |
| 1.2.5 | Aumentar score MP: Confirmação de pagamento | MÉDIA | [ ] | Responder HTTP 200 corretamente |

---

## FASE 2: FUNCIONALIDADES DO PRODUTO

### 2.1 Limitações e Regras de Negócio

| # | Tarefa | Prioridade | Status | Observações |
|---|--------|------------|--------|-------------|
| 2.1.1 | Implementar limite de questões/dia por plano | ALTA | [ ] | Calouro: 10 questões/dia, Veterano: 30 questões/dia |
| 2.1.2 | Contabilizar questão apenas após envio da resposta | ALTA | [ ] | Evitar que usuário "gaste" crédito sem responder |
| 2.1.3 | Implementar correção de 2 redações/mês | ALTA | [ ] | Incluído no plano Veterano |
| 2.1.4 | Cobrar por redações extras além das 2/mês | MÉDIA | [ ] | Definir valor por redação adicional |

### 2.2 Conteúdo e Matérias

| # | Tarefa | Prioridade | Status | Observações |
|---|--------|------------|--------|-------------|
| 2.2.1 | Auditar matérias existentes | MÉDIA | [ ] | Verificar quais existem e qualidade |
| 2.2.2 | Criar 3 novas matérias | MÉDIA | [ ] | Baseado nas necessidades dos concursos oferecidos |
| 2.2.3 | Expandir para 15 matérias completas | BAIXA | [ ] | Meta: ~1.000 questões totais |

---

## FASE 3: OPERACIONAL E ADMIN

### 3.1 Painel Administrativo

| # | Tarefa | Prioridade | Status | Observações |
|---|--------|------------|--------|-------------|
| 3.1.1 | Criar painel admin básico | MÉDIA | [ ] | Visualizar assinantes, pagamentos, usuários |
| 3.1.2 | Dashboard com métricas principais | BAIXA | [ ] | Conversão, churn, LTV, receita |

### 3.2 Gestão de Assinaturas

| # | Tarefa | Prioridade | Status | Observações |
|---|--------|------------|--------|-------------|
| 3.2.1 | Implementar cancelamento de assinatura | ALTA | [ ] | Requisito legal para plano Veterano |
| 3.2.2 | Notificar usuário antes da renovação | MÉDIA | [ ] | Email X dias antes da cobrança |

### 3.3 Infraestrutura

| # | Tarefa | Prioridade | Status | Observações |
|---|--------|------------|--------|-------------|
| 3.3.1 | Analisar as duas contas no bot Telegram | MÉDIA | [ ] | Verificar se há conflito ou duplicação |
| 3.3.2 | Sincronizar Replit com código atual | BAIXA | [ ] | Replit ficou pausado durante testes |

---

## FASE 4: EXPERIÊNCIA DO USUÁRIO

### 4.1 Comunicação

| # | Tarefa | Prioridade | Status | Observações |
|---|--------|------------|--------|-------------|
| 4.1.1 | Email de boas-vindas pós-ativação | MÉDIA | [ ] | Após ativar no bot, enviar instruções de uso |
| 4.1.2 | Notificação de créditos baixos | MÉDIA | [ ] | Avisar quando restam ~10% dos créditos |

### 4.2 Área do Usuário

| # | Tarefa | Prioridade | Status | Observações |
|---|--------|------------|--------|-------------|
| 4.2.1 | Página "Minha Conta" | BAIXA | [ ] | Ver plano, créditos, histórico, configurações |
| 4.2.2 | Recuperação de senha / magic link | BAIXA | [ ] | Login sem senha via email |

---

## FASE 5: CRESCIMENTO E MARKETING

### 5.1 Aquisição

| # | Tarefa | Prioridade | Status | Observações |
|---|--------|------------|--------|-------------|
| 5.1.1 | Implementar cupons de desconto | BAIXA | [ ] | Promoções e parcerias |
| 5.1.2 | Sistema de indicação (referral) | BAIXA | [ ] | Usuário indica amigo e ganha créditos |

### 5.2 Analytics

| # | Tarefa | Prioridade | Status | Observações |
|---|--------|------------|--------|-------------|
| 5.2.1 | Integração com Google Analytics 4 | BAIXA | [ ] | Tracking de eventos de conversão |
| 5.2.2 | Dashboard de métricas de negócio | BAIXA | [ ] | Conversão, retenção, receita |

---

## FASE 6: QUALIDADE E MANUTENÇÃO

| # | Tarefa | Prioridade | Status | Observações |
|---|--------|------------|--------|-------------|
| 6.1 | Testes automatizados (E2E) | BAIXA | [ ] | Garantir que fluxo de pagamento não quebre |
| 6.2 | Documentação técnica atualizada | BAIXA | [ ] | API, webhooks, fluxos |
| 6.3 | Backup automático do banco | BAIXA | [ ] | Rotina de backup diário |

---

## TAREFAS CONCLUÍDAS (Histórico)

| Data | Tarefa | Observações |
|------|--------|-------------|
| 19/01/2026 | Adequar cores página Success | Verde Passarei |
| 19/01/2026 | Voltar credenciais PROD | APP_USR configurado |
| 19/01/2026 | Configurar webhooks PROD no MP | Railway URL |
| 19/01/2026 | Corrigir fluxo PIX (pendente vs confirmado) | Página diferenciada |
| 19/01/2026 | Melhorar score MP: dados comprador | Payload completo |
| 19/01/2026 | Melhorar score MP: SDK frontend | payerForm habilitado |
| 19/01/2026 | Corrigir botão Veterano | URL redirecionamento MP |
| 19/01/2026 | Limpar arquivos temporários | 11 arquivos removidos |
| 19/01/2026 | LIBERAR MVP | Produção ativa |

---

## NOTAS E DECISÕES PENDENTES

1. **MiniChat Desktop:** Decidir entre corrigir scroll ou implementar sobretela
2. **Redações extras:** Definir preço por correção adicional
3. **Novas matérias:** Listar quais matérias são prioritárias para os concursos

---

## CONTATOS E RECURSOS

- **Site:** https://www.passarei.com.br
- **Bot Telegram:** @PassareiBot
- **Deploy:** Railway (auto-deploy via GitHub)
- **Banco:** Supabase PostgreSQL
- **Pagamentos:** Mercado Pago (PROD)

---

*Este documento deve ser atualizado sempre que uma tarefa for concluída ou novas tarefas forem identificadas.*
