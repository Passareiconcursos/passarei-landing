import { db } from "./db";
import { editals } from "./db/schema";

async function populateEditals() {
  console.log("🔄 Populando editais de exemplo...\n");

  const editaisExemplo = [
    {
      examType: "PF",
      state: null,
      year: 2025,
      organization: "CEBRASPE",
      pdfUrl: "https://exemplo.com/edital-pf-2025.pdf",
      subjects: [
        {
          name: "DIREITO_PENAL",
          weight: 15,
          questions: 15,
          topics: [
            "Teoria do Crime",
            "Legítima Defesa",
            "Tentativa",
            "Concurso de Crimes",
            "Crimes contra a Administração Pública",
            "Crimes contra a Vida",
            "Crimes contra o Patrimônio",
            "Dosimetria da Pena"
          ]
        },
        {
          name: "DIREITO_CONSTITUCIONAL",
          weight: 12,
          questions: 12,
          topics: [
            "Direitos Fundamentais",
            "Organização do Estado",
            "Poder Legislativo",
            "Poder Executivo",
            "Poder Judiciário",
            "Controle de Constitucionalidade",
            "Direitos Sociais"
          ]
        },
        {
          name: "DIREITO_ADMINISTRATIVO",
          weight: 10,
          questions: 10,
          topics: [
            "Princípios da Administração Pública",
            "Atos Administrativos",
            "Licitações e Contratos",
            "Servidores Públicos",
            "Improbidade Administrativa",
            "Responsabilidade Civil do Estado"
          ]
        },
        {
          name: "CRIMINOLOGIA",
          weight: 8,
          questions: 8,
          topics: [
            "Teorias da Criminalidade",
            "Criminologia Crítica",
            "Vitimologia",
            "Política Criminal"
          ]
        }
      ],
      status: "active"
    },
    {
      examType: "PRF",
      state: null,
      year: 2025,
      organization: "CEBRASPE",
      pdfUrl: "https://exemplo.com/edital-prf-2025.pdf",
      subjects: [
        {
          name: "DIREITO_PENAL",
          weight: 12,
          questions: 10,
          topics: [
            "Crimes de Trânsito",
            "Embriaguez ao Volante",
            "Homicídio Culposo no Trânsito",
            "Lesão Corporal no Trânsito"
          ]
        },
        {
          name: "LEGISLACAO_TRANSITO",
          weight: 20,
          questions: 20,
          topics: [
            "Código de Trânsito Brasileiro",
            "Infrações e Penalidades",
            "Sinalização Viária",
            "Direção Defensiva",
            "Primeiros Socorros"
          ]
        },
        {
          name: "DIREITO_CONSTITUCIONAL",
          weight: 10,
          questions: 10,
          topics: [
            "Direitos Fundamentais",
            "Organização do Estado"
          ]
        }
      ],
      status: "active"
    },
    {
      examType: "PM",
      state: "SP",
      year: 2025,
      organization: "VUNESP",
      pdfUrl: "https://exemplo.com/edital-pm-sp-2025.pdf",
      subjects: [
        {
          name: "DIREITO_PENAL_MILITAR",
          weight: 15,
          questions: 15,
          topics: [
            "Crimes Militares",
            "Insubordinação",
            "Deserção",
            "Abandono de Posto"
          ]
        },
        {
          name: "DIREITO_CONSTITUCIONAL",
          weight: 10,
          questions: 10,
          topics: [
            "Direitos Fundamentais",
            "Segurança Pública"
          ]
        },
        {
          name: "DIREITO_ADMINISTRATIVO",
          weight: 8,
          questions: 8,
          topics: [
            "Princípios da Administração",
            "Atos Administrativos"
          ]
        }
      ],
      status: "active"
    }
  ];

  try {
    for (const edital of editaisExemplo) {
      const resultado = await db.insert(editals).values(edital).returning();
      console.log(`✅ Edital criado: ${edital.examType} ${edital.year} (${resultado[0].id})`);
    }
    
    console.log("\n🎉 Editais populados com sucesso!");
    console.log("\n📊 Resumo:");
    console.log("- PF 2025: 4 matérias, 33 tópicos");
    console.log("- PRF 2025: 3 matérias, 11 tópicos");
    console.log("- PM-SP 2025: 3 matérias, 8 tópicos");
    console.log("\n✨ Total: 52 tópicos disponíveis para geração!");
    
  } catch (error) {
    console.error("❌ Erro ao popular editais:", error);
  }
  
  process.exit(0);
}

populateEditals();
