import { useState, useEffect, useRef } from "react";
import { useStudentAuth } from "@/contexts/StudentAuthContext";
import { SalaLayout } from "@/components/sala/SalaLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Brain,
  ChevronRight,
  Loader2,
  BarChart3,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Sparkles,
  Menu,
  X,
  Clock,
  Trophy,
  ClipboardList,
  PenLine,
  Star,
  RotateCcw,
  Flame,
  Zap,
  Medal,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

interface Subject {
  id: string;
  name: string;
  slug: string;
  contentCount: number;
  isDifficulty: boolean;
  isFacility: boolean;
}

interface ContentItem {
  id: string;
  title: string;
  body: string;
  subjectId: string;
  subjectName: string;
  topicId?: string;
  parsed: { definition?: string; keyPoints?: string[]; example?: string };
  enrichment?: { keyPoints: string; example: string; tip: string } | null;
}

interface QuestionItem {
  id: string;
  text: string;
  options: string[];
}

interface SubjectStat {
  subject: string;
  total: number;
  correct: number;
  percentage: number;
}

interface SimuladoItem {
  id: string;
  title: string;
  totalQuestions: number;
  durationMinutes: number;
  passingScore: number;
  month: string;
  userSimuladoId: string | null;
  userStatus: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "EXPIRED";
  userScore: number | null;
  userPassed: boolean | null;
  currentQuestion: number;
  startedAt: string | null;
}

interface ActiveSimulado {
  userSimuladoId: string;
  title: string;
  totalQuestions: number;
  durationMinutes: number;
  startedAt: Date;
  currentQuestion: number;
  correctAnswers: number;
  wrongAnswers: number;
}

interface ChatMessage {
  id: string;
  type: "content" | "question" | "answer" | "enrichment" | "system" | "simulado-result" | "essay-result";
  data: any;
  timestamp: Date;
}

interface GamificationData {
  streak: number;
  bestStreak: number;
  xp: number;
  level: number;
  xpInCurrentLevel: number;
  xpForNextLevel: number;
  rank: number;
  topUsers: { name: string; xp: number; level: number; streak: number }[];
}

// ============================================
// COMPONENT
// ============================================

export default function SalaAula() {
  const { token, student } = useStudentAuth();
  const { toast } = useToast();

  // State
  const [studyMode, setStudyMode] = useState<"plano" | "livre" | "simulado">("plano");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentContent, setCurrentContent] = useState<ContentItem | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionItem | null>(null);
  const [questionCorrectIndex, setQuestionCorrectIndex] = useState<number | null>(null);
  const [stats, setStats] = useState<{ totalQuestionsAnswered: number; bySubject: SubjectStat[] } | null>(null);
  const [studyPlan, setStudyPlan] = useState<{ subjectId: string; subjectName: string; totalContent: number; studiedContent: number; percentage: number; isDifficulty: boolean }[]>([]);
  const [simulados, setSimulados] = useState<SimuladoItem[]>([]);
  const [isVeterano, setIsVeterano] = useState(false);
  const [activeSimulado, setActiveSimulado] = useState<ActiveSimulado | null>(null);
  const [simuladoTimeRemaining, setSimuladoTimeRemaining] = useState<number>(0);
  const [isLoadingSimulado, setIsLoadingSimulado] = useState(false);
  const [sm2DueCount, setSm2DueCount] = useState(0);
  const [sm2Items, setSm2Items] = useState<{ reviewId: string; contentId: string; title: string; body: string; subjectName: string; totalReviews: number }[]>([]);
  const [sm2ActiveIndex, setSm2ActiveIndex] = useState<number | null>(null);
  const [showEssayForm, setShowEssayForm] = useState(false);
  const [essayTheme, setEssayTheme] = useState("");
  const [essayText, setEssayText] = useState("");
  const [isSubmittingEssay, setIsSubmittingEssay] = useState(false);
  const [essayStatus, setEssayStatus] = useState<{ freeRemaining: number; credits: number; plan: string } | null>(null);
  const [gamification, setGamification] = useState<GamificationData | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [answeredIndex, setAnsweredIndex] = useState<number | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [remaining, setRemaining] = useState<number | undefined>();

  const chatEndRef = useRef<HTMLDivElement>(null);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ============================================
  // FETCH SUBJECTS + STATS ON MOUNT
  // ============================================

  useEffect(() => {
    fetchSubjects();
    fetchStats();
    fetchStudyPlan();
    fetchSimulados();
    fetchEssayStatus();
    fetchSm2Due();
    fetchGamification();
    // Welcome message
    addMessage("system", {
      text: `Olá, ${student?.name?.split(" ")[0]}! Escolha uma matéria ao lado ou clique em "Próximo conteúdo" para começar.`,
    });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Timer for active simulado
  useEffect(() => {
    if (!activeSimulado) return;
    const interval = setInterval(() => {
      const elapsed = (Date.now() - activeSimulado.startedAt.getTime()) / 60000;
      const remaining = Math.max(0, activeSimulado.durationMinutes - elapsed);
      setSimuladoTimeRemaining(Math.round(remaining));
      if (remaining <= 0) {
        clearInterval(interval);
        addMessage("system", { text: "Tempo esgotado! O simulado foi encerrado automaticamente." });
        setActiveSimulado(null);
        fetchSimulados();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activeSimulado]);

  // ============================================
  // API CALLS
  // ============================================

  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/sala/subjects", { headers });
      const data = await res.json();
      if (data.success) setSubjects(data.subjects);
    } catch {
      toast({ variant: "destructive", title: "Erro ao carregar matérias" });
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/sala/stats", { headers });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        if (data.stats.access?.freeRemaining != null) {
          setRemaining(data.stats.access.freeRemaining);
        } else if (data.stats.access?.dailyRemaining != null) {
          setRemaining(data.stats.access.dailyRemaining);
        }
      }
    } catch { /* silent */ }
  };

  const fetchStudyPlan = async () => {
    try {
      const res = await fetch("/api/sala/study-plan", { headers });
      const data = await res.json();
      if (data.success) setStudyPlan(data.plan);
    } catch { /* silent */ }
  };

  const fetchSequentialContent = async (subjectId: string) => {
    setIsLoadingContent(true);
    setCurrentQuestion(null);
    setAnsweredIndex(null);
    setQuestionCorrectIndex(null);

    try {
      const res = await fetch(`/api/sala/content/sequential?subjectId=${subjectId}`, { headers });
      const data = await res.json();

      if (data.success && data.content) {
        setCurrentContent(data.content);
        addMessage("content", data.content);
        if (data.content.enrichment) {
          addMessage("enrichment", data.content.enrichment);
        }
        fetchStudyPlan(); // refresh progress
      } else {
        addMessage("system", { text: data.message || "Nenhum conteúdo disponível." });
      }
    } catch {
      toast({ variant: "destructive", title: "Erro ao carregar conteúdo" });
    } finally {
      setIsLoadingContent(false);
    }
  };

  const fetchSimulados = async () => {
    try {
      const res = await fetch("/api/sala/simulados", { headers });
      const data = await res.json();
      if (data.success) {
        setSimulados(data.simulados);
        setIsVeterano(data.isVeterano);
      }
    } catch { /* silent */ }
  };

  const fetchEssayStatus = async () => {
    try {
      const res = await fetch("/api/sala/essays/status", { headers });
      const data = await res.json();
      if (data.success) setEssayStatus({ freeRemaining: data.freeRemaining, credits: data.credits, plan: data.plan });
    } catch { /* silent */ }
  };

  const fetchSm2Due = async () => {
    try {
      const res = await fetch("/api/sala/sm2/due?limit=10", { headers });
      const data = await res.json();
      if (data.success) {
        setSm2DueCount(data.dueCount);
        setSm2Items(data.items);
      }
    } catch { /* silent */ }
  };

  const fetchGamification = async () => {
    try {
      const res = await fetch("/api/sala/gamification", { headers });
      const data = await res.json();
      if (data.success) setGamification(data);
    } catch { /* silent */ }
  };

  const startSm2Review = async () => {
    await fetchSm2Due();
    setSm2ActiveIndex(0);
  };

  const submitSm2Review = async (reviewId: string, quality: number) => {
    try {
      await fetch("/api/sala/sm2/review", {
        method: "POST",
        headers,
        body: JSON.stringify({ reviewId, quality }),
      });
      const next = (sm2ActiveIndex ?? 0) + 1;
      if (next < sm2Items.length) {
        setSm2ActiveIndex(next);
      } else {
        setSm2ActiveIndex(null);
        setSm2Items([]);
        await fetchSm2Due();
        addMessage("system", { text: "Revisão concluída! Todos os itens de hoje foram revisados." });
      }
    } catch {
      toast({ variant: "destructive", title: "Erro ao registrar revisão" });
    }
  };

  const submitEssay = async () => {
    if (!essayTheme.trim() || !essayText.trim()) return;
    setIsSubmittingEssay(true);
    setShowEssayForm(false);
    addMessage("system", { text: `Enviando redação para correção: "${essayTheme}"...` });
    try {
      const res = await fetch("/api/sala/essays/submit", {
        method: "POST",
        headers,
        body: JSON.stringify({ theme: essayTheme, text: essayText }),
      });
      const data = await res.json();
      if (data.requiresUpgrade) {
        addMessage("system", { text: data.error || "Você precisa de um plano superior para enviar redações." });
        return;
      }
      if (!data.success || !data.correction) {
        addMessage("system", { text: "Não foi possível corrigir a redação agora. Tente novamente." });
        return;
      }
      addMessage("essay-result", { theme: essayTheme, ...data.correction });
      setEssayTheme("");
      setEssayText("");
      fetchEssayStatus();
    } catch {
      toast({ variant: "destructive", title: "Erro ao enviar redação" });
    } finally {
      setIsSubmittingEssay(false);
    }
  };

  const startSimulado = async (simuladoId: string, title: string, totalQuestions: number, durationMinutes: number) => {
    setIsLoadingSimulado(true);
    try {
      const res = await fetch("/api/sala/simulados/start", {
        method: "POST",
        headers,
        body: JSON.stringify({ simuladoId }),
      });
      const data = await res.json();
      if (data.requiresUpgrade) {
        addMessage("system", { text: data.error });
        return;
      }
      if (!data.success) {
        addMessage("system", { text: data.error || "Não foi possível iniciar o simulado." });
        return;
      }
      const newActive: ActiveSimulado = {
        userSimuladoId: data.userSimuladoId,
        title,
        totalQuestions,
        durationMinutes,
        startedAt: new Date(data.startedAt),
        currentQuestion: data.currentQuestion,
        correctAnswers: data.correctAnswers,
        wrongAnswers: data.wrongAnswers,
      };
      setActiveSimulado(newActive);
      const elapsed = (Date.now() - newActive.startedAt.getTime()) / 60000;
      setSimuladoTimeRemaining(Math.round(Math.max(0, durationMinutes - elapsed)));
      addMessage("system", {
        text: data.resumed
          ? `Retomando "${title}" — questão ${data.currentQuestion + 1}/${totalQuestions}`
          : `Simulado "${title}" iniciado! ${totalQuestions} questões em ${durationMinutes} minutos. Boa sorte!`,
      });
      await fetchSimuladoQuestion(data.userSimuladoId);
    } catch {
      toast({ variant: "destructive", title: "Erro ao iniciar simulado" });
    } finally {
      setIsLoadingSimulado(false);
    }
  };

  const fetchSimuladoQuestion = async (userSimuladoId: string) => {
    setIsLoadingQuestion(true);
    try {
      const res = await fetch(`/api/sala/simulados/question/${userSimuladoId}`, { headers });
      const data = await res.json();
      if (data.expired) {
        addMessage("system", { text: "Tempo esgotado! O simulado foi encerrado." });
        setActiveSimulado(null);
        fetchSimulados();
        return;
      }
      if (data.finished || !data.success) {
        addMessage("system", { text: "Simulado concluído! Veja o resultado no histórico." });
        setActiveSimulado(null);
        fetchSimulados();
        return;
      }
      if (data.skipped) return;
      if (data.question) {
        setCurrentQuestion(data.question);
        setQuestionCorrectIndex(null);
        setAnsweredIndex(null);
        addMessage("question", data.question);
        if (data.timeRemaining != null) setSimuladoTimeRemaining(data.timeRemaining);
      }
    } catch {
      toast({ variant: "destructive", title: "Erro ao buscar questão do simulado" });
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  const submitSimuladoAnswer = async (optionIndex: number) => {
    if (!activeSimulado || !currentQuestion || answeredIndex !== null) return;
    setAnsweredIndex(optionIndex);
    try {
      const res = await fetch("/api/sala/simulados/answer", {
        method: "POST",
        headers,
        body: JSON.stringify({
          userSimuladoId: activeSimulado.userSimuladoId,
          questionId: currentQuestion.id,
          simuladoQuestionId: (currentQuestion as any).simuladoQuestionId,
          answer: optionIndex,
        }),
      });
      const data = await res.json();
      if (!data.success) return;

      setQuestionCorrectIndex(data.correctAnswer ?? -1);
      addMessage("answer", {
        isCorrect: data.correct,
        correctAnswer: data.correctAnswer ?? -1,
        userAnswer: optionIndex,
      });

      // Update active simulado progress
      setActiveSimulado((prev) =>
        prev
          ? {
              ...prev,
              currentQuestion: data.currentQuestion ?? prev.currentQuestion + 1,
              correctAnswers: data.correctAnswers ?? prev.correctAnswers + (data.correct ? 1 : 0),
              wrongAnswers: data.wrongAnswers ?? prev.wrongAnswers + (data.correct ? 0 : 1),
            }
          : null
      );

      if (data.finished && data.result) {
        const r = data.result;
        addMessage("simulado-result", r);
        setActiveSimulado(null);
        fetchSimulados();
      }
    } catch {
      toast({ variant: "destructive", title: "Erro ao responder questão do simulado" });
    }
  };

  const fetchNextContent = async (subjectId?: string | null) => {
    setIsLoadingContent(true);
    setCurrentQuestion(null);
    setAnsweredIndex(null);
    setQuestionCorrectIndex(null);

    try {
      const url = subjectId
        ? `/api/sala/content/next?subjectId=${subjectId}`
        : "/api/sala/content/next";
      const res = await fetch(url, { headers });
      const data = await res.json();

      if (data.success && data.content) {
        setCurrentContent(data.content);
        addMessage("content", data.content);

        if (data.content.enrichment) {
          addMessage("enrichment", data.content.enrichment);
        }
      } else {
        addMessage("system", { text: data.message || "Nenhum conteúdo disponível." });
      }
    } catch {
      toast({ variant: "destructive", title: "Erro ao carregar conteúdo" });
    } finally {
      setIsLoadingContent(false);
    }
  };

  const fetchQuestion = async () => {
    if (!currentContent) return;
    setIsLoadingQuestion(true);

    try {
      const params = new URLSearchParams({
        contentId: currentContent.id,
        subjectId: currentContent.subjectId,
        contentTitle: currentContent.title,
        contentText: currentContent.body?.slice(0, 500) || "",
      });
      if (currentContent.topicId) params.set("topicId", currentContent.topicId);

      const res = await fetch(`/api/sala/question?${params}`, { headers });
      const data = await res.json();

      if (data.accessDenied) {
        addMessage("system", {
          text: "Você atingiu o limite de questões. Assine um plano para continuar estudando!",
          type: "limit",
        });
        return;
      }

      if (data.success && data.question) {
        setCurrentQuestion(data.question);
        setQuestionCorrectIndex(null);
        setAnsweredIndex(null);
        if (data.remaining != null) setRemaining(data.remaining);
        addMessage("question", data.question);
      } else {
        addMessage("system", { text: data.message || "Nenhuma questão disponível." });
      }
    } catch {
      toast({ variant: "destructive", title: "Erro ao carregar questão" });
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  const submitAnswer = async (optionIndex: number) => {
    if (!currentQuestion || answeredIndex !== null) return;
    // Route to simulado answer submission when a simulado is active
    if (activeSimulado) {
      await submitSimuladoAnswer(optionIndex);
      return;
    }
    setAnsweredIndex(optionIndex);

    try {
      const res = await fetch("/api/sala/question/answer", {
        method: "POST",
        headers,
        body: JSON.stringify({
          questionId: currentQuestion.id,
          userAnswer: optionIndex,
          correctIndex: questionCorrectIndex,
          contentId: currentContent?.id,
          contentTitle: currentContent?.title,
          contentText: currentContent?.body?.slice(0, 500),
        }),
      });
      const data = await res.json();

      if (data.success) {
        setQuestionCorrectIndex(data.correctAnswer);
        addMessage("answer", {
          isCorrect: data.isCorrect,
          correctAnswer: data.correctAnswer,
          userAnswer: optionIndex,
          explanation: data.explanation,
        });
        fetchStats();
        fetchGamification(); // Refresh XP + streak
      }
    } catch {
      toast({ variant: "destructive", title: "Erro ao enviar resposta" });
    }
  };

  // ============================================
  // HELPERS
  // ============================================

  const addMessage = (type: ChatMessage["type"], data: any) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}_${Math.random()}`, type, data, timestamp: new Date() },
    ]);
  };

  const handleSubjectClick = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setShowMobileSidebar(false);
    if (studyMode === "plano") {
      fetchSequentialContent(subjectId);
    } else {
      fetchNextContent(subjectId);
    }
  };

  const handleNextContent = () => {
    if (studyMode === "plano" && selectedSubject) {
      fetchSequentialContent(selectedSubject);
    } else {
      fetchNextContent(selectedSubject);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <SalaLayout>
      <div className="flex h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)]">
        {/* Mobile sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed bottom-4 left-4 z-50 rounded-full shadow-lg bg-primary text-primary-foreground h-12 w-12"
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        >
          {showMobileSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* LEFT: Subject Sidebar */}
        <aside
          className={`${
            showMobileSidebar ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:relative z-40 w-64 h-full border-r bg-background transition-transform duration-200`}
        >
          {/* Mode toggle */}
          <div className="p-2 border-b">
            <div className="flex rounded-lg bg-muted p-1">
              <button
                onClick={() => setStudyMode("plano")}
                className={`flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors ${
                  studyMode === "plano"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Plano
              </button>
              <button
                onClick={() => setStudyMode("livre")}
                className={`flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors ${
                  studyMode === "livre"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Livre
              </button>
              <button
                onClick={() => { setStudyMode("simulado"); fetchSimulados(); }}
                className={`flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors ${
                  studyMode === "simulado"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Simulados
              </button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100%-3.25rem)]">
            <div className="p-2 space-y-1">
              {studyMode === "simulado" ? (
                <>
                  {!isVeterano && (
                    <div className="px-3 py-3 rounded-lg bg-amber-50 border border-amber-200 mx-1 my-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Trophy className="h-3.5 w-3.5 text-amber-600" />
                        <span className="text-xs font-semibold text-amber-800">Plano VETERANO</span>
                      </div>
                      <p className="text-[11px] text-amber-700">Simulados mensais são exclusivos do plano VETERANO.</p>
                    </div>
                  )}
                  <p className="px-3 py-1 text-xs text-muted-foreground">Simulados do mês</p>
                  <Separator className="my-1" />
                  {simulados.length === 0 ? (
                    <p className="px-3 py-4 text-xs text-muted-foreground text-center">Carregando...</p>
                  ) : (
                    simulados.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          if (!isVeterano) {
                            addMessage("system", { text: "Simulados são exclusivos do plano VETERANO. Faça upgrade para acessar!" });
                            return;
                          }
                          if (s.userStatus === "COMPLETED") {
                            addMessage("system", { text: `Você já completou "${s.title}" com ${s.userScore}% de aproveitamento.` });
                            return;
                          }
                          setShowMobileSidebar(false);
                          startSimulado(s.id, s.title, s.totalQuestions, s.durationMinutes);
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors hover:bg-muted"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="truncate font-medium text-xs">{s.title}</span>
                          {s.userStatus === "COMPLETED" ? (
                            <Badge variant={s.userPassed ? "default" : "secondary"} className="text-[10px] px-1 py-0 shrink-0">
                              {s.userScore}%
                            </Badge>
                          ) : s.userStatus === "IN_PROGRESS" ? (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 shrink-0">em andamento</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 shrink-0">novo</Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {s.totalQuestions} questões · {s.durationMinutes} min
                        </p>
                      </button>
                    ))
                  )}
                </>
              ) : studyMode === "livre" ? (
                <>
                  {/* Estudo Livre: smart + subject list */}
                  <button
                    onClick={() => { setSelectedSubject(null); setShowMobileSidebar(false); fetchNextContent(null); }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedSubject === null
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Estudo inteligente
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">Seleção adaptativa</p>
                  </button>

                  <Separator className="my-2" />

                  {subjects.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSubjectClick(s.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedSubject === s.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{s.name}</span>
                        {s.isDifficulty && (
                          <Badge variant="destructive" className="text-[10px] px-1 py-0">foco</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{s.contentCount} conteúdos</p>
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {/* Plano de Aula: sequential progress */}
                  <p className="px-3 py-1 text-xs text-muted-foreground">
                    Estude na ordem recomendada. Matérias de foco aparecem primeiro.
                  </p>

                  <Separator className="my-2" />

                  {[...studyPlan]
                    .sort((a, b) => (a.isDifficulty === b.isDifficulty ? 0 : a.isDifficulty ? -1 : 1))
                    .map((s) => (
                    <button
                      key={s.subjectId}
                      onClick={() => { setSelectedSubject(s.subjectId); setShowMobileSidebar(false); fetchSequentialContent(s.subjectId); }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedSubject === s.subjectId
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{s.subjectName}</span>
                        {s.isDifficulty && (
                          <Badge variant="destructive" className="text-[10px] px-1 py-0">foco</Badge>
                        )}
                      </div>
                      {/* Progress bar */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-muted rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              s.percentage === 100 ? "bg-green-500" : "bg-primary"
                            }`}
                            style={{ width: `${Math.max(s.percentage, 2)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {s.studiedContent}/{s.totalContent}
                        </span>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          </ScrollArea>
        </aside>

        {/* CENTER: Chat Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Active simulado banner */}
          {activeSimulado && (
            <div className="flex items-center justify-between px-4 py-2 bg-blue-50 border-b border-blue-200 text-sm">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800 truncate">{activeSimulado.title}</span>
                <Badge variant="outline" className="text-blue-700 border-blue-300 text-xs">
                  {activeSimulado.currentQuestion}/{activeSimulado.totalQuestions}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-blue-700 shrink-0">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{simuladoTimeRemaining}min</span>
              </div>
            </div>
          )}

          <ScrollArea className="flex-1 p-4">
            <div className="max-w-2xl mx-auto space-y-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} onAnswer={submitAnswer} answeredIndex={answeredIndex} correctIndex={questionCorrectIndex} />
              ))}

              {(isLoadingContent || isLoadingQuestion || isLoadingSimulado) && (
                <div className="flex items-center gap-2 text-muted-foreground py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">
                    {isLoadingContent ? "Buscando conteúdo..." : isLoadingSimulado ? "Iniciando simulado..." : "Buscando questão..."}
                  </span>
                </div>
              )}

              {/* SM2 review card */}
              {sm2ActiveIndex !== null && sm2Items[sm2ActiveIndex] && (
                <SM2ReviewCard
                  item={sm2Items[sm2ActiveIndex]}
                  current={sm2ActiveIndex + 1}
                  total={sm2Items.length}
                  onRate={(q) => submitSm2Review(sm2Items[sm2ActiveIndex].reviewId, q)}
                  onSkip={() => {
                    const next = sm2ActiveIndex + 1;
                    if (next < sm2Items.length) setSm2ActiveIndex(next);
                    else { setSm2ActiveIndex(null); setSm2Items([]); }
                  }}
                />
              )}

              {/* Inline essay form */}
              {showEssayForm && !activeSimulado && (
                <Card className="border-l-4 border-l-violet-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <PenLine className="h-4 w-4 text-violet-600" /> Redação
                    </CardTitle>
                    {essayStatus && (
                      <p className="text-xs text-muted-foreground">
                        {essayStatus.freeRemaining > 0
                          ? `${essayStatus.freeRemaining} redação${essayStatus.freeRemaining > 1 ? "ões" : ""} grátis este mês`
                          : essayStatus.credits >= 1.99
                          ? `Saldo: R$ ${essayStatus.credits.toFixed(2)}`
                          : "Sem créditos disponíveis"}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Tema da redação</label>
                      <Input
                        placeholder="Ex: Segurança pública e a atuação policial..."
                        value={essayTheme}
                        onChange={(e) => setEssayTheme(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Sua redação</label>
                      <Textarea
                        placeholder="Escreva sua redação aqui (mínimo 50 palavras)..."
                        rows={8}
                        value={essayText}
                        onChange={(e) => setEssayText(e.target.value)}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {essayText.trim() ? essayText.trim().split(/\s+/).length : 0} palavras
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={submitEssay}
                        disabled={!essayTheme.trim() || essayText.trim().split(/\s+/).length < 50}
                        size="sm"
                        className="bg-violet-600 hover:bg-violet-700"
                      >
                        Enviar para correção
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setShowEssayForm(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          {/* Action bar */}
          <div className="border-t p-3 bg-background">
            <div className="max-w-2xl mx-auto flex gap-2 flex-wrap">
              {/* Simulado mode: next question after answering */}
              {activeSimulado ? (
                <>
                  {answeredIndex !== null && !isLoadingQuestion && (
                    <Button
                      onClick={() => {
                        setCurrentQuestion(null);
                        setAnsweredIndex(null);
                        setQuestionCorrectIndex(null);
                        fetchSimuladoQuestion(activeSimulado.userSimuladoId);
                      }}
                      size="sm"
                    >
                      <ChevronRight className="mr-1 h-3 w-3" />
                      Próxima questão
                    </Button>
                  )}
                  <span className="text-xs text-muted-foreground self-center ml-auto">
                    {activeSimulado.correctAnswers} certas · {activeSimulado.wrongAnswers} erradas
                  </span>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleNextContent}
                    disabled={isLoadingContent}
                    size="sm"
                  >
                    {isLoadingContent ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <ChevronRight className="mr-1 h-3 w-3" />}
                    Próximo conteúdo
                  </Button>
                  {currentContent && answeredIndex === null && !currentQuestion && (
                    <Button
                      onClick={fetchQuestion}
                      disabled={isLoadingQuestion}
                      variant="secondary"
                      size="sm"
                    >
                      {isLoadingQuestion ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Brain className="mr-1 h-3 w-3" />}
                      Responder questão
                    </Button>
                  )}
                  {answeredIndex !== null && !activeSimulado && (
                    <Button
                      onClick={fetchQuestion}
                      disabled={isLoadingQuestion}
                      variant="secondary"
                      size="sm"
                    >
                      Próxima questão
                    </Button>
                  )}
                  {sm2DueCount > 0 && sm2ActiveIndex === null && (
                    <Button
                      onClick={startSm2Review}
                      variant="outline"
                      size="sm"
                      className="relative"
                    >
                      <RotateCcw className="mr-1 h-3 w-3" />
                      Revisar
                      <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {sm2DueCount > 9 ? "9+" : sm2DueCount}
                      </span>
                    </Button>
                  )}
                  <Button
                    onClick={() => { setShowEssayForm(!showEssayForm); }}
                    variant="outline"
                    size="sm"
                    disabled={isSubmittingEssay}
                  >
                    {isSubmittingEssay ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <PenLine className="mr-1 h-3 w-3" />}
                    Redação
                  </Button>
                  {remaining != null && (
                    <span className="text-xs text-muted-foreground self-center ml-auto">
                      {remaining} questões restantes hoje
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Stats Panel */}
        <aside className="hidden lg:block w-72 border-l">
          <div className="p-4 border-b">
            <h2 className="font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Seu progresso
            </h2>
          </div>
          <ScrollArea className="h-[calc(100%-3.5rem)]">
            <div className="p-4 space-y-4">
              {/* Total */}
              <Card>
                <CardContent className="pt-4 pb-3">
                  <div className="text-3xl font-bold text-primary">
                    {stats?.totalQuestionsAnswered || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">questões respondidas</p>
                </CardContent>
              </Card>

              {/* Per subject */}
              {stats?.bySubject && stats.bySubject.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Por matéria</h3>
                  {stats.bySubject.map((s) => (
                    <div key={s.subject} className="text-sm">
                      <div className="flex justify-between">
                        <span className="truncate">{s.subject}</span>
                        <span className="font-medium">{s.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full ${
                            s.percentage >= 70
                              ? "bg-green-500"
                              : s.percentage >= 40
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${Math.max(s.percentage, 2)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {s.correct}/{s.total} corretas
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Gamification: Streak + XP + Rank */}
              {gamification && (
                <>
                  {/* Streak */}
                  <Card className={gamification.streak > 0 ? "border-orange-200 bg-orange-50/50" : ""}>
                    <CardContent className="pt-4 pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Flame className={`h-5 w-5 ${gamification.streak > 0 ? "text-orange-500" : "text-muted-foreground"}`} />
                          <span className="text-2xl font-bold">{gamification.streak}</span>
                          <span className="text-sm text-muted-foreground">
                            dia{gamification.streak !== 1 ? "s" : ""}
                          </span>
                        </div>
                        {gamification.bestStreak > 0 && (
                          <span className="text-xs text-muted-foreground">
                            melhor: {gamification.bestStreak}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">sequência de estudos</p>
                    </CardContent>
                  </Card>

                  {/* XP + Level */}
                  <Card>
                    <CardContent className="pt-4 pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold text-sm">Nível {gamification.level}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{gamification.xp} XP</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-yellow-400 transition-all"
                          style={{ width: `${Math.min((gamification.xpInCurrentLevel / gamification.xpForNextLevel) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {gamification.xpForNextLevel - gamification.xpInCurrentLevel} XP para nível {gamification.level + 1}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Ranking */}
                  <div>
                    <h3 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                      <Medal className="h-4 w-4 text-yellow-600" /> Ranking
                      {gamification.rank <= 10 && (
                        <Badge variant="outline" className="text-xs ml-auto">#{gamification.rank}</Badge>
                      )}
                    </h3>
                    <div className="space-y-1">
                      {gamification.topUsers.slice(0, 5).map((u, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm ${
                            u.name === (student?.name?.split(" ")[0]) ? "bg-primary/10 font-medium" : ""
                          }`}
                        >
                          <span className="text-xs text-muted-foreground w-4 shrink-0">#{i + 1}</span>
                          <span className="truncate flex-1">{u.name}</span>
                          <span className="text-xs text-muted-foreground shrink-0">{u.xp} XP</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Plan info */}
              <Card>
                <CardContent className="pt-4 pb-3">
                  <Badge variant={student?.plan === "FREE" ? "secondary" : "default"}>
                    {student?.plan || "FREE"}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">
                    {student?.plan === "FREE"
                      ? "21 questões grátis no primeiro dia"
                      : student?.plan === "CALOURO"
                      ? "10 questões/dia"
                      : "30 questões/dia"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </aside>
      </div>
    </SalaLayout>
  );
}

// ============================================
// SM2 REVIEW CARD COMPONENT
// ============================================

function SM2ReviewCard({
  item,
  current,
  total,
  onRate,
  onSkip,
}: {
  item: { title: string; body: string; subjectName: string; totalReviews: number };
  current: number;
  total: number;
  onRate: (quality: number) => void;
  onSkip: () => void;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Card className="border-l-4 border-l-orange-500 bg-orange-50/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-orange-500" /> Revisão {current}/{total}
          </CardTitle>
          <Badge variant="outline" className="text-xs">{item.subjectName}</Badge>
        </div>
        <p className="font-semibold">{item.title}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {!revealed ? (
          <Button onClick={() => setRevealed(true)} variant="secondary" size="sm" className="w-full">
            Mostrar conteúdo
          </Button>
        ) : (
          <>
            <div className="text-sm text-muted-foreground max-h-48 overflow-y-auto bg-white/70 rounded-lg p-3">
              {item.body?.split("\n").slice(0, 10).map((line, i) => (
                <p key={i} className={line.trim() === "" ? "h-2" : ""}>{line}</p>
              ))}
            </div>
            <div>
              <p className="text-xs font-medium mb-2">Quanto você lembrava?</p>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { q: 0, label: "Nada", color: "bg-red-100 hover:bg-red-200 text-red-700" },
                  { q: 1, label: "Pouco", color: "bg-orange-100 hover:bg-orange-200 text-orange-700" },
                  { q: 3, label: "Com esforço", color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-700" },
                  { q: 4, label: "Bem", color: "bg-green-100 hover:bg-green-200 text-green-700" },
                  { q: 5, label: "Facilmente", color: "bg-emerald-100 hover:bg-emerald-200 text-emerald-700" },
                ].map(({ q, label, color }) => (
                  <button
                    key={q}
                    onClick={() => { setRevealed(false); onRate(q); }}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${color}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        <button onClick={onSkip} className="text-xs text-muted-foreground hover:text-foreground underline">
          Pular este item
        </button>
      </CardContent>
    </Card>
  );
}

// ============================================
// MESSAGE BUBBLE COMPONENT
// ============================================

function MessageBubble({
  message,
  onAnswer,
  answeredIndex,
  correctIndex,
}: {
  message: ChatMessage;
  onAnswer: (index: number) => void;
  answeredIndex: number | null;
  correctIndex: number | null;
}) {
  const { type, data } = message;

  if (type === "system") {
    return (
      <div className="text-center py-2">
        <p className="text-sm text-muted-foreground inline-block bg-muted/50 rounded-full px-4 py-1.5">
          {data.text}
        </p>
      </div>
    );
  }

  if (type === "content") {
    return (
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{data.subjectName}</Badge>
          </div>
          <CardTitle className="text-lg">{data.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-foreground">
            {data.body?.split("\n").map((line: string, i: number) => (
              <p key={i} className={line.trim() === "" ? "h-2" : ""}>
                {line}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === "enrichment") {
    return (
      <Card className="border-l-4 border-l-amber-500 bg-amber-50/50">
        <CardContent className="pt-4 space-y-3">
          {data.keyPoints && (
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Pontos-chave
              </h4>
              <p className="text-sm text-muted-foreground">{data.keyPoints}</p>
            </div>
          )}
          {data.example && (
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-1">
                <BookOpen className="h-3.5 w-3.5 text-amber-600" /> Exemplo
              </h4>
              <p className="text-sm text-muted-foreground">{data.example}</p>
            </div>
          )}
          {data.tip && (
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-1">
                <Lightbulb className="h-3.5 w-3.5 text-amber-600" /> Dica
              </h4>
              <p className="text-sm text-muted-foreground">{data.tip}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (type === "question") {
    const isAnswered = answeredIndex !== null;
    return (
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-600" /> Questão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-3">{data.text}</p>
          <div className="space-y-2">
            {data.options?.map((option: string, i: number) => {
              let variant: "outline" | "default" | "destructive" | "secondary" = "outline";
              if (isAnswered) {
                if (correctIndex !== null && i === correctIndex) variant = "default";
                else if (i === answeredIndex && correctIndex !== null && i !== correctIndex) variant = "destructive";
                else variant = "secondary";
              }

              return (
                <Button
                  key={i}
                  variant={variant}
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => !isAnswered && onAnswer(i)}
                  disabled={isAnswered}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + i)})</span>
                  <span className="text-sm">{option}</span>
                  {isAnswered && correctIndex === i && <CheckCircle2 className="ml-auto h-4 w-4 text-green-600" />}
                  {isAnswered && answeredIndex === i && correctIndex !== i && <XCircle className="ml-auto h-4 w-4 text-red-600" />}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === "answer") {
    return (
      <Card className={`border-l-4 ${data.isCorrect ? "border-l-green-500 bg-green-50/50" : "border-l-red-500 bg-red-50/50"}`}>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-2">
            {data.isCorrect ? (
              <><CheckCircle2 className="h-5 w-5 text-green-600" /> <span className="font-semibold text-green-700">Correto!</span></>
            ) : (
              <><XCircle className="h-5 w-5 text-red-600" /> <span className="font-semibold text-red-700">Incorreto</span></>
            )}
          </div>
          {data.explanation && (
            <p className="text-sm text-muted-foreground">{data.explanation}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (type === "essay-result") {
    const total = data.scores?.total ?? 0;
    const pct = Math.round((total / 1000) * 100);
    const comps = [
      { label: "Norma culta", score: data.scores?.comp1, feedback: data.feedback?.comp1 },
      { label: "Compreensão", score: data.scores?.comp2, feedback: data.feedback?.comp2 },
      { label: "Organização", score: data.scores?.comp3, feedback: data.feedback?.comp3 },
      { label: "Coesão", score: data.scores?.comp4, feedback: data.feedback?.comp4 },
      { label: "Intervenção", score: data.scores?.comp5, feedback: data.feedback?.comp5 },
    ];
    return (
      <Card className="border-l-4 border-l-violet-500 bg-violet-50/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <PenLine className="h-4 w-4 text-violet-600" /> Resultado: {data.theme}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-violet-700">{total}/1000</div>
            <div>
              <div className="w-full bg-muted rounded-full h-2 w-32">
                <div className="h-2 rounded-full bg-violet-500" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{pct}% de aproveitamento</p>
            </div>
          </div>
          {data.feedback?.general && (
            <p className="text-sm text-muted-foreground bg-white/70 rounded-lg p-3">{data.feedback.general}</p>
          )}
          <div className="space-y-2">
            {comps.map((c, i) => (
              <div key={i} className="text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{c.label}</span>
                  <div className="flex items-center gap-1">
                    {[0,1,2,3,4].map(s => (
                      <Star key={s} className={`h-3 w-3 ${(c.score ?? 0) > s * 40 ? "text-violet-500 fill-violet-500" : "text-muted-foreground"}`} />
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

  if (type === "simulado-result") {
    const passed = data.passed;
    return (
      <Card className={`border-2 ${passed ? "border-green-500 bg-green-50/50" : "border-orange-400 bg-orange-50/50"}`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className={`h-5 w-5 ${passed ? "text-green-600" : "text-orange-500"}`} />
            {passed ? "Simulado aprovado!" : "Simulado concluído"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-4xl font-bold text-center py-2">
            {data.score}%
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="bg-white/70 rounded-lg p-2">
              <div className="font-bold text-green-600">{data.correctAnswers}</div>
              <div className="text-xs text-muted-foreground">certas</div>
            </div>
            <div className="bg-white/70 rounded-lg p-2">
              <div className="font-bold text-red-500">{data.wrongAnswers}</div>
              <div className="text-xs text-muted-foreground">erradas</div>
            </div>
            <div className="bg-white/70 rounded-lg p-2">
              <div className="font-bold">{data.timeSpent}min</div>
              <div className="text-xs text-muted-foreground">tempo</div>
            </div>
          </div>
          <p className="text-sm text-center text-muted-foreground">
            {passed ? "Parabéns! Você atingiu a nota mínima de aprovação." : `Continue estudando! A nota mínima é ${data.passingScore ?? 60}%.`}
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
}
