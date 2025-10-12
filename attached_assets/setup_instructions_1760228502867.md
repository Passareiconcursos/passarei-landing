# 🚀 INSTRUÇÕES COMPLETAS - SETUP PASSAREI NO REPLIT

## 📋 ÍNDICE
1. [Pré-requisitos](#pre-requisitos)
2. [Setup Supabase](#setup-supabase)
3. [Criar Projeto no Replit](#criar-projeto-replit)
4. [Prompt para Replit Agent](#prompt-replit-agent)
5. [Validação e Testes](#validacao-testes)
6. [Troubleshooting](#troubleshooting)

---

## 1. PRÉ-REQUISITOS

### ✅ Checklist Antes de Começar

- [ ] Email criado: passarei.oficial@gmail.com (ou similar)
- [ ] Domínio registrado: passarei.com.br
- [ ] Conta Supabase criada (supabase.com)
- [ ] Conta Replit criada (replit.com)
- [ ] PRD da Landing Page (Documento 1) salvo
- [ ] Schema Prisma (Documento 2) salvo

---

## 2. SETUP SUPABASE

### 2.1 Criar Projeto no Supabase

1. **Acesse:** https://supabase.com
2. **Login** com o email do Passarei
3. **New Project:**
   - Name: `passarei-production`
   - Database Password: [crie uma senha forte - GUARDE!]
   - Region: `South America (São Paulo)` ← Importante!
   - Pricing: `Free` (por enquanto)
4. **Create Project** (aguarde 2-3 minutos)

### 2.2 Pegar Credenciais

Após o projeto ser criado:

1. **Menu lateral:** Settings → API
2. **Copie estas informações:**

```bash
# PROJECT URL
https://xxxxxxxxxxxxx.supabase.co

# ANON KEY (public)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# SERVICE ROLE KEY (secret - NUNCA COMPARTILHE!)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Menu lateral:** Settings → Database
4. **Copie:**

```bash
# CONNECTION STRING (Direct)
postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres

# Substitua [PASSWORD] pela senha que você criou
```

### 2.3 Guardar Credenciais com Segurança

Crie um arquivo **LOCAL** (não suba pro Replit ainda):

```bash
# supabase-credentials.txt

PROJECT_URL=https://xxxxxxxxxxxxx.supabase.co
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:SUA_SENHA@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

**⚠️ IMPORTANTE:** Este arquivo é SENSÍVEL! Não compartilhe!

---

## 3. CRIAR PROJETO NO REPLIT

### 3.1 Novo Repl

1. **Acesse:** https://replit.com
2. **Login** com o email do Passarei
3. **Create Repl:**
   - Template: `Next.js` ✅
   - Title: `passarei-landing`
   - Public/Private: `Private` (por enquanto)
4. **Create Repl**

### 3.2 Aguardar Inicialização

- Replit vai criar estrutura básica do Next.js
- Aguarde aparecer os arquivos
- NÃO rode nada ainda!

---

## 4. PROMPT PARA REPLIT AGENT

### 4.1 Como Enviar o Prompt

**Opção A: Via Chat do Replit Agent**
1. Abra o Replit Agent (ícone de robô)
2. Cole o prompt completo (abaixo)
3. Envie

**Opção B: Via Arquivo**
1. Crie arquivo: `INSTRUCTIONS.md`
2. Cole o prompt completo
3. Diga ao Agent: "Siga as instruções em INSTRUCTIONS.md"

### 4.2 PROMPT COMPLETO PARA O REPLIT AGENT

```markdown
# INSTRUÇÕES: Criar Landing Page Passarei.com.br

Você é um desenvolvedor full-stack expert em Next.js 14, Prisma, Supabase e Tailwind CSS.

Sua missão: Criar uma landing page de alta conversão para o produto "Passarei" - um assistente de estudos para concursos policiais via WhatsApp.

## CONTEXTO DO PRODUTO

Passarei é um assistente inteligente que ajuda candidatos a concursos policiais (PM, PC, PRF, PF) a estudarem de forma eficiente pelo WhatsApp. Utiliza IA, repetição espaçada e personalização baseada em edital.

## OBJETIVO DESTA FASE

Landing page funcional que:
- Captura leads (nome, email, WhatsApp, concurso, estado)
- Salva no Supabase (PostgreSQL via Prisma)
- Design moderno, responsivo e otimizado para conversão
- Performance excelente (100% Lighthouse)

## STACK TECNOLÓGICO

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Forms:** React Hook Form + Zod
- **Animações:** Framer Motion
- **Icons:** Lucide React

## ESTRUTURA DO PROJETO

```
passarei-landing/
├── app/
│   ├── page.tsx              # Landing page principal
│   ├── layout.tsx            # Layout global
│   ├── obrigado/
│   │   └── page.tsx          # Página pós-cadastro
│   ├── api/
│   │   └── leads/
│   │       └── route.ts      # POST /api/leads
│   └── globals.css
├── components/
│   ├── sections/             # Seções da landing
│   │   ├── Hero.tsx
│   │   ├── SocialProof.tsx
│   │   ├── ParaQuemE.tsx
│   │   ├── Beneficios.tsx
│   │   ├── ComoFunciona.tsx
│   │   ├── Comparativo.tsx
│   │   ├── Pricing.tsx
│   │   ├── Depoimentos.tsx
│   │   ├── FAQ.tsx
│   │   ├── CTAFinal.tsx
│   │   └── Footer.tsx
│   ├── ui/                   # Componentes shadcn
│   └── LeadForm.tsx          # Formulário principal
├── lib/
│   ├── prisma.ts             # Cliente Prisma
│   ├── validations.ts        # Schemas Zod
│   └── utils.ts              # Utilitários
├── prisma/
│   ├── schema.prisma         # Schema do banco
│   └── seed.ts               # Dados iniciais (opcional)
├── public/
│   └── images/
└── .env.local                # Variáveis de ambiente
```

## SCHEMA PRISMA

[COLE AQUI O CONTEÚDO DO DOCUMENTO 2 - SCHEMA PRISMA COMPLETO]

## DESIGN E COPY

[COLE AQUI O CONTEÚDO DO DOCUMENTO 1 - PRD COMPLETO]

## VARIÁVEIS DE AMBIENTE

Crie arquivo `.env.local` com:

```bash
# Supabase / Database
DATABASE_URL="postgresql://postgres:SENHA@db.xxxxx.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:SENHA@db.xxxxx.supabase.co:5432/postgres"

# Supabase Keys (opcional para auth futura)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."

# App Config
NEXT_PUBLIC_SITE_URL="https://passarei.com.br"
NEXT_PUBLIC_WHATSAPP_NUMBER="5511999999999"

# Analytics (opcional)
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_META_PIXEL_ID=""
```

## REGRAS DE IMPLEMENTAÇÃO

### 1. Design System

**Cores:**
```css
--primary-green: #10B981;     /* Marca principal */
--primary-blue: #1E40AF;      /* Confiança */
--dark: #1F2937;              /* Texto */
--light-green: #D1FAE5;       /* Backgrounds */
--light-blue: #DBEAFE;        /* Destaques */
```

**Tipografia:**
- Font: Inter (já vem no Tailwind)
- H1: text-5xl md:text-6xl font-bold
- H2: text-4xl font-bold
- Body: text-base

### 2. Componentes

**Botões CTA:**
```tsx
// Primário (verde)
<button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all">
  💚 Eu Vou Passar!
</button>

// Secundário (outline)
<button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all">
  Ver Demonstração
</button>
```

**Cards:**
```tsx
<div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-100">
  {/* Conteúdo */}
</div>
```

### 3. Responsividade

- Mobile First approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Testar em: iPhone SE, iPhone 12, iPad, Desktop 1920px

### 4. Performance

- Lazy load images
- Optimize images (next/image)
- Minimize JavaScript
- Code splitting automático do Next.js
- Meta: Lighthouse 90+ em todas as métricas

### 5. SEO

**Meta tags essenciais em layout.tsx:**
```tsx
export const metadata = {
  title: 'Passarei - Aprove em Concursos Policiais com IA',
  description: 'Sistema inteligente via WhatsApp para estudar para PM, PC, PRF e PF. Repetição espaçada, conteúdo personalizado e aprovação garantida.',
  keywords: 'concurso policial, PM, PC, PRF, PF, estudos, WhatsApp, IA',
  openGraph: {
    title: 'Passarei - Você Vai Passar',
    description: 'Aprove em concursos policiais com IA',
    url: 'https://passarei.com.br',
    siteName: 'Passarei',
    locale: 'pt_BR',
    type: 'website',
  },
}
```

### 6. Form Handling

**Validação com Zod:**
```tsx
// lib/validations.ts
import { z } from 'zod'

export const leadSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\([0-9]{2}\) [0-9]{5}-[0-9]{4}$/, 'WhatsApp inválido'),
  examType: z.enum(['PM', 'PC', 'PRF', 'PF', 'OUTRO']),
  state: z.string().length(2, 'Estado inválido'),
  acceptedWhatsApp: z.boolean().refine(val => val === true, 'Aceite é obrigatório'),
})
```

**API Route:**
```tsx
// app/api/leads/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { leadSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validar
    const validatedData = leadSchema.parse(body)
    
    // Salvar no banco
    const lead = await prisma.lead.create({
      data: {
        ...validatedData,
        status: 'NOVO',
      }
    })
    
    // Retornar sucesso
    return NextResponse.json({ 
      success: true, 
      leadId: lead.id 
    })
    
  } catch (error) {
    console.error('Erro ao criar lead:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao processar cadastro' 
    }, { status: 400 })
  }
}
```

### 7. Animações

Use Framer Motion para:
- Fade in sections ao scroll
- Hover effects nos cards
- Micro-interactions nos botões

```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true }}
>
  {/* Conteúdo */}
</motion.div>
```

## ORDEM DE IMPLEMENTAÇÃO

### Fase 1: Setup (30 min)
1. Instalar dependências
2. Configurar Prisma
3. Conectar Supabase
4. Testar conexão com banco

### Fase 2: Componentes Base (1h)
1. Layout global
2. Design system (cores, tipografia)
3. Componentes shadcn/ui necessários

### Fase 3: Seções da Landing (2-3h)
1. Hero Section
2. Para Quem É
3. Benefícios
4. Como Funciona
5. Comparativo
6. Pricing
7. Depoimentos
8. FAQ
9. CTA Final
10. Footer

### Fase 4: Formulário (1h)
1. Componente LeadForm
2. Validação Zod
3. API Route
4. Página de obrigado

### Fase 5: Testes e Ajustes (1h)
1. Testar formulário
2. Validar responsividade
3. Otimizar performance
4. Ajustar SEO

## COMANDOS IMPORTANTES

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Criar tabelas no Supabase
npx prisma db push

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Visualizar banco de dados
npx prisma studio
```

## CHECKLIST DE VALIDAÇÃO

Antes de considerar completo:

- [ ] Landing page carrega sem erros
- [ ] Todas as seções aparecem corretamente
- [ ] Formulário valida dados
- [ ] Dados são salvos no Supabase
- [ ] Responsivo em mobile, tablet e desktop
- [ ] Performance Lighthouse > 90
- [ ] SEO meta tags corretas
- [ ] Sem erros no console
- [ ] Links e botões funcionam
- [ ] Animações suaves

## PRÓXIMOS PASSOS (FASE 2)

Após landing funcionando:
- Integração com WhatsApp Business API
- Dashboard admin para ver leads
- Email automático de boas-vindas
- Pixel Meta e Google Analytics

---

## IMPORTANTE

- Use TypeScript sempre
- Comente código complexo
- Siga convenções do Next.js 14
- Mantenha componentes pequenos e reutilizáveis
- Priorize UX e conversão

Agora, construa a landing page seguindo este documento!
```

---

## 5. VALIDAÇÃO E TESTES

### 5.1 Após Replit Agent Terminar

**Checklist Rápido:**

```bash
# 1. Verificar se não há erros no console
# 2. Testar formulário com dados fictícios
# 3. Verificar se lead aparece no Supabase
# 4. Testar em mobile (F12 → Device Toolbar)
```

### 5.2 Como Verificar Leads no Supabase

1. **Supabase Dashboard** → Table Editor
2. **Selecione:** `Lead`
3. **Deve aparecer:** Seus dados de teste

### 5.3 Testes Críticos

**Formulário:**
- [ ] Validação de email funciona
- [ ] Validação de telefone funciona
- [ ] Select de concurso funciona
- [ ] Select de estado funciona
- [ ] Checkbox obrigatório funciona
- [ ] Mensagem de erro aparece
- [ ] Redirecionamento pós-envio funciona

**Visual:**
- [ ] Logo aparece
- [ ] Cores corretas (verde #10B981)
- [ ] Botões hover funcionam
- [ ] Cards têm sombra
- [ ] FAQ expande/colapsa
- [ ] Mobile: stack vertical correto

**Performance:**
- [ ] Lighthouse > 90 (Performance)
- [ ] Lighthouse > 90 (Accessibility)
- [ ] Lighthouse > 90 (Best Practices)
- [ ] Lighthouse > 90 (SEO)

---

## 6. TROUBLESHOOTING

### Problema: "Error connecting to database"

**Solução:**
```bash
# 1. Verificar .env.local
DATABASE_URL=postgresql://postgres:SENHA_CORRETA@...

# 2. Testar conexão
npx prisma db push

# 3. Se falhar, verificar:
# - Senha está correta?
# - IP está liberado no Supabase? (Settings → Database → Connection Pooling)
```

### Problema: "Prisma Client not generated"

**Solução:**
```bash
npx prisma generate
```

### Problema: "Module not found: @/components/..."

**Solução:**
```bash
# Verificar tsconfig.json tem:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Problema: "Form not submitting"

**Solução:**
```tsx
// Verificar API route em: app/api/leads/route.ts
// Console.log para debug:
console.log('Dados recebidos:', body)
console.log('Dados validados:', validatedData)
```

### Problema: "Supabase connection timeout"

**Solução:**
```bash
# Usar Connection Pooler do Supabase
# Em .env.local:
DATABASE_URL="postgresql://postgres.xxx:PASSWORD@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
```

---

## 7. SECRETS DO REPLIT

**Como adicionar variáveis de ambiente no Replit:**

1. **Sidebar** → 🔒 Secrets (ícone de cadeado)
2. **Add Secret:**
   - Key: `DATABASE_URL`
   - Value: `postgresql://postgres:SENHA@...`
3. **Repetir para cada variável**

⚠️ **Secrets são privadas!** Não aparecem em forks/clones.

---

## 8. DEPLOY (FUTURO)

Quando estiver tudo testado no Replit:

### Opção A: Vercel (Recomendado)
```bash
# 1. Conectar GitHub ao Replit
# 2. Push para GitHub
# 3. Vercel: Import from GitHub
# 4. Adicionar secrets no Vercel
# 5. Deploy automático
```

### Opção B: Replit Deploy
```bash
# 1. Replit: Deployment tab
# 2. Connect Domain: passarei.com.br
# 3. Deploy
```

---

## 9. PRÓXIMAS ETAPAS

Após landing funcionando:

**Semana 1:**
- [ ] Conectar domínio passarei.com.br
- [ ] Setup Google Analytics
- [ ] Setup Meta Pixel
- [ ] Primeiras campanhas de tráfego

**Semana 2:**
- [ ] Dashboard admin para ver leads
- [ ] Email automático de boas-vindas
- [ ] WhatsApp automático de boas-vindas

**Semana 3:**
- [ ] Fase 2: Backend completo (User, Content, Questions)
- [ ] Painel do aluno
- [ ] Sistema de pagamentos

---

## 10. CONTATOS E SUPORTE

**Supabase:**
- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com

**Replit:**
- Docs: https://docs.replit.com
- Community: https://replit.com/community

**Prisma:**
- Docs: https://www.prisma.io/docs
- Discord: https://pris.ly/discord

---

## ✅ RESUMO RÁPIDO

1. **Criar projeto Supabase** → copiar credenciais
2. **Criar Repl Next.js** no Replit
3. **Colar Prompt Completo** no Replit Agent (incluir PRD + Schema)
4. **Aguardar construção** (20-40 min)
5. **Adicionar Secrets** no Replit
6. **Testar formulário**
7. **Verificar lead no Supabase**
8. **SUCESSO!** 🎉

---

**Boa sorte! Você está criando algo incrível! 🚀💚**