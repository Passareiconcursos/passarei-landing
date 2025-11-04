import { db } from "./db";
import { sql } from "drizzle-orm";

async function checkDB() {
  console.log("🔍 Verificando banco de dados...\n");
  
  try {
    const result = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log("📊 Tabelas encontradas:");
    console.log(result.rows.map(r => `  ✓ ${r.table_name}`).join('\n'));
    console.log(`\n✅ Total: ${result.rows.length} tabelas`);
    
    console.log("\n📈 Contagem de registros:");
    
    const tables = ['admins', 'categories', 'subjects', 'leads', 'users', 'content', 'questions'];
    
    for (const table of tables) {
      try {
        const count = await db.execute(sql`SELECT COUNT(*) as count FROM ${sql.identifier(table)}`);
        console.log(`  ${table}: ${count.rows[0].count} registro(s)`);
      } catch (e) {
        console.log(`  ${table}: ❌ não existe`);
      }
    }
    
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    process.exit(0);
  }
}

checkDB();
