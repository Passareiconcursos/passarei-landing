export function Concursos() {
  const concursos = [
    { icon: "🔵", name: "Polícia Federal", sigla: "PF", nivel: "Federal" },
    {
      icon: "🛣️",
      name: "Polícia Rodoviária Federal",
      sigla: "PRF",
      nivel: "Federal",
    },
    {
      icon: "🔒",
      name: "Polícia Penal Federal",
      sigla: "PP Federal",
      nivel: "Federal",
    },
    {
      icon: "🏛️",
      name: "Polícia Legislativa Federal",
      sigla: "PL Federal",
      nivel: "Federal",
    },
    { icon: "🎖️", name: "Polícia Militar", sigla: "PM", nivel: "Estadual" },
    { icon: "🕵️", name: "Polícia Civil", sigla: "PC", nivel: "Estadual" },
    {
      icon: "🔐",
      name: "Polícia Penal Estadual",
      sigla: "PP",
      nivel: "Estadual",
    },
    {
      icon: "🏢",
      name: "Polícia Legislativa Estadual",
      sigla: "PL",
      nivel: "Estadual",
    },
    { icon: "🚒", name: "Corpo de Bombeiros", sigla: "CBM", nivel: "Estadual" },
    { icon: "🛡️", name: "Guarda Municipal", sigla: "GM", nivel: "Municipal" },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-[#18cb96]/10 text-[#18cb96] px-4 py-2 rounded-full text-sm font-semibold">
              🎯 10 Carreiras Policiais
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Para Qual Concurso Você Estuda?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Cobrimos todas as principais carreiras policiais e de segurança
            pública do Brasil
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {concursos.map((concurso, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 border border-gray-100"
            >
              <div className="text-4xl mb-3">{concurso.icon}</div>
              <div className="text-xs text-[#18cb96] font-semibold mb-1">
                {concurso.nivel}
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{concurso.sigla}</h3>
              <p className="text-sm text-gray-600">{concurso.name}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            📚 Conteúdo específico para cada concurso • 🎯 Baseado nos editais
            oficiais
          </p>
        </div>
      </div>
    </section>
  );
}
