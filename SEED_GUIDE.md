# 🌱 Guia de Seed do Banco de Dados - Passarei

## ⚠️ Problema Identificado

O projeto usa **Drizzle ORM**, mas os arquivos de seed antigos foram criados para Prisma (não configurado).

---

## ✅ Solução Implementada

Criamos um seed correto para Drizzle em `db/seed.ts` que:
- ✅ Cria o admin padrão: `admin@passarei.com` / `admin123`
- ✅ Verifica se já existe antes de criar (evita duplicatas)
- ✅ Usa bcrypt para hash de senha

---

## 📋 Passos para Popular o Banco

Execute os seguintes comandos **no shell do Replit**:

### 1. Fazer Push do Schema Drizzle
```bash
npm run db:push
```
Isso criará todas as tabelas no banco de dados PostgreSQL.

### 2. Rodar o Seed
```bash
npm run db:seed
```
Isso criará o usuário admin padrão.

---

## 🔐 Credenciais Criadas

Após executar o seed, você poderá fazer login no painel admin com:

- **Email**: `admin@passarei.com`
- **Senha**: `admin123`
- **URL**: `/educ/login`

---

## 🧹 Limpeza (Opcional)

Os seguintes arquivos são **desnecessários** e podem ser removidos:

```bash
# Arquivos Prisma antigos (não usados)
rm -rf prisma/
rm install-bcrypt.sh

# Arquivos temporários
rm package.json.fixed package.json.updated package.json.final package.json.drizzle
```

---

## 🚀 Resumo dos Comandos

```bash
# 1. Push do schema
npm run db:push

# 2. Seed (criar admin)
npm run db:seed

# 3. (Opcional) Limpar arquivos antigos
rm -rf prisma/ install-bcrypt.sh package.json.*
```

---

## ✨ Pronto!

Após executar os comandos acima, seu banco estará configurado e você poderá acessar o painel admin.
