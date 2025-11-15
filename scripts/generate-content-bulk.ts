import Anthropic from "@anthropic-ai/sdk";
import { db } from "../db";
import { sql } from "drizzle-orm";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SUBJECTS = [
  { exam: 'PM', subject: 'Direito Penal', count: 10 },
  { exam: 'PM', subject: 'Direito Constitucional', count: 10 },
  { exam: 'PC', subject: 'Direito Penal', count: 10 },
  { exam: 'PC', subject: 'Direito Processual Penal', count: 10 },
  { exam: 'PF', subject: 'Direito Administrativo', count: 10 },
];

async function generateContent(exam: string, subject: string) {
  const prompt = `Crie conteúdo educativo CONCISO para ${exam} sobre ${subject}.

REGRAS:
- Título: máx 40 caracteres
- Definição: máx 150 caracteres (2 linhas)
- Pontos-chave: 3 itens curtos
- Exemplo: máx 100 caracteres
- Dica: máx 80 caracteres

JSON:
{
  "title": "...",
  "definition": "...",
  "keyPoints": "• ...\n• ...\n• ...",
  "example": "...",
  "tip": "..."
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
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

  console.log(`✅ ${exam} - ${data.title}`);
}

async function main() {
  console.log('🚀 Gerando 50 conteúdos...\n');
  
  for (const item of SUBJECTS) {
    console.log(`📚 ${item.exam} - ${item.subject}`);
    
    for (let i = 0; i < item.count; i++) {
      try {
        await generateContent(item.exam, item.subject);
        await new Promise(r => setTimeout(r, 2000));
      } catch (error) {
        console.error(`❌ Erro: ${error}`);
      }
    }
  }
  
  console.log('\n✅ CONCLUÍDO!');
}

main();
