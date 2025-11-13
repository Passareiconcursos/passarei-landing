export function formatContent(content: any): string {
  return `📚 *${content.title}*

━━━━━━━━━━━━━━━━

📖 *O QUE É?*

${content.definition}

━━━━━━━━━━━━━━━━

✅ *PONTOS-CHAVE*

${content.keyPoints.split('•').filter(Boolean).map((p: string) => `• ${p.trim()}`).join('\n\n')}

━━━━━━━━━━━━━━━━

💡 *EXEMPLO PRÁTICO*

${content.example}

━━━━━━━━━━━━━━━━

🎯 *DICA DE PROVA*

${content.tip}

━━━━━━━━━━━━━━━━

📝 *EXERCÍCIO DE FIXAÇÃO*

Baseado no conteúdo acima, responda:

❓ ${generateQuestion(content)}

💬 Responda digitando sua resposta!
_(Vou corrigir e dar feedback)_`;
}

function generateQuestion(content: any): string {
  // Gerar questão baseada no conteúdo
  return `Explique com suas palavras: ${content.title}`;
}
