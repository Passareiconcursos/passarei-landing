import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "./schema";

neonConfig.webSocketConstructor = ws;

// Log para debug
console.log("🔍 Verificando DATABASE_URL...");
console.log("🔍 DATABASE_URL existe:", !!process.env.DATABASE_URL);
console.log("🔍 DATABASE_URL começa com:", process.env.DATABASE_URL?.substring(0, 30) + "...");

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL não está definida!");
  console.error("📋 Variáveis disponíveis:", Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('SUPABASE') || k.includes('PG')));
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log("✅ DATABASE_URL encontrada, conectando ao banco...");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

console.log("✅ Conexão com banco configurada!");
