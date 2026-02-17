import { useState, useEffect, useRef } from "react";
import { useStudentAuth } from "@/contexts/StudentAuthContext";
import { SalaLayout } from "@/components/sala/SalaLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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

interface ChatMessage {
  id: string;
  type: "content" | "question" | "answer" | "enrichment" | "system";
  data: any;
  timestamp: Date;
}

// ============================================
// COMPONENT
// ============================================

export default function SalaAula() {
  const { token, student } = useStudentAuth();
  const { toast } = useToast();

  // State
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentContent, setCurrentContent] = useState<ContentItem | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionItem | null>(null);
  const [questionCorrectIndex, setQuestionCorrectIndex] = useState<number | null>(null);
  const [stats, setStats] = useState<{ totalQuestionsAnswered: number; bySubject: SubjectStat[] } | null>(null);
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
    // Welcome message
    addMessage("system", {
      text: `Olá, ${student?.name?.split(" ")[0]}! Escolha uma matéria ao lado ou clique em "Próximo conteúdo" para começar.`,
    });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    setAnsweredIndex(optionIndex);

    try {
      const res = await fetch("/api/sala/question/answer", {
        method: "POST",
        headers,
        body: JSON.stringify({
          questionId: currentQuestion.id,
          userAnswer: optionIndex,
          correctIndex: questionCorrectIndex,
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
        fetchStats(); // Refresh stats
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
    fetchNextContent(subjectId);
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
          <div className="p-4 border-b">
            <h2 className="font-semibold flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Matérias
            </h2>
          </div>
          <ScrollArea className="h-[calc(100%-3.5rem)]">
            <div className="p-2 space-y-1">
              {/* All subjects (smart) */}
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
            </div>
          </ScrollArea>
        </aside>

        {/* CENTER: Chat Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-2xl mx-auto space-y-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} onAnswer={submitAnswer} answeredIndex={answeredIndex} correctIndex={questionCorrectIndex} />
              ))}

              {(isLoadingContent || isLoadingQuestion) && (
                <div className="flex items-center gap-2 text-muted-foreground py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">
                    {isLoadingContent ? "Buscando conteúdo..." : "Buscando questão..."}
                  </span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          {/* Action bar */}
          <div className="border-t p-3 bg-background">
            <div className="max-w-2xl mx-auto flex gap-2 flex-wrap">
              <Button
                onClick={() => fetchNextContent(selectedSubject)}
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
              {answeredIndex !== null && (
                <Button
                  onClick={fetchQuestion}
                  disabled={isLoadingQuestion}
                  variant="secondary"
                  size="sm"
                >
                  Próxima questão
                </Button>
              )}
              {remaining != null && (
                <span className="text-xs text-muted-foreground self-center ml-auto">
                  {remaining} questões restantes hoje
                </span>
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

  return null;
}
