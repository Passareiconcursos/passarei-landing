import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Obrigado() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Você Está a Um Passo da Aprovação!
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          Recebemos seu cadastro com sucesso. Em breve você receberá uma mensagem no WhatsApp com seus primeiros conteúdos.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Próximos Passos:
          </h3>
          <ul className="text-left space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Verifique seu WhatsApp nos próximos minutos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Salve nosso contato para não perder mensagens</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Comece hoje mesmo com seu primeiro conteúdo</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="hover-elevate active-elevate-2"
            data-testid="button-voltar-inicio"
          >
            Voltar ao Início
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Tem dúvidas? Entre em contato: <a href="mailto:contato@passarei.com.br" className="text-primary hover:underline">contato@passarei.com.br</a>
        </p>
      </div>
    </div>
  );
}
