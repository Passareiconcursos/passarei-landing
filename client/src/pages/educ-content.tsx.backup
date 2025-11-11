import { AIGenerationModal } from "@/components/admin/AIGenerationModal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  FileText,
  Wand2,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertContentSchema, type Content } from "@shared/schema";

type ContentFormData = z.infer<typeof insertContentSchema>;

const aiGenerationSchema = z.object({
  subject: z.string().min(1, "Selecione uma matéria"),
  examType: z.string().min(1, "Selecione um concurso"),
  topic: z.string().min(3, "Digite o tópico (mínimo 3 caracteres)"),
});

type AIGenerationData = z.infer<typeof aiGenerationSchema>;

const subjects = {
  Direito: [
    { value: "DIREITO_PENAL", label: "Direito Penal" },
    { value: "DIREITO_CONSTITUCIONAL", label: "Direito Constitucional" },
    { value: "DIREITO_ADMINISTRATIVO", label: "Direito Administrativo" },
    { value: "DIREITO_PROCESSUAL_PENAL", label: "Direito Processual Penal" },
    { value: "DIREITO_CIVIL", label: "Direito Civil" },
    { value: "DIREITO_PENAL_MILITAR", label: "Direito Penal Militar" },
    {
      value: "DIREITO_PROCESSUAL_PENAL_MILITAR",
      label: "Direito Processual Penal Militar",
    },
    { value: "DIREITOS_HUMANOS", label: "Direitos Humanos" },
    { value: "LEGISLACAO_ESPECIAL", label: "Legislação Especial" },
  ],
  "Conhecimentos Básicos": [
    { value: "PORTUGUES", label: "Português" },
    { value: "RACIOCINIO_LOGICO", label: "Raciocínio Lógico" },
    { value: "MATEMATICA", label: "Matemática" },
    { value: "INFORMATICA", label: "Informática" },
    { value: "ATUALIDADES", label: "Atualidades" },
    { value: "GEOGRAFIA", label: "Geografia" },
    { value: "HISTORIA", label: "História" },
    { value: "ETICA_SERVICO_PUBLICO", label: "Ética no Serviço Público" },
    { value: "INGLES", label: "Inglês" },
    { value: "ESPANHOL", label: "Espanhol" },
  ],
  "Conhecimentos Técnicos": [
    { value: "CRIMINOLOGIA", label: "Criminologia" },
    { value: "MEDICINA_LEGAL", label: "Medicina Legal" },
    { value: "LEGISLACAO_TRANSITO", label: "Legislação de Trânsito" },
    { value: "NOCOES_FISICA", label: "Noções de Física" },
    { value: "GEOPOLITICA", label: "Geopolítica" },
    { value: "PRIMEIROS_SOCORROS", label: "Primeiros Socorros" },
    { value: "ESTATISTICA", label: "Estatística" },
    { value: "CONTABILIDADE", label: "Contabilidade" },
    { value: "ARQUIVOLOGIA", label: "Arquivologia" },
    { value: "ADMINISTRACAO_PUBLICA", label: "Administração Pública" },
  ],
  Perícia: [
    { value: "BIOLOGIA_FORENSE", label: "Biologia Forense" },
    { value: "QUIMICA_FORENSE", label: "Química Forense" },
    { value: "FISICA_FORENSE", label: "Física Forense" },
    { value: "INFORMATICA_FORENSE", label: "Informática Forense" },
  ],
};

const examTypeLabels: Record<string, string> = {
  PF: "PF - Polícia Federal",
  PRF: "PRF - Polícia Rodoviária Federal",
  PP_FEDERAL: "Polícia Penal Federal",
  PL_FEDERAL: "Polícia Legislativa Federal",
  PM: "PM - Polícia Militar",
  PC: "PC - Polícia Civil",
  PP_ESTADUAL: "Polícia Penal Estadual",
  PL_ESTADUAL: "Polícia Legislativa Estadual",
  CBM: "CBM - Corpo de Bombeiros",
  GM: "GM - Guarda Municipal",
  OUTRO: "Outro",
};

const statusLabels: Record<string, string> = {
  DRAFT: "Rascunho",
  PUBLISHED: "Publicado",
  ARCHIVED: "Arquivado",
};

function getSubjectLabel(value: string): string {
  for (const category of Object.values(subjects)) {
    const found = category.find((s) => s.value === value);
    if (found) return found.label;
  }
  return value;
}

export default function EducContent() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    subject: "",
    examType: "",
    status: "",
    page: 1,
    limit: 10,
  });

  const form = useForm<ContentFormData>({
    resolver: zodResolver(insertContentSchema),
    defaultValues: {
      title: "",
      subject: "DIREITO_PENAL",
      examType: "PRF",
      sphere: "FEDERAL",
      body: "",
      status: "DRAFT",
      generatedByAI: false,
    },
  });

  const aiForm = useForm<AIGenerationData>({
    resolver: zodResolver(aiGenerationSchema),
    defaultValues: {
      subject: "DIREITO_ADMINISTRATIVO",
      examType: "PRF",
      topic: "",
    },
  });

  const {
    data,
    isLoading: isLoadingContent,
    refetch,
  } = useQuery({
    queryKey: ["/api/admin/content/list", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
      const res = await fetch(`/api/admin/content/list?${params}`);
      if (!res.ok) throw new Error("Erro ao carregar conteúdos");
      return res.json();
    },
  });

  const handleGenerateWithAI = async (data: AIGenerationData) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/admin/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Erro ao gerar conteúdo");
      }

      setGeneratedContent({
        ...result.content,
        subject: data.subject,
        examType: data.examType,
      });
      setShowPreview(true);

      toast({
        title: "✅ Conteúdo gerado!",
        description: "Revise e edite se necessário antes de salvar.",
      });
    } catch (error: any) {
      toast({
        title: "❌ Erro ao gerar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGenerated = async () => {
    if (!generatedContent) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/content/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...generatedContent,
          status: "PUBLISHED",
          generatedByAI: true,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Erro ao salvar");
      }

      toast({
        title: "✅ Conteúdo salvo!",
        description: "O conteúdo foi publicado com sucesso.",
      });

      setIsAIDialogOpen(false);
      setShowPreview(false);
      setGeneratedContent(null);
      aiForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/list"] });
    } catch (error: any) {
      toast({
        title: "❌ Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (content: Content) => {
    setEditingContent(content);
    form.reset({
      title: content.title,
      subject: content.subject,
      examType: content.examType,
      sphere: content.sphere || "FEDERAL",
      body: content.body,
      status: content.status,
      generatedByAI: content.generatedByAI,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${title}"?`)) return;

    try {
      await apiRequest(`/api/admin/content/${id}`, { method: "DELETE" });
      toast({
        title: "Conteúdo excluído",
        description: "O conteúdo foi removido com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/list"] });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: ContentFormData) => {
    setIsLoading(true);
    try {
      if (editingContent) {
        await apiRequest(`/api/admin/content/${editingContent.id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
        toast({
          title: "Conteúdo atualizado",
          description: "As alterações foram salvas",
        });
      } else {
        await apiRequest("/api/admin/content", {
          method: "POST",
          body: JSON.stringify(data),
        });
        toast({
          title: "Conteúdo criado",
          description: "O novo conteúdo foi adicionado",
        });
      }
      setIsDialogOpen(false);
      setEditingContent(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/list"] });
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      subject: "",
      examType: "",
      status: "",
      page: 1,
      limit: 10,
    });
  };

  const activeFiltersCount = [
    filters.search,
    filters.subject,
    filters.examType,
    filters.status,
  ].filter(Boolean).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">📚 Conteúdo Educacional</h1>
            <p className="text-muted-foreground">
              Gerencie o conteúdo de estudo para os alunos
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setEditingContent(null);
                form.reset();
                setIsDialogOpen(true);
              }}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Manual
            </Button>
            <Button
              onClick={() => {
                aiForm.reset();
                setGeneratedContent(null);
                setShowPreview(false);
                setIsAIDialogOpen(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Gerar com IA
            </Button>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Buscar por título..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: e.target.value,
                    page: 1,
                  }))
                }
                data-testid="input-search"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              data-testid="button-toggle-filters"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>

            {activeFiltersCount > 0 && (
              <Button variant="ghost" onClick={clearFilters}>
                Limpar
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div>
                <Label htmlFor="filter-subject">Matéria</Label>
                <select
                  id="filter-subject"
                  value={filters.subject}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      subject: e.target.value,
                      page: 1,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Todas</option>
                  {Object.entries(subjects).map(([category, items]) => (
                    <optgroup key={category} label={category}>
                      {items.map((subject) => (
                        <option key={subject.value} value={subject.value}>
                          {subject.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="filter-exam">Concurso</Label>
                <select
                  id="filter-exam"
                  value={filters.examType}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      examType: e.target.value,
                      page: 1,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Todos</option>
                  {Object.entries(examTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="filter-status">Status</Label>
                <select
                  id="filter-status"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: e.target.value,
                      page: 1,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Todos</option>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            {isLoadingContent ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  Carregando conteúdos...
                </p>
              </div>
            ) : data?.contents && data.contents.length > 0 ? (
              <>
                {data.contents.map((content: Content) => (
                  <div
                    key={content.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg truncate">
                          {content.title}
                        </h3>
                        {content.generatedByAI && (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <Sparkles className="h-3 w-3" />
                            IA
                          </Badge>
                        )}
                        <Badge
                          variant={
                            content.status === "PUBLISHED"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {statusLabels[content.status]}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span>📚 {getSubjectLabel(content.subject)}</span>
                        <span>•</span>
                        <span>🎯 {examTypeLabels[content.examType]}</span>
                        <span>•</span>
                        <span>
                          {new Date(content.createdAt).toLocaleDateString(
                            "pt-BR",
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(content)}
                        data-testid={`button-edit-${content.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(content.id, content.title)}
                        data-testid={`button-delete-${content.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}

                {data.pagination && data.pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                      }
                      disabled={filters.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      {data.pagination.page} / {data.pagination.totalPages}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                      }
                      disabled={filters.page >= data.pagination.totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 space-y-4">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="font-medium">Nenhum conteúdo encontrado</p>
                  <p className="text-sm text-muted-foreground">
                    {activeFiltersCount > 0
                      ? "Tente ajustar os filtros ou limpar a busca"
                      : 'Clique em "Gerar com IA" para começar'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingContent(null);
            form.reset();
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingContent ? "Editar Conteúdo" : "Criar Novo Conteúdo"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                data-testid="input-title"
                {...form.register("title")}
                placeholder="Ex: Princípio da Legalidade"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subject">Matéria</Label>
                <select
                  id="subject"
                  data-testid="select-subject"
                  {...form.register("subject")}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {Object.entries(subjects).map(([category, items]) => (
                    <optgroup key={category} label={category}>
                      {items.map((subject) => (
                        <option key={subject.value} value={subject.value}>
                          {subject.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="examType">Tipo de Concurso</Label>
                <select
                  id="examType"
                  data-testid="select-exam-type"
                  {...form.register("examType")}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {Object.entries(examTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="body">Conteúdo Completo</Label>
              <Textarea
                id="body"
                data-testid="textarea-body"
                {...form.register("body")}
                placeholder="Texto completo do conteúdo..."
                className="min-h-[150px]"
              />
              {form.formState.errors.body && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.body.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                {...form.register("status")}
                className="w-full px-3 py-2 border rounded-md"
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
                data-testid="button-submit-content"
              >
                {isLoading
                  ? "Salvando..."
                  : editingContent
                    ? "Atualizar"
                    : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AIGenerationModal
        open={isAIDialogOpen}
        onClose={() => setIsAIDialogOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: ["/api/admin/content/list"],
          });
          setIsAIDialogOpen(false);
          // Recarregar página após 500ms para garantir que salvou
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }}
      />
    </AdminLayout>
  );
}
