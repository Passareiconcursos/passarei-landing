# PROMPT ÚNICO COMPLETO - CORRIGIR LANDING PAGE PASSAREI

Preciso corrigir TODOS os problemas da landing page de uma vez. Faça EXATAMENTE isso:

---

## 1. FORMULÁRIO FUNCIONANDO (PRIORIDADE MÁXIMA)

### Criar arquivo: app/api/leads/route.ts

```typescript
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validação básica
    if (!body.name || !body.email || !body.phone || !body.examType || !body.state) {
      return NextResponse.json({ 
        success: false, 
        error: 'Campos obrigatórios faltando' 
      }, { status: 400 })
    }
    
    // Salvar no banco
    const lead = await prisma.lead.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        examType: body.examType,
        state: body.state,
        interestedPlan: body.interestedPlan || 'GRATUITO',
        acceptedWhatsApp: body.acceptedWhatsApp || false,
        status: 'NOVO',
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      leadId: lead.id 
    })
    
  } catch (error: any) {
    console.error('Erro ao criar lead:', error)
    
    // Erro de email/phone duplicado
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        success: false, 
        error: 'Email ou telefone já cadastrado' 
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao processar cadastro' 
    }, { status: 500 })
  }
}
```

---

## 2. COMPONENTE LEADFORM COMPLETO

### Criar arquivo: components/LeadForm.tsx

```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

const concursos = [
  { value: 'PM', label: 'PM - Polícia Militar' },
  { value: 'PC', label: 'PC - Polícia Civil' },
  { value: 'PRF', label: 'PRF - Polícia Rodoviária Federal' },
  { value: 'PF', label: 'PF - Polícia Federal' },
  { value: 'OUTRO', label: 'Outro concurso policial' },
]

export default function LeadForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    examType: '',
    state: '',
    acceptedWhatsApp: false,
  })

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'phone') {
      setFormData(prev => ({ ...prev, [name]: maskPhone(value) }))
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validações
      if (!formData.name || formData.name.length < 3) {
        throw new Error('Nome deve ter pelo menos 3 caracteres')
      }
      
      if (!formData.email.includes('@')) {
        throw new Error('Email inválido')
      }
      
      if (formData.phone.length < 15) {
        throw new Error('WhatsApp inválido')
      }
      
      if (!formData.examType) {
        throw new Error('Selecione o concurso')
      }
      
      if (!formData.state) {
        throw new Error('Selecione o estado')
      }
      
      if (!formData.acceptedWhatsApp) {
        throw new Error('Você precisa aceitar receber conteúdo via WhatsApp')
      }

      // Enviar para API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao processar cadastro')
      }

      // Sucesso - redirecionar
      router.push('/obrigado')

    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
      {/* Nome */}
      <div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nome completo"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Seu melhor email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      {/* WhatsApp */}
      <div>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="WhatsApp com DDD"
          maxLength={15}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      {/* Concurso */}
      <div>
        <select
          name="examType"
          value={formData.examType}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        >
          <option value="">Qual seu concurso?</option>
          {concursos.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Estado */}
      <div>
        <select
          name="state"
          value={formData.state}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        >
          <option value="">Qual seu estado?</option>
          {estados.map(estado => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
      </div>

      {/* Checkbox */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          name="acceptedWhatsApp"
          checked={formData.acceptedWhatsApp}
          onChange={handleChange}
          className="mt-1 w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
          required
        />
        <label className="text-sm text-gray-600">
          Aceito receber conteúdo educacional via WhatsApp
        </label>
      </div>

      {/* Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Botão */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processando...' : '💚 Eu Vou Passar!'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Ao clicar, você concorda com nossos{' '}
        <a href="#" className="underline">Termos de Uso</a> e{' '}
        <a href="#" className="underline">Política de Privacidade</a>
      </p>
    </form>
  )
}
```

---

## 3. PÁGINA DE OBRIGADO

### Criar arquivo: app/obrigado/page.tsx

```typescript
'use client'
import { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

export default function Obrigado() {
  useEffect(() => {
    // Analytics (quando configurar)
    if (typeof window !== 'undefined') {
      console.log('Conversão registrada!')
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Parabéns! Você Deu o Primeiro Passo! 🎉
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Seu cadastro foi realizado com sucesso!
        </p>
        
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-green-800 mb-3">
            📱 Próximos Passos:
          </h2>
          <ol className="text-left text-gray-700 space-y-3">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>Você receberá uma mensagem no WhatsApp <strong>em até 2 minutos</strong></span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>Salve nosso número como <strong>"Passarei"</strong></span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>Responda a mensagem para ativar seu plano</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">4.</span>
              <span>Receba seu primeiro conteúdo <strong>hoje mesmo</strong>!</span>
            </li>
          </ol>
        </div>
        
        <p className="text-gray-500 mb-6">
          💚 <strong>Você vai passar!</strong> Estamos juntos nessa jornada.
        </p>
        
        <a 
          href="/"
          className="inline-block bg-green-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-600 transition-all"
        >
          Voltar para Home
        </a>
      </div>
    </div>
  )
}
```

---

## 4. ADICIONAR SCROLL SUAVE

Na página principal (page.tsx), adicionar:

1. ID no formulário: `<section id="formulario">`
2. IDs nas outras seções: `#para-quem-e`, `#beneficios`, `#como-funciona`, `#planos`, `#depoimentos`, `#faq`
3. Em TODOS os botões "Eu Vou Passar!", adicionar:

```typescript
onClick={() => {
  document.getElementById('formulario')?.scrollIntoView({ 
    behavior: 'smooth' 
  })
}}
```

---

## 5. FAQ COM ACCORDION

Instalar shadcn/ui Accordion (se não tiver):

```bash
npx shadcn-ui@latest add accordion
```

Usar no FAQ:

```typescript
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="item-1">
    <AccordionTrigger>Como funciona na prática?</AccordionTrigger>
    <AccordionContent>
      Não! Tudo funciona 100% pelo WhatsApp...
    </AccordionContent>
  </AccordionItem>
  {/* Repetir para todas as perguntas */}
</Accordion>
```

---

## 6. ANIMAÇÕES FRAMER MOTION

Em TODAS as seções principais, adicionar:

```typescript
import { motion } from 'framer-motion'

<motion.section
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="..."
>
  {/* conteúdo da seção */}
</motion.section>
```

---

## 7. HOVER EFFECTS

Adicionar em:

**Botões CTAs:**
```
hover:scale-105 hover:shadow-2xl transition-all duration-300
```

**Cards:**
```
hover:-translate-y-2 hover:shadow-xl transition-all duration-300
```

**Cards de Planos:**
```
hover:scale-105 hover:shadow-2xl transition-all duration-300
```

---

## 8. COMPARATIVO TABELA

Melhorar visualmente com símbolos:

```typescript
// Para Passarei
<td className="text-green-600 font-bold">✅</td>

// Para concorrentes (não tem)
<td className="text-red-500">❌</td>

// Para limitado
<td className="text-yellow-600">⚠️</td>
```

Cores de fundo:
- Linha do Passarei: `bg-green-50`
- Linhas concorrentes: `bg-gray-50`

---

## 9. DEPOIMENTOS COM FOTOS

Adicionar fotos usando avatars:

```typescript
<img 
  src={`https://ui-avatars.com/api/?name=Carlos+Mendes&size=80&background=10B981&color=fff&bold=true`}
  alt="Carlos Mendes"
  className="w-20 h-20 rounded-full mx-auto mb-4"
/>
```

Para cada depoimento, usar o nome da pessoa.

---

## 10. FOOTER COMPLETO

Adicionar:

```typescript
import { Instagram, Facebook, Youtube, Linkedin, Mail, Phone } from 'lucide-react'

<footer className="bg-gray-900 text-white py-12">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Coluna 1 - Logo e descrição */}
      <div>
        <h3 className="text-2xl font-bold mb-4">PASSAREI ↗️</h3>
        <p className="text-gray-400">
          Aprove em concursos policiais com IA e WhatsApp
        </p>
      </div>
      
      {/* Coluna 2 - Produto */}
      <div>
        <h4 className="font-semibold mb-4">Produto</h4>
        <ul className="space-y-2 text-gray-400">
          <li><a href="#como-funciona" className="hover:text-white">Como Funciona</a></li>
          <li><a href="#planos" className="hover:text-white">Planos e Preços</a></li>
          <li><a href="#depoimentos" className="hover:text-white">Depoimentos</a></li>
        </ul>
      </div>
      
      {/* Coluna 3 - Ajuda */}
      <div>
        <h4 className="font-semibold mb-4">Ajuda</h4>
        <ul className="space-y-2 text-gray-400">
          <li><a href="#faq" className="hover:text-white">FAQ</a></li>
          <li><a href="#" className="hover:text-white">Contato</a></li>
          <li><a href="#" className="hover:text-white">Suporte</a></li>
        </ul>
      </div>
      
      {/* Coluna 4 - Contato */}
      <div>
        <h4 className="font-semibold mb-4">Contato</h4>
        <div className="space-y-3 text-gray-400">
          <div className="flex items-center gap-2">
            <Mail size={18} />
            <span>contato@passarei.com.br</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={18} />
            <span>(11) 99999-9999</span>
          </div>
        </div>
        
        {/* Redes Sociais */}
        <div className="flex gap-4 mt-6">
          <a href="#" className="hover:text-green-400"><Instagram /></a>
          <a href="#" className="hover:text-green-400"><Facebook /></a>
          <a href="#" className="hover:text-green-400"><Youtube /></a>
          <a href="#" className="hover:text-green-400"><Linkedin /></a>
        </div>
      </div>
    </div>
    
    {/* Copyright */}
    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
      <p>© {new Date().getFullYear()} Passarei - Todos os direitos reservados</p>
    </div>
  </div>
</footer>
```

---

## 11. MELHORIAS VISUAIS FINAIS

**Badge "MAIS POPULAR":**
```typescript
<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
    ⭐ MAIS POPULAR
  </span>
</div>
```

**Gradientes nos CTAs:**
```
bg-gradient-to-r from-green-500 to-green-600
```

**Sombras nos cards:**
```
shadow-lg hover:shadow-2xl
```

---

## CHECKLIST FINAL DE VALIDAÇÃO:

Após implementar TUDO, teste:

- [ ] Formulário aceita dados e valida
- [ ] Select de concurso tem 5 opções
- [ ] Select de estado tem 27 opções
- [ ] Máscara de telefone funciona
- [ ] Checkbox é obrigatório
- [ ] Botão mostra loading
- [ ] Salva no Supabase (verificar em Table Editor)
- [ ] Redireciona para /obrigado
- [ ] Página /obrigado existe e é bonita
- [ ] Botões "Eu Vou Passar!" scrollam para formulário
- [ ] FAQ abre e fecha
- [ ] Animações aparecem ao scroll
- [ ] Hover funciona em cards e botões
- [ ] Tabela comparativa tem ✅ ❌ ⚠️
- [ ] Depoimentos têm fotos
- [ ] Footer completo com links e ícones
- [ ] Mobile responsivo
- [ ] Sem erros no console

---

## IMPORTANTE:

- Implemente TUDO exatamente como descrito
- Não simplifique nenhuma parte
- Não pule nenhuma seção
- Teste cada funcionalidade depois

Quando terminar, me avise para eu validar!