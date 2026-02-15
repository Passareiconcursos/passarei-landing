import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Loader2, ChevronLeft, ChevronRight, Users, TrendingUp, Mail, AlertTriangle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  examType: string;
  state: string;
  status: string;
  acceptedWhatsApp: boolean;
  createdAt: string;
  source?: string;
  dripEmail1SentAt?: string;
  dripEmail2SentAt?: string;
  dripEmail3SentAt?: string;
  dripEmail4SentAt?: string;
};

// Helper: Calcular progresso do drip campaign
const getDripProgress = (lead: Lead) => {
  if (lead.dripEmail4SentAt) return { step: 4, label: "4/4", color: "bg-green-500" };
  if (lead.dripEmail3SentAt) return { step: 3, label: "3/4", color: "bg-blue-500" };
  if (lead.dripEmail2SentAt) return { step: 2, label: "2/4", color: "bg-yellow-500" };
  if (lead.dripEmail1SentAt) return { step: 1, label: "1/4", color: "bg-gray-400" };
  return { step: 0, label: "0/4", color: "bg-red-500" };
};

// Helper: Calcular dias desde cadastro
const getDaysSince = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  return `há ${diffDays}d`;
};

// Helper: Formatar source para exibição
const getSourceBadge = (source?: string) => {
  if (!source) return { label: "Landing", variant: "outline" as const };

  const sourceMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
    "landing_page": { label: "Landing", variant: "outline" },
    "minichat": { label: "MiniChat", variant: "secondary" },
    "telegram": { label: "Telegram", variant: "default" },
    "whatsapp": { label: "WhatsApp", variant: "default" },
  };

  return sourceMap[source.toLowerCase()] || { label: source, variant: "outline" as const };
};

type LeadsResponse = {
  success: boolean;
  leads: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type LeadsKPIs = {
  total: number;
  week: number;
  month: number;
  conversionRate: string;
  convertidos: number;
  stalled: number;
  status: Record<string, number>;
  source: Record<string, number>;
  examType: Record<string, number>;
  drip: { email1: number; email2: number; email3: number; email4: number; total: number };
};

const statusMap = {
  NOVO: { label: "Novo", variant: "default" as const },
  CONTATADO: { label: "Contatado", variant: "secondary" as const },
  QUALIFICADO: { label: "Qualificado", variant: "outline" as const },
  CONVERTIDO: { label: "Convertido", variant: "default" as const },
};

const examTypeMap: Record<string, string> = {
  PM: "Polícia Militar",
  PC: "Polícia Civil",
  PRF: "Polícia Rodoviária Federal",
  PF: "Polícia Federal",
  OUTRO: "Outro",
};

export default function AdminLeads() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [examTypeFilter, setExamTypeFilter] = useState("ALL");
  const [searchInput, setSearchInput] = useState("");

  const { data: kpis } = useQuery<{ success: boolean; kpis: LeadsKPIs }>({
    queryKey: ["/api/admin/leads/kpis"],
    queryFn: async () => {
      const res = await fetch("/api/admin/leads/kpis", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch KPIs");
      return res.json();
    },
  });

  const { data, isLoading, isError } = useQuery<LeadsResponse>({
    queryKey: ["/api/admin/leads", page, search, statusFilter, examTypeFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(statusFilter && statusFilter !== "ALL" && { status: statusFilter }),
        ...(examTypeFilter && examTypeFilter !== "ALL" && { examType: examTypeFilter }),
      });
      
      const res = await fetch(`/api/admin/leads?${params}`, {
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch leads");
      }
      
      return res.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/admin/leads/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Status atualizado",
        description: "O status do lead foi atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do lead.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleStatusChange = (leadId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: leadId, status: newStatus });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-destructive">Erro ao carregar leads</h2>
            <p className="text-muted-foreground mt-2">Tente recarregar a página</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Gestão de Leads</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie e acompanhe todos os leads cadastrados na plataforma
          </p>
        </div>

        {kpis?.kpis && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis.kpis.total}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{kpis.kpis.week}</span> esta semana
                  {" / "}
                  <span className="text-blue-600">+{kpis.kpis.month}</span> este mes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conversao</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis.kpis.conversionRate}</div>
                <p className="text-xs text-muted-foreground">
                  {kpis.kpis.convertidos} convertidos de {kpis.kpis.total}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Drip Campaign</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {kpis.kpis.drip.total > 0
                    ? Math.round((kpis.kpis.drip.email4 / kpis.kpis.drip.total) * 100)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {kpis.kpis.drip.email1}/{kpis.kpis.drip.email2}/{kpis.kpis.drip.email3}/{kpis.kpis.drip.email4} emails (1/2/3/4)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leads Parados</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${kpis.kpis.stalled > 0 ? "text-orange-600" : "text-green-600"}`}>
                  {kpis.kpis.stalled}
                </div>
                <p className="text-xs text-muted-foreground">
                  Status "Novo" ha mais de 7 dias
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {kpis?.kpis && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(kpis.kpis.status).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm">
                        <Badge variant={statusMap[status as keyof typeof statusMap]?.variant || "default"} className="mr-2">
                          {statusMap[status as keyof typeof statusMap]?.label || status}
                        </Badge>
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2"
                            style={{ width: `${Math.round((count / kpis.kpis.total) * 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Por Concurso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(kpis.kpis.examType).map(([exam, count]) => (
                    <div key={exam} className="flex items-center justify-between">
                      <span className="text-sm">{examTypeMap[exam] || exam}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2"
                            style={{ width: `${Math.round((count / kpis.kpis.total) * 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Filtre os leads por status, tipo de concurso ou pesquisa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar por nome, email ou telefone"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  data-testid="input-search"
                />
                <Button onClick={handleSearch} size="icon" data-testid="button-search">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(1); }}>
                <SelectTrigger data-testid="select-status-filter">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os Status</SelectItem>
                  <SelectItem value="NOVO">Novo</SelectItem>
                  <SelectItem value="CONTATADO">Contatado</SelectItem>
                  <SelectItem value="QUALIFICADO">Qualificado</SelectItem>
                  <SelectItem value="CONVERTIDO">Convertido</SelectItem>
                </SelectContent>
              </Select>

              <Select value={examTypeFilter} onValueChange={(value) => { setExamTypeFilter(value); setPage(1); }}>
                <SelectTrigger data-testid="select-exam-type-filter">
                  <SelectValue placeholder="Tipo de Concurso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os Concursos</SelectItem>
                  <SelectItem value="PM">Polícia Militar</SelectItem>
                  <SelectItem value="PC">Polícia Civil</SelectItem>
                  <SelectItem value="PRF">Polícia Rodoviária Federal</SelectItem>
                  <SelectItem value="PF">Polícia Federal</SelectItem>
                  <SelectItem value="OUTRO">Outro</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearch("");
                  setSearchInput("");
                  setStatusFilter("ALL");
                  setExamTypeFilter("ALL");
                  setPage(1);
                }}
                data-testid="button-clear-filters"
              >
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads ({data?.pagination.total || 0})</CardTitle>
            <CardDescription>
              Página {data?.pagination.page} de {data?.pagination.totalPages || 1}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Concurso</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Drip</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.leads.map((lead) => {
                  const drip = getDripProgress(lead);
                  const sourceBadge = getSourceBadge(lead.source);
                  return (
                    <TableRow key={lead.id} data-testid={`row-lead-${lead.id}`}>
                      <TableCell className="font-medium" data-testid={`text-name-${lead.id}`}>
                        <div>{lead.name}</div>
                        <div className="text-xs text-muted-foreground">{lead.phone}</div>
                      </TableCell>
                      <TableCell data-testid={`text-email-${lead.id}`}>
                        <div className="max-w-[180px] truncate" title={lead.email}>{lead.email}</div>
                      </TableCell>
                      <TableCell>
                        <div>{examTypeMap[lead.examType] || lead.examType}</div>
                        <div className="text-xs text-muted-foreground">{lead.state}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={sourceBadge.variant}>{sourceBadge.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${drip.color}`} title={`Email ${drip.step} de 4 enviado`} />
                          <span className="text-sm font-medium">{drip.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusMap[lead.status as keyof typeof statusMap]?.variant || "default"}>
                          {statusMap[lead.status as keyof typeof statusMap]?.label || lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{getDaysSince(lead.createdAt)}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lead.status}
                          onValueChange={(value) => handleStatusChange(lead.id, value)}
                          disabled={updateStatusMutation.isPending}
                        >
                          <SelectTrigger className="w-[130px]" data-testid={`select-status-${lead.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NOVO">Novo</SelectItem>
                            <SelectItem value="CONTATADO">Contatado</SelectItem>
                            <SelectItem value="QUALIFICADO">Qualificado</SelectItem>
                            <SelectItem value="CONVERTIDO">Convertido</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {data?.leads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      Nenhum lead encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {data && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando {((page - 1) * data.pagination.limit) + 1} a{" "}
                  {Math.min(page * data.pagination.limit, data.pagination.total)} de{" "}
                  {data.pagination.total} leads
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    data-testid="button-prev-page"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= data.pagination.totalPages}
                    data-testid="button-next-page"
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
