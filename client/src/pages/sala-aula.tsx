import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useStudentAuth } from "@/contexts/StudentAuthContext";
import { SalaLayout } from "@/components/sala/SalaLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Brain,
  ChevronRight,
  ChevronLeft,
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
  Target,
  LogOut,
  Send,
  ShieldCheck,
  Scale,
  Building2,
  Shield,
  Crosshair,
  Lock,
} from "lucide-react";
import { sortByNucleoDuro, isNucleoDuro } from "@/lib/pedagogia";

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
  banca?: string;
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

interface ConcursoItem {
  id: string;
  nome: string;
  sigla: string;
  banca: string;
  cargo_padrao: string;
}

// Agrupamento client-side dos concursos — 5 Blocos oficiais
// Constantes usadas como chave em groupConcursos E getAreaIcon (evita mismatch de encoding)
const BLOCO_A = "Polícias Federais";
const BLOCO_B = "Defesa | Forças Armadas";
const BLOCO_C = "Inteligência | Administrativo";
const BLOCO_D = "Poder Judiciário | CNJ";
const BLOCO_E = "Estados e Municípios";

// Siglas fixas por bloco — inclui tanto siglas-código quanto siglas-nome-completo do DB
const SIGLAS_BLOCO_B = new Set([
  "ESPCEX", "IME", "ESA", "EXERCITO",
  "CN", "EN", "FUZNAVAIS", "MARINHA",
  "ITA", "EPCAR", "EAGS", "FAB", "AERONAUTICA", "MIN_DEF", "MD", "MIN_DEFESA",
]);
const SIGLAS_BLOCO_C = new Set(["ABIN", "ANAC", "CPNU"]);

function groupConcursos(list: ConcursoItem[]): Record<string, ConcursoItem[]> {
  const groups: Record<string, ConcursoItem[]> = {
    [BLOCO_A]: [], [BLOCO_B]: [], [BLOCO_C]: [], [BLOCO_D]: [], [BLOCO_E]: [],
  };
  for (const c of list) {
    const s = c.sigla;
    if (
      s.startsWith("PF") || s.startsWith("PRF") || s.startsWith("RFB") || s === "GP" ||
      ["PPF", "PP_FEDERAL", "PLF", "PL_FEDERAL"].includes(s)
    ) {
      groups[BLOCO_A].push(c);
    } else if (SIGLAS_BLOCO_B.has(s)) {
      groups[BLOCO_B].push(c);
    } else if (SIGLAS_BLOCO_C.has(s)) {
      groups[BLOCO_C].push(c);
    } else if (s.startsWith("PJ")) {
      groups[BLOCO_D].push(c);
    } else {
      // Bloco E: PM, PC, CBM, PP_ESTADUAL, PL_ESTADUAL, GM e demais estaduais/municipais
      groups[BLOCO_E].push(c);
    }
  }
  return groups;
}

// Ícones por bloco (chaves = constantes BLOCO_*)
function getAreaIcon(grupo: string) {
  const icons: Record<string, JSX.Element> = {
    [BLOCO_A]: <ShieldCheck size={36} className="text-blue-600" />,
    [BLOCO_B]: <Crosshair   size={36} className="text-green-700" />,
    [BLOCO_C]: <Building2   size={36} className="text-sky-500" />,
    [BLOCO_D]: <Scale       size={36} className="text-violet-600" />,
    [BLOCO_E]: <Shield      size={36} className="text-slate-500" />,
  };
  return icons[grupo] || <Shield size={36} className="text-muted-foreground" />;
}

// ============================================
// COMPONENT
// ============================================

export default function SalaAula() {
  const { token, student, updateProfile, logout } = useStudentAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

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
  const [essayStatus, setEssayStatus] = useState<{ freeRemaining: number; credits: number; plan: string } | null>(null);
  const [gamification, setGamification] = useState<GamificationData | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [subjectCompleted, setSubjectCompleted] = useState(false);
  const [answeredIndex, setAnsweredIndex] = useState<number | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [remaining, setRemaining] = useState<number | undefined>();
  const [showConcursoSelector, setShowConcursoSelector] = useState(false);
  const [showRaioX, setShowRaioX] = useState(false);
  const [lastStudiedSubjectId, setLastStudiedSubjectId] = useState<string | null>(
    () => localStorage.getItem("passarei_last_subject") ?? null
  );
  const [concursosList, setConcursosList] = useState<ConcursoItem[]>([]);
  const [targetConcurso, setTargetConcurso] = useState<{ id: string; nome: string; banca: string } | null>(null);
  const [showDashboard, setShowDashboard] = useState(true);
  const [showNavSheet, setShowNavSheet] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [editalProgress, setEditalProgress] = useState<{
    percentage: number; studiedCount: number; totalCount: number;
    subjects: { name: string; studiedCount: number; totalCount: number; percentage: number }[];
  } | null>(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [weeklyStatus, setWeeklyStatus] = useState<{
    available: boolean; reason: string; nextAvailableAt?: string;
  } | null>(null);

  // ── Jornada / Palco ──────────────────────────────────────
  const [showStudyPalco, setShowStudyPalco] = useState(true);
  const [nextMissionPreview, setNextMissionPreview] = useState<{ subjectName: string; contentTitle: string } | null>(null);
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);
  const [celebrateCorrect, setCelebrateCorrect] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasPersistedSession, setHasPersistedSession] = useState(false);

  // ── Modo Prova (Simulado Semanal imersivo) ──────────────
  const [weeklyExamMode, setWeeklyExamMode] = useState(false);
  const [weeklyExamUserSimId, setWeeklyExamUserSimId] = useState<string | null>(null);
  const [weeklyExamTotal, setWeeklyExamTotal] = useState(10);
  const [weeklyExamStartedAt, setWeeklyExamStartedAt] = useState(0);
  const [weeklyExamQuestion, setWeeklyExamQuestion] = useState<any>(null);
  const [weeklyExamQNum, setWeeklyExamQNum] = useState(1);
  const [weeklyExamAnswered, setWeeklyExamAnswered] = useState<number | null>(null);
  const [weeklyExamCorrectIdx, setWeeklyExamCorrectIdx] = useState<number | null>(null);
  const [weeklyExamCorrect, setWeeklyExamCorrect] = useState(0);
  const [weeklyExamWrongQs, setWeeklyExamWrongQs] = useState<{ question: any; correctAnswer: number; userAnswer: number }[]>([]);
  const [weeklyExamResult, setWeeklyExamResult] = useState<{
    score: number; correctAnswers: number; wrongAnswers: number;
    timeSpent: number; passed: boolean; timedOut?: boolean;
  } | null>(null);
  const [weeklyExamShowExit, setWeeklyExamShowExit] = useState(false);
  const [weeklyExamShowFinish, setWeeklyExamShowFinish] = useState(false);
  const [weeklyExamLoading, setWeeklyExamLoading] = useState(false);
  const [weeklyExamTimeLeft, setWeeklyExamTimeLeft] = useState(3600);
  const [weeklyExamShowReview, setWeeklyExamShowReview] = useState(false);

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
  }, []);

  // Verificar concurso-alvo ao montar (ou quando student muda)
  useEffect(() => {
    if (!student) return;
    fetch("/api/edital/concursos", { headers })
      .then(r => r.json())
      .then(d => {
        const list: ConcursoItem[] = d.concursos || [];
        setConcursosList(list);
        if (!student.targetConcursoId) {
          setShowConcursoSelector(true);
        } else {
          const found = list.find(c => c.id === student.targetConcursoId);
          if (found) setTargetConcurso({ id: found.id, nome: found.nome, banca: found.banca });
        }
      })
      .catch(() => { /* silent */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student?.id]);

  // Carregar progresso do edital e status semanal quando student ou concurso mudar
  useEffect(() => {
    if (!student) return;
    fetchEditalProgress();
    fetchWeeklyStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student?.id, student?.targetConcursoId]);

  // Cronômetro regressivo do Modo Prova
  useEffect(() => {
    if (!weeklyExamMode || weeklyExamResult || weeklyExamTimeLeft <= 0) return;
    const t = setTimeout(() => setWeeklyExamTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [weeklyExamMode, weeklyExamResult, weeklyExamTimeLeft]);

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

  // Salvar sessão de estudo no sessionStorage
  useEffect(() => {
    if (messages.length > 0 && !showDashboard && studyMode === "plano") {
      sessionStorage.setItem("passarei_sala_messages", JSON.stringify(messages.slice(-30)));
      sessionStorage.setItem("passarei_sala_subject", selectedSubject || "");
    }
  }, [messages]);

  // Detectar sessão persistida ao montar
  useEffect(() => {
    const saved = sessionStorage.getItem("passarei_sala_messages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setHasPersistedSession(true);
      } catch {}
    }
  }, []);

  // Buscar preview da próxima missão quando palco aparece
  useEffect(() => {
    if (showStudyPalco && !showDashboard && studyMode === "plano" && !hasPersistedSession && studyPlan.length > 0) {
      const ndSubject = studyPlan.find(s => isNucleoDuro(s.subjectName) && s.percentage < 100);
      fetchNextMissionPreview(ndSubject?.subjectId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showStudyPalco, showDashboard, studyMode, hasPersistedSession, studyPlan.length]);

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
    setIsTyping(true);
    setCurrentQuestion(null);
    setAnsweredIndex(null);
    setQuestionCorrectIndex(null);
    setSubjectCompleted(false); // reset sempre que tentar carregar novo conteúdo

    try {
      const res = await fetch(`/api/sala/content/sequential?subjectId=${subjectId}`, { headers });
      const data = await res.json();

      setIsTyping(false);
      if (data.success && data.content) {
        setCurrentContent(data.content);
        addMessage("content", data.content);
        if (data.content.enrichment) {
          addMessage("enrichment", data.content.enrichment);
        }
        fetchStudyPlan(); // refresh progress
      } else {
        // Matéria esgotada: sinaliza para exibir botão "próxima matéria"
        if (data.success && !data.content) setSubjectCompleted(true);
        addMessage("system", { text: data.message || "Nenhum conteúdo disponível." });
      }
    } catch {
      setIsTyping(false);
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

  const fetchEditalProgress = async () => {
    setIsLoadingProgress(true);
    try {
      const res = await fetch("/api/sala/edital/progress", { headers });
      const data = await res.json();
      if (data.success) setEditalProgress(data);
    } catch { /* silent */ } finally {
      setIsLoadingProgress(false);
    }
  };

  const fetchWeeklyStatus = async () => {
    try {
      const res = await fetch("/api/sala/simulados/weekly-status", { headers });
      const data = await res.json();
      setWeeklyStatus(data);
    } catch { /* silent */ }
  };

  const fetchNextMissionPreview = async (subjectId?: string) => {
    setIsFetchingPreview(true);
    try {
      const url = subjectId
        ? `/api/sala/content/peek?subjectId=${encodeURIComponent(subjectId)}`
        : "/api/sala/content/peek";
      const res = await fetch(url, { headers });
      const data = await res.json();
      if (data.title) setNextMissionPreview({ subjectName: data.subjectName, contentTitle: data.title });
    } catch { /* silent — preview é opcional */ } finally {
      setIsFetchingPreview(false);
    }
  };

  // ── Modo Prova — funções ──────────────────────────────

  const startWeeklyExam = async () => {
    setWeeklyExamLoading(true);
    try {
      const res = await fetch("/api/sala/simulados/weekly/start", { method: "POST", headers });
      const data = await res.json();
      if (!data.success) {
        toast({ variant: "destructive", title: data.error || "Erro ao iniciar simulado semanal" });
        return;
      }
      setWeeklyExamUserSimId(data.userSimuladoId);
      setWeeklyExamTotal(data.totalQuestions ?? 10);
      setWeeklyExamStartedAt(Date.now());
      setWeeklyExamTimeLeft((data.durationMinutes ?? 60) * 60);
      setWeeklyExamCorrect(0);
      setWeeklyExamWrongQs([]);
      setWeeklyExamResult(null);
      setWeeklyExamQNum(1);
      setWeeklyExamShowReview(false);
      setWeeklyExamShowExit(false);
      setWeeklyExamShowFinish(false);
      // Buscar primeira questão
      const qRes = await fetch(`/api/sala/simulados/question/${data.userSimuladoId}`, { headers });
      const qData = await qRes.json();
      if (qData.question) {
        setWeeklyExamQuestion(qData.question);
        setWeeklyExamAnswered(null);
        setWeeklyExamCorrectIdx(null);
      }
      setWeeklyExamMode(true);
    } catch {
      toast({ variant: "destructive", title: "Erro ao iniciar simulado semanal" });
    } finally {
      setWeeklyExamLoading(false);
    }
  };

  const submitWeeklyExamAnswer = async (optionIndex: number) => {
    if (!weeklyExamUserSimId || !weeklyExamQuestion || weeklyExamAnswered !== null) return;
    setWeeklyExamAnswered(optionIndex);
    try {
      const res = await fetch("/api/sala/simulados/answer", {
        method: "POST",
        headers,
        body: JSON.stringify({
          userSimuladoId: weeklyExamUserSimId,
          questionId: weeklyExamQuestion.id,
          simuladoQuestionId: weeklyExamQuestion.simuladoQuestionId,
          answer: optionIndex,
        }),
      });
      const data = await res.json();
      if (!data.success) return;

      setWeeklyExamCorrectIdx(data.correctAnswer ?? -1);
      if (!data.correct) {
        setWeeklyExamWrongQs(prev => [...prev, {
          question: weeklyExamQuestion,
          correctAnswer: data.correctAnswer ?? -1,
          userAnswer: optionIndex,
        }]);
      } else {
        setWeeklyExamCorrect(prev => prev + 1);
      }

      if (data.finished && data.result) {
        setWeeklyExamResult({
          score: data.result.score,
          correctAnswers: data.result.correctAnswers,
          wrongAnswers: data.result.wrongAnswers,
          timeSpent: Math.round((Date.now() - weeklyExamStartedAt) / 60000),
          passed: data.result.passed,
        });
        fetchWeeklyStatus();
        return;
      }

      // Avançar para próxima questão após mostrar gabarito
      const simId = weeklyExamUserSimId;
      setTimeout(async () => {
        setWeeklyExamQNum(n => n + 1);
        setWeeklyExamAnswered(null);
        setWeeklyExamCorrectIdx(null);
        const qRes = await fetch(`/api/sala/simulados/question/${simId}`, { headers });
        const qData = await qRes.json();
        if (qData.question) setWeeklyExamQuestion(qData.question);
      }, 1300);
    } catch { /* silent */ }
  };

  const finishWeeklyExam = () => {
    const elapsed = Math.round((Date.now() - weeklyExamStartedAt) / 60000);
    setWeeklyExamResult({
      score: weeklyExamTotal > 0 ? Math.round(weeklyExamCorrect / weeklyExamTotal * 100) : 0,
      correctAnswers: weeklyExamCorrect,
      wrongAnswers: weeklyExamWrongQs.length,
      timeSpent: elapsed,
      passed: weeklyExamTotal > 0 && weeklyExamCorrect / weeklyExamTotal >= 0.6,
    });
    setWeeklyExamShowFinish(false);
    fetchWeeklyStatus();
  };

  const exitWeeklyExam = () => {
    setWeeklyExamMode(false);
    setWeeklyExamUserSimId(null);
    setWeeklyExamQuestion(null);
    setWeeklyExamResult(null);
    setWeeklyExamShowExit(false);
    setWeeklyExamShowFinish(false);
    setWeeklyExamShowReview(false);
  };

  const startWeeklySimulado = async () => {
    setIsLoadingSimulado(true);
    try {
      const res = await fetch("/api/sala/simulados/weekly/start", { method: "POST", headers });
      const data = await res.json();
      if (!data.success) {
        addMessage("system", { text: data.error || "Erro ao iniciar simulado semanal." });
        return;
      }
      const newActive: ActiveSimulado = {
        userSimuladoId: data.userSimuladoId,
        title: "Simulado Semanal",
        totalQuestions: data.totalQuestions,
        durationMinutes: data.durationMinutes,
        startedAt: new Date(data.startedAt),
        currentQuestion: 1,
        correctAnswers: 0,
        wrongAnswers: 0,
      };
      setActiveSimulado(newActive);
      setSimuladoTimeRemaining(data.durationMinutes);
      addMessage("system", { text: "Simulado Semanal iniciado! Boa sorte!" });
      await fetchSimuladoQuestion(data.userSimuladoId);
      fetchWeeklyStatus();
    } catch {
      toast({ variant: "destructive", title: "Erro ao iniciar simulado semanal" });
    } finally {
      setIsLoadingSimulado(false);
    }
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
        if (data.isCorrect) {
          setCelebrateCorrect(true);
          setTimeout(() => setCelebrateCorrect(false), 1400);
        }
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
    setLastStudiedSubjectId(subjectId);
    localStorage.setItem("passarei_last_subject", subjectId);
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

  const handleNextSubject = () => {
    setSubjectCompleted(false);
    // Achar próxima matéria com conteúdo pendente, começando após a atual
    const currentIdx = studyPlan.findIndex(s => s.subjectId === selectedSubject);
    const rotated = [
      ...studyPlan.slice(currentIdx + 1),
      ...studyPlan.slice(0, currentIdx),
    ];
    // Prioriza Núcleo Duro incompleto; se não houver, qualquer matéria incompleta
    const nextND = rotated.find(s => isNucleoDuro(s.subjectName) && s.percentage < 100);
    const nextAny = rotated.find(s => s.percentage < 100);
    const next = nextND ?? nextAny;
    if (next) {
      handleSubjectClick(next.subjectId);
    } else {
      addMessage("system", { text: "Parabéns! Você concluiu todo o conteúdo disponível no plano de estudos. 🎉" });
    }
  };

  const handleEstudarAgora = () => {
    if (hasPersistedSession) {
      const savedMessages = sessionStorage.getItem("passarei_sala_messages");
      const savedSubject = sessionStorage.getItem("passarei_sala_subject");
      if (savedMessages && savedSubject) {
        try {
          setMessages(JSON.parse(savedMessages));
          setSelectedSubject(savedSubject);
          setShowStudyPalco(false);
          return;
        } catch {}
      }
    }
    // Fresh start: primeiro subject ND incompleto
    const ndSubject = studyPlan
      .filter(s => isNucleoDuro(s.subjectName) && s.percentage < 100)
      .sort((a, b) => a.percentage - b.percentage)[0];
    const subjectId = ndSubject?.subjectId ?? studyPlan[0]?.subjectId;
    if (subjectId) {
      setSelectedSubject(subjectId);
      fetchSequentialContent(subjectId);
    }
    setShowStudyPalco(false);
  };

  const selectConcurso = async (concursoId: string | null) => {
    // Atualização otimista: fecha modal e atualiza UI imediatamente
    const found = concursosList.find(c => c.id === concursoId);
    setTargetConcurso(found ? { id: found.id, nome: found.nome, banca: found.banca } : null);
    setShowConcursoSelector(false);
    setEditalProgress(null); // Limpa progresso antigo enquanto calcula o novo

    try {
      const res = await fetch("/api/sala/profile/concurso", {
        method: "PUT",
        headers,
        body: JSON.stringify({ concursoId }),
      });
      const data = await res.json();
      if (data.success) {
        updateProfile(data.profile);
        fetchEditalProgress();
        fetchWeeklyStatus();
      } else {
        // Reverter em caso de erro
        toast({ variant: "destructive", title: "Erro ao salvar concurso" });
        setTargetConcurso(null);
      }
    } catch {
      toast({ variant: "destructive", title: "Erro ao salvar concurso" });
      setTargetConcurso(null);
    }
  };

  // ============================================
  // SIDEBAR CONTENT (reutilizado em desktop aside + mobile Sheet)
  // ============================================

  const renderSidebarContent = () => (
    <>
      {/* Painel button (desktop only, shown when not on dashboard) */}
      {!showDashboard && (
        <div className="px-2 pt-2 pb-1 hidden md:block">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-1 text-xs text-muted-foreground"
            onClick={() => setShowDashboard(true)}>
            <ChevronLeft className="h-3 w-3" /> Painel
          </Button>
        </div>
      )}

          <ScrollArea className="h-[calc(100%-3.25rem)]">
            <div className="p-2 space-y-1">
              {studyMode === "simulado" ? (
                <>
                  {/* Simulado Semanal */}
                  <div className="px-2 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 px-1">Semanal</p>
                    {weeklyStatus?.available ? (
                      <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white text-xs"
                        onClick={() => { setShowMobileSidebar(false); startWeeklySimulado(); }}
                        disabled={isLoadingSimulado}>
                        {isLoadingSimulado ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                        Iniciar Simulado Semanal
                      </Button>
                    ) : weeklyStatus?.reason === "no_target" ? (
                      <p className="text-[11px] text-muted-foreground px-1">Defina seu concurso-alvo primeiro.</p>
                    ) : weeklyStatus?.nextAvailableAt ? (
                      <p className="text-[11px] text-muted-foreground px-1">
                        Próximo em {Math.ceil((new Date(weeklyStatus.nextAvailableAt).getTime() - Date.now()) / 86400000)}d
                      </p>
                    ) : (
                      <p className="text-[11px] text-muted-foreground px-1">Carregando...</p>
                    )}
                  </div>
                  <Separator className="my-1" />
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
                  {/* Plano de Aula: Jornada por fases (Núcleo Duro primeiro, demais bloqueadas) */}
                  <p className="text-[11px] text-muted-foreground px-3 pt-3 pb-1 leading-snug">
                    As matérias serão desbloqueadas conforme o seu progresso.
                  </p>
                  <Separator className="my-1" />
                  <div className="py-1">
                    {sortByNucleoDuro(studyPlan.map(s => ({ ...s, name: s.subjectName }))).map((s) => {
                      const isND = isNucleoDuro(s.name);
                      const pct = s.percentage ?? 0;
                      // Desbloqueada se: é Núcleo Duro, ou já foi estudada, ou é a atual
                      const isUnlocked = isND || pct > 0 || selectedSubject === s.subjectId;
                      const level = pct < 25 ? "Nível 1: Iniciante"
                        : pct < 50 ? "Nível 2: Intermediário"
                        : pct < 75 ? "Nível 3: Avançado"
                        : "Nível 4: Especialista";
                      return (
                        <button
                          key={s.subjectId}
                          onClick={() => {
                            if (!isUnlocked) {
                              toast({ title: "Matéria bloqueada", description: "Complete o Núcleo Duro primeiro para desbloquear esta matéria." });
                              return;
                            }
                            setSelectedSubject(s.subjectId);
                            setShowMobileSidebar(false);
                            fetchSequentialContent(s.subjectId);
                            setShowStudyPalco(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 transition-colors",
                            selectedSubject === s.subjectId ? "bg-accent" : "hover:bg-accent/50",
                            !isUnlocked && "opacity-40"
                          )}
                        >
                          <div className="flex items-start gap-2">
                            {isUnlocked
                              ? <BookOpen className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                              : <Lock className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{s.subjectName}</p>
                              <p className="text-[10px] text-muted-foreground">{isUnlocked ? level : "Bloqueada"}</p>
                            </div>
                          </div>
                          {isUnlocked && (
                            <Progress value={pct} className="h-0.5 mt-1.5 ml-5 mr-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
    </>
  );

  // ============================================
  // RENDER
  // ============================================

  const formatExamTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <SalaLayout>
      {/* Dialog de seleção de concurso-alvo */}
      <Dialog open={showConcursoSelector} onOpenChange={(open) => { setShowConcursoSelector(open); if (!open) setSelectedArea(null); }}>
        <DialogContent className="max-w-md max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {selectedArea ? (
                <button
                  onClick={() => setSelectedArea(null)}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" /> Voltar
                </button>
              ) : `Bem-vindo(a), ${student?.name?.split(" ")[0] || ""}!`}
            </DialogTitle>
            <DialogDescription>
              {selectedArea
                ? "Selecione o concurso específico."
                : "Escolha sua área de atuação para começar."}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1">
            {!selectedArea ? (
              /* Nível 1 — Grid de Áreas */
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-1 pb-2">
                {Object.entries(groupConcursos(concursosList))
                  .filter(([, items]) => items.length > 0)
                  .map(([grupo]) => (
                    <button
                      key={grupo}
                      onClick={() => setSelectedArea(grupo)}
                      className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all active:scale-95 text-center"
                    >
                      {getAreaIcon(grupo)}
                      <span className="text-xs font-medium leading-tight">{grupo}</span>
                    </button>
                  ))}
              </div>
            ) : (
              /* Nível 2 — Lista de Editais da Área */
              <div className="space-y-1 pr-1 pb-2 overflow-y-auto max-h-[400px]">
                {(groupConcursos(concursosList)[selectedArea] || []).map(c => (
                  <button
                    key={c.id}
                    onClick={() => { selectConcurso(c.id); setSelectedArea(null); }}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-lg border transition-colors",
                      targetConcurso?.id === c.id
                        ? "border-primary/50 bg-primary/5"
                        : "border-transparent hover:bg-primary/5 hover:border-primary/20"
                    )}
                  >
                    <div className="text-sm font-medium">{c.cargo_padrao}</div>
                    <div className="text-xs text-muted-foreground">{c.banca} · {c.sigla}</div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
          {!selectedArea && (
            <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => setShowConcursoSelector(false)}>
              Decidir depois
            </Button>
          )}
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════
          RAIO-X DE PERFORMANCE
          ══════════════════════════════════════════ */}
      <Dialog open={showRaioX} onOpenChange={setShowRaioX}>
        <DialogContent className="max-w-md max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-sky-500" /> Raio-X de Performance
            </DialogTitle>
            <DialogDescription>
              {targetConcurso ? `${targetConcurso.nome} · ${targetConcurso.banca}` : "Desempenho geral"}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1">
            <div className="space-y-5 pb-2 pr-1">

              {/* ── Métricas gerais ── */}
              {(() => {
                const totalBySubject = stats?.bySubject.reduce((a, s) => a + s.total, 0) ?? 0;
                const correctBySubject = stats?.bySubject.reduce((a, s) => a + s.correct, 0) ?? 0;
                const globalRate = totalBySubject > 0 ? Math.round(correctBySubject / totalBySubject * 100) : 0;
                return (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center justify-center rounded-xl border bg-muted/30 py-3 px-2 text-center">
                      <span className="text-xl font-bold tabular-nums">{stats?.totalQuestionsAnswered ?? 0}</span>
                      <span className="text-[10px] text-muted-foreground leading-tight mt-0.5">Total de Questões</span>
                      <span className="text-[9px] text-muted-foreground/60">Web + Bot</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl border bg-muted/30 py-3 px-2 text-center">
                      <span className={cn("text-xl font-bold tabular-nums", globalRate >= 70 ? "text-green-600" : globalRate >= 50 ? "text-yellow-600" : "text-red-500")}>
                        {globalRate}%
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-tight mt-0.5">Taxa de Acerto</span>
                      <span className="text-[9px] text-muted-foreground/60">{correctBySubject}/{totalBySubject}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl border bg-muted/30 py-3 px-2 text-center">
                      {gamification ? (
                        <>
                          <span className="text-xl font-bold tabular-nums text-primary">#{gamification.rank}</span>
                          <span className="text-[10px] text-muted-foreground leading-tight mt-0.5">Ranking</span>
                          <span className="text-[9px] text-muted-foreground/60">{gamification.xp} XP</span>
                        </>
                      ) : (
                        <>
                          <span className="text-xl font-bold text-muted-foreground">—</span>
                          <span className="text-[10px] text-muted-foreground leading-tight mt-0.5">Ranking</span>
                          <span className="text-[9px] text-muted-foreground/60">sem dados</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* ── Desempenho por Matéria ── */}
              {stats && stats.bySubject.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Desempenho por Matéria
                  </p>
                  <div className="space-y-2.5">
                    {[...stats.bySubject]
                      .sort((a, b) => b.percentage - a.percentage)
                      .map((s) => (
                        <div key={s.subject}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium truncate flex-1 pr-2">{s.subject}</span>
                            <span className={cn(
                              "text-xs font-semibold tabular-nums shrink-0",
                              s.percentage >= 70 ? "text-green-600" : s.percentage >= 50 ? "text-yellow-600" : "text-red-500"
                            )}>
                              {s.percentage}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={s.percentage}
                              className={cn("h-1.5 flex-1",
                                s.percentage >= 70 ? "[&>div]:bg-green-500" :
                                s.percentage >= 50 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-red-500"
                              )}
                            />
                            <span className="text-[10px] text-muted-foreground tabular-nums shrink-0 w-14 text-right">
                              {s.correct}/{s.total} certas
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma questão respondida ainda. Comece a estudar para ver seu desempenho!
                </p>
              )}

            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════
          MODO PROVA — Full-screen exam overlay
          ═══════════════════════════════════════════ */}
      {weeklyExamMode && (
        <div className="fixed inset-0 z-[60] bg-background flex flex-col">

          {/* ── EXIT CONFIRMATION ── */}
          {weeklyExamShowExit && (
            <div className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-background rounded-xl shadow-2xl p-6 max-w-sm w-full space-y-4">
                <h3 className="text-base font-semibold">Sair da prova?</h3>
                <p className="text-sm text-muted-foreground">Seu progresso será perdido e o simulado semanal ficará indisponível por 7 dias.</p>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setWeeklyExamShowExit(false)}>Continuar prova</Button>
                  <Button variant="destructive" size="sm" onClick={exitWeeklyExam}>Sair mesmo assim</Button>
                </div>
              </div>
            </div>
          )}

          {/* ── FINISH CONFIRMATION ── */}
          {weeklyExamShowFinish && (
            <div className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-background rounded-xl shadow-2xl p-6 max-w-sm w-full space-y-4">
                <h3 className="text-base font-semibold">Finalizar prova?</h3>
                <p className="text-sm text-muted-foreground">
                  Você respondeu {weeklyExamQNum - 1} de {weeklyExamTotal} questões. Deseja encerrar e ver o resultado?
                </p>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setWeeklyExamShowFinish(false)}>Continuar</Button>
                  <Button size="sm" onClick={finishWeeklyExam}>Finalizar</Button>
                </div>
              </div>
            </div>
          )}

          {weeklyExamResult ? (
            /* ── RESULT SCREEN ── */
            <div className="flex flex-col h-full">
              {/* Result top bar */}
              <div className="flex items-center justify-between px-4 h-12 border-b shrink-0">
                <span className="text-sm font-semibold">Resultado</span>
                <Button variant="ghost" size="sm" className="text-xs" onClick={exitWeeklyExam}>Fechar</Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="max-w-md mx-auto px-4 py-8 space-y-6">
                  {/* Score circle */}
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 ${weeklyExamResult.passed ? "border-green-500 text-green-600" : "border-red-400 text-red-500"}`}>
                      <span className="text-3xl font-bold">{weeklyExamResult.score}%</span>
                      <span className="text-[10px] uppercase tracking-widest font-semibold">{weeklyExamResult.passed ? "Aprovado" : "Reprovado"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Simulado Semanal — {new Date().toLocaleDateString("pt-BR")}</p>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-green-500/10 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-green-600">{weeklyExamResult.correctAnswers}</p>
                      <p className="text-[11px] text-muted-foreground">Acertos</p>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-red-500">{weeklyExamResult.wrongAnswers}</p>
                      <p className="text-[11px] text-muted-foreground">Erros</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <p className="text-xl font-bold">{weeklyExamResult.timeSpent}m</p>
                      <p className="text-[11px] text-muted-foreground">Tempo</p>
                    </div>
                  </div>

                  {weeklyExamResult.timedOut && (
                    <p className="text-center text-sm text-orange-500 font-medium">⏰ Tempo esgotado</p>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    {weeklyExamWrongQs.length > 0 && (
                      <Button variant="outline" className="w-full" onClick={() => setWeeklyExamShowReview(true)}>
                        Revisar {weeklyExamWrongQs.length} erro{weeklyExamWrongQs.length !== 1 ? "s" : ""}
                      </Button>
                    )}
                    <Button className="w-full" onClick={exitWeeklyExam}>Voltar ao Painel</Button>
                  </div>

                  {/* Review errors */}
                  {weeklyExamShowReview && weeklyExamWrongQs.length > 0 && (
                    <div className="space-y-4 pt-2">
                      <h3 className="text-sm font-semibold border-t pt-4">Revisão de Erros</h3>
                      {weeklyExamWrongQs.map((item, idx) => (
                        <div key={idx} className="rounded-lg border p-4 space-y-3">
                          <p className="text-sm font-medium">{idx + 1}. {item.question?.statement}</p>
                          <div className="space-y-1.5">
                            {(item.question?.options as string[] || []).map((opt: string, oIdx: number) => (
                              <div key={oIdx} className={`flex items-start gap-2 text-xs rounded-md px-3 py-2 ${
                                oIdx === item.correctAnswer ? "bg-green-500/15 text-green-700 font-medium" :
                                oIdx === item.userAnswer ? "bg-red-500/10 text-red-500 line-through" : "text-muted-foreground"
                              }`}>
                                <span className="font-semibold shrink-0">{["A","B","C","D"][oIdx]}.</span>
                                <span>{opt}</span>
                              </div>
                            ))}
                          </div>
                          {item.question?.explanation && (
                            <p className="text-xs text-muted-foreground border-t pt-2">{item.question.explanation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          ) : (
            /* ── EXAM IN PROGRESS ── */
            <div className="flex flex-col h-full">
              {/* Exam top bar */}
              <div className="flex items-center gap-3 px-4 h-12 border-b bg-background shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => setWeeklyExamShowExit(true)}>
                  <X className="h-4 w-4" />
                </Button>
                {/* Progress bar */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] text-muted-foreground">Questão {weeklyExamQNum} de {weeklyExamTotal}</span>
                  </div>
                  <Progress value={(weeklyExamQNum - 1) / weeklyExamTotal * 100} className="h-1.5" />
                </div>
                {/* Timer */}
                <div className={`flex items-center gap-1 font-mono text-sm font-semibold shrink-0 ${weeklyExamTimeLeft < 300 ? "text-red-500" : "text-foreground"}`}>
                  <Clock className="h-3.5 w-3.5" />
                  {formatExamTime(weeklyExamTimeLeft)}
                </div>
              </div>

              {/* Question area */}
              <ScrollArea className="flex-1">
                <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
                  {weeklyExamQuestion ? (
                    <>
                      <p className="text-sm font-medium leading-relaxed">{weeklyExamQuestion.statement}</p>
                      <div className="space-y-2.5">
                        {(weeklyExamQuestion.options as string[] || []).map((opt: string, idx: number) => {
                          const isAnswered = weeklyExamAnswered !== null;
                          const isSelected = weeklyExamAnswered === idx;
                          const isCorrect = weeklyExamCorrectIdx === idx;
                          return (
                            <button
                              key={idx}
                              disabled={isAnswered}
                              onClick={() => submitWeeklyExamAnswer(idx)}
                              className={`w-full text-left flex items-start gap-3 rounded-lg border px-4 py-3 text-sm transition-all ${
                                !isAnswered ? "hover:border-primary/50 hover:bg-primary/5 active:scale-[0.99] cursor-pointer" :
                                isCorrect ? "border-green-500 bg-green-500/10 text-green-700 cursor-default" :
                                isSelected ? "border-red-400 bg-red-500/10 text-red-600 cursor-default" :
                                "opacity-50 cursor-default"
                              }`}
                            >
                              <span className="font-semibold shrink-0 mt-0.5">{["A","B","C","D"][idx]}.</span>
                              <span className="leading-snug">{opt}</span>
                              {isAnswered && isCorrect && <span className="ml-auto shrink-0 text-green-600">✓</span>}
                              {isAnswered && isSelected && !isCorrect && <span className="ml-auto shrink-0 text-red-500">✗</span>}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center py-20">
                      <div className="text-center space-y-2">
                        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-sm text-muted-foreground">Carregando questão...</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Bottom action bar */}
              <div className="border-t px-4 py-3 bg-background shrink-0 flex items-center justify-between gap-3">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground"
                  onClick={() => setWeeklyExamShowExit(true)}>
                  Sair
                </Button>
                <Button variant="outline" size="sm" className="text-xs"
                  onClick={() => setWeeklyExamShowFinish(true)}>
                  Finalizar Prova
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {showDashboard ? (
        /* ═══════════════════════════════════════════
           DASHBOARD VIEW
           ═══════════════════════════════════════════ */
        <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">

          {/* TOP BAR */}
          <div className="flex items-center gap-2 px-4 h-12 border-b bg-background sticky top-0 z-30 shrink-0">
            {/* Hamburger → Navigation Sheet */}
            <Sheet open={showNavSheet} onOpenChange={setShowNavSheet}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader className="pb-4 border-b">
                  <SheetTitle className="text-sm">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-1">
                  <div className="flex items-center gap-3 px-2 py-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary text-sm">
                      {student?.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{student?.name}</p>
                      <Badge variant="secondary" className="text-[10px]">{student?.plan || "FREE"}</Badge>
                    </div>
                  </div>
                  <Separator />
                  <Button variant="ghost" className="w-full justify-start gap-2 mt-2" onClick={() => { setShowConcursoSelector(true); setShowNavSheet(false); }}>
                    <Target className="h-4 w-4" /> Mudar Concurso-Alvo
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                    <a href="https://t.me/passarei_bot" target="_blank" rel="noreferrer">
                      <Send className="h-4 w-4" /> Estudar pelo Bot
                    </a>
                  </Button>
                  <Separator className="my-2" />
                  <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                    onClick={() => { setShowNavSheet(false); logout(); }}>
                    <LogOut className="h-4 w-4" /> Sair
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Saudação */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate leading-tight">
                Bem-vindo(a), {student?.name?.split(" ")[0] || "Aluno"}!
              </p>
            </div>

            {/* Streak + Level */}
            {gamification && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="flex items-center gap-0.5 text-xs font-medium text-orange-500">
                  <Flame className="h-3.5 w-3.5" />{gamification.streak}
                </span>
                <Badge variant="secondary" className="text-[10px] h-5 px-1.5">Nv {gamification.level}</Badge>
              </div>
            )}
          </div>

          {/* MAIN SCROLL */}
          <ScrollArea className="flex-1">
            <div className="px-4 py-5 space-y-6 max-w-xl mx-auto">

              {/* HERO: Progresso do Edital */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <Card
                  className="border-primary/20 bg-primary/5 cursor-pointer hover:border-primary/40 transition-colors active:scale-[0.99]"
                  onClick={() => setShowConcursoSelector(true)}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-semibold truncate">
                          {targetConcurso ? targetConcurso.nome : "Concurso-alvo"}
                        </h2>
                        {targetConcurso && (
                          <p className="text-[10px] text-primary/60 leading-tight">
                            {targetConcurso.banca} · <span className="underline underline-offset-2">trocar</span>
                          </p>
                        )}
                      </div>
                      {isLoadingProgress ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                      ) : (
                        <span className="text-lg font-bold text-primary shrink-0 ml-2">{editalProgress?.percentage ?? 0}%</span>
                      )}
                    </div>
                    <Progress
                      value={isLoadingProgress ? undefined : (editalProgress?.percentage ?? 0)}
                      className={cn("h-2 mb-1", isLoadingProgress && "animate-pulse")}
                    />
                    <p className="text-xs text-muted-foreground">
                      {isLoadingProgress
                        ? "Calculando progresso..."
                        : !targetConcurso
                        ? "Toque aqui para definir seu concurso-alvo"
                        : editalProgress && editalProgress.totalCount > 0
                        ? `${editalProgress.studiedCount} de ${editalProgress.totalCount} tópicos estudados`
                        : "Nenhum tópico deste edital estudado ainda"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* 4 ACTION CARDS */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">O que vamos fazer hoje?</h3>
                <div className="grid grid-cols-2 gap-3">

                  {/* Card 1 — Continuar Estudo (sempre ativo) */}
                  {(() => {
                    const resumeSubject = lastStudiedSubjectId
                      ? subjects.find(s => s.id === lastStudiedSubjectId) ?? null
                      : null;
                    return (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all active:scale-95 h-full"
                          onClick={() => {
                            setShowDashboard(false);
                            setStudyMode("plano");
                            setShowStudyPalco(true);
                            setNextMissionPreview(null);
                          }}>
                          <CardContent className="p-4 flex flex-col gap-2">
                            <BookOpen className="h-7 w-7 text-primary" />
                            <p className="text-sm font-semibold leading-tight">Continuar Estudo</p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {resumeSubject ? `Retomar: ${resumeSubject.name}` : "Seguir pelo edital"}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })()}

                  {/* Card 2 — Reforço SM2 */}
                  {(() => {
                    const total = stats?.totalQuestionsAnswered ?? 0;
                    const locked = total < 15;
                    return (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="h-full">
                        {locked ? (
                          /* ── BLOQUEADO ── */
                          <Card
                            className="h-full cursor-pointer border-2 bg-emerald-900/10 border-emerald-900/20 active:scale-[0.98] transition-transform"
                            onClick={() => toast({
                              title: "Base de dados insuficiente",
                              description: `Responda mais ${15 - total} questões para desbloquear seu Mapa de Calor e Reforço Inteligente.`,
                            })}
                          >
                            <CardContent className="p-4 flex flex-col gap-2">
                              <RotateCcw className="h-7 w-7 text-emerald-800/25" />
                              <div>
                                <Badge variant="outline" className="text-[8px] font-bold tracking-widest uppercase text-emerald-800/50 border-emerald-800/25 px-1.5 py-0 mb-1.5">
                                  MAPA EM CONSTRUÇÃO
                                </Badge>
                                <p className="text-sm font-semibold leading-tight text-foreground/50">Reforço SM2</p>
                              </div>
                              <div className="space-y-1.5 mt-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-medium tabular-nums text-emerald-900/40">{total}/15 questões</span>
                                  <span className="text-[10px] text-emerald-900/30">{Math.round(total / 15 * 100)}%</span>
                                </div>
                                <Progress value={Math.round(total / 15 * 100)} className="h-1 bg-emerald-900/10 [&>div]:bg-emerald-700/40" />
                                <p className="text-[9px] text-muted-foreground/60 leading-snug">Atinja sua cota de estudos para desbloquear</p>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          /* ── LIBERADO — brilho verde ── */
                          <motion.div
                            className="rounded-lg h-full"
                            animate={{ boxShadow: ["0 0 0 0 rgba(34,197,94,0)", "0 0 0 7px rgba(34,197,94,0.22)", "0 0 0 0 rgba(34,197,94,0)"] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <Card className="h-full cursor-pointer border-2 border-green-300/60 hover:border-green-400 hover:shadow-md transition-all active:scale-95"
                              onClick={() => { setShowDashboard(false); setStudyMode("livre"); startSm2Review(); }}>
                              <CardContent className="p-4 flex flex-col gap-2">
                                <RotateCcw className="h-7 w-7 text-green-600" />
                                <div>
                                  <Badge className="text-[8px] font-bold tracking-widest uppercase bg-green-500 hover:bg-green-500 px-1.5 py-0 mb-1.5">
                                    REFORÇO CRÍTICO
                                  </Badge>
                                  <p className="text-sm font-semibold leading-tight">Reforço SM2</p>
                                </div>
                                <p className="text-[11px] text-muted-foreground">{sm2DueCount} itens para revisar</p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })()}

                  {/* Card 3 — Simulados */}
                  {(() => {
                    const total = stats?.totalQuestionsAnswered ?? 0;
                    const questoesInsuficientes = total < 15;
                    const weeklyAvailable = !questoesInsuficientes && weeklyStatus?.available === true;
                    const weeklyCooldown = !questoesInsuficientes && weeklyStatus?.reason === "cooldown";
                    return (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="h-full">
                        {questoesInsuficientes ? (
                          /* ── BLOQUEADO — questões insuficientes (igual SM2) ── */
                          <Card className="h-full border-2 bg-emerald-900/10 border-emerald-900/20 active:scale-[0.98] transition-transform cursor-pointer"
                            onClick={() => toast({ title: "Simulado indisponível", description: `Responda mais ${15 - total} questões para desbloquear os Simulados Semanais.` })}>
                            <CardContent className="p-4 flex flex-col gap-2">
                              <Trophy className="h-7 w-7 text-emerald-800/25" />
                              <div>
                                <Badge variant="outline" className="text-[8px] font-bold tracking-widest uppercase text-emerald-800/50 border-emerald-800/25 px-1.5 py-0 mb-1.5">
                                  MAPA EM CONSTRUÇÃO
                                </Badge>
                                <p className="text-sm font-semibold leading-tight text-foreground/50">Simulados</p>
                              </div>
                              <div className="space-y-1.5 mt-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-medium tabular-nums text-emerald-900/40">{total}/15 questões</span>
                                  <span className="text-[10px] text-emerald-900/30">{Math.round(total / 15 * 100)}%</span>
                                </div>
                                <Progress value={Math.round(total / 15 * 100)} className="h-1 bg-emerald-900/10 [&>div]:bg-emerald-700/40" />
                                <p className="text-[9px] text-muted-foreground/60 leading-snug">Atinja sua cota de estudos para desbloquear</p>
                              </div>
                            </CardContent>
                          </Card>
                        ) : weeklyAvailable ? (
                          /* ── PROVA LIBERADA — brilho verde ── */
                          <motion.div
                            className="rounded-lg h-full"
                            animate={{ boxShadow: ["0 0 0 0 rgba(34,197,94,0)", "0 0 0 7px rgba(34,197,94,0.22)", "0 0 0 0 rgba(34,197,94,0)"] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                          >
                            <Card className="h-full cursor-pointer border-2 border-green-300/60 hover:border-green-400 hover:shadow-md transition-all active:scale-95"
                              onClick={() => { if (!weeklyExamLoading) startWeeklyExam(); }}>
                              <CardContent className="p-4 flex flex-col gap-2">
                                <Trophy className="h-7 w-7 text-green-600" />
                                <div>
                                  <Badge className="text-[8px] font-bold tracking-widest uppercase bg-green-500 hover:bg-green-500 px-1.5 py-0 mb-1.5">
                                    PROVA LIBERADA
                                  </Badge>
                                  <p className="text-sm font-semibold leading-tight">Simulados</p>
                                </div>
                                <p className="text-[11px] text-muted-foreground">Simulado semanal pronto</p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ) : weeklyCooldown ? (
                          /* ── COOLDOWN — consolidando base ── */
                          <Card className="h-full cursor-pointer border-2 bg-emerald-900/10 border-emerald-900/20 hover:shadow-sm transition-all active:scale-95"
                            onClick={() => { setShowDashboard(false); setStudyMode("simulado"); fetchSimulados(); }}>
                            <CardContent className="p-4 flex flex-col gap-2">
                              <Trophy className="h-7 w-7 text-emerald-800/25" />
                              <div>
                                <Badge variant="outline" className="text-[8px] font-bold tracking-widest uppercase text-emerald-800/50 border-emerald-800/25 px-1.5 py-0 mb-1.5">
                                  CONSOLIDANDO BASE
                                </Badge>
                                <p className="text-sm font-semibold leading-tight text-foreground/50">Simulados</p>
                              </div>
                              <div className="space-y-1 mt-1">
                                <p className="text-[10px] font-medium tabular-nums text-emerald-900/40">
                                  Próximo em {Math.ceil((new Date(weeklyStatus!.nextAvailableAt!).getTime() - Date.now()) / 86400000)}d
                                </p>
                                <p className="text-[9px] text-muted-foreground/60 leading-snug">Atinja sua cota de estudos para desbloquear</p>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          /* ── ESTADO NEUTRO (sem target ou carregando) ── */
                          <Card className="h-full cursor-pointer hover:shadow-md hover:border-violet-300 transition-all active:scale-95"
                            onClick={() => { setShowDashboard(false); setStudyMode("simulado"); fetchSimulados(); }}>
                            <CardContent className="p-4 flex flex-col gap-2">
                              <Trophy className="h-7 w-7 text-violet-500" />
                              <p className="text-sm font-semibold leading-tight">Simulados</p>
                              <p className="text-[11px] text-muted-foreground">Mensal + Semanal</p>
                            </CardContent>
                          </Card>
                        )}
                      </motion.div>
                    );
                  })()}

                  {/* Card 4 — Desempenho → abre Raio-X */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <Card className="cursor-pointer hover:shadow-md hover:border-sky-300 transition-all active:scale-95 h-full"
                      onClick={() => setShowRaioX(true)}>
                      <CardContent className="p-4 flex flex-col gap-2">
                        <BarChart3 className="h-7 w-7 text-sky-500" />
                        <p className="text-sm font-semibold leading-tight">Desempenho</p>
                        <p className="text-[11px] text-muted-foreground">
                          {stats
                            ? `${stats.totalQuestionsAnswered} questões respondidas`
                            : "Carregando..."}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>

              {/* Card 5 — Redação (hero full-width) */}
              {(() => {
                const essayRemaining = essayStatus?.freeRemaining ?? 0;
                const essayCredits = essayStatus?.credits ?? 0;
                const essayAvailable = essayRemaining > 0 || essayCredits > 0;
                const essayTotal = 2;
                // Próximo reset: dia 01 do mês seguinte
                const nextReset = new Date();
                nextReset.setMonth(nextReset.getMonth() + 1);
                nextReset.setDate(1);
                const nextResetLabel = nextReset.toLocaleDateString("pt-BR", { month: "long" });
                return (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    {essayAvailable ? (
                      <Card className="w-full cursor-pointer border-2 border-violet-300/60 hover:border-violet-400 hover:shadow-md transition-all active:scale-[0.99]"
                        onClick={() => setLocation("/sala/redacao")}>
                        <CardContent className="p-4 flex items-center gap-4">
                          <PenLine className="h-7 w-7 text-violet-600 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <Badge className="text-[8px] font-bold tracking-widest uppercase bg-violet-500 hover:bg-violet-500 px-1.5 py-0">
                                DISPONÍVEL
                              </Badge>
                              <p className="text-sm font-semibold">Redação</p>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              Correções disponíveis: {essayRemaining}/{essayTotal} este mês
                            </p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            {Array.from({ length: essayTotal }).map((_, i) => (
                              <div key={i} className={`h-2 w-6 rounded-full ${i < essayRemaining ? "bg-violet-500" : "bg-muted"}`} />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="w-full border-2 bg-emerald-900/10 border-emerald-900/20 cursor-default">
                        <CardContent className="p-4 flex items-center gap-4">
                          <PenLine className="h-7 w-7 text-emerald-800/25 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <Badge variant="outline" className="text-[8px] font-bold tracking-widest uppercase text-emerald-800/50 border-emerald-800/25 px-1.5 py-0">
                                LIMITE ATINGIDO
                              </Badge>
                              <p className="text-sm font-semibold text-foreground/50">Redação</p>
                            </div>
                            <p className="text-[11px] text-muted-foreground/60">
                              Disponível em 01 de {nextResetLabel}
                            </p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            {Array.from({ length: essayTotal }).map((_, i) => (
                              <div key={i} className="h-2 w-6 rounded-full bg-muted" />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                );
              })()}

              {/* MEU EDITAL */}
              {targetConcurso && editalProgress?.subjects && editalProgress.subjects.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Meu Edital</h3>
                  <Accordion type="multiple" className="space-y-1">
                    {editalProgress.subjects.map((s) => (
                      <AccordionItem key={s.name} value={s.name} className="border rounded-lg px-3">
                        <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
                          <span className="flex-1 text-left truncate pr-2">{s.name}</span>
                          <span className="text-xs text-muted-foreground mr-2 shrink-0">{s.percentage}%</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-3 pt-0">
                          <Progress value={s.percentage} className="h-1 mb-2" />
                          <p className="text-xs text-muted-foreground mb-3">{s.studiedCount}/{s.totalCount} tópicos estudados</p>
                          <Button size="sm" variant="outline" className="w-full text-xs h-8"
                            onClick={() => {
                              setShowDashboard(false);
                              setStudyMode("plano");
                              const match = subjects.find(sub =>
                                sub.name.toLowerCase().includes(s.name.toLowerCase().split(" ")[0]) ||
                                s.name.toLowerCase().includes(sub.name.toLowerCase().split(" ")[0])
                              );
                              if (match) {
                                setSelectedSubject(match.id);
                                fetchSequentialContent(match.id);
                              } else {
                                fetchNextContent(null);
                              }
                            }}>
                            Estudar esta matéria
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              )}

            </div>
          </ScrollArea>
        </div>
      ) : (
        /* ═══════════════════════════════════════════
           STUDY MODE VIEW (existing chat interface)
           ═══════════════════════════════════════════ */
        <>
          {/* Mobile top bar — study mode */}
          <div className="md:hidden flex items-center gap-2 px-3 py-2 border-b bg-background sticky top-0 z-50 h-10">
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setShowDashboard(true)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Sheet open={showMobileSidebar} onOpenChange={setShowMobileSidebar}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="px-4 py-3 border-b">
                  <SheetTitle className="text-sm">Matérias</SheetTitle>
                </SheetHeader>
                {renderSidebarContent()}
              </SheetContent>
            </Sheet>

            <span className="flex-1 text-xs font-medium truncate">
              {studyMode === "simulado" ? "Simulados" : studyMode === "livre" ? "Estudo Livre" : "Continuar Estudo"}
            </span>

            {gamification && (
              <div className="flex items-center gap-2 shrink-0">
                {/* Streak */}
                <span className="flex items-center gap-0.5 text-xs font-medium text-orange-500">
                  <Flame className="h-3 w-3" />{gamification.streak}
                </span>
                {/* Level badge */}
                <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-semibold">
                  Nv {gamification.level}
                </Badge>
                {/* XP mini-bar */}
                {gamification.xpForNextLevel > 0 && (
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-yellow-500 shrink-0" />
                    <div className="w-10 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-yellow-400"
                        style={{ width: `${Math.min(100, Math.round(gamification.xpInCurrentLevel / gamification.xpForNextLevel * 100))}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

      {/* Main layout — ajustado para descontar a top bar mobile */}
      <div className="flex h-[calc(100vh-3.5rem-2.5rem)] md:h-[calc(100vh-3.5rem)]">
        {/* LEFT: Subject Sidebar */}
        <aside className="hidden md:flex md:flex-col w-64 border-r bg-background shrink-0">
          {renderSidebarContent()}
        </aside>

        {/* CENTER: Chat Panel */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* ── PALCO CENTRAL ── aparece antes do chat quando studyMode=plano */}
          {showStudyPalco && studyMode === "plano" ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="space-y-5 w-full max-w-xs"
              >
                <div className="text-4xl select-none">📚</div>
                <Button
                  size="lg"
                  className="w-full text-base font-bold py-7 rounded-2xl shadow-md bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleEstudarAgora}
                >
                  {hasPersistedSession ? "CONTINUAR DE ONDE PAROU" : "ESTUDAR AGORA"}
                </Button>
                {!hasPersistedSession && (
                  <p className="text-xs text-muted-foreground leading-snug min-h-[2rem]">
                    {isFetchingPreview ? (
                      <span className="animate-pulse">Buscando próxima missão...</span>
                    ) : nextMissionPreview ? (
                      <>Sua próxima missão:{" "}
                        <span className="font-medium text-foreground">
                          {nextMissionPreview.subjectName} — {nextMissionPreview.contentTitle}
                        </span>
                      </>
                    ) : null}
                  </p>
                )}
                {hasPersistedSession && (
                  <button
                    className="text-[11px] text-muted-foreground underline underline-offset-2"
                    onClick={() => {
                      sessionStorage.removeItem("passarei_sala_messages");
                      sessionStorage.removeItem("passarei_sala_subject");
                      setHasPersistedSession(false);
                      setNextMissionPreview(null);
                    }}
                  >
                    Começar uma nova sessão
                  </button>
                )}
              </motion.div>
            </div>
          ) : (
          <>

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

          {/* Chat fixed header */}
          <div className="px-4 py-2 border-b bg-muted/40 shrink-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Jornada de Estudo Ativa
            </p>
          </div>

          <ScrollArea className="flex-1 overflow-x-hidden">
            <div className="px-4 py-4 max-w-2xl mx-auto space-y-4 w-full min-w-0">
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <MessageBubble message={msg} onAnswer={submitAnswer} answeredIndex={answeredIndex} correctIndex={questionCorrectIndex} />
                  </motion.div>
                ))}
              </AnimatePresence>

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

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center px-1 py-1">
                  <div className="bg-muted rounded-2xl px-3 py-2.5 flex gap-1.5">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          {/* Quick reply buttons — pré-questão: aparece após conteúdo/enrichment */}
          {!isTyping && !activeSimulado &&
            messages.length > 0 &&
            (messages[messages.length - 1]?.type === "content" || messages[messages.length - 1]?.type === "enrichment") &&
            !currentQuestion && answeredIndex === null && (
            <div className="px-3 py-2 border-t flex flex-wrap gap-1.5 bg-background">
              <Button variant="outline" size="sm"
                className="text-xs h-7 rounded-full border-dashed"
                onClick={() => handleNextContent()}>
                Entendi, avançar →
              </Button>
              <Button variant="outline" size="sm"
                className="text-xs h-7 rounded-full border-dashed"
                onClick={fetchQuestion}>
                Quero responder uma questão
              </Button>
            </div>
          )}

          {/* Botão pós-questão — aparece imediatamente após o aluno responder */}
          {!isTyping && !activeSimulado && answeredIndex !== null && (
            <div className="px-3 py-2 border-t flex flex-wrap gap-1.5 bg-background">
              <Button variant="outline" size="sm"
                className="text-xs h-7 rounded-full border-dashed"
                onClick={() => {
                  setCurrentQuestion(null);
                  setAnsweredIndex(null);
                  setQuestionCorrectIndex(null);
                  handleNextContent();
                }}>
                Próximo tópico →
              </Button>
            </div>
          )}

          {/* Botão fim de matéria — aparece quando todos os conteúdos foram estudados */}
          {subjectCompleted && !activeSimulado && !isTyping && (
            <div className="px-3 py-2 border-t flex gap-1.5 bg-background">
              <Button
                size="sm"
                className="text-xs h-7 rounded-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handleNextSubject}>
                Ir para a próxima matéria →
              </Button>
            </div>
          )}

          {/* Action bar — oculta no modo Redação */}
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
                  {remaining != null && (
                    <span className="text-xs text-muted-foreground self-center ml-auto">
                      {remaining} questões restantes hoje
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          </>
          )}
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
        </>
      )}

      {/* Celebração de acerto */}
      <AnimatePresence>
        {celebrateCorrect && (
          <motion.div
            key="celebrate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [1, 1.25, 1], opacity: [0, 1, 0.8] }}
              transition={{ duration: 0.5 }}
              className="rounded-full bg-green-500/15 p-10"
            >
              <CheckCircle2 className="h-14 w-14 text-green-500" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
      <Card className="border-l-4 border-l-primary w-full min-w-0">
        <CardHeader className="pb-2 px-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{data.subjectName}</Badge>
          </div>
          <CardTitle className="text-lg break-words">{data.title}</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="prose prose-sm max-w-none text-foreground break-words [overflow-wrap:break-word] [hyphens:auto]">
            {data.body?.split("\n").map((line: string, i: number) => (
              <p key={i} className={line.trim() === "" ? "h-2" : "break-words"}>
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
      <Card className="border-l-4 border-l-amber-500 bg-amber-50/50 w-full min-w-0">
        <CardContent className="pt-4 px-3 sm:px-6 space-y-3">
          {data.keyPoints && (
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Pontos-chave
              </h4>
              <p className="text-sm text-muted-foreground break-words [overflow-wrap:break-word]">{data.keyPoints}</p>
            </div>
          )}
          {data.example && (
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-1">
                <BookOpen className="h-3.5 w-3.5 text-amber-600" /> Exemplo
              </h4>
              <p className="text-sm text-muted-foreground break-words [overflow-wrap:break-word]">{data.example}</p>
            </div>
          )}
          {data.tip && (
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-1">
                <Lightbulb className="h-3.5 w-3.5 text-amber-600" /> Dica
              </h4>
              <p className="text-sm text-muted-foreground break-words [overflow-wrap:break-word]">{data.tip}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (type === "question") {
    const isAnswered = answeredIndex !== null;
    return (
      <Card className="border-l-4 border-l-blue-500 shadow-sm w-full min-w-0">
        <CardHeader className="pb-2 px-3 sm:px-6">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-600" /> Questão
            {data.banca && (
              <Badge variant="secondary" className="text-[10px] font-normal ml-auto">{data.banca}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <p className="text-base leading-relaxed mb-4 break-words [overflow-wrap:break-word] [hyphens:auto]">{data.text}</p>
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
                  className="w-full justify-start text-left h-auto py-2 px-3 whitespace-normal"
                  onClick={() => !isAnswered && onAnswer(i)}
                  disabled={isAnswered}
                >
                  <span className="font-medium mr-2 shrink-0">{String.fromCharCode(65 + i)})</span>
                  <span className="text-sm break-words min-w-0 flex-1 text-left">{option}</span>
                  {isAnswered && correctIndex === i && <CheckCircle2 className="ml-2 h-4 w-4 text-green-600 shrink-0" />}
                  {isAnswered && answeredIndex === i && correctIndex !== i && <XCircle className="ml-2 h-4 w-4 text-red-600 shrink-0" />}
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
      <Card className={`border-l-4 w-full min-w-0 ${data.isCorrect ? "border-l-green-500 bg-green-50/50" : "border-l-red-500 bg-red-50/50"}`}>
        <CardContent className="pt-4 px-3 sm:px-6">
          <div className="flex items-center gap-2 mb-2">
            {data.isCorrect ? (
              <><CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" /> <span className="font-semibold text-green-700">Correto!</span></>
            ) : (
              <><XCircle className="h-5 w-5 text-red-600 shrink-0" /> <span className="font-semibold text-red-700">Incorreto</span></>
            )}
          </div>
          {data.explanation && (
            <p className="text-sm text-muted-foreground break-words [overflow-wrap:break-word]">{data.explanation}</p>
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
      <Card className="border-l-4 border-l-violet-500 bg-violet-50/30 w-full min-w-0">
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
