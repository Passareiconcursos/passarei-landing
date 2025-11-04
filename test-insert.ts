import { db } from "./db";
import { leads } from "./db/schema";

async function test() {
  console.log("🧪 Testando inserção manual...");
  
  try {
    const result = await db.insert(leads).values({
      name: "Teste Manual",
      email: "teste.manual.123@email.com",
      phone: "11999999999",
      examType: "PM",
      state: "SP",
      status: "NOVO",
      acceptedWhatsApp: true,
      source: "teste",
    }).returning();
    
    console.log("✅ Lead inserido:", result[0]);
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    process.exit(0);
  }
}

test();
