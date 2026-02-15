import { Mail, Instagram, MessageCircle } from "lucide-react";

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
              Aprove em concursos policiais com IA e Telegram
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
              <a
                href="https://www.facebook.com/profile.php?id=61582389145624"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#18cb96] transition-colors"
                aria-label="Siga no Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://t.me/PassareiBot"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#18cb96] transition-colors"
                aria-label="Suporte no Telegram"
              >
                <MessageCircle className="w-5 h-5" />
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
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:suporte@passarei.com.br"
                  className="hover:text-white transition-colors"
                >
                  suporte@passarei.com.br
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <a
                  href="https://t.me/PassareiBot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Suporte via Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-sm text-gray-400 text-center">
            {currentYear} Passarei. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
