import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Verificando tabela Admin...\n");

  // 1. Listar todos os admins
  const admins = await prisma.admin.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      password: true,
    }
  });

  console.log(`📊 Total de admins: ${admins.length}\n`);

  if (admins.length === 0) {
    console.log("⚠️ Nenhum admin encontrado! Criando admin padrão...\n");

    const passwordHash = await bcrypt.hash("admin@123", 10);

    const newAdmin = await prisma.admin.create({
      data: {
        email: "admin@passarei.com",
        name: "Admin Passarei",
        password: passwordHash,
        role: "SUPER_ADMIN",
        isActive: true,
      }
    });

    console.log("✅ Admin criado!");
    console.log(`   Email: admin@passarei.com`);
    console.log(`   Senha: admin@123`);
    console.log(`   ID: ${newAdmin.id}`);
  } else {
    // Listar admins existentes
    for (const admin of admins) {
      console.log(`📧 Email: ${admin.email}`);
      console.log(`   Nome: ${admin.name}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Ativo: ${admin.isActive ? "Sim" : "Não"}`);
      console.log(`   Hash atual: ${admin.password?.substring(0, 30)}...`);
      console.log("");
    }

    // 2. Atualizar senha do primeiro admin para admin@123
    const targetAdmin = admins.find(a => a.email === "admin@passarei.com") || admins[0];

    console.log(`🔐 Atualizando senha de ${targetAdmin.email}...`);

    const newPasswordHash = await bcrypt.hash("admin@123", 10);

    await prisma.admin.update({
      where: { id: targetAdmin.id },
      data: {
        password: newPasswordHash,
        isActive: true,
      }
    });

    console.log("✅ Senha atualizada com sucesso!");
    console.log(`   Email: ${targetAdmin.email}`);
    console.log(`   Nova senha: admin@123`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
