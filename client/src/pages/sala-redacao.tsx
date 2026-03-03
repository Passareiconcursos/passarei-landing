import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useStudentAuth } from "@/contexts/StudentAuthContext";
import { SalaLayout } from "@/components/sala/SalaLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft, PenLine, Loader2, BookOpen, ChevronDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

interface Template {
  id: string;
  title: string;
  motivating_text: string;
}

interface EssayStatus {
  available: boolean;
  cooldownDaysLeft: number;
  lastScore: number | null;
  plan: string;
  freeRemaining: number;
  credits: number;
}

interface EssayResult {
  theme: string;
  scores: {
    comp1: number;
    comp2: number;
    comp3: number;
    comp4: number;
    total: number;
  };
  feedback: {
    general?: string;
    comp1?: string;
    comp2?: string;
    comp3?: string;
    comp4?: string;
  };
  rewrite_suggestion?: string;
}

// ============================================
// COMPONENT
// ============================================

export default function SalaRedacao() {
  const { token } = useStudentAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [phase, setPhase] = useState<"select" | "write" | "result">("select");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showMotivador, setShowMotivador] = useState(false);
  const [essayText, setEssayText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [essayStatus, setEssayStatus] = useState<EssayStatus | null>(null);
  const [result, setResult] = useState<EssayResult | null>(null);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchEssayStatus();
    fetchTemplates();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEssayStatus = async () => {
    try {
      const res = await fetch("/api/sala/essays/status", { headers });
      const data = await res.json();
      if (data.success) {
        setEssayStatus({
          available: data.available,
          cooldownDaysLeft: data.cooldownDaysLeft,
          lastScore: data.lastScore,
          plan: data.plan,
          freeRemaining: data.freeRemaining,
          credits: data.credits,
        });
      }
    } catch { /* silent */ }
  };

  const fetchTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const res = await fetch("/api/sala/essays/templates", { headers });
      const data = await res.json();
      if (data.success) setTemplates(data.templates);
    } catch { /* silent */ }
    finally { setIsLoadingTemplates(false); }
  };

  const submitEssay = async () => {
    if (!selectedTemplate || essayText.trim().split(/\s+/).length < 50) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/sala/essays/submit", {
        method: "POST",
        headers,
        body: JSON.stringify({
          theme: selectedTemplate.title,
          text: essayText,
          motivatingText: selectedTemplate.motivating_text,
        }),
      });
      const data = await res.json();
      if (data.cooldown) {
        toast({ variant: "destructive", title: "Redação bloqueada", description: data.error });
        return;
      }
      if (data.requiresUpgrade) {
        toast({ variant: "destructive", title: "Créditos insuficientes", description: data.error });
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
        toast({ variant: "destructive", title: "Erro na correção", description: "Não foi possível corrigir a redação agora." });
        return;
      }
      setResult({ theme: selectedTemplate.title, ...data.correction });
      setPhase("result");
      fetchEssayStatus();
    } catch {
      toast({ variant: "destructive", title: "Erro ao enviar redação" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
  const charCount = essayText.length;
  const essayAvailable = essayStatus?.available ?? false;

  return (
    <SalaLayout>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">

        {/* Top bar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b h-11 sticky top-0 z-30 bg-background">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 text-xs"
            onClick={() => {
              if (phase === "write") { setPhase("select"); setEssayText(""); setShowMotivador(false); }
              else if (phase === "result") { setPhase("select"); setResult(null); setEssayText(""); setSelectedTemplate(null); }
              else setLocation("/sala/aula");
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            {phase === "select" ? "Voltar ao Painel" : phase === "write" ? "Escolher outro tema" : "Nova redação"}
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium flex items-center gap-1.5">
            <PenLine className="h-4 w-4 text-violet-600" />
            Redação
          </span>
          {essayStatus && (
            <div className="ml-auto">
              {essayStatus.available ? (
                <Badge className="text-[9px] bg-violet-500 hover:bg-violet-500">DISPONÍVEL</Badge>
              ) : (
                <Badge variant="outline" className="text-[9px] text-amber-600 border-amber-400">
                  {essayStatus.cooldownDaysLeft}d restantes
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

            {/* ── PHASE: SELECT ── */}
            {phase === "select" && (
              <>
                {/* Status card */}
                {essayStatus && !essayAvailable && (
                  <Card className="border-amber-200 bg-amber-50/50">
                    <CardContent className="p-4 flex items-start gap-3">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Redação bloqueada</p>
                        <p className="text-xs text-amber-700 mt-0.5">
                          Próxima redação disponível em {essayStatus.cooldownDaysLeft} {essayStatus.cooldownDaysLeft === 1 ? "dia" : "dias"}.
                          {essayStatus.lastScore !== null && (
                            <> Última nota: {((essayStatus.lastScore / 1000) * 10).toFixed(1)}/10.</>
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div>
                  <h2 className="text-sm font-semibold mb-1">Escolha um tema para sua redação</h2>
                  <p className="text-xs text-muted-foreground mb-4">
                    Temas adaptados ao seu concurso. Cada tema inclui um texto motivador.
                  </p>
                  {isLoadingTemplates ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : templates.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Temas não disponíveis. Tente novamente.</p>
                  ) : (
                    <div className="space-y-3">
                      {templates.map((t) => (
                        <Card
                          key={t.id}
                          className={cn(
                            "cursor-pointer border-2 transition-all active:scale-[0.99]",
                            essayAvailable
                              ? "hover:border-violet-400 hover:shadow-md border-border"
                              : "opacity-60 cursor-not-allowed border-border"
                          )}
                          onClick={() => {
                            if (!essayAvailable) return;
                            setSelectedTemplate(t);
                            setPhase("write");
                          }}
                        >
                          <CardContent className="p-4 flex items-start gap-3">
                            <BookOpen className="h-4 w-4 text-violet-500 mt-0.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium leading-snug">{t.title}</p>
                              <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{t.motivating_text}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── PHASE: WRITE ── */}
            {phase === "write" && selectedTemplate && (
              <>
                {/* Tema selecionado */}
                <Card className="border-l-4 border-l-violet-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-violet-700 leading-snug">
                      {selectedTemplate.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Toggle texto motivador */}
                    <button
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowMotivador((v) => !v)}
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      {showMotivador ? "Ocultar" : "Ver"} Texto Motivador
                      <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showMotivador && "rotate-180")} />
                    </button>
                    {showMotivador && (
                      <p className="mt-3 text-xs text-muted-foreground leading-relaxed border-t pt-3">
                        {selectedTemplate.motivating_text}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Área de escrita */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <label className="text-sm font-medium block">Sua redação</label>
                    <Textarea
                      placeholder="Escreva sua redação aqui (mínimo 50 palavras)..."
                      rows={12}
                      value={essayText}
                      onChange={(e) => setEssayText(e.target.value)}
                      className="resize-none"
                      disabled={isSubmitting}
                    />
                    <div className="flex items-center justify-between">
                      <p className={cn("text-xs", wordCount >= 50 ? "text-green-600" : "text-muted-foreground")}>
                        {wordCount} palavras · {charCount} caracteres
                        {wordCount < 50 && <span className="ml-1">(mínimo 50)</span>}
                        {wordCount >= 50 && <span className="ml-1">✓</span>}
                      </p>
                    </div>
                    <Button
                      onClick={submitEssay}
                      disabled={!essayAvailable || wordCount < 50 || isSubmitting}
                      className="w-full bg-violet-600 hover:bg-violet-700"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Corrigindo com IA...</>
                      ) : (
                        "Enviar para correção"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {/* ── PHASE: RESULT ── */}
            {phase === "result" && result && (
              <EssayResultCard result={result} />
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
  const notaEm10 = ((total / 1000) * 10).toFixed(1);
  const pct = Math.round((total / 1000) * 100);

  const comps = [
    { label: "Norma Culta",                   score: result.scores?.comp1, feedback: result.feedback?.comp1, value: "comp1" },
    { label: "Estrutura do Texto",             score: result.scores?.comp2, feedback: result.feedback?.comp2, value: "comp2" },
    { label: "Desenvolvimento Argumentativo",  score: result.scores?.comp3, feedback: result.feedback?.comp3, value: "comp3" },
    { label: "Coesão e Coerência",             score: result.scores?.comp4, feedback: result.feedback?.comp4, value: "comp4" },
  ];
  const maxPerComp = 250;

  return (
    <Card className="border-l-4 border-l-violet-500 bg-violet-50/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <PenLine className="h-4 w-4 text-violet-600" />
          Resultado da Redação
        </CardTitle>
        <p className="text-xs text-muted-foreground line-clamp-2">{result.theme}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Nota em destaque */}
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-violet-700">{notaEm10}<span className="text-lg text-muted-foreground">/10</span></div>
          <div className="flex-1">
            <Progress value={pct} className="h-2 mb-1" />
            <p className="text-xs text-muted-foreground">{total}/1000 pontos · {pct}% de aproveitamento</p>
          </div>
          <Badge className={cn("text-xs shrink-0", pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500")}>
            {pct >= 70 ? "Aprovado" : pct >= 50 ? "Regular" : "Abaixo"}
          </Badge>
        </div>

        {/* Feedback geral */}
        {result.feedback?.general && (
          <p className="text-sm text-muted-foreground bg-white/70 rounded-lg p-3 leading-relaxed">
            {result.feedback.general}
          </p>
        )}

        {/* Critérios em accordion */}
        <Accordion type="multiple" className="space-y-1">
          {comps.map((c) => {
            const pctComp = Math.round(((c.score ?? 0) / maxPerComp) * 100);
            return (
              <AccordionItem key={c.value} value={c.value} className="border rounded-lg px-3">
                <AccordionTrigger className="py-2.5 hover:no-underline">
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <span className="text-sm font-medium">{c.label}</span>
                    <div className="flex-1 mx-2">
                      <Progress value={pctComp} className="h-1.5" />
                    </div>
                    <span className={cn(
                      "text-xs font-bold w-14 text-right shrink-0",
                      pctComp >= 70 ? "text-green-600" : pctComp >= 50 ? "text-amber-500" : "text-red-500"
                    )}>
                      {c.score ?? 0}/{maxPerComp}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-3 text-xs text-muted-foreground leading-relaxed">
                  {c.feedback || "Sem comentário específico para este critério."}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Sugestão "Nota 10" */}
        {result.rewrite_suggestion && (
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3">
            <p className="text-xs font-semibold text-amber-700 mb-1.5">💡 Como chegar na nota 10</p>
            <p className="text-xs text-amber-800 leading-relaxed">{result.rewrite_suggestion}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
