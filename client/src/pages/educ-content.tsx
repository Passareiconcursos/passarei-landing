import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Bot,
  FileText,
  CheckCircle2,
  Archive,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentItem {
  id: string;
  title: string;
  subject: string;
  examType: string;
  sphere: string | null;
  state: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  generatedByAI: boolean;
  body: string;
  definition?: string | null;
  keyPoints?: string | null;
  example?: string | null;
  tip?: string | null;
  tags: string[];
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const SUBJECTS = [
  { value: "DIREITO_PENAL", label: "Direito Penal" },
  { value: "DIREITO_CONSTITUCIONAL", label: "Direito Constitucional" },
  { value: "DIREITO_ADMINISTRATIVO", label: "Direito Administrativo" },
  { value: "DIREITO_PROCESSUAL_PENAL", label: "D. Processual Penal" },
  { value: "DIREITO_CIVIL", label: "Direito Civil" },
  { value: "DIREITO_PENAL_MILITAR", label: "D. Penal Militar" },
  { value: "DIREITO_PROCESSUAL_PENAL_MILITAR", label: "DPP Militar" },
  { value: "DIREITOS_HUMANOS", label: "Direitos Humanos" },
  { value: "LEGISLACAO_ESPECIAL", label: "Legislação Especial" },
  { value: "PORTUGUES", label: "Português" },
  { value: "RACIOCINIO_LOGICO", label: "Raciocínio Lógico" },
  { value: "MATEMATICA", label: "Matemática" },
  { value: "INFORMATICA", label: "Informática" },
  { value: "ATUALIDADES", label: "Atualidades" },
  { value: "CRIMINOLOGIA", label: "Criminologia" },
  { value: "MEDICINA_LEGAL", label: "Medicina Legal" },
  { value: "LEGISLACAO_TRANSITO", label: "Legislação de Trânsito" },
  { value: "GEOPOLITICA", label: "Geopolítica" },
  { value: "ETICA_SERVICO_PUBLICO", label: "Ética no Serviço Público" },
  { value: "ADMINISTRACAO_PUBLICA", label: "Administração Pública" },
];

const EXAM_TYPES = [
  { value: "PF", label: "PF" },
  { value: "PRF", label: "PRF" },
  { value: "PM", label: "PM" },
  { value: "PC", label: "PC" },
  { value: "PP_FEDERAL", label: "PP Federal" },
  { value: "PP_ESTADUAL", label: "PP Estadual" },
  { value: "PL_FEDERAL", label: "PL Federal" },
  { value: "PL_ESTADUAL", label: "PL Estadual" },
  { value: "CBM", label: "CBM" },
  { value: "OUTRO", label: "Outro" },
];

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "secondary",
  PUBLISHED: "default",
  ARCHIVED: "outline",
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Rascunho",
  PUBLISHED: "Publicado",
  ARCHIVED: "Arquivado",
};

const emptyForm = {
  title: "",
  subject: "DIREITO_PENAL",
  examType: "PF",
  sphere: "FEDERAL",
  state: "",
  status: "DRAFT" as const,
  body: "",
  definition: "",
  keyPoints: "",
  example: "",
  tip: "",
};

export default function EducContent() {
  const { toast } = useToast();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterExamType, setFilterExamType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchContent = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "15",
          ...(search && { search }),
          ...(filterSubject !== "all" && { subject: filterSubject }),
          ...(filterExamType !== "all" && { examType: filterExamType }),
          ...(filterStatus !== "all" && { status: filterStatus }),
        });
        const res = await fetch(`/api/admin/content/list?${params}`);
        const data = await res.json();
        if (data.success) {
          setItems(data.contents);
          setPagination(data.pagination);
        }
      } catch {
        toast({ title: "Erro ao carregar conteúdos", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    },
    [search, filterSubject, filterExamType, filterStatus, toast],
  );

  useEffect(() => {
    const t = setTimeout(() => fetchContent(1), 300);
    return () => clearTimeout(t);
  }, [fetchContent]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item: ContentItem) => {
    setEditing(item);
    setForm({
      title: item.title,
      subject: item.subject,
      examType: item.examType,
      sphere: item.sphere || "FEDERAL",
      state: item.state || "",
      status: item.status,
      body: item.body,
      definition: item.definition || "",
      keyPoints: item.keyPoints || "",
      example: item.example || "",
      tip: item.tip || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast({ title: "Título e conteúdo são obrigatórios", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/admin/content/${editing.id}` : "/api/admin/content";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          state: form.sphere === "FEDERAL" ? undefined : form.state || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: editing ? "Conteúdo atualizado!" : "Conteúdo criado!" });
        setModalOpen(false);
        fetchContent(pagination.page);
      } else {
        toast({ title: data.error || "Erro ao salvar", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erro de conexão", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: ContentItem) => {
    if (!confirm(`Excluir "${item.title}"? Isso também remove as questões vinculadas.`)) return;
    try {
      const res = await fetch(`/api/admin/content/${item.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Conteúdo excluído" });
        fetchContent(pagination.page);
      } else {
        toast({ title: data.error || "Erro ao excluir", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erro de conexão", variant: "destructive" });
    }
  };

  const stats = {
    total: pagination.total,
    published: items.filter((i) => i.status === "PUBLISHED").length,
    draft: items.filter((i) => i.status === "DRAFT").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Conteúdo</h1>
            <p className="text-muted-foreground">Gerenciar conteúdo educacional e questões</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Conteúdo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
              <div className="text-2xl font-bold">{pagination.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-xs text-muted-foreground">Publicados</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-yellow-500" />
                <span className="text-xs text-muted-foreground">Rascunhos</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Matéria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as matérias</SelectItem>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterExamType} onValueChange={setFilterExamType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Concurso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {EXAM_TYPES.map((e) => (
                    <SelectItem key={e.value} value={e.value}>
                      {e.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="DRAFT">Rascunho</SelectItem>
                  <SelectItem value="PUBLISHED">Publicado</SelectItem>
                  <SelectItem value="ARCHIVED">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              {isLoading ? "Carregando..." : `${pagination.total} conteúdos encontrados`}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Matéria</TableHead>
                  <TableHead>Concurso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IA</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-20">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum conteúdo encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium max-w-xs">
                        <span className="truncate block" title={item.title}>
                          {item.title}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {SUBJECTS.find((s) => s.value === item.subject)?.label ?? item.subject}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.examType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_COLORS[item.status] as any} className="text-xs">
                          {STATUS_LABELS[item.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.generatedByAI && (
                          <Bot className="h-3.5 w-3.5 text-violet-500" title="Gerado por IA" />
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => openEdit(item)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Página {pagination.page} de {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchContent(pagination.page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchContent(pagination.page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Conteúdo" : "Novo Conteúdo"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Título *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Ex: Crimes contra a pessoa — Homicídio"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Matéria *</Label>
                <Select
                  value={form.subject}
                  onValueChange={(v) => setForm((f) => ({ ...f, subject: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Concurso *</Label>
                <Select
                  value={form.examType}
                  onValueChange={(v) => setForm((f) => ({ ...f, examType: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXAM_TYPES.map((e) => (
                      <SelectItem key={e.value} value={e.value}>
                        {e.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Esfera</Label>
                <Select
                  value={form.sphere}
                  onValueChange={(v) => setForm((f) => ({ ...f, sphere: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FEDERAL">Federal</SelectItem>
                    <SelectItem value="ESTADUAL">Estadual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Rascunho</SelectItem>
                    <SelectItem value="PUBLISHED">Publicado</SelectItem>
                    <SelectItem value="ARCHIVED">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {form.sphere === "ESTADUAL" && (
              <div className="space-y-1.5">
                <Label>Estado (UF) *</Label>
                <Input
                  maxLength={2}
                  placeholder="SP"
                  value={form.state}
                  onChange={(e) => setForm((f) => ({ ...f, state: e.target.value.toUpperCase() }))}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Corpo do Conteúdo *</Label>
              <Textarea
                rows={5}
                placeholder="Descrição completa do tópico (mínimo 20 caracteres)..."
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Definição</Label>
              <Textarea
                rows={2}
                placeholder="Definição clara e concisa..."
                value={form.definition}
                onChange={(e) => setForm((f) => ({ ...f, definition: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Pontos-Chave</Label>
              <Textarea
                rows={2}
                placeholder="Pontos principais para memorização..."
                value={form.keyPoints}
                onChange={(e) => setForm((f) => ({ ...f, keyPoints: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Exemplo Prático</Label>
                <Textarea
                  rows={2}
                  value={form.example}
                  onChange={(e) => setForm((f) => ({ ...f, example: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Dica de Prova</Label>
                <Textarea
                  rows={2}
                  value={form.tip}
                  onChange={(e) => setForm((f) => ({ ...f, tip: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : editing ? "Salvar Alterações" : "Criar Conteúdo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
