# 🗺️ ROADMAP - Integração de Concursos e Conteúdos

## 🔴 REGRAS FUNDAMENTAIS

```
✅ EXPANDIR     - Adicionar novos concursos, cargos, matérias
✅ COMPLEMENTAR - Vincular conteúdo existente às novas estruturas
❌ NÃO EXCLUIR  - Manter todo conteúdo/questões existentes
❌ NÃO DUPLICAR - Verificar existência antes de criar
```

---

## 📊 Situação Atual

### ❌ Dados Hardcoded (NÃO conectados ao banco)

| Arquivo | Local | Dados |
|---------|-------|-------|
| `MiniChat.tsx` | Frontend | 10 concursos, ~20 cargos |
| `Concursos.tsx` | Landing Page | 10 concursos |
| `bot.ts` | Telegram Bot | Lista de concursos (linhas 99-106) |
| `onboarding.ts` | Telegram Bot | CARGOS + SUBJECT_FALLBACK |

### ✅ Dados no Banco (NÃO usados pelos frontends)
- 20 concursos cadastrados
- 62 cargos cadastrados
- Tabelas: `concursos`, `cargos`, `cargo_materias`, `conteudo_cargos`

### ✅ Conteúdo Existente (PRESERVAR!)
- Tabela `Content` → Conteúdos educacionais ativos
- Tabela `Question` → Questões vinculadas
- Tabela `Subject` → Matérias cadastradas
- Tabela `user_answers` → Histórico de respostas
- Tabela `sm2_reviews` → Revisões espaçadas (VETERANO)

---

## 🎯 FASE 1: API de Concursos (Backend)
**Objetivo:** Criar endpoints para servir dados dinâmicos

### Tarefas:
- [ ] 1.1 Criar `GET /api/concursos` - Lista todos os concursos ativos
- [ ] 1.2 Criar `GET /api/concursos/:sigla/cargos` - Lista cargos de um concurso
- [ ] 1.3 Criar `GET /api/cargos/:id/materias` - Lista matérias de um cargo
- [ ] 1.4 Adicionar cache para performance

### Arquivos a criar/modificar:
```
server/
├── routes/
│   └── concursos.ts (NOVO)
└── index.ts (adicionar rotas)
```

---

## 🎯 FASE 2: Integração Frontend (Onboarding Web)
**Objetivo:** Substituir dados hardcoded por chamadas à API

### Tarefas:
- [ ] 2.1 Criar hook `useConcursos()` para buscar concursos da API
- [ ] 2.2 Criar hook `useCargos(concursoId)` para buscar cargos
- [ ] 2.3 Atualizar `MiniChat.tsx` para usar hooks
- [ ] 2.4 Atualizar `Concursos.tsx` (landing page)
- [ ] 2.5 Adicionar loading states e error handling

### Arquivos a modificar:
```
client/src/
├── hooks/
│   └── useConcursos.ts (NOVO)
├── components/
│   ├── MiniChat.tsx (MODIFICAR)
│   └── sections/
│       └── Concursos.tsx (MODIFICAR)
```

---

## 🎯 FASE 2.5: Integração Telegram Bot
**Objetivo:** Bot usar dados do banco ao invés de hardcoded

### Arquivos com dados hardcoded:
```
server/telegram/
├── bot.ts          → const concursos = [...] (linhas 99-106)
├── onboarding.ts   → CARGOS = {...} (linhas 8-40)
│                   → SUBJECT_FALLBACK = {...} (linhas 42-82)
```

### Tarefas:
- [ ] 2.5.1 Criar função `getConcursosFromDB()` em database.ts
- [ ] 2.5.2 Criar função `getCargosFromDB(concursoSigla)` em database.ts
- [ ] 2.5.3 Criar função `getMateriasFromDB(cargoId)` em database.ts
- [ ] 2.5.4 Atualizar `bot.ts` para usar funções do banco
- [ ] 2.5.5 Atualizar `onboarding.ts` para usar funções do banco
- [ ] 2.5.6 Manter fallback para concursos sem dados no banco

### Estratégia de Migração (Segura):
```
1. Criar funções que buscam do banco
2. Se banco vazio/erro → usar hardcoded como fallback
3. Testar em produção com logs
4. Quando estável → remover fallback
```

---

## 🎯 FASE 3: Matérias por Cargo
**Objetivo:** Cadastrar matérias específicas para cada cargo

### Estrutura de Prioridade:

| Prioridade | Concurso | Cargos | Status |
|------------|----------|--------|--------|
| 🔴 Alta | PF | Agente, Escrivão, Delegado | Seed básico feito |
| 🔴 Alta | PRF | Policial | Pendente |
| 🟡 Média | PM/PC | Soldado, Delegado, Agente | Pendente |
| 🟡 Média | ABIN | Oficial de Inteligência | Pendente |
| 🟢 Baixa | Militares | EsPCEx, ESA, ITA | Pendente |
| 🟢 Baixa | CPNU | Blocos 1-8 | Pendente |

### Tarefas:
- [ ] 3.1 Mapear edital oficial de cada concurso
- [ ] 3.2 Cadastrar matérias com peso e quantidade de questões
- [ ] 3.3 Definir tópicos específicos por matéria
- [ ] 3.4 Criar script de seed para cada concurso

---

## 🎯 FASE 3.5: Vincular Conteúdo Existente
**Objetivo:** Associar conteúdos já criados aos novos cargos

### Conteúdo Existente (NÃO EXCLUIR):
```sql
-- Verificar conteúdo existente
SELECT COUNT(*) FROM "Content" WHERE "isActive" = true;
SELECT COUNT(*) FROM "Question";
SELECT DISTINCT "subjectId" FROM "Content";
```

### Tarefas:
- [ ] 3.5.1 Listar todo conteúdo existente por subject
- [ ] 3.5.2 Mapear subjects existentes → cargo_materias
- [ ] 3.5.3 Criar vínculos em `conteudo_cargos` para conteúdo existente
- [ ] 3.5.4 Validar que nenhum conteúdo foi perdido

### Script de Vinculação:
```sql
-- Vincular conteúdo de Direito Penal ao cargo Agente PF
INSERT INTO conteudo_cargos (content_id, cargo_id, cargo_materia_id)
SELECT
  c.id,
  cg.id,
  cm.id
FROM "Content" c
CROSS JOIN cargos cg
JOIN cargo_materias cm ON cm.cargo_id = cg.id
WHERE c."subjectId" IN (SELECT id FROM "Subject" WHERE name = 'DIR_PENAL')
  AND cg.codigo = 'AGENTE_PF'
  AND cm.codigo = 'DIREITO_PENAL'
ON CONFLICT DO NOTHING;
```

---

## 🎯 FASE 4: Geração de Conteúdo NOVO
**Objetivo:** Criar conteúdos NOVOS vinculados aos cargos

### Fluxo de Criação:

```
1. Selecionar Cargo
        ↓
2. Listar Matérias do Cargo
        ↓
3. Para cada Matéria:
   ├── 3.1 Definir tópicos (do edital)
   ├── 3.2 Criar conteúdo (manual ou IA)
   ├── 3.3 Vincular a conteudo_cargos
   └── 3.4 Criar questões do conteúdo
        ↓
4. Revisar qualidade
        ↓
5. Publicar (status: PUBLISHED)
```

### Ordem de Criação por Matéria:

```
CONHECIMENTOS BÁSICOS (criar primeiro):
├── 1. Língua Portuguesa
├── 2. Raciocínio Lógico
├── 3. Noções de Informática
└── 4. Atualidades

DIREITO (criar segundo):
├── 5. Direito Constitucional
├── 6. Direito Administrativo
├── 7. Direito Penal
├── 8. Direito Processual Penal
└── 9. Legislação Especial

CONHECIMENTOS ESPECÍFICOS (criar terceiro):
├── 10. Criminologia
├── 11. Medicina Legal
└── 12. Legislação específica do cargo
```

### Padrão de Qualidade por Conteúdo:

```
✅ CONTEÚDO COMPLETO:
├── Título claro e objetivo
├── Corpo com 500-1500 palavras
├── Definição (resumo em 2-3 frases)
├── Key Points (5-7 pontos principais)
├── Exemplo prático
├── Dica de prova (CEBRASPE/FCC/VUNESP)
├── Tags para busca
├── Vinculação a cargo(s) específico(s)
└── 5-10 questões vinculadas
```

---

## 🎯 FASE 5: Questões por Conteúdo
**Objetivo:** Criar banco de questões de qualidade

### Estrutura por Questão:

```
✅ QUESTÃO COMPLETA:
├── Enunciado claro
├── 5 alternativas (A-E)
├── Gabarito correto
├── Explicação da resposta certa
├── Explicação de cada alternativa errada
├── Dificuldade (FACIL/MEDIO/DIFICIL)
├── Banca (CEBRASPE/FCC/VUNESP/IBFC)
├── Tags
└── Vinculação ao conteúdo
```

### Meta de Questões:

| Matéria | Mínimo | Ideal | Por Tópico |
|---------|--------|-------|------------|
| Português | 100 | 300 | 15-20 |
| Direito Penal | 100 | 300 | 15-20 |
| Direito Constitucional | 100 | 300 | 15-20 |
| Raciocínio Lógico | 80 | 200 | 10-15 |
| Informática | 50 | 150 | 10-15 |

---

## 🎯 FASE 6: Painel Admin
**Objetivo:** Interface para gestão de conteúdo

### Funcionalidades:
- [ ] 6.1 CRUD de Concursos
- [ ] 6.2 CRUD de Cargos por Concurso
- [ ] 6.3 CRUD de Matérias por Cargo
- [ ] 6.4 Vincular conteúdo existente a cargos
- [ ] 6.5 Dashboard de cobertura (% de matérias com conteúdo)

---

## 📅 CRONOGRAMA SUGERIDO

```
SEMANA 1-2: FASE 1 (API Backend)
├── Endpoints de concursos
├── Endpoints de cargos
└── Endpoints de matérias

SEMANA 3-4: FASE 2 (Integração Frontend)
├── Hooks React
├── Atualizar MiniChat
└── Atualizar Landing Page

SEMANA 5-8: FASE 3 (Matérias por Cargo)
├── Semana 5: PF (todos os cargos)
├── Semana 6: PRF + PP Federal
├── Semana 7: PM + PC
├── Semana 8: ABIN + Militares

SEMANA 9-16: FASE 4 (Conteúdos)
├── Foco: 1 matéria por semana
├── Meta: 10-15 conteúdos/matéria
└── Total: ~100 conteúdos

SEMANA 17-24: FASE 5 (Questões)
├── Meta: 50 questões/semana
├── Prioridade: matérias de maior peso
└── Total: ~400 questões

CONTÍNUO: FASE 6 (Painel Admin)
├── Desenvolver conforme necessidade
└── Melhorias incrementais
```

---

## 🔒 REGRAS DE SEGURANÇA

### Ao criar conteúdo:
1. ✅ Sempre verificar se já existe antes de criar
2. ✅ Usar transactions para operações múltiplas
3. ✅ Validar dados antes de inserir
4. ✅ Manter backup antes de alterações em massa
5. ✅ Nunca deletar dados de produção sem confirmação

### Ao modificar código:
1. ✅ Testar em ambiente local primeiro
2. ✅ Manter compatibilidade com dados existentes
3. ✅ Adicionar migrations para mudanças de schema
4. ✅ Commit atômicos (uma funcionalidade por commit)

---

## 📁 Scripts de Seed Disponíveis

```
db/
├── seed-cargos.ts              # Cargos básicos (PF, PRF, etc.)
├── seed-militares-abin.ts      # ABIN + Forças Armadas
├── seed-outros-federais.ts     # PFF, ANAC, CPNU, etc.
├── create-test-content.ts      # Exemplo de conteúdo
└── migrations/
    ├── 001_add_transactions.sql
    └── 002_add_concursos_structure.sql
```

---

## 🎯 PRÓXIMO PASSO IMEDIATO

**Recomendação:** Começar pela FASE 1 (API Backend)

Isso permitirá:
1. Testar a estrutura do banco em produção
2. Validar os dados cadastrados
3. Preparar o terreno para integração frontend

Comando para iniciar:
```bash
# Criar arquivo de rotas
touch server/routes/concursos.ts
```
