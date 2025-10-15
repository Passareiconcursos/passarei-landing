# CORREÇÃO FINAL - FASE 1 PASSAREI

Implemente as correções abaixo com ATENÇÃO aos detalhes.

---

## ⚠️ IMPORTANTE: AS IMAGENS JÁ FORAM FEITAS UPLOAD

As seguintes imagens JÁ ESTÃO na pasta `/public/`:
- ✅ `logo.png` (160x40px)
- ✅ `favicon.ico`
- ✅ `favicon-16x16.png`
- ✅ `favicon-32x32.png`
- ✅ `apple-touch-icon.png`
- ✅ `android-chrome-192x192.png`
- ✅ `android-chrome-512x512.png`

**Você só precisa USAR essas imagens no código.**

---

## 1. CORRIGIR LOGO (Header e Footer)

### 1.1 Header:

```tsx
<header className="fixed top-0 w-full bg-white shadow-sm z-50">
  <div className="container mx-auto px-4 py-3 flex items-center justify-between">
    
    {/* Logo - CORRETO */}
    <a 
      href="/" 
      className="flex items-center hover:opacity-80 transition-opacity"
    >
      <img 
        src="/logo.png" 
        alt="Passarei - Concursos Policiais" 
        className="h-8 md:h-10 w-auto"
        onError={(e) => {
          console.error('Logo não carregou')
          e.currentTarget.style.display = 'none'
        }}
      />
    </a>
    