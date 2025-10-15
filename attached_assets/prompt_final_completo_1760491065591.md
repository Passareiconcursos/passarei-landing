# PROMPT FINAL COMPLETO - PASSAREI

Implemente TODAS as correções abaixo com precisão. Leia tudo antes de começar.

---

## 🎨 PALETA DE CORES OFICIAL

**Verde Primário:** `#18cb96`  
**Preto/Cinza Escuro:** `#1F2937`  
**Branco:** `#FFFFFF`  
**Cinza Claro:** `#F3F4F6`  

**IMPORTANTE:** Use `#18cb96` em TODOS os elementos verdes (botões, ícones, hover, links, badges).

---

## 1. ATUALIZAR HEADLINE PRINCIPAL

### Hero Section - Trocar texto:

**ANTES:**
```
Você Vai Passar no Concurso Policial
(e a gente mostra como)
```

**DEPOIS:**
```
Seu preparador pessoal para concursos policiais.

IA que envia o conteúdo certo, na hora certa — direto no WhatsApp
```

**Styling:**
```tsx
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
  Seu preparador pessoal para concursos policiais.
</h1>

<p className="text-xl md:text-2xl text-gray-600 mb-8">
  IA que envia o conteúdo certo, na hora certa — direto no WhatsApp
</p>
```

---

## 2. LOGO E FAVICON

### As imagens JÁ FORAM feitas upload em /public/

Arquivos disponíveis:
- `/public/logo.png`
- `/public/favicon.ico`
- `/public/favicon.svg`
- `/public/apple-touch-icon.png`
- `/public/favicon-16x16.png`
- `/public/favicon-32x32.png`

### 2.1 Atualizar index.html (ou App.tsx):

```html
<!-- index.html - dentro do <head> -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<meta name="theme-color" content="#18cb96" />
```

### 2.2 Header - Logo clicável:

```tsx
<header className="fixed top-0 w-full bg-white shadow-sm z-50">
  <div className="container mx-auto px-4 py-4 flex items-center justify-between">
    
    {/* Logo - Esquerda - CLICÁVEL */}
    <a 
      href="/" 
      className="flex items-center hover:opacity-80 transition-opacity"
    >
      <img 
        src="/logo.png" 
        alt="Passarei" 
        className="h-8 md:h-10 w-auto"
      />
    </a>
    
    {/* Menu - Centro */}
    <nav className="hidden md:flex items-center gap-8">
      <a href="#como-funciona" className="text-gray-700 hover:text-[#18cb96] transition-colors font-medium">
        Como Funciona
      </a>
      <a href="#depoimentos" className="text-gray-700 hover:text-[#18cb96] transition-colors font-medium">
        Depoimentos
      </a>
      <a href="#planos" className="text-gray-700 hover:text-[#18cb96] transition-colors font-medium">
        Planos
      </a>
      <a href="#faq" className="text-gray-700 hover:text-[#18cb96] transition-colors font-medium">
        FAQ
      </a>
    </nav>
    
    {/* CTA - Direita - APENAS "Cadastrar" */}
    <div className="hidden md:flex">
      <button
        onClick={() => {
          const el = document.getElementById('formulario')
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }}
        className="bg-[#18cb96] text-white px-8 py-3 rounded-lg font-semibold text-base hover:bg-[#14b584] transition-all hover:scale-105 shadow-md hover:shadow-lg"
      >
        Cadastrar
      </button>
    </div>
    
    {/* Mobile - Hamburger */}
    <button className="md:hidden text-gray-700">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
</header>
```

### 2.3 Footer - Logo clicável:

```tsx
<footer className="bg-gray-900 text-white py-12">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      
      {/* Coluna 1 - Logo */}
      <div>
        <a 
          href="/" 
          className="inline-block mb-4 hover:opacity-80 transition-opacity"
        >
          <img 
            src="/logo.png" 
            alt="Passarei" 
            className="h-8 w-auto brightness-0 invert"
          />
        </a>
        <p className="text-gray-400 text-sm">
          Aprove em concursos policiais com IA e WhatsApp
        </p>
      </div>
      
      {/* ... resto do footer ... */}
    </div>
  </div>
</footer>
```

---

## 3. NAVEGAÇÃO EM PÁGINAS DE POLÍTICAS

### Problema: Links não funcionam em /termos-de-uso, /politica-de-privacidade, etc.

### Solução: Usar caminhos absolutos com "/"

Em TODAS as páginas de políticas, atualizar links:

```tsx
// ERRADO:
<a href="#como-funciona">Como Funciona</a>

// CORRETO:
<a href="/#como-funciona">Como Funciona</a>
```

**Aplicar em:**
- Menu de navegação
- Logo (href="/")
- Botão Cadastrar (href="/#formulario")
- Link "Voltar" (href="/")

---

## 4. BOTÕES MOBILE - TEXTO E MARGENS

### 4.1 Botão "Começar Minha Preparação Agora"

**ANTES:** "Começar Minha Preparação Agora"  
**DEPOIS:** "Iniciar Preparação Agora"

```tsx
<div className="w-full px-4">
  <button className="
    w-full md:w-auto
    px-8 py-4
    bg-[#18cb96] text-white
    rounded-lg font-semibold text-lg
    hover:bg-[#14b584] transition-all hover:scale-105
    shadow-lg hover:shadow-xl
  ">
    Iniciar Preparação Agora
  </button>
</div>
```

### 4.2 Botão "Ainda tem dúvidas? Fale com a gente"

**ANTES:** "Ainda tem dúvidas? Fale com a gente"  
**DEPOIS:** "Dúvidas? Chama a gente"

```tsx
<div className="w-full px-4">
  <a 
    href="https://wa.me/5527999999999?text=Olá,%20tenho%20dúvidas"
    target="_blank"
    rel="noopener noreferrer"
    className="
      inline-flex items-center justify-center gap-2
      w-full md:w-auto
      px-8 py-3
      border-2 border-[#18cb96] text-[#18cb96]
      rounded-lg font-semibold text-base
      hover:bg-[#18cb96] hover:text-white
      transition-all
    "
  >
    💬 Dúvidas? Chama a gente
  </a>
</div>
```

### 4.3 Garantir margens corretas em TODOS os botões mobile:

```tsx
// Wrapper padrão para botões em mobile:
<div className="w-full px-4 md:px-0">
  <button className="w-full md:w-auto ...">
    Texto do Botão
  </button>
</div>
```

---

## 5. ÍCONES DESALINHADOS - CORRIGIR

### Problema: Ícones ✅, ❌, ⚠️ estão fora do alinhamento vertical

### 5.1 Seção "Para Quem É" - 4 cards:

```tsx
{/* Card individual */}
<div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
  
  {/* Ícone - Centralizado e com tamanho fixo */}
  <div className="flex items-center justify-center w-12 h-12 bg-[#18cb96] bg-opacity-10 rounded-full mb-4">
    <svg className="w-6 h-6 text-[#18cb96]" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  </div>
  
  {/* Título */}
  <h3 className="text-xl font-bold text-gray-900 mb-3">
    Trabalha 8h/dia e tem pouco tempo livre
  </h3>
  
  {/* Descrição */}
  <p className="text-gray-600 leading-relaxed">
    Estude nos intervalos, no ônibus, em qualquer momento. 
    Apenas 15 minutos por dia são suficientes para resultados reais.
  </p>
  
</div>
```

**APLICAR MESMO PADRÃO** em:
- Seção "Benefícios" (6 cards)
- Tabela comparativa (ícones ✅, ❌, ⚠️)

### 5.2 Tabela Comparativa - Alinhar ícones:

```tsx
<td className="px-4 py-3 text-center">
  <div className="flex items-center justify-center">
    <svg className="w-5 h-5 text-[#18cb96]" fill="currentColor" viewBox="0 0 20 20">
      {/* ✅ Check icon */}
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  </div>
</td>

<td className="px-4 py-3 text-center">
  <div className="flex items-center justify-center">
    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
      {/* ❌ X icon */}
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  </div>
</td>

<td className="px-4 py-3 text-center">
  <div className="flex items-center justify-center">
    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
      {/* ⚠️ Warning icon */}
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  </div>
</td>
```

---

## 6. FAQ - TROCAR ❓ POR NÚMEROS

### ANTES: ❓ Como funciona...
### DEPOIS: 1. Como funciona...

```tsx
<div className="space-y-4">
  
  {/* Pergunta 1 */}
  <div className="border-b border-gray-200 pb-4">
    <button className="flex items-start justify-between w-full text-left">
      <span className="flex items-start gap-3">
        <span className="flex-shrink-0 w-8 h-8 bg-[#18cb96] text-white rounded-full flex items-center justify-center font-bold text-sm">
          1
        </span>
        <span className="text-lg font-semibold text-gray-900">
          Como funciona exatamente? Preciso baixar algum app?
        </span>
      </span>
      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div className="mt-4 pl-11 text-gray-600">
      {/* Resposta */}
    </div>
  </div>
  
  {/* Pergunta 2 */}
  <div className="border-b border-gray-200 pb-4">
    <button className="flex items-start justify-between w-full text-left">
      <span className="flex items-start gap-3">
        <span className="flex-shrink-0 w-8 h-8 bg-[#18cb96] text-white rounded-full flex items-center justify-center font-bold text-sm">
          2
        </span>
        <span className="text-lg font-semibold text-gray-900">
          Funciona para qual concurso policial?
        </span>
      </span>
      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div className="mt-4 pl-11 text-gray-600">
      {/* Resposta */}
    </div>
  </div>
  
  {/* Repetir para todas as 8 perguntas, numerando 1, 2, 3, 4, 5, 6, 7, 8 */}
  
</div>
```

---

## 7. MOCKUP WHATSAPP - CARROSSEL MOBILE (Opção C)

### 7.1 Desktop: Mockup grande (como está)

Manter o mockup atual do celular, MAS corrigir TODAS as cores verdes para `#18cb96`:

```tsx
{/* Header WhatsApp - Corrigir cor */}
<div className="bg-[#18cb96] text-white px-4 py-3 ...">
  <div className="w-10 h-10 bg-white rounded-full ...">
    <span className="text-[#18cb96] font-bold">P</span>
  </div>
  <div>
    <div className="font-semibold">PASSAREI</div>
    <div className="text-xs opacity-90">online agora</div>
  </div>
</div>

{/* Mensagens do usuário - Corrigir cor do balão */}
<div className="bg-[#DCF8C6] ...">  {/* Verde claro do WhatsApp */}
  <p>Resposta do usuário</p>
</div>

{/* Feedback positivo - Corrigir cor */}
<p className="text-[#18cb96] font-bold">✅ CORRETO!</p>
```

### 7.2 Mobile: Carrossel com 3 cards

**Instalar biblioteca Swiper:**
```bash
npm install swiper
```

**Componente:**

```tsx
'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

export default function WhatsAppCarousel() {
  return (
    <div className="md:hidden w-full px-4 py-8">
      <Swiper
        modules={[Pagination]}
        spaceBetween={16}
        slidesPerView={1.1}
        centeredSlides
        pagination={{ clickable: true }}
        className="w-full"
      >
        
        {/* Card 1: Conteúdo */}
        <SwiperSlide>
          <div className="bg-white rounded-2xl shadow-xl border-8 border-gray-800 overflow-hidden">
            
            {/* Notch */}
            <div className="bg-gray-800 h-6 w-32 mx-auto rounded-b-3xl"></div>
            
            {/* Tela */}
            <div className="bg-[#ECE5DD] min-h-[400px] p-4">
              
              {/* Header WhatsApp */}
              <div className="bg-[#18cb96] text-white px-3 py-2 rounded-t-xl flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-[#18cb96] font-bold text-sm">P</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">PASSAREI</div>
                  <div className="text-xs opacity-90">online</div>
                </div>
              </div>
              
              {/* Mensagem 1 */}
              <div className="bg-white rounded-lg rounded-tl-none p-3 shadow mb-3 max-w-[85%]">
                <p className="text-sm">📚 Bom dia! Vamos estudar?</p>
              </div>
              
              {/* Mensagem 2 */}
              <div className="bg-white rounded-lg rounded-tl-none p-3 shadow mb-3 max-w-[90%]">
                <p className="font-semibold text-sm mb-1">Hoje: Princípio da Legalidade</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  O princípio estabelece que o administrador público 
                  só pode agir quando há previsão legal expressa...
                </p>
              </div>
              
              {/* Botões */}
              <div className="bg-white rounded-lg rounded-tl-none p-3 shadow max-w-[75%]">
                <p className="text-xs">Entendeu?</p>
                <div className="flex gap-2 mt-2">
                  <button className="bg-[#18cb96] text-white text-xs px-3 py-1 rounded">
                    👍 Sim
                  </button>
                  <button className="border border-gray-300 text-gray-700 text-xs px-3 py-1 rounded">
                    ❓ Dúvida
                  </button>
                </div>
              </div>
              
            </div>
          </div>
        </SwiperSlide>
        
        {/* Card 2: Questão */}
        <SwiperSlide>
          <div className="bg-white rounded-2xl shadow-xl border-8 border-gray-800 overflow-hidden">
            <div className="bg-gray-800 h-6 w-32 mx-auto rounded-b-3xl"></div>
            
            <div className="bg-[#ECE5DD] min-h-[400px] p-4">
              
              {/* Header */}
              <div className="bg-[#18cb96] text-white px-3 py-2 rounded-t-xl flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-[#18cb96] font-bold text-sm">P</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">PASSAREI</div>
                  <div className="text-xs opacity-90">online</div>
                </div>
              </div>
              
              {/* Questão */}
              <div className="bg-white rounded-lg rounded-tl-none p-3 shadow mb-3">
                <p className="font-bold text-sm mb-2">🎯 QUESTÃO 1/5</p>
                <p className="text-xs mb-2">Sobre legalidade, é correto:</p>
                <div className="space-y-1 text-xs">
                  <p>A) Administrador pode tudo</p>
                  <p>B) Particular só o permitido</p>
                  <p className="font-bold text-[#18cb96]">C) ✅ Correto!</p>
                  <p>D) Legalidade = moralidade</p>
                </div>
              </div>
              
              {/* Resposta usuário */}
              <div className="bg-[#DCF8C6] rounded-lg rounded-tr-none p-3 shadow ml-auto max-w-[30%] text-right">
                <p className="text-sm font-semibold">C</p>
              </div>
              
            </div>
          </div>
        </SwiperSlide>
        
        {/* Card 3: Feedback */}
        <SwiperSlide>
          <div className="bg-white rounded-2xl shadow-xl border-8 border-gray-800 overflow-hidden">
            <div className="bg-gray-800 h-6 w-32 mx-auto rounded-b-3xl"></div>
            
            <div className="bg-[#ECE5DD] min-h-[400px] p-4">
              
              {/* Header */}
              <div className="bg-[#18cb96] text-white px-3 py-2 rounded-t-xl flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-[#18cb96] font-bold text-sm">P</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">PASSAREI</div>
                  <div className="text-xs opacity-90">online</div>
                </div>
              </div>
              
              {/* Feedback positivo */}
              <div className="bg-white rounded-lg rounded-tl-none p-4 shadow text-center">
                <p className="text-2xl font-bold text-[#18cb96] mb-2">✅ CORRETO!</p>
                <p className="text-sm text-gray-600 mb-3">
                  Parabéns! Você dominou esse conceito.
                </p>
                <div className="bg-[#18cb96] bg-opacity-10 rounded-lg p-3">
                  <p className="text-lg font-bold text-[#18cb96]">+10 pontos 🔥</p>
                  <p className="text-xs text-gray-600 mt-1">Sequência: 5 dias</p>
                </div>
              </div>
              
            </div>
          </div>
        </SwiperSlide>
        
      </Swiper>
      
      {/* Legenda abaixo */}
      <p className="text-center text-sm text-gray-500 mt-4">
        ← Arraste para ver como funciona →
      </p>
    </div>
  )
}
```

**IMPORTANTE:** 
- Carrossel aparece **APENAS em mobile** (classe `md:hidden`)
- Mockup grande aparece **APENAS em desktop** (classe `hidden md:block`)

---

## 8. LINKS REDES SOCIAIS NO FOOTER

```tsx
<div className="flex gap-4 mt-6">
  
  {/* Facebook */}
  <a 
    href="https://www.facebook.com/profile.php?id=61582389145624"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#18cb96] transition-colors"
    aria-label="Facebook"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  </a>
  
  {/* Instagram */}
  <a 
    href="https://www.instagram.com/passareiconcursos/"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#18cb96] transition-colors"
    aria-label="Instagram"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.