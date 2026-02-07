# SETUP DE EXECUCAO - Passarei MVP
# Atualizado: 07/02/2026
# Status: EM EXECUCAO

---

## FASE A - Limpeza e Base (sem afetar funcionamento)

### A1. Deletar codigo morto Prisma
- [ ] Deletar `db/prisma.ts`
- [ ] Deletar `server/auth-prisma.ts`
- [ ] Deletar `server/routes-prisma.ts`
- [ ] Deletar `server/middleware-prisma.ts`
- [ ] Deletar pasta `prisma/` (schema.prisma, migrations, seed.ts)
- [ ] Deletar `test-prisma.ts`
- [ ] Remover `@prisma/client` e `prisma` do package.json
- [ ] Verificar que nada quebrou (build ok)

### A2. Corrigir bug generate-content.ts (subjectId recebendo contentId)
- [ ] Linha 273: `${contentId}` no campo "subjectId" -> usar subjectId real
- [ ] Garantir que questoes geradas vinculam ao Subject correto

### A3. Padronizar formato de alternativas
- [ ] Todas as questoes: sempre `{letter, text}` (nao strings soltas)
- [ ] Questoes Certo/Errado: `{letter:"C", text:"Certo"}` e `{letter:"E", text:"Errado"}`
- [ ] correctAnswer: sempre letra ("A","B","C","D") nao indice ("0","1")

### A4. Remover ENEM do sistema
- [ ] Remover ENEM do enum examType no schema
- [ ] Remover do onboarding (opcoes de concurso)
- [ ] Remover da landing page / MiniChat se referenciado
- [ ] Foco: somente seguranca publica

---

## FASE B - Sincronizacao Conteudo<->Questao (core)

### B1. Usar topicId para vincular conteudo->questao
- [ ] Alterar `sendNextContent` em learning-session.ts
- [ ] Buscar questao pelo topicId do conteudo (nao so subjectId)
- [ ] Fallback: subjectId se topicId nao disponivel

### B2. Regra "sem questao = nao enviar"
- [ ] Se nao achar questao para o topico, pular conteudo
- [ ] Logar: "ALERTA: Conteudo X sem questao - topicId Y"
- [ ] Tentar proximo conteudo que TENHA questao

### B3. Botao intermediario
- [ ] Conteudo -> [Responder questao] -> questao
- [ ] Remover auto-send de questao apos 3s delay
- [ ] Callback: `ready_question` para enviar a questao

### B4. Questoes Certo/Errado
- [ ] Botoes: "Certo" e "Errado" (texto completo, fiel a banca CESPE)
- [ ] Nao usar "C" ou "E" como texto do botao

---

## FASE C - UX e Fluxo

### C1. Aproveitamento consolidado (3 gatilhos)
- [ ] Gatilho 1: Limite diario atingido (CALOURO:10, VETERANO:30)
- [ ] Gatilho 2: Inatividade 30min (timer com setInterval)
- [ ] Gatilho 3: Comando /parar (encerramento voluntario)
- [ ] Salvar `lastInteractionAt` no banco (nao in-memory)
- [ ] Resumo: acertos/erros por materia, melhor/pior materia

### C2. Estudo adaptativo (dia seguinte)
- [ ] Salvar desempenho diario por materia no User
- [ ] Materias com <50% acerto entram em `dificuldades`
- [ ] Proximo dia: getSmartContent prioriza dificuldades (70/30)

### C3. Mensagem instrucional para novos alunos
- [ ] Antes do onboarding: mensagem curta sobre /menu
- [ ] Apenas no primeiro acesso (nao em retornos)

### C4. Comando /parar e /sair
- [ ] Encerrar sessao voluntariamente
- [ ] Mostrar resumo de progresso do dia
- [ ] Adicionar ao /menu como opcao

### C5. Remover aproveitamento por troca de materia
- [ ] Remover bloco lines 328-344 de learning-session.ts
- [ ] Aproveitamento so nos 3 gatilhos acima

---

## FASE D - Professor Revisor

### D1. Criar pipeline de revisao IA
- [ ] Prompt especializado do "Professor Revisor"
- [ ] Regras: seguranca publica, fidelidade a banca, gabarito correto
- [ ] Status de conteudo: PENDENTE -> APROVADO / REJEITADO
- [ ] Score 0-10 para cada conteudo/questao

### D2. Rodar batch nos conteudos existentes
- [ ] Revisar todos os conteudos ja no banco
- [ ] Marcar aprovados/rejeitados
- [ ] Logar problemas encontrados

### D3. Alimentar com editais e bancas
- [ ] Extrair conteudo programatico dos editais principais
- [ ] Salvar referencias de bancas (CESPE, FCC, Vunesp)
- [ ] Incluir no prompt do Professor

---

## FASE E - Espelhamento MiniChat

### E1. MiniChat importar funcoes compartilhadas
- [ ] Usar funcoes do database.ts (getSmartContent, etc)
- [ ] Nao quebrar funcionamento atual

### E2. Espelhar melhorias
- [ ] Botao intermediario no MiniChat
- [ ] Formato Certo/Errado
- [ ] Sincronizacao conteudo<->questao

### E3. Adequar frontend
- [ ] Remover ENEM das opcoes do MiniChat
- [ ] Atualizar textos da landing page
- [ ] Verificar precos e features nas paginas de oferta

---

## POS-EXECUCAO

### Atualizar documentos
- [ ] Atualizar PRD_Passarei_v4 com todas as mudancas
- [ ] Atualizar Schema (remover Prisma, documentar Drizzle)
- [ ] Atualizar MEMORY.md com novos padroes

### Validacao final
- [ ] Build sem erros
- [ ] Deploy no Railway
- [ ] Testar fluxo completo no bot
- [ ] Testar MiniChat
- [ ] Testar pagamento fim-a-fim

---

## LOG DE EXECUCAO

| Data | Fase | Tarefa | Status |
|------|------|--------|--------|
| 07/02 | Pre | UX P1-P7 implementados | CONCLUIDO |
| 07/02 | A1 | Deletar Prisma (12 arquivos + pasta + deps) | CONCLUIDO |
| 07/02 | A2 | Fix generate-content.ts (subjectId, alternativas, gabarito) | CONCLUIDO |
| 07/02 | A3 | Formato alternativas padronizado (seed ok, normalizer ok) | CONCLUIDO |
| 07/02 | A4 | ENEM removido (2 scripts deletados, refs pedagogicas mantidas) | CONCLUIDO |
| 07/02 | B | Inicio Fase B | EM ANDAMENTO |
