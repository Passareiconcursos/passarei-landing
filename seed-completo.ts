import { db } from "./db";
import { 
  admins, 
  categories, 
  subjects, 
  leads, 
  users, 
  content,
  questions 
} from "./db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🌱 Iniciando seed completo do Drizzle...\n");

  const adminEmail = "admin@passarei.com";
  const existingAdmin = await db.select().from(admins).where(eq(admins.email, adminEmail));

  let adminId: string;
  if (existingAdmin.length > 0) {
    console.log("✓ Admin já existe:", adminEmail);
    adminId = existingAdmin[0].id;
  } else {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const newAdmin = await db.insert(admins).values({
      email: adminEmail,
      passwordHash: hashedPassword,
      name: "Administrador",
      role: "SUPER_ADMIN",
      isActive: true,
    }).returning();
    adminId = newAdmin[0].id;
    console.log("✓ Admin criado!");
  }

  console.log("\n📋 Criando leads de teste...");
  const leadsData = [
    { name: "João Silva", email: "joao.silva@email.com", phone: "11987654321", examType: "PM", state: "SP", status: "NOVO" },
    { name: "Maria Santos", email: "maria.santos@email.com", phone: "21987654321", examType: "PC", state: "RJ", status: "CONTATADO" },
    { name: "Pedro Costa", email: "pedro.costa@email.com", phone: "31987654321", examType: "PRF", state: "MG", status: "QUALIFICADO" },
    { name: "Ana Oliveira", email: "ana.oliveira@email.com", phone: "41987654321", examType: "PF", state: "PR", status: "NOVO" },
    { name: "Carlos Souza", email: "carlos.souza@email.com", phone: "51987654321", examType: "PM", state: "RS", status: "CONTATADO" },
    { name: "Julia Lima", email: "julia.lima@email.com", phone: "61987654321", examType: "PC", state: "DF", status: "NOVO" },
    { name: "Rafael Alves", email: "rafael.alves@email.com", phone: "71987654321", examType: "PRF", state: "BA", status: "QUALIFICADO" },
    { name: "Fernanda Dias", email: "fernanda.dias@email.com", phone: "81987654321", examType: "PF", state: "PE", status: "NOVO" },
  ];

  let leadsCreated = 0;
  for (const lead of leadsData) {
    const existing = await db.select().from(leads).where(eq(leads.email, lead.email));
    if (existing.length === 0) {
      await db.insert(leads).values({ ...lead, acceptedWhatsApp: true, source: "landing_page" });
      leadsCreated++;
    }
  }
  console.log(`✓ ${leadsCreated} leads criados (${leadsData.length - leadsCreated} já existiam)`);

  console.log("\n👥 Criando usuários de teste...");
  const usersData = [
    { name: "Bruno Martins", email: "bruno.martins@email.com", phone: "11999887766", examType: "PM", state: "SP", plan: "FREE", isActive: true, emailVerified: true },
    { name: "Carla Ferreira", email: "carla.ferreira@email.com", phone: "21999887766", examType: "PC", state: "RJ", plan: "CALOURO", isActive: true, emailVerified: true, subscriptionStatus: "ACTIVE" },
    { name: "Diego Rocha", email: "diego.rocha@email.com", phone: "31999887766", examType: "PRF", state: "MG", plan: "VETERANO", isActive: true, emailVerified: true, subscriptionStatus: "ACTIVE" },
    { name: "Elisa Campos", email: "elisa.campos@email.com", phone: "41999887766", examType: "PF", state: "PR", plan: "FREE", isActive: true, emailVerified: false },
    { name: "Fabio Nunes", email: "fabio.nunes@email.com", phone: "51999887766", examType: "PM", state: "RS", plan: "CALOURO", isActive: false, emailVerified: true, subscriptionStatus: "CANCELED" },
  ];

  let usersCreated = 0;
  for (const user of usersData) {
    const existing = await db.select().from(users).where(eq(users.email, user.email));
    if (existing.length === 0) {
      const hashedPassword = await bcrypt.hash("senha123", 10);
      await db.insert(users).values({ ...user, passwordHash: hashedPassword });
      usersCreated++;
    }
  }
  console.log(`✓ ${usersCreated} usuários criados (${usersData.length - usersCreated} já existiam)`);

  console.log("\n" + "=".repeat(50));
  console.log("🎉 SEED CONCLUÍDO!");
  console.log("=".repeat(50));
  console.log(`\n📊 Criados: ${leadsCreated} leads + ${usersCreated} usuários`);
  console.log("\n🚀 Rode 'tsx check-db.ts' para verificar!\n");
}

main().catch((e) => {
  console.error("❌ Erro:", e);
  process.exit(1);
}).finally(() => {
  process.exit(0);
});
