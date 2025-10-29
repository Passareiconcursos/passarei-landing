import bcrypt from "bcrypt";
import { db } from "./db";
import { admins } from "./db/schema";
import { eq } from "drizzle-orm";

async function testBcrypt() {
  console.log("🧪 Testando bcrypt...\n");

  // Buscar admin do banco
  const [admin] = await db
    .select()
    .from(admins)
    .where(eq(admins.email, "admin@passarei.com"))
    .limit(1);

  if (!admin) {
    console.log("❌ Admin não encontrado no banco!");
    process.exit(1);
  }

  console.log("✅ Admin encontrado:");
  console.log("   Email:", admin.email);
  console.log("   Hash no banco:", admin.passwordHash.substring(0, 30) + "...");
  console.log("   Comprimento do hash:", admin.passwordHash.length);
  console.log("");

  // Senha que deveria funcionar
  const passwordToTest = "admin123";
  
  console.log("🔑 Testando senha:", passwordToTest);
  console.log("");

  try {
    const isValid = await bcrypt.compare(passwordToTest, admin.passwordHash);
    console.log("✅ Resultado da verificação:", isValid);
    
    if (isValid) {
      console.log("🎉 SENHA CORRETA! Login deveria funcionar.");
    } else {
      console.log("❌ SENHA INCORRETA! Há um problema com o hash.");
      console.log("");
      console.log("🔧 Gerando novo hash com bcrypt...");
      const newHash = await bcrypt.hash(passwordToTest, 10);
      console.log("   Novo hash:", newHash.substring(0, 30) + "...");
      console.log("");
      console.log("📝 Execute este SQL para corrigir:");
      console.log(`   UPDATE admins SET password_hash = '${newHash}' WHERE email = 'admin@passarei.com';`);
    }
  } catch (error) {
    console.log("❌ Erro ao comparar:", error);
  }

  process.exit(0);
}

testBcrypt();
