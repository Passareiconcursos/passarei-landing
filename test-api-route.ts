async function testRoute() {
  console.log("🧪 Testando rota da API...\n");

  try {
    const response = await fetch("http://localhost:5000/api/admin/ai/generate-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: "Direito Constitucional",
        examType: "PF",
        topic: "Separação dos Poderes"
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log("✅ Rota funcionando!");
      console.log("📝 Título:", data.content.title);
      console.log("💡 Definição:", data.content.definition.substring(0, 100) + "...");
    } else {
      console.log("❌ Erro:", data.error);
    }
  } catch (error: any) {
    console.log("❌ Erro ao chamar API:", error.message);
    console.log("\n⚠️  Certifique-se de que o servidor está rodando!");
    console.log("   Execute: npm run dev");
  }
}

testRoute();
