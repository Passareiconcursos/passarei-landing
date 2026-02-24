import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useStudentAuth } from "@/contexts/StudentAuthContext";
import { SalaLayout } from "@/components/sala/SalaLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, PenLine, Star, Loader2 } from "lucide-react";

// ============================================
// TYPES
// ============================================

interface EssayStatus {
  freeRemaining: number;
  credits: number;
  plan: string;
}

interface EssayResult {
  id: string;
  theme: string;
  scores: {
    comp1: number;
    comp2: number;
    comp3: number;
    comp4: number;
    comp5: number;
    total: number;
  };
  feedback: {
    comp1?: string;
    comp2?: string;
    comp3?: string;
    comp4?: string;
    comp5?: string;
    general?: string;
  };
}

// ============================================
// COMPONENT
// ============================================

export default function SalaRedacao() {
  const { token } = useStudentAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [essayTheme, setEssayTheme] = useState("");
  const [essayText, setEssayText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [essayStatus, setEssayStatus] = useState<EssayStatus | null>(null);
  const [results, setResults] = useState<EssayResult[]>([]);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchEssayStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEssayStatus = async () => {
    try {
      const res = await fetch("/api/sala/essays/status", { headers });
      const data = await res.json();
      if (data.success) {
        setEssayStatus({ freeRemaining: data.freeRemaining, credits: data.credits, plan: data.plan });
      }
    } catch { /* silent */ }
  };

  const submitEssay = async () => {
    if (!essayTheme.trim() || essayText.trim().split(/\s+/).length < 50) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/sala/essays/submit", {
        method: "POST",
        headers,
        body: JSON.stringify({ theme: essayTheme, text: essayText }),
      });
      const data = await res.json();
      if (data.requiresUpgrade) {
        toast({ variant: "destructive", title: "Créditos insuficientes", description: data.error || "Você precisa de um plano superior para enviar redações." });
        return;
      }
      if (data.creditsPreserved || (!data.success && !data.correction)) {
        toast({
          variant: "destructive",
          title: "Erro na análise técnica",
          description: "Seus créditos estão preservados. Tente novamente em alguns minutos.",
        });
        return;
      }
      if (!data.success || !data.correction) {
        toast({ variant: "destructive", title: "Erro na correção", description: "Não foi possível corrigir a redação agora. Tente novamente." });
        return;
      }
      const newResult: EssayResult = {
        id: Date.now().toString(),
        theme: essayTheme,
        ...data.correction,
      };
      setResults((prev) => [newResult, ...prev]);
      setEssayTheme("");
      setEssayText("");
      fetchEssayStatus();
    } catch {
      toast({ variant: "destructive", title: "Erro ao enviar redação" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
  const essayAvailable = (essayStatus?.freeRemaining ?? 0) > 0 || (essayStatus?.credits ?? 0) > 0;
  const essayTotal = 2;

  return (
    <SalaLayout>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">

        {/* Top bar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b h-11 sticky top-0 z-30 bg-background">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 text-xs"
            onClick={() => setLocation("/sala/aula")}
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar ao Painel
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium flex items-center gap-1.5">
            <PenLine className="h-4 w-4 text-violet-600" />
            Redação
          </span>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

            {/* Status bar */}
            {essayStatus && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {essayAvailable
                    ? `${essayStatus.freeRemaining} correção${essayStatus.freeRemaining !== 1 ? "ões" : ""} disponível${essayStatus.freeRemaining !== 1 ? "is" : ""} este mês`
                    : "Limite mensal atingido"}
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: essayTotal }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-8 rounded-full ${i < (essayStatus.freeRemaining) ? "bg-violet-500" : "bg-muted"}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Essay form */}
            <Card className="border-l-4 border-l-violet-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <PenLine className="h-4 w-4 text-violet-600" />
                  Nova Redação
                </CardTitle>
                {essayStatus && !essayAvailable && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {(() => {
                      const nextReset = new Date();
                      nextReset.setMonth(nextReset.getMonth() + 1);
                      nextReset.setDate(1);
                      return `Disponível a partir de 01 de ${nextReset.toLocaleDateString("pt-BR", { month: "long" })}`;
                    })()}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Tema da redação</label>
                  <Input
                    placeholder="Ex: Segurança pública e a atuação policial..."
                    value={essayTheme}
                    onChange={(e) => setEssayTheme(e.target.value)}
                    disabled={!essayAvailable || isSubmitting}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Sua redação</label>
                  <Textarea
                    placeholder="Escreva sua redação aqui (mínimo 50 palavras)..."
                    rows={10}
                    value={essayText}
                    onChange={(e) => setEssayText(e.target.value)}
                    className="resize-none"
                    disabled={!essayAvailable || isSubmitting}
                  />
                  <p className={`text-xs mt-1 ${wordCount >= 50 ? "text-green-600" : "text-muted-foreground"}`}>
                    {wordCount} palavras {wordCount < 50 ? `(mínimo 50)` : "✓"}
                  </p>
                </div>
                <Button
                  onClick={submitEssay}
                  disabled={!essayAvailable || !essayTheme.trim() || wordCount < 50 || isSubmitting}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Corrigindo...</>
                  ) : (
                    "Enviar para correção"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Correções desta sessão
                </h3>
                {results.map((result) => (
                  <EssayResultCard key={result.id} result={result} />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </SalaLayout>
  );
}

// ============================================
// ESSAY RESULT CARD
// ============================================

function EssayResultCard({ result }: { result: EssayResult }) {
  const total = result.scores?.total ?? 0;
  const pct = Math.round((total / 1000) * 100);
  const comps = [
    { label: "Norma culta", score: result.scores?.comp1, feedback: result.feedback?.comp1 },
    { label: "Compreensão", score: result.scores?.comp2, feedback: result.feedback?.comp2 },
    { label: "Organização", score: result.scores?.comp3, feedback: result.feedback?.comp3 },
    { label: "Coesão", score: result.scores?.comp4, feedback: result.feedback?.comp4 },
    { label: "Intervenção", score: result.scores?.comp5, feedback: result.feedback?.comp5 },
  ];

  return (
    <Card className="border-l-4 border-l-violet-500 bg-violet-50/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <PenLine className="h-4 w-4 text-violet-600" /> Resultado: {result.theme}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-violet-700">{total}/1000</div>
          <div className="flex-1">
            <Progress value={pct} className="h-2 mb-1" />
            <p className="text-xs text-muted-foreground">{pct}% de aproveitamento</p>
          </div>
          <Badge
            className={`text-xs ${pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
          >
            {pct >= 70 ? "Aprovado" : pct >= 50 ? "Regular" : "Abaixo"}
          </Badge>
        </div>
        {result.feedback?.general && (
          <p className="text-sm text-muted-foreground bg-white/70 rounded-lg p-3">{result.feedback.general}</p>
        )}
        <div className="space-y-2">
          {comps.map((c, i) => (
            <div key={i} className="text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">{c.label}</span>
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star
                      key={s}
                      className={`h-3 w-3 ${(c.score ?? 0) > s * 40 ? "text-violet-500 fill-violet-500" : "text-muted-foreground"}`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">{c.score ?? 0}/200</span>
                </div>
              </div>
              {c.feedback && <p className="text-xs text-muted-foreground mt-0.5">{c.feedback}</p>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
