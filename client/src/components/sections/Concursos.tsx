import { useMemo } from "react";
import { useConcursos, type Concurso } from "../../hooks/use-concursos";

// Fallback para caso a API falhe
const CONCURSOS_FALLBACK = [
  { icon: "🎯", name: "Polícia Federal", sigla: "PF", nivel: "Federal" },
  { icon: "🚓", name: "Polícia Rodoviária Federal", sigla: "PRF", nivel: "Federal" },
  { icon: "🔒", name: "Polícia Penal Federal", sigla: "PPF", nivel: "Federal" },
  { icon: "🏛️", name: "Polícia Legislativa Federal", sigla: "PLF", nivel: "Federal" },
  { icon: "🚔", name: "Polícia Militar", sigla: "PM", nivel: "Estadual" },
  { icon: "🕵️", name: "Polícia Civil", sigla: "PC", nivel: "Estadual" },
  { icon: "🔐", name: "Polícia Penal Estadual", sigla: "PPE", nivel: "Estadual" },
  { icon: "🚒", name: "Corpo de Bombeiros", sigla: "CBM", nivel: "Estadual" },
  { icon: "🛡️", name: "Guarda Municipal", sigla: "GM", nivel: "Municipal" },
  { icon: "🔍", name: "ABIN", sigla: "ABIN", nivel: "Federal" },
];

// Mapa de ícones por sigla
const ICONS: Record<string, string> = {
  PF: "🎯",
  PRF: "🚓",
  PPF: "🔒",
  PP_FEDERAL: "🔒",
  PLF: "🏛️",
  PL_FEDERAL: "🏛️",
  PM: "🚔",
  PC: "🕵️",
  PPE: "🔐",
  PP_ESTADUAL: "🔐",
  CBM: "🚒",
  GM: "🛡️",
  ABIN: "🔍",
  EXERCITO: "⚔️",
  MARINHA: "⚓",
  FAB: "✈️",
  ANAC: "🛫",
  CPNU: "📋",
  PFF: "🚂",
  PJ_CNJ: "⚖️",
  MD: "🎖️",
  PC_CIENT: "🔬",
  GP: "🚢",
};

export function Concursos() {
  const { concursos: apiConcursos, loading, error } = useConcursos();

  // Formata concursos da API para o formato de exibição
  const concursos = useMemo(() => {
    if (apiConcursos.length > 0) {
      // Limita a 10 para exibição na landing page
      return apiConcursos.slice(0, 10).map((c: Concurso) => ({
        icon: ICONS[c.sigla] || "📌",
        name: c.nome,
        sigla: c.sigla,
        nivel: c.esfera === "FEDERAL" ? "Federal" :
               c.esfera === "ESTADUAL" ? "Estadual" : "Municipal",
      }));
    }
    return CONCURSOS_FALLBACK;
  }, [apiConcursos]);

  const totalConcursos = apiConcursos.length > 0 ? apiConcursos.length : 10;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-[#18cb96]/10 text-[#18cb96] px-4 py-2 rounded-full text-sm font-semibold">
              {loading ? "Carregando..." : `✅ ${totalConcursos} Carreiras`}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Para Qual Concurso Você Estuda?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Cobrimos todas as principais carreiras policiais, militares e de segurança
            pública do Brasil
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {concursos.map((concurso, index) => (
            <div
              key={concurso.sigla || index}
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
            {totalConcursos > 10 && (
              <span className="block mb-2 text-[#18cb96] font-semibold">
                + {totalConcursos - 10} outros concursos disponíveis
              </span>
            )}
            • Conteúdo específico para cada concurso • Baseado nos editais
            oficiais
          </p>
        </div>
      </div>
    </section>
  );
}
