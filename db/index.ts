import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

console.log("🔍 Verificando DATABASE_URL...");
console.log("🔍 DATABASE_URL existe:", !!process.env.DATABASE_URL);
console.log("🔍 DATABASE_URL começa com:", process.env.DATABASE_URL?.substring(0, 50) + "...");

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL não está definida!");
  throw new Error("DATABASE_URL must be set.");
}

// Log do usuário na URL
const urlMatch = process.env.DATABASE_URL.match(/postgresql:\/\/([^:]+):/);
console.log("👤 Usuário na URL:", urlMatch ? urlMatch[1] : "não encontrado");

console.log("✅ DATABASE_URL encontrada, conectando ao banco...");

const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });

console.log("✅ Conexão com banco configurada!");
