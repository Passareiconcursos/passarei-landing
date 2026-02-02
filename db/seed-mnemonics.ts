import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

/**
 * Seed: 15 mnemônicos e macetes para concursos policiais
 * Organizados por Subject com keywords para match dinâmico
 */

interface MnemonicSeed {
  subjectId: string;
  mnemonic: string;
  title: string;
  meaning: string;
  article: string;
  keywords: string[];
  category: "mnemonico" | "macete";
}

function generateId(): string {
  return `mn${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`.slice(0, 25);
}

const MNEMONICS: MnemonicSeed[] = [
  // ============================================
  // DIREITO CONSTITUCIONAL (8)
  // ============================================
  {
    subjectId: "cmichej6a0005rpiyxqjqmyzr", // DIR_CONSTITUCIONAL
    mnemonic: "L.I.M.P.E.",
    title: "Princípios da Administração Pública",
    meaning: "Legalidade, Impessoalidade, Moralidade, Publicidade, Eficiência",
    article: "Art. 37, CF",
    keywords: ["princípios", "administração pública", "art 37", "limpe", "legalidade", "impessoalidade", "moralidade", "publicidade", "eficiência"],
    category: "mnemonico",
  },
  {
    subjectId: "cmichej6a0005rpiyxqjqmyzr",
    mnemonic: "SO-CI-DI-VA-PLU",
    title: "Fundamentos da República Federativa",
    meaning: "Soberania, Cidadania, Dignidade da pessoa humana, Valores sociais do trabalho e livre iniciativa, Pluralismo político",
    article: "Art. 1º, CF",
    keywords: ["fundamentos", "república", "art 1", "soberania", "cidadania", "dignidade", "valores sociais", "pluralismo"],
    category: "mnemonico",
  },
  {
    subjectId: "cmichej6a0005rpiyxqjqmyzr",
    mnemonic: "CON-GA-ERRA-PRO",
    title: "Objetivos Fundamentais da República",
    meaning: "CONstruir sociedade livre, justa e solidária; GArantir o desenvolvimento nacional; ERRAdicar a pobreza e marginalização; PROmover o bem de todos",
    article: "Art. 3º, CF",
    keywords: ["objetivos fundamentais", "art 3", "construir", "garantir", "erradicar", "promover"],
    category: "mnemonico",
  },
  {
    subjectId: "cmichej6a0005rpiyxqjqmyzr",
    mnemonic: "CAPACETE de PM",
    title: "Competência Privativa da União para legislar",
    meaning: "Civil, Agrário, Penal, Aeronáutico, Comercial, Eleitoral, Trabalho, Espacial, Processual, Marítimo",
    article: "Art. 22, CF",
    keywords: ["competência privativa", "legislar", "art 22", "competência da união", "capacete"],
    category: "mnemonico",
  },
  {
    subjectId: "cmichej6a0005rpiyxqjqmyzr",
    mnemonic: "MP3.COM",
    title: "Cargos Privativos de Brasileiros Natos",
    meaning: "Ministro do STF, Presidente e Vice-Presidente da República, Presidente da Câmara, Presidente do Senado, Oficial das Forças Armadas, Ministro de Estado da Defesa, carreira diplomática",
    article: "Art. 12, §3º, CF",
    keywords: ["brasileiro nato", "cargos privativos", "art 12", "nato", "naturalizado"],
    category: "mnemonico",
  },
  {
    subjectId: "cmichej6a0005rpiyxqjqmyzr",
    mnemonic: "VO-SE-FO-DI",
    title: "Cláusulas Pétreas",
    meaning: "VOto direto, secreto, universal e periódico; SEparação dos poderes; FOrma federativa de Estado; DIreitos e garantias individuais",
    article: "Art. 60, §4º, CF",
    keywords: ["cláusulas pétreas", "art 60", "emenda constitucional", "abolir", "limitações"],
    category: "mnemonico",
  },
  {
    subjectId: "cmichej6a0005rpiyxqjqmyzr",
    mnemonic: "R.I.C.C.I.",
    title: "Perda e Suspensão de Direitos Políticos",
    meaning: "Recusa de cumprir obrigação a todos imposta, Improbidade administrativa, Cancelamento da naturalização, Condenação criminal transitada em julgado, Incapacidade civil absoluta",
    article: "Art. 15, CF",
    keywords: ["direitos políticos", "perda", "suspensão", "art 15", "cassação"],
    category: "mnemonico",
  },
  {
    subjectId: "cmichej6a0005rpiyxqjqmyzr",
    mnemonic: "MESSTAL PPP",
    title: "Direitos Sociais",
    meaning: "Moradia, Educação, Saúde, Segurança, Trabalho, Assistência aos desamparados, Lazer, Previdência social, Proteção à infância, Proteção à maternidade",
    article: "Art. 6º, CF",
    keywords: ["direitos sociais", "art 6", "moradia", "educação", "saúde", "segurança", "trabalho"],
    category: "mnemonico",
  },

  // ============================================
  // DIREITO ADMINISTRATIVO (3)
  // ============================================
  {
    subjectId: "cmichej6f0006rpiyqzrso6dc", // DIR_ADMINISTRATIVO
    mnemonic: "DIS-CO-AUTO",
    title: "Atributos do Poder de Polícia",
    meaning: "DIScricionariedade, COercibilidade, AUTOexecutoriedade",
    article: "Doutrina",
    keywords: ["poder de polícia", "atributos", "discricionariedade", "coercibilidade", "autoexecutoriedade"],
    category: "mnemonico",
  },
  {
    subjectId: "cmichej6f0006rpiyqzrso6dc",
    mnemonic: "SU-PER-I-RES",
    title: "Sanções por Ato de Improbidade Administrativa",
    meaning: "SUpensão dos direitos políticos, PERda da função pública, Indisponibilidade dos bens, RESsarcimento ao erário",
    article: "Art. 37, §4º, CF",
    keywords: ["improbidade", "sanções", "art 37", "perda função", "ressarcimento", "indisponibilidade"],
    category: "mnemonico",
  },
  {
    subjectId: "cmichej6f0006rpiyqzrso6dc",
    mnemonic: "ON-DI-FI-PU-MO",
    title: "Requisitos do Ato Administrativo",
    meaning: "Objeto (ou coNteúdo), DIretiva (ou finalidade), FIgura (ou forma), PUblicação (ou competência), MOtivação (ou motivo) — Competência, Finalidade, Forma, Motivo, Objeto",
    article: "Lei 4.717/65, Art. 2º",
    keywords: ["ato administrativo", "requisitos", "elementos", "competência", "finalidade", "forma", "motivo", "objeto"],
    category: "macete",
  },

  // ============================================
  // DIREITO PENAL (3)
  // ============================================
  {
    subjectId: "cmichej6m0007rpiyf4nkyj67", // DIR_PENAL
    mnemonic: "L.U.T.A.",
    title: "Tempo e Lugar do Crime",
    meaning: "LUgar → teoria da Ubiquidade (Art. 6º, CP); Tempo → teoria da Atividade (Art. 4º, CP)",
    article: "Arts. 4º e 6º, CP",
    keywords: ["tempo do crime", "lugar do crime", "ubiquidade", "atividade", "art 4", "art 6", "teoria"],
    category: "mnemonico",
  },
  {
    subjectId: "cmichej6m0007rpiyf4nkyj67",
    mnemonic: "Bruce LEEE",
    title: "Excludentes de Ilicitude (Causas de Exclusão)",
    meaning: "Legítima defesa, Estado de necessidade, Estrito cumprimento do dever legal, Exercício regular do direito",
    article: "Art. 23, CP",
    keywords: ["excludente", "ilicitude", "legítima defesa", "estado de necessidade", "estrito cumprimento", "exercício regular", "art 23"],
    category: "mnemonico",
  },
  {
    subjectId: "cmichej6m0007rpiyf4nkyj67",
    mnemonic: "3TH + RAC + GA",
    title: "Crimes Inafiançáveis",
    meaning: "Tortura, Tráfico, Terrorismo, Hediondos + Racismo + ação de Grupos Armados contra o Estado Democrático",
    article: "Art. 5º, XLII/XLIII/XLIV, CF",
    keywords: ["inafiançável", "fiança", "hediondo", "tortura", "tráfico", "terrorismo", "racismo", "grupos armados", "imprescritível"],
    category: "mnemonico",
  },

  // ============================================
  // DIREITO PROCESSUAL PENAL (1)
  // ============================================
  {
    subjectId: "cmkub49t5dcdaf0e728cb2f95", // DIREITO_PROCESSUAL_PENAL
    mnemonic: "GA-CO-NAS",
    title: "Fundamentos da Prisão Preventiva",
    meaning: "GArantia da ordem pública, COnveniência da instrução criminal, garantia da ordem ecoNÔmica, Aplicação da lei penal, deScumprimento de medidas cautelares",
    article: "Art. 312, CPP",
    keywords: ["prisão preventiva", "art 312", "preventiva", "ordem pública", "instrução criminal", "cautelar"],
    category: "mnemonico",
  },
];

async function seed() {
  console.log("🧠 Iniciando seed de mnemônicos...\n");

  let created = 0;
  let skipped = 0;

  for (const m of MNEMONICS) {
    // Verificar se já existe (por mnemonic + subjectId)
    const existing = await db.execute(sql`
      SELECT id FROM "Mnemonic"
      WHERE "mnemonic" = ${m.mnemonic} AND "subjectId" = ${m.subjectId}
    `) as any[];

    if (existing.length > 0) {
      console.log(`⏭️ Já existe: ${m.mnemonic} (${m.title})`);
      skipped++;
      continue;
    }

    const id = generateId();
    const keywordsJson = JSON.stringify(m.keywords);

    await db.execute(sql`
      INSERT INTO "Mnemonic" (
        "id", "subjectId", "mnemonic", "title", "meaning",
        "article", "keywords", "category", "isActive",
        "createdAt", "updatedAt"
      ) VALUES (
        ${id}, ${m.subjectId}, ${m.mnemonic}, ${m.title}, ${m.meaning},
        ${m.article}, ${keywordsJson}, ${m.category}, true,
        NOW(), NOW()
      )
    `);

    console.log(`✅ ${m.mnemonic} → ${m.title}`);
    created++;
  }

  console.log(`\n📊 Resultado: ${created} criados, ${skipped} já existiam`);
  console.log(`📊 Total de mnemônicos: ${MNEMONICS.length}`);

  process.exit(0);
}

seed();
