# 🔐 PRD + SCHEMA: SISTEMA ADMIN - PASSAREI

**Versão:** 1.0  
**Data:** Janeiro 2025  
**Objetivo:** Back-office profissional para gestão completa do negócio

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Schema Prisma Atualizado](#schema-prisma)
3. [Arquitetura de Autenticação](#autenticação)
4. [Páginas e Funcionalidades](#páginas)
5. [Design System Admin](#design-system)
6. [Segurança e Permissões](#segurança)
7. [Métricas e KPIs](#métricas)
8. [Prompt para Replit Agent](#prompt)

---

## 🎯 VISÃO GERAL

### Objetivo do Admin

Plataforma completa para você (founder) gerenciar:
- Leads da landing page
- Usuários cadastrados
- Conteúdos e questões
- Editais e matérias
- Métricas de negócio
- Receita e assinaturas

### Personas de Acesso

```
SUPER_ADMIN (você)
├── Acesso total
├── Ver todas métricas
├── Gerenciar tudo
└── Deletar dados

MODERATOR (futuro)
├── Ver leads e usuários
├── Criar conteúdo
├── Responder suporte
└── SEM deletar ou alterar $

VIEWER (futuro - investidor)
├── Apenas visualizar métricas
└── Exportar relatórios
```

---

## 💾 SCHEMA PRISMA ATUALIZADO

Adicione ao seu `schema.prisma` existente:

```prisma
// ============================================
// AUTENTICAÇÃO E PERMISSÕES
// ============================================

enum Role {
  SUPER_ADMIN
  MODERATOR
  VIEWER
  USER
}

model Admin {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String   // bcrypt hash
  name          String
  role          Role     @default(SUPER_ADMIN)
  
  // Segurança
  isActive      Boolean  @default(true)
  lastLoginAt   DateTime?
  loginAttempts Int      @default(0)
  lockedUntil   DateTime?
  
  // Auditoria
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  createdBy     String?
  
  // Relações
  sessions      AdminSession[]
  auditLogs     AuditLog[]
  
  @@index([email])
  @@map("admins")
}

model AdminSession {
  id        String   @id @default(cuid())
  adminId   String
  admin     Admin    @relation(fields: [adminId], references: [id], onDelete: Cascade)
  
  token     String   @unique // JWT ou session ID
  ipAddress String?
  userAgent String?
  
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  @@index([adminId])
  @@index([token])
  @@index([expiresAt])
  @@map("admin_sessions")
}

// ============================================
// AUDITORIA (LOGS DE AÇÕES)
// ============================================

enum AuditAction {
  LOGIN
  LOGOUT
  CREATE
  UPDATE
  DELETE
  EXPORT
  VIEW
}

model AuditLog {
  id          String      @id @default(cuid())
  adminId     String
  admin       Admin       @relation(fields: [adminId], references: [id])
  
  action      AuditAction
  resource    String      // "Lead", "User", "Content", etc
  resourceId  String?     // ID do recurso afetado
  changes     Json?       // Antes/depois
  
  ipAddress   String?
  userAgent   String?
  timestamp   DateTime    @default(now())
  
  @@index([adminId])
  @@index([action])
  @@index([resource])
  @@index([timestamp])
  @@map("audit_logs")
}

// ============================================
// LEADS (já existe, adicionando campos)
// ============================================

model Lead {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  phone     String   // WhatsApp com DDD
  examType  String   // PM, PC, PRF, PF
  state     String   // SP, RJ, etc
  
  // Novos campos para admin
  status    LeadStatus @default(NEW)
  source    String?    @default("landing_page") // UTM tracking futuro
  notes     String?    // Notas do admin
  assignedTo String?   // Admin que está acompanhando
  
  // Marketing
  utmSource   String?
  utmMedium   String?
  utmCampaign String?
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  convertedAt DateTime? // Quando virou USER
  
  // Relações
  convertedToUser User?  @relation("LeadConversion")
  
  @@index([email])
  @@index([status])
  @@index([createdAt])
  @@index([examType, state])
  @@map("leads")
}

enum LeadStatus {
  NEW           // Acabou de chegar
  CONTACTED     // Já enviamos WhatsApp
  INTERESTED    // Respondeu positivo
  CONVERTED     // Virou usuário
  UNRESPONSIVE  // Não responde
  DISQUALIFIED  // Não é público-alvo
}

// ============================================
// USUÁRIOS (adicionar campos de negócio)
// ============================================

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  phone     String
  
  // Autenticação
  passwordHash String?
  
  // Perfil
  examType  String   // PM, PC, PRF, PF
  state     String
  plan      Plan     @default(FREE)
  
  // Status
  isActive        Boolean  @default(true)
  emailVerified   Boolean  @default(false)
  phoneVerified   Boolean  @default(false)
  
  // Assinatura
  subscriptionId     String?   @unique
  subscriptionStatus String?   // active, canceled, past_due
  currentPeriodStart DateTime?
  currentPeriodEnd   DateTime?
  cancelAtPeriodEnd  Boolean   @default(false)
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  lastActiveAt DateTime?
  
  // Relações
  leadOrigin Lead? @relation("LeadConversion", fields: [leadOriginId], references: [id])
  leadOriginId String? @unique
  
  progress     UserProgress[]
  subscriptions Subscription[]
  
  @@index([email])
  @@index([plan])
  @@index([isActive])
  @@index([createdAt])
  @@map("users")
}

enum Plan {
  FREE
  CALOURO
  VETERANO
}

// ============================================
// ASSINATURAS E PAGAMENTOS
// ============================================

model Subscription {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Stripe/Mercado Pago
  externalId String  @unique // subscription_id do gateway
  plan       Plan
  status     SubscriptionStatus
  
  // Valores
  amount         Float   // 29.90, 238.80
  currency       String  @default("BRL")
  interval       String  // month, year
  
  // Datas
  startDate      DateTime
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  canceledAt     DateTime?
  endedAt        DateTime?
  
  // Pagamento
  paymentMethod  String? // card, pix, boleto
  lastPaymentAt  DateTime?
  nextPaymentAt  DateTime?
  
  // Auditoria
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
  @@index([status])
  @@index([nextPaymentAt])
  @@map("subscriptions")
}

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELED
  UNPAID
  TRIALING
}

// ============================================
// MÉTRICAS AGREGADAS (cache para dashboard)
// ============================================

model DailyMetric {
  id    String   @id @default(cuid())
  date  DateTime @unique @db.Date
  
  // Leads
  newLeads       Int @default(0)
  convertedLeads Int @default(0)
  
  // Usuários
  newUsers       Int @default(0)
  activeUsers    Int @default(0)
  churnedUsers   Int @default(0)
  
  // Financeiro
  mrr            Float @default(0) // Monthly Recurring Revenue
  newRevenue     Float @default(0)
  churnRevenue   Float @default(0)
  
  // Engajamento
  questionsAnswered Int @default(0)
  avgStudyTime      Int @default(0) // minutos
  
  // Atualização
  updatedAt DateTime @updatedAt
  
  @@index([date])
  @@map("daily_metrics")
}

// ============================================
// SISTEMA DE NOTIFICAÇÕES INTERNAS
// ============================================

model Notification {
  id      String   @id @default(cuid())
  adminId String
  
  type    NotificationType
  title   String
  message String
  link    String?  // Link para recurso relacionado
  
  isRead  Boolean  @default(false)
  readAt  DateTime?
  
  createdAt DateTime @default(now())
  
  @@index([adminId, isRead])
  @@index([createdAt])
  @@map("notifications")
}

enum NotificationType {
  NEW_LEAD
  NEW_USER
  PAYMENT_FAILED
  SUBSCRIPTION_CANCELED
  HIGH_CHURN_ALERT
  SYSTEM_ERROR
  MILESTONE_REACHED
}
```

---

## 🔐 ARQUITETURA DE AUTENTICAÇÃO

### Fluxo de Login

```
1. Admin acessa /admin
   └─> Verifica se tem session ativa
       ├─> SIM: Redireciona para /admin/dashboard
       └─> NÃO: Mostra tela de login

2. Admin digita email + senha
   └─> POST /api/admin/login
       ├─> Valida credenciais (bcrypt compare)
       ├─> Verifica se isActive = true
       ├─> Verifica loginAttempts < 5
       ├─> Cria AdminSession (JWT)
       ├─> Registra AuditLog (LOGIN)
       └─> Retorna token + dados admin

3. Frontend armazena token em httpOnly cookie
   └─> Todas requests para /admin/* enviam cookie
       └─> Middleware valida token
           ├─> Token válido: permite acesso
           └─> Token inválido: redirect /admin/login
```

### Segurança Implementada

**1. Rate Limiting:**
```typescript
// Máximo 5 tentativas de login em 15 minutos
if (admin.loginAttempts >= 5) {
  throw new Error('Conta temporariamente bloqueada')
}
```

**2. Proteção CSRF:**
```typescript
// Token CSRF em cada form
<input type="hidden" name="csrf" value={csrfToken} />
```

**3. Session Expiry:**
```typescript
// Sessions expiram em 24h
expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
```

**4. IP Whitelist (opcional):**
```typescript
// Só permite login de IPs específicos (seu escritório/casa)
const allowedIPs = ['189.x.x.x']
if (!allowedIPs.includes(req.ip)) {
  throw new Error('IP não autorizado')
}
```

**5. 2FA (futuro):**
```typescript
// Autenticação em 2 fatores via email/SMS
// Fase 2 do projeto
```

---

## 📱 PÁGINAS E FUNCIONALIDADES

### 1. `/admin` - Login

**Design:**
- Fundo gradiente verde/azul (marca Passarei)
- Card centralizado
- Logo no topo
- Form minimalista

**Campos:**
```tsx
<form>
  <input type="email" placeholder="admin@passarei.com.br" />
  <input type="password" placeholder="Senha" />
  <button>Entrar</button>
  <a href="/admin/recuperar-senha">Esqueci minha senha</a>
</form>
```

**Features:**
- Validação em tempo real
- Loading state no botão
- Mensagens de erro claras
- Lembrar de mim (7 dias)

---

### 2. `/admin/dashboard` - Overview

**Layout:**
```
┌─────────────────────────────────────────────┐
│ SIDEBAR │ HEADER (nome, notifs, logout)    │
├─────────┼─────────────────────────────────────┤
│ Nav     │ KPI CARDS (4 principais)           │
│ Links   │ ┌────┬────┬────┬────┐              │
│         │ │Lead│User│ MRR│Conv│              │
│ • Home  │ └────┴────┴────┴────┘              │
│ • Leads │                                     │
│ • Users │ GRÁFICOS (2 linhas)                │
│ • $$$   │ ┌──────────────┬──────────────┐    │
│ • Cont  │ │Leads/dia     │Receita/mês   │    │
│ • Edit  │ │  (LineChart) │  (BarChart)  │    │
│ • Supp  │ └──────────────┴──────────────┘    │
│         │                                     │
│         │ TABELAS (últimas ações)            │
│         │ • 5 últimos leads                   │
│         │ • 5 últimos usuários                │
│         │ • 5 últimas conversões              │
└─────────┴─────────────────────────────────────┘
```

**KPI Cards:**

```tsx
<div className="grid grid-cols-4 gap-6">
  {/* Card 1: Leads */}
  <Card>
    <Icon>📥</Icon>
    <Label>Leads (hoje)</Label>
    <Value>23</Value>
    <Change>+12% vs ontem</Change>
  </Card>
  
  {/* Card 2: Usuários Ativos */}
  <Card>
    <Icon>👥</Icon>
    <Label>Usuários Ativos</Label>
    <Value>847</Value>
    <Change>+5.2% vs mês passado</Change>
  </Card>
  
  {/* Card 3: MRR */}
  <Card>
    <Icon>💰</Icon>
    <Label>MRR</Label>
    <Value>R$ 25.341</Value>
    <Change>+R$ 2.100 este mês</Change>
  </Card>
  
  {/* Card 4: Taxa de Conversão */}
  <Card>
    <Icon>📈</Icon>
    <Label>Conversão (Lead→User)</Label>
    <Value>18.5%</Value>
    <Change>Meta: 15-25%</Change>
  </Card>
</div>
```

**Gráficos (Recharts):**

```typescript
// Leads por dia (últimos 30 dias)
const leadsData = [
  { date: '01/01', leads: 12, converted: 2 },
  { date: '02/01', leads: 18, converted: 3 },
  // ...
]

<LineChart data={leadsData}>
  <Line dataKey="leads" stroke="#10B981" />
  <Line dataKey="converted" stroke="#1E40AF" />
</LineChart>
```

**Tabelas Rápidas:**

```tsx
<Table>
  <thead>
    <tr>
      <th>Nome</th>
      <th>Email</th>
      <th>Concurso</th>
      <th>Status</th>
      <th>Hora</th>
    </tr>
  </thead>
  <tbody>
    {latestLeads.map(lead => (
      <tr key={lead.id}>
        <td>{lead.name}</td>
        <td>{lead.email}</td>
        <td>{lead.examType}</td>
        <td><Badge status={lead.status} /></td>
        <td>{formatTime(lead.createdAt)}</td>
      </tr>
    ))}
  </tbody>
</Table>
```

---

### 3. `/admin/leads` - Gestão de Leads

**Features:**

**Filtros (topo):**
```tsx
<Filters>
  <Select name="status">
    <option value="all">Todos Status</option>
    <option value="NEW">Novos</option>
    <option value="CONTACTED">Contatados</option>
    <option value="CONVERTED">Convertidos</option>
  </Select>
  
  <Select name="examType">
    <option value="all">Todos Concursos</option>
    <option value="PM">PM</option>
    <option value="PC">PC</option>
    <option value="PRF">PRF</option>
    <option value="PF">PF</option>
  </Select>
  
  <DateRangePicker />
  
  <SearchInput placeholder="Buscar por nome ou email" />
  
  <Button onClick={exportCSV}>📥 Exportar CSV</Button>
</Filters>
```

**Tabela Completa:**
```tsx
<Table>
  <thead>
    <tr>
      <th><Checkbox /> Selecionar</th>
      <th>Nome</th>
      <th>Email</th>
      <th>WhatsApp</th>
      <th>Concurso</th>
      <th>Estado</th>
      <th>Status</th>
      <th>Data</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    {leads.map(lead => (
      <tr key={lead.id} className="hover:bg-gray-50">
        <td><Checkbox /></td>
        <td>{lead.name}</td>
        <td>{lead.email}</td>
        <td>
          <a href={`https://wa.me/${lead.phone}`} target="_blank">
            {formatPhone(lead.phone)} 📱
          </a>
        </td>
        <td>{lead.examType}</td>
        <td>{lead.state}</td>
        <td>
          <Badge status={lead.status}>
            {lead.status}
          </Badge>
        </td>
        <td>{formatDate(lead.createdAt)}</td>
        <td>
          <DropdownMenu>
            <MenuItem onClick={() => viewDetails(lead.id)}>
              👁️ Ver Detalhes
            </MenuItem>
            <MenuItem onClick={() => editStatus(lead.id)}>
              ✏️ Editar Status
            </MenuItem>
            <MenuItem onClick={() => convertToUser(lead.id)}>
              ✅ Converter em Usuário
            </MenuItem>
            <MenuItem onClick={() => sendWhatsApp(lead.id)}>
              💬 Enviar WhatsApp
            </MenuItem>
            <MenuItem onClick={() => deleteLead(lead.id)} danger>
              🗑️ Deletar
            </MenuItem>
          </DropdownMenu>
        </td>
      </tr>
    ))}
  </tbody>
</Table>

<Pagination 
  currentPage={1} 
  totalPages={10} 
  onPageChange={setPage} 
/>
```

**Ações em Massa:**
```tsx
<BulkActions>
  <Select>
    <option>Ações em Massa</option>
    <option>Marcar como Contatado</option>
    <option>Exportar Selecionados</option>
    <option>Deletar Selecionados</option>
  </Select>
  <Button>Aplicar (3 selecionados)</Button>
</BulkActions>
```

**Modal de Detalhes:**
```tsx
<Modal title="Detalhes do Lead">
  <Section>
    <h3>Informações Pessoais</h3>
    <Field label="Nome">{lead.name}</Field>
    <Field label="Email">{lead.email}</Field>
    <Field label="WhatsApp">{lead.phone}</Field>
  </Section>
  
  <Section>
    <h3>Concurso</h3>
    <Field label="Tipo">{lead.examType}</Field>
    <Field label="Estado">{lead.state}</Field>
  </Section>
  
  <Section>
    <h3>Tracking</h3>
    <Field label="Origem">{lead.source}</Field>
    <Field label="UTM Source">{lead.utmSource}</Field>
    <Field label="Criado em">{lead.createdAt}</Field>
  </Section>
  
  <Section>
    <h3>Notas Internas</h3>
    <Textarea 
      value={lead.notes} 
      onChange={updateNotes}
      placeholder="Adicione observações sobre este lead..."
    />
  </Section>
  
  <Actions>
    <Button onClick={save}>Salvar</Button>
    <Button onClick={close} variant="secondary">Fechar</Button>
  </Actions>
</Modal>
```

---

### 4. `/admin/users` - Gestão de Usuários

Similar ao `/admin/leads`, mas com:

**Campos extras:**
- Plano (FREE/CALOURO/VETERANO)
- Status assinatura
- Último acesso
- Taxa de engajamento
- Questões respondidas
- Tempo total de estudo

**Ações específicas:**
- Dar acesso premium temporário
- Resetar senha
- Ver progresso detalhado
- Enviar mensagem via WhatsApp
- Suspender conta

**Filtros:**
- Por plano
- Por status (ativo/inativo)
- Por engajamento (alto/médio/baixo)
- Por risco de churn

---

### 5. `/admin/revenue` - Financeiro

**KPIs:**
```tsx
<Grid cols={3}>
  <Card>
    <Label>MRR (Monthly Recurring Revenue)</Label>
    <Value>R$ 25.341,00</Value>
    <Change>+8.5% vs mês passado</Change>
    <Target>Meta: R$ 50k até Jun/25</Target>
  </Card>
  
  <Card>
    <Label>ARR (Annual Recurring Revenue)</Label>
    <Value>R$ 304.092,00</Value>
    <Projection>Projeção: R$ 450k</Projection>
  </Card>
  
  <Card>
    <Label>Churn Rate</Label>
    <Value>4.2%</Value>
    <Status good>Abaixo de 5% ✅</Status>
  </Card>
</Grid>
```

**Gráfico de Receita:**
```typescript
// Receita mensal (últimos 12 meses)
const revenueData = [
  { month: 'Jan', mrr: 0, arr: 0 },
  { month: 'Fev', mrr: 0, arr: 0 },
  { month: 'Mar', mrr: 5200, arr: 62400 },
  // ...
]

<BarChart data={revenueData}>
  <Bar dataKey="mrr" fill="#10B981" />
  <Line dataKey="arr" stroke="#1E40AF" />
</BarChart>
```

**Distribuição por Plano:**
```tsx
<PieChart>
  <Pie data={[
    { name: 'Gratuito', value: 847, color: '#gray' },
    { name: 'Calouro', value: 234, color: '#blue' },
    { name: 'Veterano', value: 89, color: '#green' },
  ]} />
</PieChart>
```

**Tabela de Transações:**
```tsx
<Table>
  <thead>
    <tr>
      <th>Data</th>
      <th>Usuário</th>
      <th>Plano</th>
      <th>Valor</th>
      <th>Status</th>
      <th>Gateway</th>
    </tr>
  </thead>
  <tbody>
    {transactions.map(tx => (
      <tr>
        <td>{tx.date}</td>
        <td>{tx.user.name}</td>
        <td>{tx.plan}</td>
        <td>R$ {tx.amount}</td>
        <td><Badge status={tx.status} /></td>
        <td>{tx.gateway}</td>
      </tr>
    ))}
  </tbody>
</Table>
```

---

### 6. `/admin/content` - Gestão de Conteúdo

**Lista de Conteúdos:**
```tsx
<ContentGrid>
  {contents.map(content => (
    <ContentCard>
      <Title>{content.title}</Title>
      <Meta>
        <Subject>{content.subject}</Subject>
        <Date>{content.createdAt}</Date>
      </Meta>
      <Stats>
        <Stat>
          <Icon>👁️</Icon>
          <Value>{content.views}</Value>
        </Stat>
        <Stat>
          <Icon>❤️</Icon>
          <Value>{content.likes}</Value>
        </Stat>
      </Stats>
      <Status>{content.status}</Status>
      <Actions>
        <Button size="sm" onClick={() => edit(content.id)}>
          Editar
        </Button>
        <Button size="sm" variant="danger" onClick={() => del(content.id)}>
          Deletar
        </Button>
      </Actions>
    </ContentCard>
  ))}
</ContentGrid>
```

**Editor de Conteúdo:**
```tsx
<Form>
  <Input label="Título" placeholder="Ex: Princípio da Legalidade" />
  
  <Textarea 
    label="Descrição" 
    placeholder="Resumo curto do conteúdo..."
    maxLength={200}
  />
  
  <Select label="Matéria">
    <option>Direito Penal</option>
    <option>Direito Constitucional</option>
    {/* ... */}
  </Select>
  
  <Editor 
    label="Conteúdo"
    placeholder="Escreva o conteúdo completo aqui..."
    minLength={500}
  />
  
  <MultiSelect label="Concursos Relacionados">
    <option value="PM-SP">PM-SP</option>
    <option value="PC-RJ">PC-RJ</option>
    {/* ... */}
  </MultiSelect>
  
  <RadioGroup label="Status">
    <Radio value="DRAFT">Rascunho</Radio>
    <Radio value="PUBLISHED">Publicar</Radio>
  </RadioGroup>
  
  <Actions>
    <Button type="submit">Salvar</Button>
    <Button variant="secondary" onClick={preview}>Preview</Button>
  </Actions>
</Form>
```

---

### 7. `/admin/editais` - Gestão de Editais

**Lista de Editais:**
```tsx
<Table>
  <thead>
    <tr>
      <th>Nome</th>
      <th>Tipo</th>
      <th>Estado</th>
      <th>Ano</th>
      <th>Matérias</th>
      <th>Status</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    {editais.map(edital => (
      <tr>
        <td>{edital.name}</td>
        <td>{edital.examType}</td>
        <td>{edital.state || 'Federal'}</td>
        <td>{edital.year}</td>
        <td>{edital.subjects.length} matérias</td>
        <td><Badge status={edital.status} /></td>
        <td>
          <Button onClick={() => view(edital.id)}>Ver</Button>
          <Button onClick={() => edit(edital.id)}>Editar</Button>
          <Button onClick={() => analyze(edital.id)}>
            Analisar com IA
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>
```

**Criar Novo Edital:**
```tsx
<Form>
  <Input label="Nome" placeholder="Ex: PM-SP 2024" />
  
  <Select label="Tipo">
    <option value="PM">PM</option>
    <option value="PC">PC</option>
    <option value="PRF">PRF</option>
    <option value="PF">PF</option>
  </Select>
  
  <Select label="Estado" nullable>
    <option value="">Federal</option>
    <option value="SP">São Paulo</option>
    <option value="RJ">Rio de Janeiro</option>
    {/* ... */}
  </Select>
  
  <Input label="Ano" type="number" defaultValue={2025} />
  
  <Input 
    label="Link do PDF do Edital" 
    placeholder="https://exemplo.com/edital.pdf"
  />
  
  <Button type="button" onClick={analyzeWithAI}>
    🤖 Analisar PDF com IA
  </Button>
  
  {/* Depois da análise, mostra: */}
  <SubjectsManager subjects={aiAnalysis.subjects} />
  
  <Button type="submit">Salvar Edital</Button>
</Form>
```

---

### 8. `/admin/support` - Suporte

**Tickets/Mensagens:**
```tsx
<TicketList>
  {tickets.map(ticket => (
    <TicketCard status={ticket.status}>
      <Header>
        <Avatar src={ticket.user.avatar} />
        <UserInfo>
          <Name>{ticket.user.name}</Name>
          <Email>{ticket.user.email}</Email>
        </UserInfo>
        <Badge>{ticket.status}</Badge>
      </Header>
      
      <Subject>{ticket