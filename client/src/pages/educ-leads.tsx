import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
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
                  <TableHead>Telefone</TableHead>
                  <TableHead>Concurso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.leads.map((lead) => (
                  <TableRow key={lead.id} data-testid={`row-lead-${lead.id}`}>
                    <TableCell className="font-medium" data-testid={`text-name-${lead.id}`}>{lead.name}</TableCell>
                    <TableCell data-testid={`text-email-${lead.id}`}>{lead.email}</TableCell>
                    <TableCell data-testid={`text-phone-${lead.id}`}>{lead.phone}</TableCell>
                    <TableCell>{examTypeMap[lead.examType] || lead.examType}</TableCell>
                    <TableCell>{lead.state}</TableCell>
                    <TableCell>
                      <Badge variant={statusMap[lead.status as keyof typeof statusMap]?.variant || "default"}>
                        {statusMap[lead.status as keyof typeof statusMap]?.label || lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {lead.acceptedWhatsApp ? (
                        <Badge variant="outline">Sim</Badge>
                      ) : (
                        <Badge variant="secondary">Não</Badge>
                      )}
                    </TableCell>
                    <TableCell>{new Date(lead.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <Select
                        value={lead.status}
                        onValueChange={(value) => handleStatusChange(lead.id, value)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <SelectTrigger className="w-[140px]" data-testid={`select-status-${lead.id}`}>
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
                ))}
                {data?.leads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
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
