import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    if (window.location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    } else {
      window.location.href = `/#${id}`;
    }
  };

  const scrollToCTA = () => {
    if (window.location.pathname === "/") {
      document
        .getElementById("cta-final")
        ?.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    } else {
      window.location.href = "/#cta-final";
    }
  };

  const menuItems = [
    { label: "Como Funciona", id: "como-funciona" },
    { label: "Depoimentos", id: "depoimentos" },
    { label: "Planos", id: "planos" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <>
      <header
        className="fixed top-0 w-full bg-white shadow-sm z-50"
        role="banner"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <a
              href="/"
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img
                src="/logo.png"
                alt="Passarei - Concursos Policiais"
                className="h-8 md:h-10 w-auto"
                width={120}
                height={40}
                loading="eager"
                decoding="async"
                onError={(e) => {
                  console.error("Logo não carregou");
                  e.currentTarget.style.display = "none";
                }}
              />
            </a>

            <nav className="hidden md:flex items-center gap-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-gray-700 hover:text-[#18cb96] transition-colors font-medium"
                  aria-label={`Ir para seção ${item.label}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <a
                href="/sala"
                className="text-gray-700 hover:text-[#18cb96] transition-colors font-medium"
              >
                Login
              </a>
              <Button
                onClick={scrollToCTA}
                className="bg-[#18cb96] hover:bg-[#14b584] text-white px-8 py-3 rounded-lg font-semibold text-base hover:scale-105 transition-all shadow-md hover:shadow-lg"
                aria-label="Começar teste grátis"
              >
                Teste Grátis
              </Button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={
                mobileMenuOpen ? "Fechar menu" : "Abrir menu de navegação"
              }
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-gray-700 hover:text-[#18cb96] transition-colors font-medium"
                  aria-label={`Ir para seção ${item.label}`}
                >
                  {item.label}
                </button>
              ))}
              <div className="border-t border-gray-200 my-2"></div>
              <a
                href="/sala"
                className="text-gray-700 hover:text-[#18cb96] transition-colors font-medium text-center py-2"
              >
                Login — Sala de Aula
              </a>
              <Button
                onClick={scrollToCTA}
                className="bg-[#18cb96] hover:bg-[#14b584] text-white w-full py-3 rounded-lg font-semibold"
              >
                Teste Grátis
              </Button>
            </nav>
          </div>
        )}
      </header>

      <div className="h-20"></div>
    </>
  );
}
