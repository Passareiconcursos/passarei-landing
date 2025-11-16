import Anthropic from "@anthropic-ai/sdk";
import { db } from "../db";
import { sql } from "drizzle-orm";
import fs from 'fs';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// CONTEÚDOS POR CONCURSO E MATÉRIA
const CONTENT_PLAN = [
  // POLÍCIA FEDERAL
  { exam: 'PF', cargo: 'Agente', subject: 'Direito Constitucional', count: 10 },
  { exam: 'PF', cargo: 'Agente', subject: 'Direito Administrativo', count: 10 },
  { exam: 'PF', cargo: 'Agente', subject: 'Direito Penal', count: 10 },
  { exam: 'PF', cargo: 'Agente', subject: 'Português', count: 8 },
  { exam: 'PF', cargo: 'Agente', subject: 'Raciocínio Lógico', count: 7 },
  
  { exam: 'PF', cargo: 'Escrivão', subject: 'Direito Penal', count: 10 },
  { exam: 'PF', cargo: 'Escrivão', subject: 'Direito Processual Penal', count: 10 },
  { exam: 'PF', cargo: 'Escrivão', subject: 'Português', count: 8 },
  
  { exam: 'PF', cargo: 'Delegado', subject: 'Direito Penal', count: 12 },
  { exam: 'PF', cargo: 'Delegado', subject: 'Direito Processual Penal', count: 12 },
  { exam: 'PF', cargo: 'Delegado', subject: 'Legislação Especial', count: 10 },
  
  // PRF
  { exam: 'PRF', cargo: 'Policial Rodoviário Federal', subject: 'Legislação de Trânsito', count: 15 },
  { exam: 'PRF', cargo: 'Policial Rodoviário Federal', subject: 'Direito Constitucional', count: 10 },
  { exam: 'PRF', cargo: 'Policial Rodoviário Federal', subject: 'Português', count: 8 },
  
  // POLÍCIA CIVIL (BASE PARA TODOS ESTADOS)
  { exam: 'PC', cargo: 'Investigador', subject: 'Direito Penal', count: 12 },
  { exam: 'PC', cargo: 'Investigador', subject: 'Direito Processual Penal', count: 10 },
  { exam: 'PC', cargo: 'Investigador', subject: 'Criminalística', count: 8 },
  
  { exam: 'PC', cargo: 'Delegado', subject: 'Direito Penal', count: 15 },
  { exam: 'PC', cargo: 'Delegado', subject: 'Direito Processual Penal', count: 15 },
  
  { exam: 'PC', cargo: 'Escrivão', subject: 'Direito Penal', count: 10 },
  { exam: 'PC', cargo: 'Escrivão', subject: 'Português', count: 10 },
  
  // POLÍCIA MILITAR (BASE PARA TODOS ESTADOS)
  { exam: 'PM', cargo: 'Soldado', subject: 'Direito Penal', count: 10 },
  { exam: 'PM', cargo: 'Soldado', subject: 'Direito Constitucional', count: 10 },
  { exam: 'PM', cargo: 'Soldado', subject: 'Português', count: 8 },
  { exam: 'PM', cargo: 'Soldado', subject: 'Raciocínio Lógico', count: 7 },
];

async function generateContent(exam: string, cargo: string, subject: string) {
  const prompt = `Crie conteúdo educativo CONCISO para ${exam} - ${cargo} sobre ${subject}.

REGRAS ESTRITAS:
- Título: máximo 35 caracteres
- Definição: máximo 140 caracteres (2 linhas curtas)
- Pontos-chave: exatamente 3 itens de máximo 40 chars cada
- Exemplo: máximo 90 caracteres
- Dica: máximo 70 caracteres

IMPORTANTE: Seja EXTREMAMENTE conciso! Mobile-first!

Retorne apenas JSON válido:
{
  "title": "...",
  "definition": "...",
  "keyPoints": "• ...\n• ...\n• ...",
  "example": "...",
  "tip": "..."
}`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Erro");

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON não encontrado");

    const data = JSON.parse(jsonMatch[0]);

    // VALIDAR TAMANHOS
    if (data.title.length > 40) data.title = data.title.substring(0, 37) + '...';
    if (data.definition.length > 150) data.definition = data.definition.substring(0, 147) + '...';
    if (data.example.length > 100) data.example = data.example.substring(0, 97) + '...';
    if (data.tip.length > 80) data.tip = data.tip.substring(0, 77) + '...';

    await db.execute(sql`
      INSERT INTO ai_generated_content (exam_type, title, definition, key_points, example, tip)
      VALUES (${exam}, ${data.title}, ${data.definition}, ${data.keyPoints}, ${data.example}, ${data.tip})
    `);

    console.log(`✅ ${exam}-${cargo}: ${data.title}`);
    return true;
  } catch (error) {
    console.error(`❌ ${exam}-${cargo}-${subject}: ${error}`);
    return false;
  }
}

async function main() {
  console.log('🚀 GERANDO CONTEÚDOS DE QUALIDADE\n');
  
  let total = 0;
  let success = 0;
  
  for (const item of CONTENT_PLAN) {
    console.log(`\n📚 ${item.exam} - ${item.cargo} - ${item.subject} (${item.count}x)`);
    
    for (let i = 0; i < item.count; i++) {
      const result = await generateContent(item.exam, item.cargo, item.subject);
      total++;
      if (result) success++;
      
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  
  console.log(`\n\n✅ CONCLUÍDO!`);
  console.log(`📊 ${success}/${total} conteúdos gerados`);
  
  const result = await db.execute(sql`
    SELECT exam_type, COUNT(*) as total 
    FROM ai_generated_content 
    GROUP BY exam_type
    ORDER BY exam_type
  `);
  
  console.log(`\n📈 Conteúdos por concurso:`);
  result.rows.forEach((r: any) => console.log(`  ${r.exam_type}: ${r.total}`));
}

main();
