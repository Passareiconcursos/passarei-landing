import { useState, useEffect } from "react";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consentDate = localStorage.getItem("passarei_cookie_consent");
    const currentTimestamp = Date.now();
    const sixMonthsInMs = 180 * 24 * 60 * 60 * 1000;
    if (!consentDate || currentTimestamp - Number(consentDate) > sixMonthsInMs) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (accepted: boolean) => {
    if (accepted) {
      localStorage.setItem("passarei_cookie_consent", Date.now().toString());
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[9999] p-4 bg-slate-900 border-t border-blue-500/50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-300">
          <p>
            Utilizamos cookies para melhorar sua experiência na plataforma e personalizar conteúdos. Ao continuar navegando, você concorda com nossa{" "}
            <a href="/cookies" className="text-blue-400 underline hover:text-blue-300">
              Política de Cookies
            </a>
            .
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => handleConsent(false)}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Apenas Essenciais
          </button>
          <button
            onClick={() => handleConsent(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20"
          >
            Aceitar Tudo
          </button>
        </div>
      </div>
    </div>
  );
}
