import Anthropic from "@anthropic-ai/sdk";
import { db } from "../db";
import { sql } from "drizzle-orm";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const CONTENT_PLAN = [
  // PF - 80 conteúdos
  { exam: 'PF', cargo: 'Agente', subject: 'Direito Constitucional', count: 12 },
  { exam: 'PF', cargo: 'Agente', subject: 'Direito Administrativo', count: 12 },
  { exam: 'PF', cargo: 'Agente', subject: 'Direito Penal', count: 10 },
  { exam: 'PF', cargo: 'Agente', subject: 'Português', count: 8 },
  { exam: 'PF', cargo: 'Escrivão', subject: 'Direito Penal', count: 12 },
  { exam: 'PF', cargo: 'Escrivão', subject: 'Direito Processual Penal', count: 12 },
  { exam: 'PF', cargo: 'Delegado', subject: 'Direito Penal', count: 10 },
  { exam: 'PF', cargo: 'Delegado', subject: 'Legislação Especial', count: 10 },
  
  // PRF - 40 conteúdos
  { exam: 'PRF', cargo: 'Policial Rodoviário Federal', subject: 'Legislação de Trânsito', count: 20 },
  { exam: 'PRF', cargo: 'Policial Rodoviário Federal', subject: 'Direito Constitucional', count: 10 },
  { exam: 'PRF', cargo: 'Policial Rodoviário Federal', subject: 'Português', count: 10 },
  
  // PC - 60 conteúdos
  { exam: 'PC', cargo: 'Investigador', subject: 'Direito Penal', count: 15 },
  { exam: 'PC', cargo: 'Investigador', subject: 'Direito Processual Penal', count: 15 },
  { exam: 'PC', cargo: 'Delegado', subject: 'Direito Penal', count: 15 },
  { exam: 'PC', cargo: 'Delegado', subject: 'Criminologia', count: 15 },
  
  // PM - 50 conteúdos
  { exam: 'PM', cargo: 'Soldado', subject: 'Direito Penal', count: 15 },
  { exam: 'PM', cargo: 'Soldado', subject: 'Direito Constitucional', count: 15 },
  { exam: 'PM', cargo: 'Soldado', subject: 'Português', count: 10 },
  { exam: 'PM', cargo: 'Soldado', subject: 'Raciocínio Lógico', count: 10 }
];

async function generateContent(exam: string, cargo: string, subject: string) {
  const prompt = `Crie conteúdo educativo COMPLETO para ${exam} - ${cargo} sobre ${subject}.

IMPORTANTE: Conteúdo deve ser RICO, EDUCATIVO e PROFISSIONAL como os exemplos já existentes no banco.

ESTRUTURA:
- Title: Conceito específico (35-50 caracteres)
- Definition: Explicação COMPLETA e DETALHADA (200-400 caracteres). Deve incluir artigo de lei quando aplicável, explicar o conceito de forma clara e contextualizada.
- Key_points: 4-5 pontos-chave separados por quebra de linha real. Use bullets (•) e seja específico.
- Example: Exemplo PRÁTICO e REALISTA (100-200 caracteres)
- Tip: Dica VALIOSA para prova (80-120 caracteres)

Retorne JSON válido:
{
  "title": "...",
  "definition": "...",
  "keyPoints": "• ...\n• ...\n• ...\n• ...",
  "example": "...",
  "tip": "..."
}`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Erro");

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON não encontrado");

    const data = JSON.parse(jsonMatch[0]);

    await db.execute(sql`
      INSERT INTO ai_generated_content (exam_type, title, definition, key_points, example, tip)
      VALUES (${exam}, ${data.title}, ${data.definition}, ${data.keyPoints}, ${data.example}, ${data.tip})
    `);

    console.log(`✅ ${exam}-${cargo}-${subject}: ${data.title}`);
    return true;
  } catch (error) {
    console.error(`❌ ${exam}-${cargo}-${subject}: ${error}`);
    return false;
  }
}

async function main() {
  console.log('🚀 GERANDO 200+ CONTEÚDOS DE ALTA QUALIDADE\n');
  
  let total = 0;
  let success = 0;
  
  for (const item of CONTENT_PLAN) {
    console.log(`\n📚 ${item.exam} - ${item.cargo} - ${item.subject} (${item.count}x)`);
    
    for (let i = 0; i < item.count; i++) {
      const result = await generateContent(item.exam, item.cargo, item.subject);
      total++;
      if (result) success++;
      
      await new Promise(r => setTimeout(r, 3000)); // 3s entre chamadas
    }
  }
  
  console.log(`\n\n✅ GERAÇÃO CONCLUÍDA!`);
  console.log(`📊 ${success}/${total} conteúdos gerados com sucesso`);
  
  const result = await db.execute(sql`
    SELECT exam_type, COUNT(*) as total 
    FROM ai_generated_content 
    GROUP BY exam_type 
    ORDER BY exam_type
  `);
  
  console.log(`\n📈 TOTAL NO BANCO:`);
  result.rows.forEach((r: any) => console.log(`  ${r.exam_type}: ${r.total}`));
}

main();
