import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GraduationCap, Search, Loader2, ChevronLeft, ChevronRight, LogIn, Pencil, Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  telegramId: string;
  plan: string;
  planStatus: string;
  planEndDate: string | null;
  lastActiveAt: string | null;
  createdAt: string;
  totalQuestions: number;
  isActive: boolean;
  concursoName: string;
  examType: string | null;
}

interface UsersResponse {
  success: boolean;
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function EducUsers() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [impersonating, setImpersonating] = useState<string | null>(null);

  // Edit credentials modal
  const [editingUser, setEditingUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleImpersonate = async (userId: string, userName: string) => {
    if (!confirm(`Acessar a Sala de Aula como "${userName}"?\n\nIsso vai abrir uma nova aba com a visão do aluno.`)) return;
    setImpersonating(userId);
    try {
      const res = await fetch(`/api/admin/impersonate/${userId}`, { method: "POST" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      localStorage.setItem("passarei_student_token", data.token);
      window.open("/sala/aula", "_blank");
    } catch (err: any) {
      alert(`Erro: ${err.message || "Falha ao iniciar shadow mode"}`);
    } finally {
      setImpersonating(null);
    }
  };

  const handleUpdateEmail = async () => {
    if (!editingUser || !newEmail.includes("@")) return;
    setIsUpdatingEmail(true);
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}/email`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast({ title: "E-mail atualizado", description: `Novo e-mail: ${newEmail}` });
      setEditingUser({ ...editingUser, email: newEmail });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.message || "Falha ao atualizar e-mail." });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!editingUser || newPassword.length < 6) return;
    setIsUpdatingPassword(true);
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast({ title: "Senha redefinida", description: `Senha do aluno ${editingUser.name || editingUser.email} atualizada.` });
      setNewPassword("");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.message || "Falha ao redefinir senha." });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: "15",
    ...(search && { search }),
    ...(planFilter !== "ALL" && { plan: planFilter }),
    ...(statusFilter !== "ALL" && { status: statusFilter }),
  });

  const { data, isLoading, isError } = useQuery<UsersResponse>({
    queryKey: [`/api/admin/users?${queryParams.toString()}`],
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays} dias`;
    return date.toLocaleDateString("pt-BR");
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "VETERANO":
        return <Badge className="bg-purple-600">Veterano</Badge>;
      case "CALOURO":
        return <Badge className="bg-blue-600">Calouro</Badge>;
      default:
        return <Badge variant="secondary">Free</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean, plan: string) => {
    if (plan === "FREE") return null;
    return isActive ? (
      <Badge variant="outline" className="text-green-600 border-green-600">Ativo</Badge>
    ) : (
      <Badge variant="outline" className="text-orange-600 border-orange-600">Inativo</Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" data-testid="heading-users">Alunos</h1>
            <p className="text-muted-foreground">
              Gerencie os alunos e acompanhe o engajamento
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por email, nome ou telegram..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select
                value={planFilter}
                onValueChange={(value) => {
                  setPlanFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="FREE">Free</SelectItem>
                  <SelectItem value="CALOURO">Calouro</SelectItem>
                  <SelectItem value="VETERANO">Veterano</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Lista de Alunos</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {data?.pagination.total || 0} alunos encontrados
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-destructive">Erro ao carregar alunos</p>
              </div>
            ) : data?.users.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum aluno encontrado</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Telegram</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Concurso</TableHead>
                      <TableHead>Progresso</TableHead>
                      <TableHead>Último Acesso</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name || "-"}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm">@{user.telegramId}</code>
                        </TableCell>
                        <TableCell>{getPlanBadge(user.plan)}</TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">{user.concursoName || "-"}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${Math.min(100, Math.round((user.totalQuestions / 500) * 100))}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{user.totalQuestions}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(user.lastActiveAt)}</TableCell>
                        <TableCell>{getStatusBadge(user.isActive, user.plan)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs gap-1"
                              disabled={impersonating === user.id}
                              onClick={() => handleImpersonate(user.id, user.name || user.email)}
                            >
                              {impersonating === user.id
                                ? <Loader2 className="h-3 w-3 animate-spin" />
                                : <LogIn className="h-3 w-3" />}
                              Entrar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs gap-1"
                              onClick={() => {
                                setEditingUser({ id: user.id, name: user.name || "", email: user.email });
                                setNewEmail(user.email);
                                setNewPassword("");
                                setShowPassword(false);
                              }}
                            >
                              <Pencil className="h-3 w-3" />
                              Editar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {data && data.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Página {data.pagination.page} de {data.pagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                        disabled={page === data.pagination.totalPages}
                      >
                        Próxima
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Modal: Editar Credenciais do Aluno ── */}
      <Dialog open={!!editingUser} onOpenChange={(open) => {
        if (!open) { setEditingUser(null); setNewEmail(""); setNewPassword(""); setShowPassword(false); }
      }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-4 w-4 text-primary" /> Editar Aluno
            </DialogTitle>
            <DialogDescription>
              {editingUser?.name || editingUser?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-1">
            {/* ── Alterar Senha ── */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5" /> Nova Senha
              </p>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button
                size="sm"
                className="w-full"
                disabled={isUpdatingPassword || newPassword.length < 6}
                onClick={handleUpdatePassword}
              >
                {isUpdatingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Senha"}
              </Button>
            </div>

            <Separator />

            {/* ── Alterar E-mail ── */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Novo E-mail
              </p>
              <Input
                type="email"
                placeholder="novo@email.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                disabled={isUpdatingEmail || !newEmail.includes("@") || newEmail === editingUser?.email}
                onClick={handleUpdateEmail}
              >
                {isUpdatingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar E-mail"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
