import { useState } from "react";
import { TrendingUp, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { label: "Como Funciona", id: "como-funciona" },
    { label: "Depoimentos", id: "depoimentos" },
    { label: "Planos e Preços", id: "planos" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <>
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo - Esquerda */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <TrendingUp className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">PASSAREI</span>
            </button>
            
            {/* Menu Desktop - Centro */}
            <nav className="hidden md:flex items-center gap-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-gray-700 hover:text-[#18cb96] transition-colors font-medium"
                >
                  {item.label}
                </button>
              ))}
            </nav>
            
            {/* CTAs Desktop - Direita */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => scrollToSection("lead-form")}
                className="text-gray-700 hover:text-[#18cb96] transition-colors font-medium"
              >
                Entrar
              </button>
              <Button
                onClick={() => scrollToSection("lead-form")}
                className="bg-[#18cb96] hover:bg-[#14b584] text-white px-6 py-2.5 rounded-lg font-semibold hover:scale-105 transition-all"
              >
                Cadastrar
              </Button>
            </div>
            
            {/* Menu Mobile - Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-[#18cb96] rounded-lg transition-colors font-medium"
                >
                  {item.label}
                </button>
              ))}
              <div className="border-t border-gray-200 my-2"></div>
              <button
                onClick={() => scrollToSection("lead-form")}
                className="text-left px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-[#18cb96] rounded-lg transition-colors font-medium"
              >
                Entrar
              </button>
              <Button
                onClick={() => scrollToSection("lead-form")}
                className="bg-[#18cb96] hover:bg-[#14b584] text-white w-full py-3 rounded-lg font-semibold"
              >
                Cadastrar Grátis
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20"></div>
    </>
  );
}
