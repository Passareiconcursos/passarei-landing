import { db } from "./index";
import { admins } from "./schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

async function main() {
  console.log('🌱 Iniciando seed do Drizzle...');

  // ===== ADMIN PADRÃO =====
  const adminEmail = 'admin@passarei.com';
  
  // Verificar se já existe
  const existingAdmin = await db.select().from(admins).where(eq(admins.email, adminEmail));
  
  if (existingAdmin.length > 0) {
    console.log('ℹ️  Admin já existe:', adminEmail);
  } else {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await db.insert(admins).values({
      email: adminEmail,
      passwordHash: hashedPassword,
      name: 'Administrador',
      role: 'SUPER_ADMIN',
      isActive: true,
    });

    console.log('✅ Admin criado com sucesso!');
    console.log('   Email:', adminEmail);
    console.log('   Senha: admin123');
  }

  console.log('🎉 Seed concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
