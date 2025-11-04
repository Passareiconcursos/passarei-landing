import { generateContent } from "./server/ai-service";

async function test() {
  console.log("🤖 Testando IA da Anthropic...\n");

  try {
    console.log("⏳ Gerando conteúdo sobre 'Legítima Defesa'...\n");
    
    const content = await generateContent({
      subject: "Direito Penal",
      examType: "PM",
      topic: "Legítima Defesa",
    });

    console.log("✅ Conteúdo gerado com sucesso!\n");
    console.log("=" .repeat(50));
    console.log("📝 Título:", content.title);
    console.log("\n💡 Definição:", content.definition);
    console.log("\n📌 Pontos principais:");
    console.log(content.keyPoints);
    console.log("\n📖 Exemplo:", content.example);
    console.log("\n🎯 Dica de prova:", content.tip);
    console.log("\n🏷️  Tags:", content.tags.join(", "));
    console.log("=" .repeat(50));
    console.log("\n✅ IA funcionando perfeitamente!");
    console.log("💰 Custo aproximado: $0.002 (menos de 1 centavo)\n");
  } catch (error: any) {
    console.error("\n❌ Erro ao testar IA:", error.message);
    
    if (error.message.includes("API key")) {
      console.error("\n🔑 Problema com a API Key!");
      console.error("   Verifique se a chave está correta no .env");
    }
  }
}

test();
