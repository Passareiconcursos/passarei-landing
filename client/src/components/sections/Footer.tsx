import { Mail, MapPin, Instagram } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <a
              href="/"
              className="inline-block mb-4 hover:opacity-80 transition-opacity"
            >
              <img
                src="/logo.png"
                alt="Passarei - Concursos Policiais"
                className="h-8 w-auto brightness-0 invert"
                loading="lazy"
                onError={(e) => {
                  console.error("Logo Footer não carregou");
                  e.currentTarget.style.display = "none";
                }}
              />
            </a>
            <p className="text-gray-400 text-sm">
              Aprove em concursos policiais com IA e WhatsApp
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href="https://www.instagram.com/passareiconcursos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#18cb96] transition-colors"
                  aria-label="Siga no Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
            </div>

            <p className="text-gray-400 text-sm mt-4">
              Siga para dicas diárias!
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Produto</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#como-funciona"
                  className="hover:text-primary transition-colors"
                >
                  Como Funciona
                </a>
              </li>
              <li>
                <a
                  href="#planos"
                  className="hover:text-primary transition-colors"
                >
                  Planos e Preços
                </a>
              </li>
              <li>
                <a
                  href="#depoimentos"
                  className="hover:text-primary transition-colors"
                >
                  Depoimentos
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/termos"
                  className="hover:text-primary transition-colors"
                >
                  Termos de Uso
                </a>
              </li>
              <li>
                <a
                  href="/privacidade"
                  className="hover:text-primary transition-colors"
                >
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a
                  href="/cookies"
                  className="hover:text-primary transition-colors"
                >
                  Política de Cookies
                </a>
              </li>
              <li>
                <a
                  href="/reembolso"
                  className="hover:text-primary transition-colors"
                >
                  Política de Reembolso
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a
                  href="mailto:suporte@passarei.com.br"
                  className="hover:text-primary transition-colors"
                >
                  suporte@passarei.com.br
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Vitória/ES</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-sm text-gray-400 text-center">
            © {currentYear} Passarei. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
