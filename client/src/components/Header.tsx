import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    // Check if we're on the landing page
    if (window.location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    } else {
      // Navigate to home page with hash
      window.location.href = `/#${id}`;
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
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            
            {/* Logo - Esquerda - CLICÁVEL */}
            <a 
              href="/" 
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img 
                src="/logo.png" 
                alt="Passarei - Concursos Policiais" 
                className="h-8 md:h-10 w-auto"
                onError={(e) => {
                  console.error('Logo não carregou');
                  e.currentTarget.style.display = 'none';
                }}
              />
            </a>
            
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
            
            {/* CTA Desktop - Direita - APENAS "Cadastrar" */}
            <div className="hidden md:flex">
              <Button
                onClick={() => scrollToSection("lead-form")}
                className="bg-[#18cb96] hover:bg-[#14b584] text-white px-8 py-3 rounded-lg font-semibold text-base hover:scale-105 transition-all shadow-md hover:shadow-lg"
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
              <Button
                onClick={() => scrollToSection("lead-form")}
                className="bg-[#18cb96] hover:bg-[#14b584] text-white w-full py-3 rounded-lg font-semibold"
              >
                Cadastrar
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
