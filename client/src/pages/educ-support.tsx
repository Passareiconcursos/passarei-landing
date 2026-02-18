import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bot,
  Send,
  Loader2,
  Users,
  BarChart3,
  Flame,
  TrendingDown,
  FileText,
  GraduationCap,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Overview {
  totalStudents: number;
  activeToday: number;
  veteranos: number;
  calouro: number;
  freeUsers: number;
  totalQuestionsAnswered: number;
  subjectErrors: { subject: string; total: number; errors: number; errorRate: number }[];
  streakLeaders: { name: string; streakDays: number; totalQuestions: number }[];
  recentEssays: { count: number; avgScore: number };
}

const QUICK_PROMPTS = [
  "Quais matérias os alunos mais erram?",
  "Quem são os alunos mais engajados?",
  "O que fazer para reter alunos FREE?",
  "Que conteúdo devo criar a seguir?",
  "Como está a saúde geral da plataforma?",
];

export default function EducSupport() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOverview();
    setMessages([
      {
        role: "assistant",
        content:
          "Olá! Sou seu assistente IA da Passarei. Posso ajudar com insights sobre alunos, desempenho, conteúdo e estratégias. Tenho acesso aos dados reais da plataforma. O que você gostaria de saber?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchOverview = async () => {
    setIsLoadingOverview(true);
    try {
      const res = await fetch("/api/admin/support/overview");
      const data = await res.json();
      if (data.success) setOverview(data.overview);
    } catch {
      /* silent */
    } finally {
      setIsLoadingOverview(false);
    }
  };

  const sendMessage = async (text?: string) => {
    const question = (text || input).trim();
    if (!question || isLoading) return;

    setInput("");
    const userMsg: Message = { role: "user", content: question, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/support/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.success ? data.answer : "Desculpe, ocorreu um erro. Tente novamente.",
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro de conexão. Verifique sua internet.", timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl">
        <div>
          <h1 className="text-3xl font-bold">Suporte IA</h1>
          <p className="text-muted-foreground">
            Assistente inteligente com contexto real da plataforma
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Alunos na Sala</span>
              </div>
              <div className="text-2xl font-bold">
                {isLoadingOverview ? "..." : overview?.totalStudents ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {overview?.activeToday ?? 0} ativos hoje
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="h-4 w-4 text-green-500" />
                <span className="text-xs text-muted-foreground">Planos pagos</span>
              </div>
              <div className="text-2xl font-bold">
                {isLoadingOverview ? "..." : (overview ? overview.veteranos + overview.calouro : 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {overview?.veteranos ?? 0} VET · {overview?.calouro ?? 0} CAL
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">Questões respondidas</span>
              </div>
              <div className="text-2xl font-bold">
                {isLoadingOverview ? "..." : (overview?.totalQuestionsAnswered ?? 0).toLocaleString("pt-BR")}
              </div>
              <p className="text-xs text-muted-foreground">total acumulado</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-violet-500" />
                <span className="text-xs text-muted-foreground">Redações (7 dias)</span>
              </div>
              <div className="text-2xl font-bold">
                {isLoadingOverview ? "..." : overview?.recentEssays.count ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                média {overview?.recentEssays.avgScore ?? 0}/1000 pts
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Matérias com mais erros */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-500" /> Matérias com mais erros
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingOverview ? (
                <p className="text-xs text-muted-foreground">Carregando...</p>
              ) : !overview?.subjectErrors.length ? (
                <p className="text-xs text-muted-foreground">Sem dados ainda.</p>
              ) : (
                <div className="space-y-2">
                  {overview.subjectErrors.slice(0, 5).map((s) => (
                    <div key={s.subject} className="text-sm">
                      <div className="flex justify-between items-center">
                        <span className="truncate text-xs">{s.subject}</span>
                        <Badge
                          variant={s.errorRate >= 60 ? "destructive" : "secondary"}
                          className="text-[10px] px-1 shrink-0"
                        >
                          {s.errorRate}% erros
                        </Badge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1 mt-1">
                        <div className="h-1 rounded-full bg-red-400" style={{ width: `${s.errorRate}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Líderes de streak */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" /> Líderes de sequência
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingOverview ? (
                <p className="text-xs text-muted-foreground">Carregando...</p>
              ) : !overview?.streakLeaders.length ? (
                <p className="text-xs text-muted-foreground">Nenhum aluno com streak {'>'} 3 dias.</p>
              ) : (
                <div className="space-y-2">
                  {overview.streakLeaders.map((u, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-xs">{u.name}</span>
                      <div className="flex items-center gap-1">
                        <Flame className="h-3 w-3 text-orange-400" />
                        <span className="text-xs font-medium">{u.streakDays} dias</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Perguntas rápidas */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" /> Perguntas rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={isLoading}
                  className="w-full text-left text-xs px-2 py-1.5 rounded-md border hover:bg-muted transition-colors disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* AI Chat */}
        <Card className="flex flex-col" style={{ height: "420px" }}>
          <CardHeader className="pb-2 border-b shrink-0">
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" /> Chat com IA
            </CardTitle>
          </CardHeader>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-[10px] opacity-60 mt-1">
                      {msg.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <Separator />
          <div className="p-3 flex gap-2 shrink-0">
            <Textarea
              placeholder="Pergunte algo sobre a plataforma... (Enter para enviar)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              rows={2}
              className="resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="h-auto shrink-0"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
