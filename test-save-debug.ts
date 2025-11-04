async function testSave() {
  console.log("🔍 Debug do salvamento\n");

  const testData = {
    title: "Teste de Salvamento",
    subject: "DIREITO_PENAL",
    examType: "PM",
    definition: "Definição teste",
    keyPoints: "• Ponto 1\n• Ponto 2",
    example: "Exemplo teste",
    tip: "Dica teste",
    tags: ["teste"],
    status: "DRAFT"
  };

  console.log("📦 Dados:", JSON.stringify(testData, null, 2));

  try {
    const response = await fetch("http://localhost:5000/api/admin/content/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testData)
    });

    console.log("\n📡 Status HTTP:", response.status);
    
    const data = await response.json();
    console.log("📄 Resposta:", JSON.stringify(data, null, 2));

  } catch (error: any) {
    console.error("❌ Erro:", error.message);
  }
}

testSave();
