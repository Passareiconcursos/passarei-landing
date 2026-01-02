import { CheckCircle, ArrowRight, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Obrigado() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Analytics tracking (quando configurado)
    if (typeof window !== "undefined") {
      console.log("Conversão registrada!");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Parabéns! Você Deu o Primeiro Passo! 🎉
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Seu cadastro foi realizado com <strong>sucesso</strong>!
        </p>

        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Smartphone className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-semibold text-green-800">
              Próximos Passos:
            </h2>
          </div>
          <ol className="text-left text-gray-700 space-y-3">
            <li className="flex items-start">
              <span className="font-bold text-green-600 mr-3 text-lg">1.</span>
              <span>
                Você receberá um email de confirmação{" "}
                <strong>em até 2 minutos</strong>
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-green-600 mr-3 text-lg">2.</span>
              <span>
                Salve nosso número como <strong>"Passarei"</strong>
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-green-600 mr-3 text-lg">3.</span>
              <span>Responda a mensagem para ativar seu plano</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-green-600 mr-3 text-lg">4.</span>
              <span>
                Receba seu primeiro conteúdo <strong>hoje mesmo</strong>!
              </span>
            </li>
          </ol>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-gray-700">
            <span className="text-2xl mr-2">💚</span>
            <strong>Você vai passar!</strong> Estamos juntos nessa jornada.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => setLocation("/")}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white hover:scale-105 transition-all"
            data-testid="button-voltar-inicio"
          >
            Voltar para Home
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Tem dúvidas? Entre em contato:{" "}
          <a
            href="mailto:suporte@passarei.com.br"
            className="text-green-600 hover:underline font-medium"
          >
            suporte@passarei.com.br
          </a>
        </p>
      </div>
    </div>
  );
}
