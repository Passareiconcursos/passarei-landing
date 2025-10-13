# PROMPT COMPLETO - CORREÇÕES FINAIS PASSAREI

Preciso fazer ajustes visuais e funcionais na landing page. Implemente EXATAMENTE como descrito abaixo.

---

## 🎨 PALETA DE CORES OFICIAL

**Verde Primário (Marca):** `#18cb96`
**Preto (Textos):** `#000000` ou `#1F2937` (cinza escuro)
**Branco:** `#FFFFFF`
**Cinza Claro:** `#F3F4F6`
**Cinza Médio:** `#9CA3AF`

**Usar verde `#18cb96` em:**
- Botões CTAs principais
- Hover effects
- Ícones de check (✅)
- Badges "MAIS POPULAR"
- Links hover
- Elementos de destaque

---

## 1. HEADER/NAVEGAÇÃO

### Desktop (> 1024px):

```tsx
<header className="fixed top-0 w-full bg-white shadow-sm z-50">
  <div className="container mx-auto px-4 py-4 flex items-center justify-between">
    
    {/* Logo - Esquerda */}
    <div className="flex items-center">
      <img src="/logo.png" alt="Passarei" className="h-10" />
      <span className="ml-2 text-xl font-bold text-gray-900">PASSAREI</span>
    </div>
    
    {/* Menu - Centro */}
    <nav className="hidden md:flex items-center gap-8">
      <a href="#como-funciona" className="text-gray-700 hover:text-[#18cb96] transition-colors">
        Como Funciona
      </a>
      <a href="#depoimentos" className="text-gray-700 hover:text-[#18cb96] transition-colors">
        Depoimentos
      </a>
      <a href="#planos" className="text-gray-700 hover:text-[#18cb96] transition-colors">
        Planos e Preços
      </a>
      <a href="#faq" className="text-gray-700 hover:text-[#18cb96] transition-colors">
        FAQ
      </a>
    </nav>
    
    {/* CTAs - Direita */}
    <div className="hidden md:flex items-center gap-4">
      <a href="#formulario" className="text-gray-700 hover:text-[#18cb96] transition-colors">
        Entrar
      </a>
      <button
        onClick={() => document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })}
        className="bg-[#18cb96] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#14b584] transition-all hover:scale-105"
      >
        Cadastrar
      </button>
    </div>
    
    {/* Menu Mobile - Hamburger */}
    <button className="md:hidden">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
</header>

{/* Espaçamento para header fixo */}
<div className="h-20"></div>
```

### Mobile (< 768px):

Menu hamburger que abre sidebar ou dropdown.

---

## 2. CORREÇÕES DE FORMULÁRIO

### Campos de Input:

```tsx
// PROBLEMA: Texto branco sobre fundo branco

// SOLUÇÃO:
<input
  type="text"
  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
  bg-white text-gray-900 placeholder-gray-500
  focus:ring-2 focus:ring-[#18cb96] focus:border-transparent
  text-base"
  placeholder="Nome completo"
/>
```

### Selects:

```tsx
// PROBLEMA: Texto branco sobre fundo cinza

// SOLUÇÃO:
<select
  className="w-full px-4 py-3 border border-gray-300 rounded-lg
  bg-white text-gray-900
  focus:ring-2 focus:ring-[#18cb96] focus:border-transparent
  text-base appearance-none cursor-pointer"
>
  <option value="" className="text-gray-900">Qual seu concurso?</option>
  <option value="PM" className="text-gray-900">PM - Polícia Militar</option>
  <option value="PC" className="text-gray-900">PC - Polícia Civil</option>
  <option value="PRF" className="text-gray-900">PRF</option>
  <option value="PF" className="text-gray-900">PF</option>
  <option value="OUTRO" className="text-gray-900">Outro</option>
</select>
```

**Adicionar ícone de seta customizado:**

```tsx
<div className="relative">
  <select className="...">...</select>
  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  </div>
</div>
```

---

## 3. BOTÕES - PADRONIZAÇÃO

### Botão CTA Principal (Verde):

```tsx
<button className="
  bg-[#18cb96] text-white 
  px-8 py-4 rounded-lg 
  font-semibold text-lg
  shadow-lg hover:shadow-2xl
  hover:bg-[#14b584] hover:scale-105
  transition-all duration-300
  disabled:opacity-50 disabled:cursor-not-allowed
">
  💚 Eu Vou Passar!
</button>
```

### Botão Secundário (Outline):

```tsx
<button className="
  border-2 border-[#18cb96] text-[#18cb96]
  px-8 py-4 rounded-lg
  font-semibold text-lg
  hover:bg-[#18cb96] hover:text-white
  transition-all duration-300
">
  Ver Demonstração
</button>
```

### Botão Texto (Link-style):

```tsx
<button className="
  text-gray-700 hover:text-[#18cb96]
  transition-colors duration-200
  underline underline-offset-4
">
  Fale com a gente
</button>
```

---

## 4. RESPONSIVIDADE MOBILE

### Problema: Botões e textos passando margem

**Solução Global:**

```tsx
// Em TODAS as sections:
<section className="w-full px-4 py-12 md:px-6 lg:px-8">
  <div className="container mx-auto max-w-7xl">
    {/* Conteúdo */}
  </div>
</section>
```

### Botões específicos:

**"Começar Minha Preparação Agora":**
```tsx
<button className="
  w-full md:w-auto
  px-6 py-4 md:px-8
  text-base md:text-lg
  bg-[#18cb96] text-white rounded-lg
  hover:bg-[#14b584] transition-all
">
  Começar Minha Preparação Agora
</button>
```

**"Ainda tem dúvidas? Fale com a gente":**
```tsx
<a 
  href="https://wa.me/5527999999999?text=Olá,%20tenho%20dúvidas%20sobre%20o%20Passarei"
  target="_blank"
  className="
    inline-block w-full md:w-auto
    text-center px-6 py-3
    border-2 border-[#18cb96] text-[#18cb96]
    rounded-lg font-semibold
    hover:bg-[#18cb96] hover:text-white
    transition-all
  "
>
  💬 Ainda tem dúvidas? Fale com a gente
</a>
```

### Textos e ícones:

```tsx
// Tamanhos responsivos:
<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
<h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
<p className="text-base md:text-lg">

// Emojis com espaçamento:
<span className="inline-block mr-2">💚</span>
<span>Texto aqui</span>
```

---

## 5. ATUALIZAR DATAS 2024 → 2025

**Encontrar e substituir em TODO o site:**

```
❌ "2024" → ✅ "2025"
❌ "154 aprovações em 2024" → ✅ "178 aprovações em 2024-2025"
❌ "Copyright 2024" → ✅ "Copyright 2025"
```

**Deixar dinâmico no footer:**

```tsx
<p>© {new Date().getFullYear()} Passarei - Todos os direitos reservados</p>
```

---

## 6. CRIAR PÁGINAS LEGAIS

### Estrutura base para todas:

```tsx
// app/termos-de-uso/page.tsx
// app/politica-de-privacidade/page.tsx
// app/politica-de-cookies/page.tsx
// app/politica-de-reembolso/page.tsx

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          
          {/* Header */}
          <div className="mb-8">
            <a href="/" className="text-[#18cb96] hover:underline mb-4 inline-block">
              ← Voltar para Home
            </a>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              [TÍTULO DA PÁGINA]
            </h1>
            <p className="text-gray-500">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
          
          {/* Conteúdo */}
          <div className="prose prose-lg max-w-none">
            {/* Texto aqui */}
          </div>
          
        </div>
      </div>
    </div>
  )
}
```

### Conteúdo de Política de Reembolso:

```markdown
# Política de Reembolso

## 1. Garantia de 15 Dias

Oferecemos garantia incondicional de 15 dias para todos os planos pagos.

Se você não estiver satisfeito por QUALQUER motivo nos primeiros 15 dias, 
basta solicitar o reembolso e devolveremos 100% do valor pago.

## 2. Como Solicitar (Dentro de 15 dias)

1. Envie mensagem no WhatsApp: "Atendimento"
2. Escolha opção: "4 - Solicitar reembolso"
3. Confirme digitando "SIM"
4. Pronto! Reembolso processado automaticamente

**Prazo de estorno:** 5-7 dias úteis (conforme operadora do cartão)

## 3. Reembolso Após 15 Dias

Após o período de garantia, analisamos casos específicos onde:
- O sistema não entregou o conteúdo prometido
- Houve falhas técnicas graves
- Problemas recorrentes não resolvidos

**Processo:**
1. Solicite atendimento no WhatsApp
2. Descreva o problema detalhadamente
3. Análise em até 48 horas
4. Possíveis soluções:
   - Reembolso de 70% via Pix
   - 1 mês gratuito + extensão do plano

## 4. Cancelamento Simples

Você pode cancelar sua assinatura a qualquer momento.
- Acesso continua até o fim do período pago
- Sem multas ou taxas adicionais
- Pode reativar quando quiser

## 5. Contato

Dúvidas? Fale conosco:
- WhatsApp: (27) 99999-9999
- Email: suporte@passarei.com.br
```

---

## 7. LINKS DO FOOTER

Atualizar todos os links:

```tsx
<footer>
  {/* ... */}
  
  <div>
    <h4>Legal</h4>
    <ul>
      <li><a href="/termos-de-uso">Termos de Uso</a></li>
      <li><a href="/politica-de-privacidade">Política de Privacidade</a></li>
      <li><a href="/politica-de-cookies">Política de Cookies</a></li>
      <li><a href="/politica-de-reembolso">Política de Reembolso</a></li>
    </ul>
  </div>
  
  <div>
    <h4>Contato</h4>
    <ul>
      <li>
        <a href="https://wa.me/5527999999999?text=Olá" target="_blank">
          WhatsApp: (27) 99999-9999
        </a>
      </li>
      <li>
        <a href="mailto:suporte@passarei.com.br">
          suporte@passarei.com.br
        </a>
      </li>
      <li>Vitória, ES - Brasil</li>
    </ul>
  </div>
  
  {/* ... */}
</footer>
```

---

## 8. INSTALAR PIXELS (Analytics)

### app/layout.tsx - Adicionar no <head>:

```tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
        
        {/* Meta Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'YOUR_PIXEL_ID');
            fbq('track', 'PageView');
          `}
        </Script>
        
        {/* Hotjar (Opcional) */}
        <Script id="hotjar" strategy="afterInteractive">
          {`
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
      </head>
      
      <body>{children}</body>
    </html>
  )
}
```

**IMPORTANTE:** Substituir:
- `G-XXXXXXXXXX` pelo ID real do Google Analytics
- `YOUR_PIXEL_ID` pelo ID real do Meta Pixel
- `YOUR_HOTJAR_ID` pelo ID do Hotjar (se usar)

---

## 9. MOCKUP WHATSAPP NO HERO

### Criar componente:

```tsx
// components/WhatsAppMockup.tsx
export default function WhatsAppMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Frame do celular */}
      <div className="relative bg-white rounded-[3rem] shadow-2xl border-8 border-gray-800 overflow-hidden">
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-3xl z-10"></div>
        
        {/* Tela */}
        <div className="bg-[#ECE5DD] min-h-[600px] pt-12 pb-6 px-4">
          
          {/* Header WhatsApp */}
          <div className="bg-[#075E54] text-white px-4 py-3 rounded-t-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-[#18cb96] rounded-full flex items-center justify-center font-bold">
              P
            </div>
            <div className="flex-1">
              <div className="font-semibold">PASSAREI</div>
              <div className="text-xs opacity-80">online agora</div>
            </div>
          </div>
          
          {/* Mensagens */}
          <div className="space-y-3 mt-4">
            
            {/* Mensagem do bot */}
            <div className="flex justify-start">
              <div className="bg-white rounded-lg rounded-tl-none p-3 max-w-[80%] shadow">
                <p className="text-sm">📚 Bom dia! Vamos estudar?</p>
              </div>
            </div>
            
            <div className="flex justify-start">
              <div className="bg-white rounded-lg rounded-tl-none p-3 max-w-[80%] shadow">
                <p className="font-semibold text-sm mb-1">Hoje: Princípio da Legalidade</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  O princípio da legalidade estabelece que o administrador público 
                  só pode agir quando há previsão legal expressa...
                </p>
                <p className="text-xs mt-2">
                  Entendeu? 👍 Sim | ❓ Dúvida
                </p>
              </div>
            </div>
            
            {/* Mensagem do usuário */}
            <div className="flex justify-end">
              <div className="bg-[#DCF8C6] rounded-lg rounded-tr-none p-3 shadow">
                <p className="text-sm">👍 Sim</p>
              </div>
            </div>
            
            {/* Questão */}
            <div className="flex justify-start">
              <div className="bg-white rounded-lg rounded-tl-none p-3 max-w-[85%] shadow">
                <p className="font-semibold text-sm mb-2">🎯 QUESTÃO 1/5</p>
                <p className="text-xs mb-2">Sobre legalidade, é correto:</p>
                <p className="text-xs">A) Administrador pode...</p>
                <p className="text-xs">B) Particular só pode...</p>
                <p className="text-xs font-bold text-[#18cb96]">C) ✅ Correto!</p>
              </div>
            </div>
            
            {/* Resposta */}
            <div className="flex justify-end">
              <div className="bg-[#DCF8C6] rounded-lg rounded-tr-none p-3 shadow">
                <p className="text-sm">C</p>
              </div>
            </div>
            
            {/* Feedback */}
            <div className="flex justify-start">
              <div className="bg-white rounded-lg rounded-tl-none p-3 max-w-[80%] shadow">
                <p className="text-sm font-bold text-[#18cb96]">✅ CORRETO!</p>
                <p className="text-xs mt-1">+10 pontos 🔥</p>
                <p className="text-xs text-gray-500">Sequência: 5 dias</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Usar no Hero Section:

```tsx
import WhatsAppMockup from '@/components/WhatsAppMockup'

<section className="...">
  <div className="grid md:grid-cols-2 gap-12 items-center">
    
    {/* Esquerda - Texto */}
    <div>
      <h1>...</h1>
      <p>...</p>
      <button>...</button>
    </div>
    
    {/* Direita - Mockup */}
    <div className="hidden md:block">
      <WhatsAppMockup />
    </div>
    
  </div>
</section>
```

---

## 10. CHECKLIST FINAL

Após implementar TUDO, validar:

- [ ] Header fixo com logo esquerda, menu centro, CTAs direita
- [ ] Formulário: texto preto sobre fundo branco
- [ ] Selects: texto preto, funcionando corretamente
- [ ] Botões usando verde `#18cb96`
- [ ] Todos os botões dentro das margens (mobile)
- [ ] Textos responsivos e legíveis (mobile)
- [ ] Datas atualizadas para 2025
- [ ] Páginas legais criadas e linkadas
- [ ] Pixels instalados (GA4 + Meta)
- [ ] Footer com links funcionais
- [ ] Mockup WhatsApp no Hero
- [ ] Sem erros no console
- [ ] Testado em mobile real

---

## IMPORTANTE:

- Use EXATAMENTE a cor verde `#18cb96` onde indicado
- Mantenha o design bonito que já existe
- Só corrija os problemas listados
- Não mude o que está funcionando bem
- Teste cada mudança

Quando terminar, me avise para eu validar!