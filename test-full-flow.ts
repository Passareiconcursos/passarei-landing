async function testFullFlow() {
  console.log("🧪 Teste completo: Gerar + Salvar conteúdo\n");

  try {
    // 1. Gerar conteúdo
    console.log("⏳ Gerando conteúdo...");
    const generateResponse = await fetch("http://localhost:5000/api/admin/ai/generate-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: "DIREITO_ADMINISTRATIVO",
        examType: "PRF",
        topic: "Princípios da Administração Pública"
      })
    });

    const generateData = await generateResponse.json();

    if (!generateData.success) {
      console.log("❌ Erro ao gerar:", generateData.error);
      return;
    }

    console.log("✅ Conteúdo gerado!");
    console.log("📝", generateData.content.title, "\n");

    // 2. Salvar no banco
    console.log("⏳ Salvando no banco...");
    const saveResponse = await fetch("http://localhost:5000/api/admin/content/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...generateData.content,
        subject: "DIREITO_ADMINISTRATIVO",
        examType: "PRF",
        status: "PUBLISHED"
      })
    });

    const saveData = await saveResponse.json();

    if (!saveData.success) {
      console.log("❌ Erro ao salvar:", saveData.error);
      return;
    }

    console.log("✅ Conteúdo salvo no banco!");
    console.log("🆔 ID:", saveData.content.id);
    console.log("\n🎉 SUCESSO TOTAL!");
    console.log("💰 Custo: ~$0.002");
    console.log("⏱️  Tempo: ~3 segundos");
    console.log("\n✨ Agora você pode ver este conteúdo em /educ/content!");

  } catch (error: any) {
    console.error("❌ Erro:", error.message);
  }
}

testFullFlow();
