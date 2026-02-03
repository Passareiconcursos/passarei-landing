# Analise de Custos de IA por Aluno - Passarei

**Data:** 02/02/2026
**Modelo atual:** Claude Sonnet 4 (`claude-sonnet-4-20250514`)
**Cambio referencia:** 1 USD = R$ 5,26

---

## Pricing Claude API

| Modelo | Input (1M tokens) | Output (1M tokens) |
|--------|-------------------|---------------------|
| Claude Haiku 4.5 | $1.00 | $5.00 |
| **Claude Sonnet 4** (atual) | **$3.00** | **$15.00** |
| Claude Sonnet 4.5 | $3.00 | $15.00 |
| Claude Opus 4.5 | $5.00 | $25.00 |

---

## 7 Pontos de Consumo de IA

| # | Funcao | Arquivo | Input (tokens) | Output (tokens) | Custo/chamada | Tipo |
|---|--------|---------|----------------|-----------------|---------------|------|
| 1 | Enriquecer conteudo (pontos-chave, exemplo, dica) | server/telegram/ai-service.ts:26 | ~420 | ~150 | $0.0035 | Por aluno |
| 2 | Explicacao pos-resposta | server/telegram/ai-service.ts:99 | ~500 | ~120 | $0.0033 | Por aluno |
| 3 | Gerar questao (fallback MiniChat) | server/minichat-routes.ts:170 | ~500 | ~500 | $0.0090 | Por aluno |
| 4 | Tirar duvida do aluno | server/minichat-routes.ts:685 | ~400 | ~150 | $0.0035 | Por aluno |
| 5 | Correcao de redacao | server/essay-routes.ts:86 | ~1100 | ~1000 | $0.0183 | Por aluno |
| 6 | Gerar conteudo (admin) | server/ai-service.ts:82 | ~800 | ~1000 | $0.0174 | Producao |
| 7 | Gerar questoes (admin) | server/ai-service.ts:135 | ~700 | ~1500 | $0.0246 | Producao |

---

## Custo por Ciclo de Estudo

**Telegram Bot (1 conteudo + 1 questao):**
- generateEnhancedContent() = $0.0035 (sempre)
- generateExplanation() = $0.0033 (80% das vezes - quando nao ha questao real)
- **Media por ciclo: $0.0061**

**MiniChat Website:**
- Mesmo fluxo + eventual geracao IA (~5%)
- **Media por ciclo: $0.0076**

---

## Custo por Plano

### FREE (21 questoes, primeiro dia)
- 21 questoes + 3 duvidas = **$0.17 = R$ 0,89 (custo de aquisicao unico)**

### CALOURO (R$ 89,90/mes - 10 questoes/dia)

| Cenario | Questoes/mes | Custo IA | Custo R$ | Margem R$ | Margem % |
|---------|-------------|----------|----------|-----------|----------|
| Maximo (10/dia x 30d) | 300 | $2.03 | R$ 10,68 | R$ 79,22 | 88% |
| Realista (6/dia x 20d) | 120 | $0.86 | R$ 4,52 | R$ 85,38 | 95% |
| Baixo engajamento | 60 | $0.43 | R$ 2,26 | R$ 87,64 | 97% |

### VETERANO (R$ 44,90/mes anual - 30 questoes/dia)

| Cenario | Questoes/mes | + Redacoes | Custo IA | Custo R$ | Margem R$ | Margem % |
|---------|-------------|-----------|----------|----------|-----------|----------|
| Maximo (30/dia x 30d) | 900 | 2 | $5.76 | R$ 30,27 | R$ 14,63 | 33% |
| Realista (15/dia x 25d) | 375 | 1 | $2.48 | R$ 13,03 | R$ 31,87 | 71% |
| Baixo engajamento | 150 | 0 | $0.92 | R$ 4,84 | R$ 40,06 | 89% |

---

## Projecao de Escala (100 alunos pagantes)

| Cenario | Mix | Custo IA/mes | Receita/mes | Margem |
|---------|-----|-------------|-------------|--------|
| Conservador | 70 Cal + 30 Vet | R$ 707 | R$ 7.640 | R$ 6.933 (91%) |
| Otimista | 50 Cal + 50 Vet | R$ 878 | R$ 6.740 | R$ 5.862 (87%) |

---

## Otimizacao Futura: Migrar para Haiku 4.5

Para funcoes repetitivas (enriquecer conteudo + explicacoes):

| Funcao | Sonnet 4 | Haiku 4.5 | Economia |
|--------|----------|-----------|----------|
| Enriquecer conteudo | $0.0035 | $0.0012 | -66% |
| Explicacao | $0.0033 | $0.0011 | -67% |
| Ciclo completo | $0.0061 | $0.0021 | -66% |

**Manter Sonnet para:** correcao de redacao, duvidas, geracao de conteudo admin.

**Impacto no VETERANO power user:**
- Com Sonnet: R$ 30,27/mes (margem 33%)
- Com Haiku: R$ 10,09/mes (margem 78%)

---

## Decisao (02/02/2026)

- [x] Manter Sonnet 4 pela qualidade (fase atual)
- [ ] Migrar funcoes repetitivas para Haiku 4.5 (futuro)
- [ ] Implementar cache de respostas para conteudos repetidos (futuro)
- [ ] Monitorar uso real via logs de tokens (futuro)
